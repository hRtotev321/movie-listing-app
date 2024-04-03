import { removeValue } from "@zolv/array-utilities";
import Button from "components/Button/Button";
import React, { useEffect, useState } from "react";
import { FieldValues, UseFormSetValue } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Card, Chip, Dialog, Portal, Text, useTheme } from "react-native-paper";
import { MovieGenre } from "static/enums";

type GenrePickerProps = {
  error: any;
  onValueChange: UseFormSetValue<FieldValues>;
  value: MovieGenre[];
};

const GenrePicker: React.FC<GenrePickerProps> = ({
  error,
  value,
  onValueChange,
}) => {
  const theme = useTheme();
  const [visible, setVisible] = useState<boolean>(false);
  const [genres, setGenres] = useState<MovieGenre[]>(value);

  useEffect(() => {
    setGenres(value);
  }, [value]);

  function addGenre(genre: MovieGenre) {
    if (genres?.includes(genre)) {
      setGenres((x) => removeValue({ arr: x, value: genre }));
    } else {
      setGenres((x) => [...x, genre]);
    }
  }
  const showDialog = () => setVisible(true);

  const hideDialog = () => {
    onValueChange("genre", genres);
    setVisible(false);
  };

  const styles = StyleSheet.create({
    error: {
      borderColor: theme.colors.error,
      borderWidth: 2,
      backgroundColor: theme.colors.background,
    },
    card: {
      borderColor: theme.colors.inversePrimary,
      borderWidth: 1,
      backgroundColor: theme.colors.background,
    },
    allGenres: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
    },
    selectedGenres: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
  });

  const RenderSelectedGenres = () => {
    if (genres?.length) {
      return (
        <>
          {genres?.map((gen) => (
            <Chip key={gen} mode="flat">
              {gen}
            </Chip>
          ))}
        </>
      );
    }

    return <Text>Select Genres</Text>;
  };

  return (
    <>
      <Card
        style={error ? styles.error : styles.card}
        mode="contained"
        onPress={showDialog}
      >
        <Card.Content style={styles.selectedGenres}>
          <RenderSelectedGenres />
        </Card.Content>
      </Card>
      <Portal>
        <Dialog
          style={{ height: 500 }}
          visible={visible}
          onDismiss={hideDialog}
        >
          <Dialog.Title>Select Genres</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>
              <View style={styles.allGenres}>
                {Object.values(MovieGenre).map((genre) => {
                  const isSelected = genres?.includes(genre);

                  return (
                    <TouchableOpacity
                      key={genre}
                      onPress={() => addGenre(genre)}
                    >
                      <Chip
                        icon={
                          isSelected ? "checkbox-outline" : "border-all-variant"
                        }
                        selected={isSelected}
                        mode="outlined"
                      >
                        {genre}
                      </Chip>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button
              mode="contained"
              children
              label="Confirm"
              onPress={hideDialog}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default GenrePicker;
