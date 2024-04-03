import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { Image, KeyboardAvoidingView, StyleSheet } from "react-native";
import { RootStackParamList } from "static/Router";
import { SCREENS } from "static/screens";
import * as ImagePicker from "expo-image-picker";
import { useDimensions } from "hooks/ui";
import { uploadImage } from "firebase/services";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Provider, TextInput } from "react-native-paper";
import Button from "components/Button/Button";
import useEditMovieScreen from "./EditMovieScreen.logic";
import LoadingLayout from "pages/LoadingLayout";
import { syncCacheOnDelete } from "hooks/storage";
import GenrePicker from "components/GenrePicher/GenrePicker";
import { MovieGenre } from "static/enums";

type Props = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.UPDATE_MOVIE_SCREEN
>;

interface FormState extends FieldValues {
  title?: string;
  description?: string;
  image?: string;
  genre?: MovieGenre[];
}

const EditMovieScreen: React.FC<Props> = ({
  navigation: { navigate },
  route,
}) => {
  const { params } = route;
  const [image, setImage] =
    React.useState<ImagePicker.ImagePickerSuccessResult>();
  const { handleEditMovie, movie, loading } = useEditMovieScreen({
    movieId: params.movieId,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    setValue("genre", movie?.genre, {
      shouldValidate: true,
    });
    setValue("image", movie?.image, {
      shouldValidate: true,
    });
    setValue("title", movie?.title, {
      shouldValidate: true,
    });
    setValue("description", movie?.description, {
      shouldValidate: true,
    });
  }, [params.movieId, loading]);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.6,
    });

    if (!result.canceled) {
      setImage(result);
      setValue("image", result.assets[0].uri);
    }
  };
  const { screenWidth } = useDimensions();

  const styles = StyleSheet.create({
    container: { gap: 5, margin: 5 },
    button: {
      marginTop: 20,
    },
    image: {
      alignSelf: "center",
      objectFit: "contain",
      height: screenWidth - 120,
      width: screenWidth - 40,
      marginVertical: 20,
    },
    input: {
      marginVertical: 5,
    },
  });

  const onSubmit = async (data: FormState) => {
    // removing old record so it will be re-saved in cache with the updates
    await syncCacheOnDelete(params.movieId);
    if (data.image && image) {
      const firebaseUrl = await uploadImage(data.image);
      data.image = firebaseUrl;
      setValue("image", firebaseUrl, { shouldValidate: true });
    }

    const movieId: string | false | undefined = await handleEditMovie({
      ...data,
      movieId: params.movieId,
    });

    if (movieId) {
      navigate({
        key: SCREENS.MOVIE_DETAILS_SCREEN,
        params: { movieId: movieId },
        name: SCREENS.MOVIE_DETAILS_SCREEN,
      });
    }
  };

  if (loading) {
    return <LoadingLayout />;
  }

  return (
    <Provider theme={{ dark: false }}>
      <KeyboardAvoidingView>
        <ScrollView style={styles.container}>
          <TouchableOpacity onPress={handleImagePicker} activeOpacity={0.7}>
            <Image
              style={styles.image}
              source={
                image ? { uri: image.assets[0].uri } : { uri: movie?.image }
              }
            />
          </TouchableOpacity>
          <Controller
            control={control}
            rules={{ required: true, minLength: 4 }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                defaultValue={movie?.title}
                style={styles.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                mode="outlined"
                label="Title (min 4)"
                error={!!errors["title"]}
              />
            )}
            name="title"
          />
          <Controller
            control={control}
            rules={{ required: true, minLength: 20 }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                defaultValue={movie?.description}
                style={styles.input}
                multiline
                numberOfLines={3}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                mode="outlined"
                label="Description (min 20)"
                error={!!errors["description"]}
              />
            )}
            name="description"
          />
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { value } }) => (
              <GenrePicker
                error={!!errors["genre"]}
                onValueChange={setValue}
                value={value}
              />
            )}
            name="genre"
          />
          <Button
            loading={loading}
            style={styles.button}
            mode={"contained"}
            children
            label="Save"
            onPress={handleSubmit(onSubmit)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Provider>
  );
};

export default EditMovieScreen;
