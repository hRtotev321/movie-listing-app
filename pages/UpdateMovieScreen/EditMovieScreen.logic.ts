import { editMovie, getOneMovie } from "firebase/services";
import React, { useEffect, useState } from "react";
import { MovieType } from "static/types";

type Props = {
  movieId: string;
};

const useEditMovieScreen = ({ movieId }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [movie, setMovie] = useState<MovieType>();

  async function fetchData() {
    try {
      setLoading(true);
      const response = await getOneMovie(movieId);
      setMovie(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEditMovie(movieData: MovieType) {
    try {
      setLoading(true);
      return await editMovie(movieData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [movieId]);

  return {
    loading,
    movie,
    handleEditMovie,
  };
};

export default useEditMovieScreen;
