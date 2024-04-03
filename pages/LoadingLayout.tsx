import React from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const LoadingLayout: React.FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size={120} />
    </View>
  );
};

export default LoadingLayout;
