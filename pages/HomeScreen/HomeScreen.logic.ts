import { useIsFocused } from "@react-navigation/native";
import { removeValue } from "@zolv/array-utilities";
import { getMovies } from "firebase/services";
import { getNetworkStatus } from "hooks/utils";
import { useEffect, useState } from "react";
import { MovieGenre } from "static/enums";
import { MovieType } from "static/types";

const useHomeScreen = () => {
  const isFocused = useIsFocused();

  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState<boolean>(false);
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [apiData, setApiData] = useState<MovieType[]>([]);
  const [isOnline, setIsOnline] = useState<boolean | undefined>(true);
  const [filterGenres, setFilterGenres] = useState<MovieGenre[]>([]);

  function addGenreToFilter(genre: MovieGenre) {
    if (filterGenres.includes(genre)) {
      setFilterGenres((x) => removeValue({ arr: x, value: genre }));
    } else {
      setFilterGenres((x) => [...x, genre]);
    }
  }

  async function fetchData() {
    try {
      setLoading(true);
      setTimeout(async () => {
        const response = await getMovies();
        setApiData(response);
        setMovies(response);
      }, 600);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 600);
    }
  }

  const search = (keyword: string) => {
    if (searchQuery.length && filterGenres.length) {
      const result = apiData.filter((movie) =>
        movie.title?.toLocaleLowerCase().includes(keyword.toLowerCase())
      );

      const finalResult = result.filter((movie) =>
        filterGenres.some((x) => movie?.genre?.includes(x))
      );

      setMovies(finalResult);
      return;
    }

    if (searchQuery.length) {
      const result = apiData.filter((movie) =>
        movie.title?.toLocaleLowerCase().includes(keyword.toLowerCase())
      );
      setMovies(result);
      return;
    }

    if (filterGenres.length) {
      const result = apiData.filter((movie) =>
        filterGenres.some((x) => movie?.genre?.includes(x))
      );

      setMovies(result);
      return;
    }
  };

  useEffect(() => {
    getNetworkStatus().then((is) => {
      setIsOnline(is);
    });
    fetchData();
  }, []);

  const refilter = () => {
    if (!apiData.length) return;
    if (searchQuery.length || filterGenres.length) {
      search(searchQuery);
    } else {
      setMovies(apiData);
    }
  };

  useEffect(() => {
    refilter();
  }, [searchQuery, filterGenres]);

  return {
    loading: loading ?? movies.length,
    movies,
    searchQuery,
    isOnline,
    filterGenres,
    refilter,
    addGenreToFilter,
    setSearchQuery,
    fetchData,
    search,
  };
};

export default useHomeScreen;
