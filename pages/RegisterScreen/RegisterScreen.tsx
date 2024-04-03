import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Button from "components/Button/Button";
import ScreenLayout from "components/ScreenLayout";
import { AuthError } from "firebase/auth";
import { registerUser } from "firebase/services";
import React, { useRef, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper";
import { RootStackParamList } from "static/Router";
import { SCREENS } from "static/screens";

type Props = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.REGISTER_SCREEN
>;

const RegisterScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const goToLogin = () => {
    navigate({
      key: SCREENS.LOGIN_SCREEN,
      params: undefined,
      name: SCREENS.LOGIN_SCREEN,
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
    watch,
  } = useForm();

  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit = async ({ email, password }: any) => {
    try {
      setLoading(true);
      const resp = await registerUser({ email, password });
      if (resp.code) {
        if (resp.code === "auth/email-already-in-use") {
          setError("Email Already in use!");
        } else {
          setError(resp.code);
        }
      } else {
        setError("");
        redirect();
      }
    } catch (error: unknown) {
      console.log(error);
      setError("backend error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Register</Text>
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
          rules={{ required: true, minLength: 6 }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
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
        <Controller
          control={control}
          rules={{
            required: true,
            validate: (value) =>
              value === password.current || "The passwords do not match",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              secureTextEntry
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              label="Repeat Password"
              error={!!errors["re-password"]}
            />
          )}
          name="re-password"
        />
        <Text style={styles.error}>
          {!!errors["re-password"] && "Passwords must match!"}
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
          label="Back to Login"
          onPress={goToLogin}
        />
        <Text style={styles.error}>{error}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

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
