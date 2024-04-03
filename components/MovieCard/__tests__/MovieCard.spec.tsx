import React from "react";

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import MovieCard from "../MovieCard";
import { getMovie } from "../testHooks";

describe("Render movie card tests", () => {
  it("Render one card", () => {
    const movie = getMovie();
    render(<MovieCard movie={movie} />);
    expect(screen.getByTestId("movieCard")).toBeTruthy();
  });

  it("Render many cards", async () => {
    const movie = getMovie();
    const movie2 = getMovie();

    const { getByText } = render(
      <>
        <MovieCard movie={movie2} />
        <MovieCard movie={movie} />
      </>
    );

    const gotMovie = getByText(movie.title as string);
    const gotMovie2 = getByText(movie2.title as string);

    expect(gotMovie).toBeTruthy();
    expect(gotMovie2).toBeTruthy();
  });

  it("Handle click on a movieCard", () => {
    const movie = getMovie();

    const mockOnPress = jest.fn();

    const { getByTestId } = render(
      <MovieCard movie={movie} onPress={mockOnPress} />
    );
    const pressMovieCard = getByTestId("movieCard");

    fireEvent.press(pressMovieCard);

    expect(mockOnPress).toHaveBeenCalled();
  });
});
