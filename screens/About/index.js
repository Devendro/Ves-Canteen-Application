import { StyleSheet, Text, View, StatusBar } from 'react-native'
import Header from '../../components/Header'
import React from 'react'
import LottieView from 'lottie-react-native'

const About = () => {
    return (
        <View>
            <StatusBar barStyle="dark-content" />
            <Header title={"About Us"} />
            <View style={styles.mainContainer}>
                <LottieView
                    style={{ height: 200, width: "100%", alignItems: "center" }}
                    source={require("../../assets/images/AboutUs.json")}
                    autoPlay
                    loop={true}
                />
                <Text style={styles.title}>Team <Text style={{ color: "#FFC300" }}>Devs</Text></Text>
                <Text style={styles.desc}>
                    We are <Text style={{ color: "#FFC300", fontFamily: "Poppins-Medium", }}>Team Devs</Text>, a trio of dedicated developers passionate about enhancing campus life at <Text style={{ color: "#FFC300", fontFamily: "Poppins-Medium", }}>VESIT</Text> through technology. As the creators of the VESIT Canteen app, we aim to provide students and staff with an easy, efficient way to order their favorite meals on campus. Our work doesn't stop with <Text style={{ color: "#FFC300", fontFamily: "Poppins-Medium", }}>development</Text>. we continuously gather feedback from our users to refine and improve the app, ensuring it meets their needs and delivers a smooth, reliable experience. At <Text style={{color: "#FFC300", fontFamily: "Poppins-Medium",}}>Team Devs</Text>, we're driven to make campus dining more convenient and enjoyable for everyone.
                </Text>
            </View>
        </View>
    )
}

export default About

const styles = StyleSheet.create({
    mainContainer: {
        margin: 10,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10
    },
    title: {
        fontSize: 20,
        fontFamily: "Poppins-Medium",
        textAlign: "center"
    },
    desc: {
        marginVertical: 10,
        fontFamily: "Poppins-Regular",
        textAlign: "center",
        fontSize: 14,
    }
})