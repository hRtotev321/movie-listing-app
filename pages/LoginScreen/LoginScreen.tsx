import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Button from "components/Button/Button";
import ScreenLayout from "components/ScreenLayout";
import { AuthError, AuthErrorCodes } from "firebase/auth";
import { loginUser } from "firebase/services";
import React, { useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import { RootStackParamList } from "static/Router";
import { SCREENS } from "static/screens";

type Props = NativeStackScreenProps<RootStackParamList, SCREENS.LOGIN_SCREEN>;

const LoginScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const goToRegister = () => {
    navigate({
      key: SCREENS.REGISTER_SCREEN,
      params: undefined,
      name: SCREENS.REGISTER_SCREEN,
    });
  };

  const redirect = () => {
    navigate({
      key: SCREENS.LANDING_SCREEN,
      params: undefined,
      name: SCREENS.LANDING_SCREEN,
    });
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email, password }: any) => {
    try {
      setLoading(true);
      const resp = await loginUser({ email, password });
      if (resp.code) {
        if (resp.code === "auth/invalid-credential") {
          setError("Invalid Credentials!");
        }
      } else {
        setError("");
        redirect();
      }
    } catch (error: unknown) {
      setError("backend error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <Controller
          control={control}
          rules={{
            required: true,
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              label="example@mail.com"
              error={!!errors["email"]}
            />
          )}
          name="email"
        />
        <Text style={styles.error}>
          {!!errors["email"] && "Email is Invalid"}
        </Text>

        <Controller
          control={control}
          rules={{ required: true, minLength: 6, maxLength: 20 }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              secureTextEntry
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              label="Password (min 6)"
              error={!!errors["password"]}
            />
          )}
          name="password"
        />
        <Text style={styles.error}>
          {!!errors["password"] && "Password must be 6 to 20 characters long"}
        </Text>
        <Button
          loading={loading}
          style={styles.button}
          mode={"contained"}
          children
          label="Submit"
          onPress={handleSubmit(onSubmit)}
        />
        <Button
          style={styles.button}
          children
          label="Crete Account"
          onPress={goToRegister}
        />
        <Text style={styles.error}>{error}</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    marginVertical: 30,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    padding: 10,
  },
  button: {
    marginTop: 20,
  },
  error: {
    height: 20,
    color: "red",
    textAlign: "center",
    fontWeight: "700",
  },
});
