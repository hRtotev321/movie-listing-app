import AsyncStorage from "@react-native-async-storage/async-storage";
import { findMostFrequentItem } from "./utils";
import * as FileSystem from "expo-file-system";
import { MovieType } from "static/types";

export enum StorageKeys {
  SUGGESTIONS = "last-visited",
  ALL_MOVIES = "all-movies",
  ONLINE = "online",
}

export const storeSuggestions = async (value: any) => {
  try {
    let current: string[] = [];
    const values: string | null = await AsyncStorage.getItem(
      StorageKeys.SUGGESTIONS
    );
    if (values) {
      current = JSON.parse(values);
      current.push(value[0]);
      if (current.length > 6) {
        current.splice(0, 1);
      }
    }
    await AsyncStorage.setItem(
      StorageKeys.SUGGESTIONS,
      JSON.stringify(current)
    );
  } catch (e) {
    console.log("error saving to AsyncStorage : ", StorageKeys.SUGGESTIONS);
  }
};

export const getSuggestion = async () => {
  try {
    const string: string | null = await AsyncStorage.getItem(
      StorageKeys.SUGGESTIONS
    );
    if (string && string.length) {
      const arrayForSuggestion = JSON.parse(string);
      const mostFrequentGenre = findMostFrequentItem(arrayForSuggestion);

      return mostFrequentGenre; // return the genre that will appear first
    }

    return null; // returns null probably on initial load of the app
  } catch (error) {
    console.log("error getting from AsyncStorage : ", StorageKeys.SUGGESTIONS);
  }
};

export const syncCacheOnDelete = async (movieId: string) => {
  await AsyncStorage.removeItem(movieId);
  const allMoviesInCache = await AsyncStorage.getItem(StorageKeys.ALL_MOVIES);

  if (allMoviesInCache && allMoviesInCache.length) {
    const arrayOfMovieIDs = JSON.parse(allMoviesInCache);
    const index = arrayOfMovieIDs.indexOf(movieId);
    if (index > -1) {
      // only splice array when item is found
      arrayOfMovieIDs.splice(index, 1); // 2nd parameter means remove one item only
    }

    await AsyncStorage.setItem(
      StorageKeys.ALL_MOVIES,
      JSON.stringify([...arrayOfMovieIDs])
    );
  }
};

export const saveMoviesToStorage = async (
  movies: MovieType[]
): Promise<MovieType[]> => {
  async function saveMovieImageToMemory(movie: MovieType): Promise<MovieType> {
    const memoryUri: string | undefined = await saveImageToMemory(
      movie.image,
      movie.movieId
    );
    const updatedMovie: MovieType = {
      ...movie,
      image: memoryUri,
    };

    await saveMovieInCache(updatedMovie);
    return updatedMovie;
  }

  const promises = movies.map(async (movie) => {
    return new Promise(async function (resolve, reject) {
      try {
        // 1st check if the movie is already in cache
        const cacheMovie = await checkIfMovieInCache(movie.movieId as string);
        if (cacheMovie) {
          if (cacheMovie.lastChange !== movie?.lastChange) {
            const updatedMovie = await saveMovieImageToMemory(movie);
            resolve(updatedMovie);
            return;
          } else {
            resolve(cacheMovie);
            return;
          }
          // check timestamp of movie here and update in cache
        }
        // if not save it and resolve the promise
        const updatedMovie = await saveMovieImageToMemory(movie);
        resolve(updatedMovie);
      } catch (error) {
        reject("Error saving movie to storage & cache");
      }
    });
  });

  return (await Promise.all(promises)) as MovieType[];
};

async function checkIfMovieInCache(movieId: string) {
  const movie = await AsyncStorage.getItem(movieId as string);
  if (!movie) {
    return undefined;
  }

  return JSON.parse(movie);
}

async function saveMovieInCache(movie: MovieType) {
  const moviesArray = await AsyncStorage.getItem(StorageKeys.ALL_MOVIES);

  if (!moviesArray) {
    await AsyncStorage.setItem(
      StorageKeys.ALL_MOVIES,
      JSON.stringify([movie.movieId])
    );
  } else {
    const ma: string[] = JSON.parse(moviesArray);
    if (!ma.includes(movie.movieId as string)) {
      await AsyncStorage.setItem(
        StorageKeys.ALL_MOVIES,
        JSON.stringify([...ma, movie.movieId])
      );
    }
  }
  await AsyncStorage.setItem(movie.movieId as string, JSON.stringify(movie));
}

export async function getMoviesFromCache() {
  const moviesArray = await AsyncStorage.getItem(StorageKeys.ALL_MOVIES);
  if (!moviesArray) {
    return [];
  } else {
    const movies = JSON.parse(moviesArray);

    const promises = movies.map((movieId: string) => {
      return new Promise(async function (resolve, reject) {
        try {
          const movie = await AsyncStorage.getItem(movieId);
          if (movie) {
            return resolve(JSON.parse(movie));
          } else {
            return reject(undefined);
          }
        } catch (error) {
          console.log("Cache Error");
        }
      });
    });

    return Promise.all(promises);
  }
}

async function saveImageToMemory(imageUrl?: string, movieId?: string) {
  if (!movieId || !imageUrl) return undefined;
  const downloadResumable = FileSystem.createDownloadResumable(
    imageUrl as string,
    FileSystem.documentDirectory + `/${imageUrl.slice(-40)}`,
    {}
  );

  try {
    const rr = await downloadResumable.downloadAsync();
    return rr?.uri || undefined;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
