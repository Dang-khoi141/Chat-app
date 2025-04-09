const User = require('../models/user.model')
const generateToken = require('../config/utils')
const bcrypt = require('bcryptjs');
const cloudinary = require("../config/cloudinary");
const signup = async (req, res) => {
  try {
    // Kiểm tra xem req.body có tồn tại không
    if (!req.body) {
      return res.status(400).json({ message: "Thiếu dữ liệu trong request body" });
    }
    
    const { fullName, email, password, phone } = req.body;
    
    // Kiểm tra các trường bắt buộc
    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin (họ tên, email, mật khẩu, số điện thoại)" });
    }
    
    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
    }
    
    // Kiểm tra email đã tồn tại chưa
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email đã được sử dụng, vui lòng dùng email khác" });
    }
    
    // Kiểm tra số điện thoại hợp lệ (ví dụ: 10 chữ số)
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Số điện thoại không hợp lệ" });
    }
    
    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phone
    });
    
    // Tạo token và lưu người dùng
    generateToken(newUser._id, res);
    await newUser.save();

    // Trả về thông tin người dùng (không bao gồm mật khẩu)
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      profilePic: newUser.profilePic
    });
    
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Lỗi máy chủ " });
  }
};

const login = async (req,res)=>{
  const {email,password}= req.body
try {
    const user = await User.findOne({email});
    // check ko de emai hoac psw sai
    if(!user){
      return res.status(400).json({message:"invalue credentials"})
    }
    //check lai psw
    if(!user.password){
      return res.status(500).json({message:"Lỗi: Không tìm thấy mật khẩu người dùng"});
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect){
      return res.status(400).json({message:"invalue credentials"})
    };

    generateToken(user._id,res);

    res.status(200).json({
      _id:user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic
    })
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Lỗi máy chủ login " });
  }
};


 const logout = async (req,res)=>{
   try {
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"Logged out successfully"});
   } catch (error) {
    console.log("Error in logout controller",error.message);
    res.status(500).json({ message: "Lỗi máy chủ logout " });
   }
};

// su dung dich vu cloud nary de tai hinh anh 
// Sửa hàm updateProfile
const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    
    if (!profilePic) {
      return res.status(400).json({ message: "profile pic is required" });
    }
    
    // Sửa lại phương thức upload của cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    
    res.status(200).json(updateUser);
  } catch (error) {
    console.log('error in update profile:', error);
    res.status(500).json({ message: "Lỗi máy chủ profile" });
  }
};

// Sửa hàm checkAuth
const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "internal Server Error" });
  }
};


module.exports = { signup,login,logout,updateProfile,checkAuth};