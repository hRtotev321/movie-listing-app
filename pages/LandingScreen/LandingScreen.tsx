import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import ScreenLayout from "components/ScreenLayout";
import { checkAuth } from "firebase/services";
import LoadingLayout from "pages/LoadingLayout";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { RootStackParamList } from "static/Router";
import { SCREENS } from "static/screens";

type Props = NativeStackScreenProps<RootStackParamList, SCREENS.LANDING_SCREEN>;

const LandingScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const isFocused = useIsFocused();
  
  useEffect(() => {
    checkAuth().then((logged: boolean) => {
      console.log(logged)
      if (logged) {
        navigate({
          key: SCREENS.HOME_SCREEN,
          params: undefined,
          name: SCREENS.HOME_SCREEN,
        });
      } else {
        navigate({
          key: SCREENS.LOGIN_SCREEN,
          params: undefined,
          name: SCREENS.LOGIN_SCREEN,
        });
      }
    });
  }, [isFocused]);

  return <LoadingLayout />;
};

export default LandingScreen;
