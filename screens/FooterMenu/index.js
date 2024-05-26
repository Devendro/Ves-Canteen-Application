import React from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  Platform,
  StyleSheet,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome, faEllipsis, faCartArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faHeart, faUser } from "@fortawesome/free-solid-svg-icons";

export function FooterMenu() {
  return (
    <View style={styles.footer}>
      <View style={styles.footerItem}>
        <FontAwesomeIcon
          icon={faHome}
          style={styles.footerIcon}
          size={15}
          color="#667C8A"
        />
        <Text style={styles.footerText}>Home</Text>
      </View>
      <View style={styles.footerItem}>
        <FontAwesomeIcon
          icon={faHeart}
          size={15}
          style={styles.footerIcon}
          color="#667C8A"
        />
        <Text style={styles.footerText}>Favorites</Text>
      </View>
      <View style={styles.footerItem}>
        <FontAwesomeIcon
          icon={faUser}
          size={15}
          style={styles.footerIcon}
          color="#667C8A"
        />
        <Text style={styles.footerText}>Account</Text>
      </View>
      <View style={styles.footerItem}>
        <FontAwesomeIcon
          icon={faCartArrowDown}
          size={15}
          style={styles.footerIcon}
          color="#667C8A"
        />
        <Text style={styles.footerText}>Account</Text>
      </View>
      <View style={styles.footerItem}>
        <FontAwesomeIcon
          icon={faEllipsis}
          size={15}
          style={styles.footerIcon}
          color="#667C8A"
        />
        <Text style={styles.footerText}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    flexGrow: 1,
    paddingTop: 11,
    paddingBottom: 5,
    backgroundColor: "#FFF",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  footerItem: {
    alignItems: "center",
  },
  footerIcon: {
    marginBottom: 5,
  },
  footerText: {
    fontSize: 13,
    color: "#667C8A",
    fontFamily: "Poppins-Medium",
  },
});
