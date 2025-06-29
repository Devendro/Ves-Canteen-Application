import { Pressable, StyleSheet, Text, View, StatusBar } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faCartArrowDown, faChevronRight, faCircle, faCircleExclamation, faCircleInfo, faComment, faHeart, faIndianRupeeSign, faKey, faPowerOff, faRupee, faStar } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import Header from '../../components/Header'
import { LOGOUT } from '../../context/constants/user'
import Animated from 'react-native-reanimated'

const SettingMenu = () => {
  const userDetail = useSelector((state) => state?.user)

  const navigation = useNavigation()
  const dispatch = useDispatch()

  /**
   * @description this function is used to navigate on speific screens
   * @param {string} path
   */
  const navigateTo = (path) => {
    navigation.navigate(path);
  }

  const handleLogout = () => {
    dispatch({type: LOGOUT, data: {}})
  }
  return (
    <View >
      <StatusBar barStyle="dark-content" />
      <Header title={"Account"} showProfile={false} />
      <View style={styles.container}>
        {userDetail && userDetail?.loggedIn && <Pressable onPress={() => { navigateTo("Profile") }} style={styles.profileCard}>
          <View style={styles.profileImage}>
            <Text style={styles.profileImageText}>{userDetail?.name?.charAt(0)}</Text>
          </View>
          <View style={styles.profileDetail}>
            <Text style={styles.username}>{userDetail?.name}</Text>
            <Text style={styles.email}>{userDetail?.email}</Text>
            <View>
              <Text style={styles.profileView}>View Profile {">"}</Text>
            </View>
          </View>
        </Pressable>}
        {(!userDetail || !userDetail?.loggedIn) && <Pressable onPress={() => { navigateTo("Login") }} style={styles.profileCard}>
          <View style={styles.profileDetail}>
            <Text style={styles.username}>Not Logged In</Text>
            <Text style={styles.email}>Please login to Continue</Text>
            <Pressable >
              <Text style={styles.profileView}>login here {">"}</Text>
            </Pressable>
          </View>
        </Pressable>}
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
          <Pressable style={styles.ordersOption} onPress={() => { navigateTo("UserReviews") }}>
            <FontAwesomeIcon icon={faStar} color="#51636E" style={styles.ordersOptionIcon} size={18} />
            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between", width: "100%" }}>
              <Text style={styles.ordersOptionText}>Your Reviews</Text>
              <FontAwesomeIcon icon={faChevronRight} color="#51636E" style={{ marginEnd: 20 }} />
            </View>
          </Pressable>
        </View>
        <View style={styles.lastSection}>
          <Pressable style={styles.ordersOption} onPress={() => { navigateTo("About") }}>
            <FontAwesomeIcon icon={faCircleInfo} color="#51636E" style={styles.ordersOptionIcon} size={18} />
            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between", width: "100%" }}>
              <Text style={styles.ordersOptionText}>About Us</Text>
              <FontAwesomeIcon icon={faChevronRight} color="#51636E" style={{ marginEnd: 20 }} />
            </View>
          </Pressable>
          <View style={{ borderWidth: 0.2, borderColor: "#DADADA", left: 40, width: "90.7%" }}></View>
          <Pressable style={styles.ordersOption} onPress={() => { navigateTo("Feedback") }}>
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
          {userDetail && userDetail?.loggedIn ? <Pressable style={styles.ordersOption} onPress={() => { handleLogout() }}>
            <FontAwesomeIcon icon={faPowerOff} color="#51636E" style={styles.ordersOptionIcon} size={18} />
            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between", width: "100%" }}>
              <Text style={styles.ordersOptionText}>Logout</Text>
              <FontAwesomeIcon icon={faChevronRight} color="#51636E" style={{ marginEnd: 20 }} />
            </View>
          </Pressable> : <Pressable style={styles.ordersOption} onPress={() => {navigation.navigate("Login")}} >
            <FontAwesomeIcon icon={faPowerOff} color="#51636E" style={styles.ordersOptionIcon} size={18} />
            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between", width: "100%" }}>
              <Text style={styles.ordersOptionText}>Login</Text>
              <FontAwesomeIcon icon={faChevronRight} color="#51636E" style={{ marginEnd: 20 }} />
            </View>
          </Pressable>}
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