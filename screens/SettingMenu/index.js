import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faCartArrowDown, faChevronRight, faCircle, faCircleExclamation, faCircleInfo, faComment, faHeart, faIndianRupeeSign, faKey, faPowerOff, faRupee } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import Header from '../../components/Header'

const SettingMenu = () => {
  const userDetail = useSelector((state) => state?.user)
  const navigation = useNavigation()

  /**
   * @description this function is used to navigate on speific screens
   * @param {string} path
   */
  const navigateTo = (path) => {
    navigation.navigate(path);
  }
  return (
    <View >
      <Header title={"Account"} showProfile={false}/>
      <View style={styles.container}>
        {userDetail && userDetail?.loggedIn && <View style={styles.profileCard}>
          <View style={styles.profileImage}>
            <Text style={styles.profileImageText}>{userDetail?.name?.charAt(0)}</Text>
          </View>
          <View style={styles.profileDetail}>
            <Text style={styles.username}>{userDetail?.name}</Text>
            <Text style={styles.email}>{userDetail?.email}</Text>
            <Pressable >
              <Text style={styles.profileView}>View Profile {">"}</Text>
            </Pressable>
          </View>
        </View>}
        {(!userDetail || !userDetail?.loggedIn) && <View style={styles.profileCard}>
          <View style={styles.profileDetail}>
            <Text style={styles.username}>Not Logged In</Text>
            <Text style={styles.email}>Please login to Continue</Text>
            <Pressable >
              <Text style={styles.profileView}>login here {">"}</Text>
            </Pressable>
          </View>
        </View>}
        <View style={styles.orderSection}>
          <Pressable style={styles.ordersOption}>
            <FontAwesomeIcon icon={faHeart} color="#51636E" style={styles.ordersOptionIcon} size={18} />
            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between", width: "100%" }}>
              <Text style={styles.ordersOptionText}>Your Favourites</Text>
              <FontAwesomeIcon icon={faChevronRight} color="#51636E" style={{ marginEnd: 20 }} />
            </View>
          </Pressable>
          <View style={{ borderWidth: 0.2, borderColor: "#DADADA", left: 40, width: "90.7%" }}></View>
          <Pressable style={styles.ordersOption} onPress={() => { navigateTo("Orders") }}>
            <FontAwesomeIcon icon={faCartArrowDown} color="#51636E" style={styles.ordersOptionIcon} size={18} />
            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between", width: "100%" }}>
              <Text style={styles.ordersOptionText}>Your Orders</Text>
              <FontAwesomeIcon icon={faChevronRight} color="#51636E" style={{ marginEnd: 20 }} />
            </View>
          </Pressable>
          <View style={{ borderWidth: 0.2, borderColor: "#DADADA", left: 40, width: "90.7%" }}></View>
          <Pressable style={styles.ordersOption}>
            <FontAwesomeIcon icon={faIndianRupeeSign} color="#51636E" style={styles.ordersOptionIcon} size={18} />
            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between", width: "100%" }}>
              <Text style={styles.ordersOptionText}>Your Payments</Text>
              <FontAwesomeIcon icon={faChevronRight} color="#51636E" style={{ marginEnd: 20 }} />
            </View>
          </Pressable>
        </View>
        <View style={styles.lastSection}>
          <Pressable style={styles.ordersOption}>
            <FontAwesomeIcon icon={faCircleInfo} color="#51636E" style={styles.ordersOptionIcon} size={18} />
            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between", width: "100%" }}>
              <Text style={styles.ordersOptionText}>About Us</Text>
              <FontAwesomeIcon icon={faChevronRight} color="#51636E" style={{ marginEnd: 20 }} />
            </View>
          </Pressable>
          <View style={{ borderWidth: 0.2, borderColor: "#DADADA", left: 40, width: "90.7%" }}></View>
          <Pressable style={styles.ordersOption}>
            <FontAwesomeIcon icon={faComment} color="#51636E" style={styles.ordersOptionIcon} size={18} />
            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between", width: "100%" }}>
              <Text style={styles.ordersOptionText}>Give a Feedback</Text>
              <FontAwesomeIcon icon={faChevronRight} color="#51636E" style={{ marginEnd: 20 }} />
            </View>
          </Pressable>
          <View style={{ borderWidth: 0.2, borderColor: "#DADADA", left: 40, width: "90.7%" }}></View>
          <Pressable style={styles.ordersOption}>
            <FontAwesomeIcon icon={faKey} color="#51636E" style={styles.ordersOptionIcon} size={18} />
            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between", width: "100%" }}>
              <Text style={styles.ordersOptionText}>Change Password</Text>
              <FontAwesomeIcon icon={faChevronRight} color="#51636E" style={{ marginEnd: 20 }} />
            </View>
          </Pressable>
          <View style={{ borderWidth: 0.2, borderColor: "#DADADA", left: 40, width: "90.7%" }}></View>
          <Pressable style={styles.ordersOption}>
            <FontAwesomeIcon icon={faPowerOff} color="#51636E" style={styles.ordersOptionIcon} size={18} />
            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between", width: "100%" }}>
              <Text style={styles.ordersOptionText}>{userDetail && userDetail?.loggedIn ? "Logout" : "Login"}</Text>
              <FontAwesomeIcon icon={faChevronRight} color="#51636E" style={{ marginEnd: 20 }} />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default SettingMenu

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  profileCard: {
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    flexDirection: "row"
  },
  profileImage: {
    height: 80,
    width: 80,
    borderRadius: 80,
    backgroundColor: "rgba(255, 195, 0, 0.2)",
    textAlign: "center",
    alignItems: "center",
    justifyContent: 'center'
  },
  profileImageText: {
    color: "#FFC300",
    fontFamily: "Poppins-SemiBold",
    fontSize: 40,
    marginTop: 8
  },
  profileDetail: {
    paddingHorizontal: 15
  },
  username: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    marginBottom: -3
  },
  email: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    marginBottom: 4
  },
  profileView: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#ffc300"
  },
  orderSection: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,

  },
  ordersOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15
  },
  ordersOptionIcon: {
    marginRight: 10
  },
  ordersOptionText: {
    fontFamily: "Poppins-Medium"
  },
  lastSection: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,

  },
})