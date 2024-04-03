import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Button from "components/Button/Button";
import { createMovie, uploadImage } from "firebase/services";
import { useDimensions } from "hooks/ui";
import React, { useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Provider, TextInput } from "react-native-paper";
import { RootStackParamList } from "static/Router";
import { SCREENS } from "static/screens";
import * as ImagePicker from "expo-image-picker";
import GenrePicker from "components/GenrePicher/GenrePicker";
import { MovieGenre } from "static/enums";

type Props = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.ADD_MOVIE_SCREEN
>;

export interface FormState extends FieldValues {
  title?: string;
  description?: string;
  image?: string;
  genre?: MovieGenre[];
}

const AddMovieScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] =
    React.useState<ImagePicker.ImagePickerSuccessResult>();

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

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
    picker: {
      borderColor: "#000000",
      borderWidth: 1,
    },
  });

  const onSubmit = async (data: FormState) => {
    try {
      if (data.image && image) {
        setLoading(true);
        const firebaseUrl = await uploadImage(data.image);
        const movieId: string | undefined = await createMovie({
          ...data,
          image: firebaseUrl,
        });

        if (movieId) {
          // navigate to newly created movie
          navigate({
            key: SCREENS.MOVIE_DETAILS_SCREEN,
            params: { movieId: movieId },
            name: SCREENS.MOVIE_DETAILS_SCREEN,
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setImage(undefined);
    }
  };
  console.log(watch("genre"));
  return (
    <Provider theme={{ dark: false }}>
      <KeyboardAvoidingView>
        <ScrollView style={styles.container}>
          <TouchableOpacity onPress={handleImagePicker} activeOpacity={0.7}>
            <Image
              style={styles.image}
              source={
                image
                  ? { uri: image.assets[0].uri }
                  : require("static/files/placeholder.jpeg")
              }
            />
          </TouchableOpacity>
          <Controller
            control={control}
            rules={{ required: true, minLength: 4 }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
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
            defaultValue={["Action"]}
            control={control}
            rules={{ required: true, minLength: 1 }}
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
            label="Create"
            onPress={handleSubmit(onSubmit)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Provider>
  );
};

export default AddMovieScreen;
