import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { auth, firestore } from "../../Config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const AccountScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        console.log("🔥 User UID:", user.uid);
        const docRef = doc(firestore, "UserData", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserInfo(docSnap.data());
        } else {
          console.log("No user data found!");
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      });
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.profileSection}>
          <Image
            source={require("../../assets/adaptive-icon.png")}
            style={styles.avatar}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{userInfo.name}</Text>
            <Text style={styles.info}>📧 {userInfo.email}</Text>
            <Text style={styles.info}>📱 {userInfo.phone}</Text>
          </View>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("EditProfileScreen")}
          >
            <MaterialIcons name="edit" size={24} color="#FFA500" />
            <Text style={styles.buttonText}>Chỉnh sửa thông tin</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#FF6347" />
            <Text style={styles.buttonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0D0D0D", // giữ màu nền khi dùng SafeAreaView
  },
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  profileSection: {
    flexDirection: "row",
    padding: 30,
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#fff",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: "#FFA500",
    borderWidth: 3,
    marginRight: 20,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 3,
  },
  buttonSection: {
    padding: 20,
    gap: 15,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#FFA500",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 15,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AccountScreen;
