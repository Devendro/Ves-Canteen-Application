"use client"

import { StyleSheet, Text, View, StatusBar, SafeAreaView, ScrollView, TouchableOpacity, Linking } from "react-native"
import Header from "../../components/Header"
import LottieView from "lottie-react-native"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import {
  faUsers,
  faLightbulb,
  faRocket,
  faHeart,
  faCode,
  faMobile,
  faEnvelope,
  faGlobe,
  faGithub,
  faUtensils,
  faClock,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons"

const About = () => {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Lead Developer",
      expertise: "Full Stack Development",
      icon: faCode,
    },
    {
      name: "Sarah Chen",
      role: "UI/UX Designer",
      expertise: "Mobile Design",
      icon: faMobile,
    },
    {
      name: "Mike Rodriguez",
      role: "Backend Engineer",
      expertise: "API Development",
      icon: faRocket,
    },
  ]

  const features = [
    {
      icon: faUtensils,
      title: "Easy Ordering",
      description: "Browse menu and place orders with just a few taps",
    },
    {
      icon: faClock,
      title: "Quick Pickup",
      description: "Skip the queue with pre-orders and pickup notifications",
    },
    {
      icon: faShieldAlt,
      title: "Secure Payments",
      description: "Safe and secure payment processing for all transactions",
    },
  ]

  const stats = [
    { number: "5000+", label: "Happy Students" },
    { number: "50K+", label: "Orders Served" },
    { number: "4.8", label: "App Rating" },
    { number: "99%", label: "Uptime" },
  ]

  const handleContactPress = (type) => {
    switch (type) {
      case "email":
        Linking.openURL("mailto:teamdevs@vesit.edu.in")
        break
      case "website":
        Linking.openURL("https://teamdevs.vesit.edu.in")
        break
      case "github":
        Linking.openURL("https://github.com/teamdevs-vesit")
        break
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <Animated.View entering={FadeInUp.duration(300)}>
        <Header title={"About Us"} />
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.heroSection}>
          <LottieView
            style={styles.lottieAnimation}
            source={require("../../assets/images/AboutUs.json")}
            autoPlay
            loop={true}
          />
          <Text style={styles.heroTitle}>
            Team <Text style={styles.accentText}>Devs</Text>
          </Text>
          <Text style={styles.heroSubtitle}>Transforming Campus Dining Experience</Text>
        </Animated.View>

        {/* Mission Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.missionSection}>
          <View style={styles.sectionHeader}>
            <FontAwesomeIcon icon={faLightbulb} size={24} color="#FFC300" />
            <Text style={styles.sectionTitle}>Our Mission</Text>
          </View>
          <Text style={styles.missionText}>
            We are <Text style={styles.highlightText}>Team Devs</Text>, a passionate trio of developers dedicated to
            revolutionizing campus life at <Text style={styles.highlightText}>VESIT</Text> through innovative technology
            solutions.
          </Text>
          <Text style={styles.missionText}>
            Our VESIT Canteen app empowers students and staff with seamless meal ordering, eliminating queues and
            enhancing the dining experience. We believe technology should make everyday tasks simpler and more
            enjoyable.
          </Text>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View entering={FadeInDown.delay(300).duration(300)} style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Our Impact</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statNumber}>{stat.number}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Features Section */}
        <Animated.View entering={FadeInDown.delay(400).duration(300)} style={styles.featuresSection}>
          <View style={styles.sectionHeader}>
            <FontAwesomeIcon icon={faRocket} size={24} color="#FFC300" />
            <Text style={styles.sectionTitle}>What We Offer</Text>
          </View>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <FontAwesomeIcon icon={feature.icon} size={20} color="#FFC300" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Team Section */}
        <Animated.View entering={FadeInDown.delay(500).duration(300)} style={styles.teamSection}>
          <View style={styles.sectionHeader}>
            <FontAwesomeIcon icon={faUsers} size={24} color="#FFC300" />
            <Text style={styles.sectionTitle}>Meet Our Team</Text>
          </View>
          <Text style={styles.teamDescription}>
            Three passionate developers working together to create amazing experiences for the VESIT community.
          </Text>
          <View style={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <View key={index} style={styles.teamCard}>
                <View style={styles.memberIcon}>
                  <FontAwesomeIcon icon={member.icon} size={24} color="#FFC300" />
                </View>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
                <Text style={styles.memberExpertise}>{member.expertise}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Values Section */}
        <Animated.View entering={FadeInDown.delay(600).duration(300)} style={styles.valuesSection}>
          <View style={styles.sectionHeader}>
            <FontAwesomeIcon icon={faHeart} size={24} color="#FFC300" />
            <Text style={styles.sectionTitle}>Our Values</Text>
          </View>
          <View style={styles.valuesList}>
            <View style={styles.valueItem}>
              <View style={styles.valueBullet} />
              <Text style={styles.valueText}>
                <Text style={styles.valueBold}>Innovation:</Text> Continuously improving through user feedback and
                cutting-edge technology
              </Text>
            </View>
            <View style={styles.valueItem}>
              <View style={styles.valueBullet} />
              <Text style={styles.valueText}>
                <Text style={styles.valueBold}>Community:</Text> Building solutions that bring the VESIT community
                together
              </Text>
            </View>
            <View style={styles.valueItem}>
              <View style={styles.valueBullet} />
              <Text style={styles.valueText}>
                <Text style={styles.valueBold}>Excellence:</Text> Delivering reliable, high-quality experiences every
                time
              </Text>
            </View>
            <View style={styles.valueItem}>
              <View style={styles.valueBullet} />
              <Text style={styles.valueText}>
                <Text style={styles.valueBold}>Accessibility:</Text> Making campus dining convenient and enjoyable for
                everyone
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Contact Section */}
        <Animated.View entering={FadeInDown.delay(700).duration(300)} style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Get In Touch</Text>
          <Text style={styles.contactDescription}>
            Have feedback, suggestions, or just want to say hello? We'd love to hear from you!
          </Text>
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.contactButton} onPress={() => handleContactPress("email")}>
              <FontAwesomeIcon icon={faEnvelope} size={18} color="#FFC300" />
              <Text style={styles.contactButtonText}>Email Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton} onPress={() => handleContactPress("website")}>
              <FontAwesomeIcon icon={faGlobe} size={18} color="#FFC300" />
              <Text style={styles.contactButtonText}>Website</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton} onPress={() => handleContactPress("github")}>
              <FontAwesomeIcon icon={faGithub} size={18} color="#FFC300" />
              <Text style={styles.contactButtonText}>GitHub</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Footer */}
        <Animated.View entering={FadeInDown.delay(800).duration(300)} style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ for the VESIT Community</Text>
          <Text style={styles.footerSubtext}>© 2024 Team Devs. All rights reserved.</Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default About

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  content: {
    flex: 1,
    padding: 16,
  },

  heroSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  lottieAnimation: {
    height: 180,
    width: "100%",
    marginBottom: 16,
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Poppins-Bold",
    marginBottom: 8,
    textAlign: "center",
  },

  accentText: {
    color: "#FFC300",
  },

  heroSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },

  missionSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
  },

  missionText: {
    fontSize: 15,
    color: "#4B5563",
    fontFamily: "Poppins-Regular",
    lineHeight: 24,
    marginBottom: 16,
    textAlign: "justify",
  },

  highlightText: {
    color: "#FFC300",
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },

  statsSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
  },

  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFC300",
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },

  featuresSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  featureCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 16,
  },

  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFBEB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },

  featureContent: {
    flex: 1,
  },

  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
  },

  featureDescription: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Poppins-Regular",
    lineHeight: 20,
  },

  teamSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  teamDescription: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },

  teamGrid: {
    gap: 16,
  },

  teamCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  memberIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFBEB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#FFC300",
  },

  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
  },

  memberRole: {
    fontSize: 14,
    color: "#FFC300",
    fontFamily: "Poppins-Medium",
    marginBottom: 2,
  },

  memberExpertise: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Poppins-Regular",
  },

  valuesSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  valuesList: {
    marginTop: 16,
  },

  valueItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },

  valueBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFC300",
    marginTop: 8,
  },

  valueText: {
    flex: 1,
    fontSize: 14,
    color: "#4B5563",
    fontFamily: "Poppins-Regular",
    lineHeight: 20,
  },

  valueBold: {
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
  },

  contactSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },

  contactDescription: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },

  contactButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },

  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FFC300",
    gap: 8,
  },

  contactButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFC300",
    fontFamily: "Poppins-SemiBold",
  },

  footer: {
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 20,
  },

  footerText: {
    fontSize: 16,
    color: "#1A1A1A",
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
    textAlign: "center",
  },

  footerSubtext: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
})
