import React from "react";
import Button from "../Button";
import { fireEvent, render, screen } from "@testing-library/react-native";

describe("Render button tests", () => {
  it("Render button", () => {
    render(<Button children label="test" />);
    expect(screen.getByTestId("button:custom")).toBeTruthy();
  });

  it("Button Pressed", () => {
    const mockOnPress = jest.fn();

    const { getByTestId } = render(
      <Button children label="test2" onPress={mockOnPress} />
    );
    const pressButton = getByTestId("button:custom");

    fireEvent.press(pressButton);

    expect(mockOnPress).toHaveBeenCalled();
  });
});
