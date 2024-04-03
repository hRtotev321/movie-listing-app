import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SCREENS } from "./screens";
import HomeScreen from "pages/HomeScreen/HomeScreen";
import AddMovieScreen from "pages/AddMovieScreen/AddMovieScreen";
import MovieDetailsScreen from "pages/MovieDetailsScreen/MovieDetailsScreen";
import EditMovieScreen from "pages/UpdateMovieScreen/EditMovieScreen";
import LandingScreen from "pages/LandingScreen/LandingScreen";
import LoginScreen from "pages/LoginScreen/LoginScreen";
import RegisterScreen from "pages/RegisterScreen/RegisterScreen";
import Logout from "components/Logout";

export type RootStackParamList = {
  [SCREENS.LANDING_SCREEN]: undefined;
  [SCREENS.LOGIN_SCREEN]: undefined;
  [SCREENS.REGISTER_SCREEN]: undefined;
  [SCREENS.HOME_SCREEN]: { movieId: string };
  [SCREENS.ADD_MOVIE_SCREEN]: undefined;
  [SCREENS.MOVIE_DETAILS_SCREEN]: { movieId: string };
  [SCREENS.UPDATE_MOVIE_SCREEN]: { movieId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Router: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={SCREENS.LANDING_SCREEN}>
        <Stack.Screen
          options={{ headerLeft: () => <></>, headerRight: Logout,title:"" }}
          name={SCREENS.HOME_SCREEN}
          component={HomeScreen}
        />
        <Stack.Screen
          name={SCREENS.ADD_MOVIE_SCREEN}
          component={AddMovieScreen}
          options={{
            headerTitle: "Add Movie",
          }}
        />
        <Stack.Screen
          name={SCREENS.UPDATE_MOVIE_SCREEN}
          options={{
            headerTitle: "Edit Movie",
          }}
          component={EditMovieScreen}
        />
        <Stack.Screen
          name={SCREENS.MOVIE_DETAILS_SCREEN}
          component={MovieDetailsScreen}
          options={{
            headerTitle: "Movie Details",
          }}
        />
        <Stack.Screen
          name={SCREENS.LANDING_SCREEN}
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREENS.LOGIN_SCREEN}
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREENS.REGISTER_SCREEN}
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
