import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronRight,
  faClockRotateLeft,
  faSearch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const RecentSearch = ({ title, recent, searchKeyword }) => {
  const [titleBold, setTitleBold] = useState(title);
  function splitSentenceWithKeyword(sentence, keyword) {
    if (!keyword || keyword === "") {
      setTitleBold(sentence);
    } else {
      console.log(sentence?.toLowerCase().startsWith(keyword?.toLowerCase()));
      if (!sentence?.toLowerCase().startsWith(keyword?.toLowerCase())) {
        setTitleBold(sentence);
      } else {
        const regex = new RegExp(keyword, 'i');
        const parts = sentence.split(regex, 2);
        setTitleBold(parts[1]);
      }
    }
  }

  // useEffect(() => {
  //   splitSentenceWithKeyword(title, searchKeyword);
  // }, [searchKeyword]);

  // useEffect(() => {
  //   console.log(titleBold);
  // }, [titleBold]);

  return (
    <View style={styles.searchCard}>
      <View style={styles.searchHeading}>
        <FontAwesomeIcon
          icon={recent ? faClockRotateLeft : faSearch}
          color="#51636E"
        />
        <View style={styles.searchTitle}>
          <Text style={styles.title}>{searchKeyword}</Text>
          <Text style={styles.boldtitle}>{titleBold}</Text>
        </View>
      </View>
      <FontAwesomeIcon
        icon={recent ? faXmark : faChevronRight}
        color="#51636E"
      />
    </View>
  );
};

export default RecentSearch;

const styles = StyleSheet.create({
  searchCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  searchHeading: {
    flexDirection: "row",
    gap: 15,
  },
  searchTitle: {
    flexDirection: "row",
  },
  title: {
    fontSize: 13,
    fontFamily: "Poppins-Medium",
    color: "#51636E",
  },
  boldtitle:{
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
    color: "#51636E",
  }
});
