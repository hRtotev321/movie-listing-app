import moment from "moment";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Card, Icon, useTheme } from "react-native-paper";
import { AirbnbRating } from "react-native-ratings";
import { CommentType } from "static/types";

type SortTypes = "DATE" | "RATING";
type SortDirectionType = "ASC" | "DESC";

const sortByDateAscending = (comments?: CommentType[]): CommentType[] => {
  return comments!
    .slice()
    .sort(
      (a, b) =>
        new Date(a?.date as string).getTime() -
        new Date(b?.date as string).getTime()
    );
};

const sortByDateDescending = (comments?: CommentType[]): CommentType[] => {
  return comments!
    .slice()
    .sort(
      (a, b) =>
        new Date(b?.date as string).getTime() -
        new Date(a?.date as string).getTime()
    );
};

const sortByRatingAscending = (comments?: CommentType[]): CommentType[] => {
  return comments!.slice().sort((a, b) => (a.rating! as number) - b?.rating!);
};

const sortByRatingDescending = (comments?: CommentType[]): CommentType[] => {
  return comments!.slice().sort((a, b) => b.rating! - a?.rating!);
};

const Comments: React.FC<{ comments?: CommentType[] }> = ({ comments }) => {
  const [currentComments, setCurrentComments] = useState<
    CommentType[] | undefined
  >(comments);
  const [sortState, setSortState] = useState<SortTypes | undefined>(undefined);
  const [sortDirectionDate, setSortDirectionDate] = useState<
    SortDirectionType | undefined
  >(undefined);
  const [sortDirectionRating, setSortDirectionRating] = useState<
    SortDirectionType | undefined
  >(undefined);

  useEffect(() => { // on adding new comment
    setCurrentComments(comments);
  }, [comments]);

  useEffect(() => {
    if (sortState === "DATE") {
      if (sortDirectionDate === "ASC") {
        setCurrentComments(sortByDateAscending(comments));
      }

      if (sortDirectionDate === "DESC") {
        setCurrentComments(sortByDateDescending(comments));
      }

      if (!sortDirectionDate) {
        setCurrentComments(comments);
      }
    }
    if (sortState === "RATING") {
      if (sortDirectionRating === "ASC") {
        setCurrentComments(sortByRatingAscending(comments));
      }

      if (sortDirectionRating === "DESC") {
        setCurrentComments(sortByRatingDescending(comments));
      }

      if (!sortDirectionRating) {
        setCurrentComments(comments);
      }
    }
  }, [sortState, sortDirectionDate, sortDirectionRating]);

  const theme = useTheme();

  const SortComment = () => {
    const handleSortByDate = () => {
      setSortState("DATE");
      setSortDirectionRating(undefined);
      switch (sortDirectionDate) {
        case undefined:
          setSortDirectionDate("ASC");
          break;
        case "ASC":
          setSortDirectionDate("DESC");
          break;
        case "DESC":
          setSortDirectionDate(undefined);
          break;
      }
    };

    const handleSortByRating = () => {
      setSortState("RATING");
      setSortDirectionDate(undefined);
      switch (sortDirectionRating) {
        case undefined:
          setSortDirectionRating("ASC");
          break;
        case "ASC":
          setSortDirectionRating("DESC");
          break;
        case "DESC":
          setSortDirectionRating(undefined);
          break;
      }
    };

    const SortByDate = () => (
      <TouchableOpacity style={styles.sortButton} onPress={handleSortByDate}>
        <Text
          style={
            !sortDirectionDate
              ? { ...styles.sortButtonText, color: theme.colors.inversePrimary }
              : { ...styles.sortButtonText, color: theme.colors.primary }
          }
        >
          Date Created
        </Text>
        {sortDirectionDate === "ASC" ? (
          <Icon
            size={30}
            color={theme.colors.primary}
            source={"sort-calendar-ascending"}
          />
        ) : null}

        {sortDirectionDate === "DESC" ? (
          <Icon
            size={30}
            color={theme.colors.primary}
            source={"sort-calendar-descending"}
          />
        ) : null}
        {!sortDirectionDate ? (
          <Icon
            size={30}
            color={theme.colors.inversePrimary}
            source={"sort-calendar-descending"}
          />
        ) : null}
      </TouchableOpacity>
    );

    const SortByRating = () => (
      <TouchableOpacity onPress={handleSortByRating}>
        <Text
          style={
            !sortDirectionRating
              ? { ...styles.sortButtonText, color: theme.colors.inversePrimary }
              : { ...styles.sortButtonText, color: theme.colors.primary }
          }
        >
          Rating
        </Text>
        {sortDirectionRating === "ASC" ? (
          <Icon
            size={30}
            color={theme.colors.primary}
            source={"sort-numeric-ascending"}
          />
        ) : null}

        {sortDirectionRating === "DESC" ? (
          <Icon
            size={30}
            color={theme.colors.primary}
            source={"sort-numeric-descending"}
          />
        ) : null}
        {!sortDirectionRating ? (
          <Icon
            size={30}
            color={theme.colors.inversePrimary}
            source={"sort-numeric-descending"}
          />
        ) : null}
      </TouchableOpacity>
    );

    return (
      <View style={styles.sortBox}>
        <SortByDate />
        <SortByRating />
      </View>
    );
  };

  return (
    <>
      {currentComments?.length ? <SortComment /> : null}
      {currentComments?.map(({ author, comment, rating, date }, index) => (
        <Card style={styles.container} key={index}>
          <View style={styles.title}>
            <Text>{moment(date).format("YYYY MMM DD [at] HH:mm")}</Text>
            <AirbnbRating defaultRating={rating} showRating={false} size={15} />
          </View>
          <Text style={styles.author}>{author}</Text>
          <Text style={styles.text}>{comment}</Text>
        </Card>
      ))}
    </>
  );
};

export default Comments;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
  },
  sortBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 10,
    paddingVertical: 10,
    borderColor: "gray",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 1,
  },
  sortButton: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  sortButtonText: {
    fontWeight: "700",
  },
  author: {
    fontWeight: "bold",
  },
  title: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: { paddingTop: 10 },
});
