import { MovieGenre } from "./enums";

export type CommentType = {
  author?: string;
  comment?: string;
  rating?: number;
  date?: string;
};

export type MovieType = {
  creatorId?: string;
  creator?: string;
  title?: string;
  rating?: number;
  comments?: CommentType[];
  description?: string;
  image?: string;
  genre?: MovieGenre[];
  movieId?: string;
  lastChange?: number;
};

export interface CreateMovieType {
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
  genre?: MovieGenre[];
}

export interface UpdateMovieType extends CreateMovieType {
  rating?: number;
  comments?: CommentType[];
  movieId?: string;
}
