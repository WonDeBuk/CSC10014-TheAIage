import { useAuth } from "@/app/providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Mail, Calendar, LogOut, User, ShieldCheck, Lock, ChevronRight } from "lucide-react";

import StudentTestHistory from "./StudentTestHistory";


export default function PersonalProfile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">

            <div className="w-full h-72 md:h-96 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 relative">

            </div>

            <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-8 pb-20">

                <div className="relative">
                    <div className="flex flex-col md:flex-row items-end -mt-20 mb-16">

                        <div className="mx-auto md:mx-0 relative">
                            <div className="w-40 h-40 md:w-56 md:h-56 bg-white rounded-full p-2 border-[6px] border-white">
                                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-6xl md:text-8xl text-gray-400 font-bold uppercase">
                                    {user?.username?.charAt(0) || "U"}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 md:mt-0 md:ml-8 md:mb-4 text-center md:text-left flex-1">
                            <h1 className="text-4xl md:text-7xl font-bold text-gray-900 tracking-tight">
                                {user?.username || "Guest User"}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start text-gray-500 mt-4 text-lg">
                                <span className="bg-gray-100 px-4 py-1.5 rounded-full flex items-center">
                                    <Mail className="w-5 h-5 mr-2 text-gray-400" />
                                    {user?.email || "email@example.com"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">

                        {/* Card 1 */}
                        <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors duration-300 group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-white rounded-2xl text-blue-600">
                                    <Calendar className="w-8 h-8" />
                                </div>
                                <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-gray-400 uppercase tracking-wider">Info</span>
                            </div>
                            <h3 className="text-gray-500 text-lg font-medium mb-1">Ngày tham gia</h3>
                            <p className="text-4xl font-bold text-gray-900">
                                {user?.created_at
                                    ? new Date(user.created_at).toLocaleDateString('vi-VN')
                                    : new Date().toLocaleDateString('vi-VN')}
                            </p>
                        </div>

                        {/* Card 2: Vai trò */}
                        <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-colors duration-300 group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-white rounded-2xl text-purple-600">
                                    <User className="w-8 h-8" />
                                </div>
                                <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-gray-400 uppercase tracking-wider">Role</span>
                            </div>
                            <h3 className="text-gray-500 text-lg font-medium mb-1">Vai trò</h3>
                            <p className="text-4xl font-bold text-gray-900">
                                {user?.role === "Student" ? "Học sinh" :
                                    user?.role === "Counsellor" ? "Tư vấn viên" :
                                        user?.role === "AI" ? "AI Assistant" : "Thành viên"}
                            </p>
                        </div>
                    </div>

                    {user?.description && (
                        <div className="mb-12 p-8 bg-gray-50 rounded-[40px] border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Giới thiệu</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {user.description}
                            </p>
                        </div>
                    )}

                    {/* Only show Test History for Students/others, NOT for Counsellors */}
                    {user?.role !== "Counsellor" && (
                        <div className="mb-12">
                            <StudentTestHistory />
                        </div>
                    )}


                    <div className="mt-12 border-t border-gray-100 pt-8">
                        <button
                            onClick={handleLogout}
                            className="w-full py-4 flex items-center justify-center bg-red-50 text-red-600 font-bold text-lg hover:bg-red-100 rounded-[32px] transition duration-300"
                        >
                            <LogOut className="w-6 h-6 mr-2" />
                            Đăng xuất
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}