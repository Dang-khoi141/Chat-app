const jwt = require('jsonwebtoken');
const User= require('../models/user.model');

const protectRoute = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token){
           return res.status(401).json({message:"dịch vụ không được cấp quyền truy cập"});
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message:"dịch vụ không thể xác thực được mã thông báo (token) đã được cung cấp"});
        }

        const user = await User.findById(decoded.userId).select("-password");
        // xac thuc nguoi dung neu dung se cap nhap ho so (profile)
        if(!user){
            return res.status(404).json({message:"user not found"});
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware");
        return res.status(500).json({message:"internal server error"});
    }
}

module.exports = protectRoute

