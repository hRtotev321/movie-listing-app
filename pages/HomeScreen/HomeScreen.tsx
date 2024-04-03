import React, { useEffect, useState } from "react";
import Button from "components/Button/Button";
import MovieCard from "components/MovieCard/MovieCard";
import ScreenLayout from "components/ScreenLayout";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import {
  Chip,
  Dialog,
  List,
  PaperProvider,
  Portal,
  Searchbar,
  MD3LightTheme as DefaultTheme,
  ThemeBase,
} from "react-native-paper";
import { SCREENS } from "static/screens";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "static/Router";
import useHomeScreen from "./HomeScreen.logic";
import LoadingLayout from "pages/LoadingLayout";
import { MovieType } from "static/types";
import { useIsFocused } from "@react-navigation/native";
import { MovieGenre } from "static/enums";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

const theme: ThemeBase = {
  ...DefaultTheme,
  dark: false,
};

type Props = NativeStackScreenProps<RootStackParamList, SCREENS.HOME_SCREEN>;

const HomeScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const {
    loading,
    movies,
    searchQuery,
    isOnline,
    filterGenres,
    refilter,
    addGenreToFilter,
    fetchData,
    setSearchQuery,
  } = useHomeScreen();
  const [refreshing, setRefreshing] = React.useState(false);
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState<boolean>(false);
  const [expanded, setExpanded] = React.useState(false);

  const handlePress = () => setExpanded(!expanded);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => {
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    fetchData().then(refilter);
  }, [isFocused]);

  const onPressMovie = (movieId: string) => {
    if (isOnline) {
      navigate({
        key: SCREENS.MOVIE_DETAILS_SCREEN,
        params: { movieId: movieId as string },
        name: SCREENS.MOVIE_DETAILS_SCREEN,
      });
    }
  };

  const renderItem = (item: MovieType) => {
    return (
      <MovieCard
        movie={item}
        onPress={() => onPressMovie(item?.movieId as string)}
      />
    );
  };

  function GenreFilterDialog() {
    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);

    return (
      <>
        <Button
          style={{ marginHorizontal: 5, marginTop: 10 }}
          children
          label={`Select Genres (${filterGenres.length})`}
          mode="contained"
          onPress={showDialog}
        />
        <View style={styles.genreFilters}>
          <View style={styles.allSelectedGenres}>
            {filterGenres?.map((gen) => {
              return (
                <Chip
                  onClose={() => addGenreToFilter(gen)}
                  compact
                  key={gen}
                  mode="outlined"
                >
                  {gen}
                </Chip>
              );
            })}
          </View>
        </View>

        <Portal>
          <Dialog
            style={{ height: 500 }}
            visible={visible}
            onDismiss={hideDialog}
          >
            <Dialog.Title>Filter By Genres</Dialog.Title>
            <Dialog.ScrollArea>
              <ScrollView>
                <View style={styles.allGenres}>
                  {Object.values(MovieGenre).map((genre) => {
                    const isSelected = filterGenres.includes(genre);
                    return (
                      <TouchableOpacity
                        key={genre}
                        onPress={() => addGenreToFilter(genre)}
                      >
                        <Chip
                          icon={
                            isSelected
                              ? "checkbox-outline"
                              : "border-all-variant"
                          }
                          selected={isSelected}
                          mode="flat"
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
  }

  return (
    <PaperProvider theme={theme}>
      <ScreenLayout>
        <List.Accordion
          style={styles.filtersAc}
          title="Filters"
          left={(props) => <List.Icon {...props} icon="filter-menu-outline" />}
          expanded={expanded}
          onPress={handlePress}
        >
          <View>
            <Searchbar
              style={styles.search}
              placeholder="Search"
              onChangeText={setSearchQuery}
              value={searchQuery}
            />
            <GenreFilterDialog />
          </View>
        </List.Accordion>

        <Button
          style={styles.button}
          compact
          mode="contained"
          label="Add Movie"
          children
          disabled={!isOnline}
          onPress={() => {
            navigate({
              key: SCREENS.ADD_MOVIE_SCREEN,
              name: SCREENS.ADD_MOVIE_SCREEN,
            });
          }}
        />
        {loading ? (
          <LoadingLayout />
        ) : (
          <View style={{ flex: 1 }}>
            <FlatList
              style={{ flex: 1 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderItem={({ item }) => renderItem(item)}
              data={movies}
              numColumns={2}
            />
          </View>
        )}
      </ScreenLayout>
    </PaperProvider>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  moviesContainer: {},
  search: {
    marginHorizontal: 5,
    marginTop: 15,
  },
  button: {
    marginVertical: 15,
    marginHorizontal: 5,
  },
  genreFilters: {
    display: "flex",
    flexDirection: "row",
    marginHorizontal: 5,
    marginTop: 15,
  },
  allGenres: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    maxHeight: 350,
    gap: 5,
    marginBottom: 150,
    marginTop: 20,
  },
  allSelectedGenres: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 5,
  },
  filtersAc: {
    backgroundColor: "#eee4f5",
  },
});
