import React from "react";
import { Text, View, Image } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

export function Review() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFC300",
        alignItems: "center",
        paddingTop: 70,
        width: "100%"
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 24,
          fontWeight: "bold",
          fontFamily: "Poppins-Light",
        }}
      >
        Rate Our Service
      </Text>
      <Text
        style={{
          color: "#483C3C",
          fontSize: 30,
          fontWeight: "bold",
          fontFamily: "Poppins-Light",
          marginTop: 40,
        }}
      >
        How was
      </Text>
      <Text>
        <Text
          style={{
            color: "#483C3C",
            fontSize: 30,
            fontWeight: "bold",
            fontFamily: "Poppins-Light",
          }}
        >
          your{" "}
        </Text>
        <Text
          style={{
            color: "#fff",
            fontSize: 30,
            fontWeight: "bold",
            fontFamily: "Poppins-Light",
          }}
        >
          food?
        </Text>
      </Text>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 2}}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 75,
            backgroundColor: "#FFF",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            transform: [{ scaleX: -1 }],
          }}
        >
          <FontAwesomeIcon icon={faThumbsDown} color="red" size={22} />
        </View>
        <View
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            backgroundColor: "#FFF",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            marginHorizontal: 20,
          }}
        >
          <Image
            source={require("../../assets/images/Samosa.png")} // Replace with your image path
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        </View>

        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 75,
            backgroundColor: "#FFF",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          {/* <Image
            source={require("../../assets/images/like.png")} // Replace with your image path
            style={{ width: 30, height: 30, borderRadius: 50, }}
          /> */}
          <FontAwesomeIcon icon={faThumbsUp} color="green" size={22} />
        </View>
      </View>

      <Text
        style={{
          color: "#483C3C",
          fontSize: 30,
          fontWeight: "bold",
          fontFamily: "Poppins-Light",
          marginTop: 60,
        }}
      >
        How was your
      </Text>

      <Text
        style={{
          color: "#fff",
          fontSize: 30,
          fontWeight: "bold",
          fontFamily: "Poppins-Light",
        }}
      >
        experience?
      </Text>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 75,
            backgroundColor: "#FFF",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            transform: [{ scaleX: -1 }],
          }}
        >
          <FontAwesomeIcon icon={faThumbsDown} color="red" size={22} />
        </View>
        <View
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            backgroundColor: "#FFF",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            marginHorizontal: 20,
          }}
        >
          <Image
            source={require("../../assets/images/actor.jpeg")} // Replace with your image path
            style={{ width: 150, height: 150, borderRadius: 75 }}
          />
        </View>

        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 75,
            backgroundColor: "#FFF",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          {/* <Image
            source={require("../../assets/images/like.png")} // Replace with your image path
            style={{ width: 30, height: 30, borderRadius: 50, }}
          /> */}
          <FontAwesomeIcon icon={faThumbsUp} color="green" size={22} />
        </View>
      </View>
    </View>
  );
}
