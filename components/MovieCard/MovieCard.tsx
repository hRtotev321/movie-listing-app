import { useDimensions } from "hooks/ui";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native-gesture-handler";
import { Card } from "react-native-paper";
import { MovieType } from "static/types";

interface MovieCardProps extends TouchableOpacityProps {
  movie: MovieType;
}

const MovieCard: React.FC<MovieCardProps> = ({ onPress, movie }) => {
  const { screenWidth } = useDimensions();

  const styles = StyleSheet.create({
    container: {
      width: (screenWidth - 20) / 2,
      marginVertical: 5,
      marginHorizontal: 5,
    },
    textContainer: {
      position: "absolute",
      bottom: 0,
      padding: 5,
      backgroundColor: "rgba(0,0,0, 0.4)",
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      width: "100%",
      alignItems: "center",
    },
    cardTitle: {
      color: "white",
      fontSize: 16,
    },
  });

  return (
    <TouchableOpacity
      testID="movieCard"
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.8}
    >
      <Card>
        <Card.Cover
          source={{
            uri: movie?.image,
          }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{movie?.title}</Text>
          <Text style={styles.cardTitle}>{movie?.genre && movie?.genre[0]}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default MovieCard;
