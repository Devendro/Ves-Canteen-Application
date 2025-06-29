"use client"

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  StatusBar,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Modal,
} from "react-native"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import {
  faUser,
  faEnvelope,
  faPhone,
  faBuilding,
  faCamera,
  faEdit,
  faSave,
  faTimes,
  faEye,
  faShoppingBag,
  faHeart,
  faCog,
  faSignOutAlt,
  faChevronRight,
  faMapMarkerAlt,
  faBell,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons"
import Header from "../../components/Header"
import { ScrollView } from "react-native-gesture-handler"
import { useSelector } from "react-redux"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"

const Profile = () => {
  const userDetail = useSelector((state) => state?.user)
  const [isEditing, setIsEditing] = useState(false)
  const [showImagePicker, setShowImagePicker] = useState(false)

  const [profileData, setProfileData] = useState({
    name: userDetail?.name || "",
    email: userDetail?.email || "",
    phone: userDetail?.phone || "",
    department: userDetail?.dept || "",
  })

  const [originalData, setOriginalData] = useState({
    name: userDetail?.name || "",
    email: userDetail?.email || "",
    phone: userDetail?.phone || "",
    department: userDetail?.dept || "",
  })

  const [focusedField, setFocusedField] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Handle Text Change
  const handleTextChange = (text, field) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: text,
    }))

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: null,
      }))
    }
  }

  // Validation
  const validateField = (field, value) => {
    let error = null

    switch (field) {
      case "name":
        if (!value.trim()) {
          error = "Name is required"
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters"
        }
        break
      case "email":
        if (!value.trim()) {
          error = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Please enter a valid email"
        }
        break
      case "phone":
        if (!value.trim()) {
          error = "Phone number is required"
        } else if (!/^\d{10}$/.test(value.replace(/\D/g, ""))) {
          error = "Please enter a valid 10-digit phone number"
        }
        break
      case "department":
        if (!value.trim()) {
          error = "Department is required"
        }
        break
    }

    setFormErrors((prev) => ({
      ...prev,
      [field]: error,
    }))

    return !error
  }

  const handleBlur = (field) => {
    setFocusedField(null)
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateField(field, profileData[field])
  }

  const handleFocus = (field) => {
    setFocusedField(field)
  }

  const validateForm = () => {
    const fields = ["name", "email", "phone", "department"]
    let isValid = true

    fields.forEach((field) => {
      if (!validateField(field, profileData[field])) {
        isValid = false
      }
    })

    setTouched({
      name: true,
      email: true,
      phone: true,
      department: true,
    })

    return isValid
  }

  const handleSave = () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fix the errors before saving.")
      return
    }

    // Here you would typically call an API to update the profile
    console.log("Saving profile data:", profileData)

    setOriginalData(profileData)
    setIsEditing(false)
    Alert.alert("Success", "Profile updated successfully!")
  }

  const handleCancel = () => {
    setProfileData(originalData)
    setFormErrors({})
    setTouched({})
    setIsEditing(false)
  }

  const hasChanges = () => {
    return JSON.stringify(profileData) !== JSON.stringify(originalData)
  }

  const menuItems = [
    {
      icon: faShoppingBag,
      title: "Order History",
      subtitle: "View your past orders",
      onPress: () => console.log("Order History"),
    },
    {
      icon: faHeart,
      title: "Favorites",
      subtitle: "Your favorite dishes",
      onPress: () => console.log("Favorites"),
    },
    {
      icon: faMapMarkerAlt,
      title: "Addresses",
      subtitle: "Manage delivery addresses",
      onPress: () => console.log("Addresses"),
    },
    {
      icon: faBell,
      title: "Notifications",
      subtitle: "Notification preferences",
      onPress: () => console.log("Notifications"),
    },
    {
      icon: faCog,
      title: "Settings",
      subtitle: "App settings and preferences",
      onPress: () => console.log("Settings"),
    },
    {
      icon: faQuestionCircle,
      title: "Help & Support",
      subtitle: "Get help and contact support",
      onPress: () => console.log("Help"),
    },
  ]

  const ImagePickerModal = () => (
    <Modal visible={showImagePicker} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.imagePickerModal}>
          <Text style={styles.modalTitle}>Change Profile Picture</Text>
          <TouchableOpacity style={styles.imageOption}>
            <FontAwesomeIcon icon={faCamera} size={20} color="#FFC300" />
            <Text style={styles.imageOptionText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageOption}>
            <FontAwesomeIcon icon={faEye} size={20} color="#FFC300" />
            <Text style={styles.imageOptionText}>Choose from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelOption} onPress={() => setShowImagePicker(false)}>
            <Text style={styles.cancelOptionText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <Animated.View entering={FadeInUp.duration(300)}>
        <Header title={"Profile"} showProfile={false} />
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileImageText}>{userDetail?.name?.charAt(0)?.toUpperCase()}</Text>
            </View>
            <TouchableOpacity style={styles.cameraButton} onPress={() => setShowImagePicker(true)}>
              <FontAwesomeIcon icon={faCamera} size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userDetail?.name}</Text>
            <Text style={styles.userEmail}>{userDetail?.email}</Text>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => (isEditing ? (hasChanges() ? handleSave() : setIsEditing(false)) : setIsEditing(true))}
          >
            <FontAwesomeIcon icon={isEditing ? faSave : faEdit} size={16} color="#FFC300" />
            <Text style={styles.editButtonText}>{isEditing ? "Save" : "Edit"}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Profile Form */}
        {isEditing && (
          <Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedField === "name" && styles.inputFocused,
                  formErrors.name && touched.name && styles.inputError,
                ]}
              >
                <FontAwesomeIcon
                  icon={faUser}
                  size={16}
                  color={formErrors.name && touched.name ? "#EF4444" : focusedField === "name" ? "#FFC300" : "#9CA3AF"}
                />
                <TextInput
                  style={styles.textInput}
                  value={profileData.name}
                  onChangeText={(text) => handleTextChange(text, "name")}
                  onFocus={() => handleFocus("name")}
                  onBlur={() => handleBlur("name")}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                  selectionColor="#FFC300"
                />
              </View>
              {formErrors.name && touched.name && <Text style={styles.errorText}>{formErrors.name}</Text>}
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedField === "email" && styles.inputFocused,
                  formErrors.email && touched.email && styles.inputError,
                ]}
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  size={16}
                  color={
                    formErrors.email && touched.email ? "#EF4444" : focusedField === "email" ? "#FFC300" : "#9CA3AF"
                  }
                />
                <TextInput
                  style={styles.textInput}
                  value={profileData.email}
                  onChangeText={(text) => handleTextChange(text, "email")}
                  onFocus={() => handleFocus("email")}
                  onBlur={() => handleBlur("email")}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  selectionColor="#FFC300"
                />
              </View>
              {formErrors.email && touched.email && <Text style={styles.errorText}>{formErrors.email}</Text>}
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedField === "phone" && styles.inputFocused,
                  formErrors.phone && touched.phone && styles.inputError,
                ]}
              >
                <FontAwesomeIcon
                  icon={faPhone}
                  size={16}
                  color={
                    formErrors.phone && touched.phone ? "#EF4444" : focusedField === "phone" ? "#FFC300" : "#9CA3AF"
                  }
                />
                <TextInput
                  style={styles.textInput}
                  value={profileData.phone}
                  onChangeText={(text) => handleTextChange(text, "phone")}
                  onFocus={() => handleFocus("phone")}
                  onBlur={() => handleBlur("phone")}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  selectionColor="#FFC300"
                />
              </View>
              {formErrors.phone && touched.phone && <Text style={styles.errorText}>{formErrors.phone}</Text>}
            </View>

            {/* Department Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Department</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedField === "department" && styles.inputFocused,
                  formErrors.department && touched.department && styles.inputError,
                ]}
              >
                <FontAwesomeIcon
                  icon={faBuilding}
                  size={16}
                  color={
                    formErrors.department && touched.department
                      ? "#EF4444"
                      : focusedField === "department"
                        ? "#FFC300"
                        : "#9CA3AF"
                  }
                />
                <TextInput
                  style={styles.textInput}
                  value={profileData.department}
                  onChangeText={(text) => handleTextChange(text, "department")}
                  onFocus={() => handleFocus("department")}
                  onBlur={() => handleBlur("department")}
                  placeholder="Enter your department"
                  placeholderTextColor="#9CA3AF"
                  selectionColor="#FFC300"
                />
              </View>
              {formErrors.department && touched.department && (
                <Text style={styles.errorText}>{formErrors.department}</Text>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <FontAwesomeIcon icon={faTimes} size={16} color="#6B7280" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <FontAwesomeIcon icon={faSave} size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Menu Items */}
        <Animated.View entering={FadeInDown.delay(300).duration(300)} style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Account</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <FontAwesomeIcon icon={item.icon} size={18} color="#FFC300" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <FontAwesomeIcon icon={faChevronRight} size={14} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Logout Button */}
        <Animated.View entering={FadeInDown.delay(400).duration(300)} style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton}>
            <FontAwesomeIcon icon={faSignOutAlt} size={18} color="#EF4444" />
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      <ImagePickerModal />
    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  content: {
    flex: 1,
    padding: 16,
  },

  profileHeader: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 195, 0, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFC300",
  },

  profileImageText: {
    color: "#FFC300",
    fontSize: 36,
    fontWeight: "700",
    fontFamily: "Poppins-Bold",
  },

  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFC300",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  profileInfo: {
    alignItems: "center",
    marginBottom: 20,
  },

  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },

  userEmail: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Poppins-Regular",
  },

  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FFC300",
    gap: 8,
  },

  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFC300",
    fontFamily: "Poppins-SemiBold",
  },

  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 20,
  },

  inputGroup: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    height: 52,
  },

  inputFocused: {
    borderColor: "#FFC300",
    backgroundColor: "#FFFBF0",
  },

  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },

  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
    fontFamily: "Poppins-Medium",
    paddingVertical: 0,
    marginLeft: 12,
  },

  errorText: {
    color: "#EF4444",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    marginTop: 4,
    marginLeft: 4,
  },

  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },

  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    fontFamily: "Poppins-SemiBold",
  },

  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#FFC300",
    gap: 8,
  },

  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },

  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFBEB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  menuItemContent: {
    flex: 1,
  },

  menuItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 2,
  },

  menuItemSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "Poppins-Regular",
  },

  logoutContainer: {
    marginBottom: 40,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FEE2E2",
    gap: 12,
  },

  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
    fontFamily: "Poppins-SemiBold",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  imagePickerModal: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    marginBottom: 20,
  },

  imageOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    marginBottom: 12,
    gap: 16,
  },

  imageOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
    fontFamily: "Poppins-Medium",
  },

  cancelOption: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },

  cancelOptionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    fontFamily: "Poppins-SemiBold",
  },
})
