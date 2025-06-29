"use client"

import { StyleSheet, Text, View, Pressable } from "react-native"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faChevronRight, faClockRotateLeft, faSearch, faXmark } from "@fortawesome/free-solid-svg-icons"
import Animated, { FadeInRight } from "react-native-reanimated"

const RecentSearch = ({ title, recent, searchKeyword, handleSearchedResultClick, removeRecentSearch, index = 0 }) => {
  const [titleBold, setTitleBold] = useState(title)

  function splitSentenceWithKeyword(sentence, keyword) {
    if (!keyword || keyword === "") {
      setTitleBold(sentence)
    } else {
      if (!sentence?.toLowerCase().startsWith(keyword?.toLowerCase())) {
        setTitleBold(sentence)
      } else {
        const regex = new RegExp(keyword, "i")
        const parts = sentence.split(regex, 2)
        setTitleBold(parts[1])
      }
    }
  }

  const handleClickEvent = () => {
    if (!recent) {
      handleSearchedResultClick()
    }
  }

  const _removeRecentSearch = () => {
    removeRecentSearch()
  }

  // Highlight matching text
  const renderHighlightedText = () => {
    if (!searchKeyword || recent) {
      return <Text style={styles.title}>{title}</Text>
    }

    const regex = new RegExp(`(${searchKeyword})`, "gi")
    const parts = title.split(regex)

    return (
      <Text style={styles.title}>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <Text key={index} style={styles.highlightedText}>
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          ),
        )}
      </Text>
    )
  }

  return (
    <Animated.View entering={FadeInRight.duration(300).delay(index * 50)} style={styles.searchContainer}>
      <Pressable
        style={styles.searchCard}
        onPress={handleClickEvent}
        android_ripple={{ color: "rgba(255, 195, 0, 0.1)" }}
      >
        <View style={styles.searchContent}>
          <View style={styles.iconContainer}>
            <FontAwesomeIcon
              icon={recent ? faClockRotateLeft : faSearch}
              size={16}
              color={recent ? "#9CA3AF" : "#FFC300"}
            />
          </View>

          <View style={styles.searchInfo}>
            {renderHighlightedText()}
            {recent && <Text style={styles.recentLabel}>Recent search</Text>}
          </View>
        </View>

        <Pressable
          style={styles.actionButton}
          onPress={recent ? _removeRecentSearch : handleClickEvent}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesomeIcon icon={recent ? faXmark : faChevronRight} size={14} color="#9CA3AF" />
        </Pressable>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 4,
  },

  searchCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F8FAFC",
  },

  searchContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  searchInfo: {
    flex: 1,
  },

  title: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1A1A1A",
    fontFamily: "Poppins-Medium",
    lineHeight: 18,
  },

  highlightedText: {
    fontWeight: "700",
    fontSize: 13,
    color: "#FFC300",
    fontFamily: "Poppins-Bold",
  },

  recentLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    fontFamily: "Poppins-Regular",
    marginTop: 2,
  },

  actionButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
})

export default RecentSearch
