import { deleteMovie, getCurrentUser, getOneMovie } from "firebase/services";
import { useEffect, useState } from "react";
import { MovieType } from "static/types";

type Props = {
  movieId: string;
};

const useMovieDetailsScreen = ({ movieId }: Props) => {
  const [movie, setMovie] = useState<MovieType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [deleteDialogOpen,setDeleteDialogOpen] = useState<boolean>(false);

  const user = getCurrentUser();

  const isCreator = user?.uid === movie?.creatorId;

  async function fetchData() {
    try {
      setLoading(true);
      const movie = await getOneMovie(movieId);
      setMovie(movie);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function refetchData() {
    const movie = await getOneMovie(movieId);
    setMovie(movie);
  }

  async function handleDeleteMovie(movieId: string) {
    try {
      setDeleteDialogOpen(false);
      setDeleteLoading(true);
      const deleted = await deleteMovie(movieId);
      return deleted;
    } catch (error) {
      return false;
    } finally {
      setDeleteLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [movieId]);

const openDialog = () => setDeleteDialogOpen(true);
const closeDialog = () => setDeleteDialogOpen(false);

  return {
    loading,
    deleteLoading,
    movie,
    isCreator,
    deleteDialogOpen,
    openDialog,
    closeDialog,
    handleDeleteMovie,
    fetchData,
    refetchData,
  };
};

export default useMovieDetailsScreen;
