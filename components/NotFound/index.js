import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'

const NotFound = ({ text }) => {
    return (
        <View style={styles.container}>
            <LottieView
                style={{ height: "40%", width: "100%", alignItems: "center" }}
                source={require("../../assets/images/NotFound.json")}
                autoPlay
                loop
                speed={2}
            />
            <Text style={styles.text}>You haven't placed any orders yet.</Text>
        </View>
    )
}

export default NotFound

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        // color: "#DADADA"
        paddingTop: 10,
        fontFamily: "Poppins-SemiBold",
        textAlign: "center"
    }
})