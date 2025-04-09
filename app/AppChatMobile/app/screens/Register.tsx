import { Formik } from "formik";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  query,
  collection,
  getDocs,
  where,
  doc,
  setDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, firestore } from "../../Config/FirebaseConfig";
import * as Yup from "yup";
import axios from "axios";

export function Register() {
  const navigation = useNavigation();
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [formData, setFormData] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const validationSchema = Yup.object().shape({
    ten: Yup.string()
      .required("Vui lòng nhập tên")
      .min(3, "Tên phải nhiều hơn 3 kí tự"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Vui lòng nhập email"),
    phone: Yup.string()
      .required("Vui lòng nhập số điện thoại")
      .matches(/^0[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),
    password: Yup.string()
      .required("Vui lòng nhập mật khẩu")
      .min(6, "Mật khẩu phải ít nhất 6 ký tự"),
  });

  const sendOTP = async (values) => {
    const { ten, email, phone, password } = values;

    try {
      const userRef = collection(firestore, "UserData");
      const phoneQuery = query(userRef, where("phone", "==", phone));
      const querySnapshot = await getDocs(phoneQuery);

      if (!querySnapshot.empty) {
        Alert.alert("Lỗi", "Số điện thoại đã được sử dụng!");
        return;
      }

      // Gửi OTP
      const res = await axios.post("http://192.168.1.11:3000/send-code", {
        phone: "+84" + phone.slice(1),
      });

      if (res.data.success) {
        setOtpSent(true);
        setFormData({ ten, email, phone, password });
        Alert.alert("Thông báo", "Đã gửi mã OTP về điện thoại!");
      } else {
        Alert.alert("Lỗi", "Gửi OTP thất bại!");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể gửi OTP. Vui lòng thử lại!");
    }
  };

  const verifyAndRegister = async () => {
    if (!otpCode || !formData) return;

    const { ten, email, phone, password } = formData;

    try {
      setVerifying(true);

      const res = await axios.post("http://192.168.1.11:3000/verify-code", {
        phone: "+84" + phone.slice(1),
        code: otpCode,
      });

      if (res.data.success && res.data.status === "approved") {
        // Tạo tài khoản Firebase
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const uid = userCredential.user.uid;

        // Lưu dữ liệu vào Firestore
        await setDoc(doc(firestore, "UserData", uid), {
          name: ten,
          email,
          phone,
        });

        Alert.alert("Thành công", "Tài khoản đã được tạo!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("LoginScreen"),
          },
        ]);
      } else {
        Alert.alert("Lỗi", "Mã OTP không đúng!");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi xác thực", "Không thể xác thực mã OTP!");
    } finally {
      setVerifying(false);
    }
  };

  const initialValue = {
    ten: "",
    email: "",
    phone: "",
    password: "",
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require("../images/logo.png")}
          style={styles.imageContainer}
        />
        <Text style={styles.title}>Đăng ký</Text>

        <Formik
          initialValues={initialValue}
          validationSchema={validationSchema}
          onSubmit={sendOTP}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={{ width: "100%" }}>
              <TextInput
                style={styles.input}
                placeholder="Tên"
                onChangeText={handleChange("ten")}
                onBlur={handleBlur("ten")}
                value={values.ten}
              />
              {touched.ten && errors.ten && (
                <Text style={styles.error}>{errors.ten}</Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />
              {touched.email && errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                keyboardType="phone-pad"
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                value={values.phone}
              />
              {touched.phone && errors.phone && (
                <Text style={styles.error}>{errors.phone}</Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                secureTextEntry
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
              {touched.password && errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Gửi mã OTP</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        {otpSent && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nhập mã OTP"
              keyboardType="number-pad"
              value={otpCode}
              onChangeText={setOtpCode}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={verifyAndRegister}
              disabled={verifying}
            >
              <Text style={styles.buttonText}>
                {verifying ? "Đang xác thực..." : "Xác thực & Đăng ký"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.agreementText}>
          Bằng cách đăng ký, bạn đồng ý với{" "}
          <Text style={styles.link}>Điều khoản</Text> &{" "}
          <Text style={styles.link}>Chính sách</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  imageContainer: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 25,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    marginTop: 20
  },
  button: {
    backgroundColor: "#4A00E0",
    paddingVertical: 15,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  agreementText: {
    color: "#555",
    fontSize: 13,
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 15,
    lineHeight: 18,
  },
  link: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  error: {
    color: "red",
    fontSize: 13,
    marginBottom: 10,
    marginTop: -10,
  },
});
