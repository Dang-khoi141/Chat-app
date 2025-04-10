import { create } from "zustand";
import axiosInstance from '../lib/axios';
import { toast } from "react-hot-toast";
import { X } from "lucide-react";

const useAuthStore = create((set)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIng:false,
    isUpdatingProfile:false,

    isCheckingAuth:true,

    checkAuth: async ()=>{
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data})
        } catch (error) {
            console.log("Error in checkAuth")
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false});
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
        } catch (error) {
            if (error.response) {
                // Máy chủ đã trả về phản hồi lỗi
                toast.error(error.response.data?.message || "An error occurred");
            } else if (error.request) {
                // Yêu cầu đã được gửi nhưng không nhận được phản hồi
                toast.error("No response from server. Please check your connection.");
            } else {
                // Lỗi xảy ra khi thiết lập yêu cầu
                toast.error("An unexpected error occurred.");
            }
        } finally {
            set({ isSigningUp: false });
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggingIn: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            // Chuyển hướng về trang login
            // window.location.href = "/login";
        } catch (error) {
            toast.error(error.response?.data?.message || "Error during logout");
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update-profile", data);
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("Error in update profile:", error);
          
          // Xử lý lỗi an toàn hơn
          if (error.response && error.response.data) {
            toast.error(error.response.data.message || "Error updating profile");
          } else if (error.message === "Network Error") {
            toast.error("Network error. Please check your internet connection.");
          } else {
            toast.error("Error updating profile. Please try again.");
          }
        } finally {
          set({ isUpdatingProfile: false });
        }
      }
      
}));

   
export default useAuthStore;