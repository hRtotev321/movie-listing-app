import { useNavigation } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "firebase/services";
import { getNetworkStatus } from "hooks/utils";
import React, { ReactNode, useEffect, useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";
import { SCREENS } from "static/screens";

interface ScreenLayoutProps {
  children: ReactNode;
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const [isOnline, setIsOnline] = useState<boolean | undefined>(true);
  const { navigate } = useNavigation();

  useEffect(() => {
    getNetworkStatus().then((is) => {
      setIsOnline(is);
    });
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("current user: ", user.email, user.uid);
      } else {
        navigate(SCREENS.LOGIN_SCREEN as never);
      }
    });
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    offlineLabel: {
      padding: 10,
      backgroundColor: theme.colors.error,
      textAlign: "center",
      color: theme.colors.errorContainer,
      fontWeight: "700",
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar />
      {!isOnline && (
        <Text style={styles.offlineLabel}>
          You are Offline
          <Icon
            size={20}
            color={theme.colors.background}
            source={"microsoft-internet-explorer"}
          />
        </Text>
      )}
      {children}
    </View>
  );
};

export default ScreenLayout;
