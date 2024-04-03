import React from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COLORS } from "static/colors";
import { Button as ButtonBase, ButtonProps } from "react-native-paper";
interface Props extends ButtonProps {
  label: string;
}

const Button: React.FC<Props> = ({ label, onPress, ...rest }) => {
  return (
    <TouchableOpacity  activeOpacity={0.8}>
      <ButtonBase
        labelStyle={{ fontSize: 16 }}
        testID="button:custom"
        onPress={onPress}
        {...rest}
      >
        {label}
      </ButtonBase>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
