import React, { useRef, useState, useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Formik } from "formik";
import { auth, firestore } from "../../Config/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
export default function LoginScreen() {
  const [fontsLoaded] = useFonts({
    Lobster: require("../assets/fonts/Lobster-Regular.ttf"),
  });
  const navigation = useNavigation();

  const [showPass, setShowPass] = useState(false);

  const email = useRef(null);
  const password = useRef(null);

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();

      await SplashScreen.hideAsync();
    }

    prepare();
  }, []);
  async function signIn(data) {
    const { email: phoneInput, password } = data;

    try {
      // 1. Tìm email theo số điện thoại
      const q = query(
        collection(firestore, "UserData"),
        where("phone", "==", phoneInput)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Không tìm thấy số điện thoại", "Vui lòng kiểm tra lại.");
        return;
      }

      // 2. Lấy email từ kết quả truy vấn
      const userData = querySnapshot.docs[0].data();
      const email = userData.email;

      // 3. Đăng nhập bằng email & password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: "HomeTabs" }],
        });
      }
    } catch (error) {
      console.log("Lỗi đăng nhập:", error);
      Alert.alert("Tài khoản hoặc mật khẩu không đúng", "Vui lòng thử lại.");
    }
  }

  return (
    <ImageBackground
      source={require("../images/hinhnenLogin.jpg")}
      style={style.imgbgr}
    >
      <View style={{ backgroundColor: "rgba(0,0,0,0.5)", flex: 1 }}>
        <View style={style.container}>
          <View style={style.header}>
            <Image
              source={require("../images/logo-removebg-preview.png")}
              style={style.logo}
            />
          </View>
          <View style={style.title}>
            <Text style={style.title1}>ShibaTalk</Text>

            <Text style={style.title3}>Đăng nhập vào tài khoản của bạn</Text>
          </View>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={(value) => {
              signIn(value);
            }}
          >
            {(props) => (
              <View style={{ flex: 1 }}>
                <View style={style.content}>
                  <View style={style.content1}>
                    <Icon name="mail-outline" size={20}></Icon>
                    <TextInput
                      style={style.input}
                      placeholder="Nhập số điện thoại của bạn"
                      keyboardType="phone-pad"
                      onChangeText={props.handleChange("email")}
                      value={props.values.email}
                    />
                  </View>
                  <View style={style.content2}>
                    <Icon name="lock-closed-outline" size={20}></Icon>
                    <TextInput
                      style={style.input}
                      placeholder="Nhập mật khẩu cùa bạn"
                      ref={password}
                      onChangeText={props.handleChange("password")}
                      value={props.values.password}
                      secureTextEntry={!showPass}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPass(!showPass)}
                      style={style.eyeButton}
                    >
                      <Icon name="eye" size={20}></Icon>
                    </TouchableOpacity>
                  </View>
                  <View style={style.content3}>
                    <View>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("ForgotPasswordScreen")
                        }
                      >
                        <Text style={{ color: "red" }}>Quên mật khẩu?</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={style.button}>
                  <TouchableOpacity
                    style={style.opacity}
                    onPress={props.handleSubmit}
                  >
                    <Text style={style.buttonContinue}>Đăng nhập</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>

          <View style={style.dangKi}>
            <Text style={{ textAlign: "center", color: "white" }}>
              Bạn chưa có tài khoản?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={{ color: "#800080" }}>Đăng kí ngay</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 0.2,
              flexDirection: "row",

              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={style.line} />
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "column",
            }}
          >
            <Text style={style.agreementText}>
              By signing up, you agree to our{" "}
              <Text style={style.link}>Terms</Text> &{" "}
              <Text style={style.link}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
const style = StyleSheet.create({
  imgbgr: {
    flex: 1,
    resizeMode: "cover",
  },
  logo: {
    height: 150,
    width: 150,
  },
  title1: {
    fontSize: 70,
    fontFamily: "Lobster",
    color: "#4A90E2",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 10,
  },
  title3: {
    opacity: 0.4,
    color: "white",
  },
  container: {
    flex: 1,
  },
  header: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    flex: 0.7,

    alignItems: "center",
  },
  content: {
    flex: 1.5,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",

    marginTop: -60,
  },
  content1: {
    flex: 0.3,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.9)",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content2: {
    flex: 0.3,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.9)",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content3: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "80%",
    height: 50,
  },
  input: {
    marginLeft: 10,
    width: "100%",
    height: 40,
  },
  button: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -70,
    paddingTop: 30,
  },
  opacity: {
    borderWidth: 0.5,
    borderRadius: 10,
    backgroundColor: "#800080",
    alignItems: "center",
    width: "80%",
    height: 50,
    justifyContent: "center",
  },
  buttonContinue: {
    fontSize: 26,
    color: "white",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#000",
    marginHorizontal: 15,
    opacity: 0.2,
  },
  iconContainer: {
    width: 300,
    height: 50,
    borderRadius: 10,

    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  remberMe: {
    height: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  dangKi: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20,
    paddingTop: 20,
  },
  fbgg: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  UngDungDangNhap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "70%",
    marginLeft: -80,
  },
  agreementText: {
    color: "#555",
    fontSize: 13,
    textAlign: "center",
    marginTop: 150,
  },
  link: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});
