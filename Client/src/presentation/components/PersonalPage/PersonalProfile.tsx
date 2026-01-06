import { useAuth } from "@/app/providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Mail, Calendar, LogOut, User, ShieldCheck, Lock, ChevronRight } from "lucide-react";

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
                <div className="absolute top-6 right-6 hidden md:block">
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-6 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full hover:bg-white/30 transition font-medium"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Đăng xuất
                    </button>
                </div>
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">

                        {/* Card 1 */}
                        <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors duration-300 group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-white rounded-2xl text-blue-600">
                                    <Calendar className="w-8 h-8" />
                                </div>
                                <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-gray-400 uppercase tracking-wider">Info</span>
                            </div>
                            <h3 className="text-gray-500 text-lg font-medium mb-1">Ngày tham gia</h3>
                            <p className="text-4xl font-bold text-gray-900">01/01/2026</p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-colors duration-300 group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-white rounded-2xl text-green-600">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-gray-400 uppercase tracking-wider">Status</span>
                            </div>
                            <h3 className="text-gray-500 text-lg font-medium mb-1">Trạng thái</h3>
                            <div className="flex items-center gap-3">
                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                <p className="text-4xl font-bold text-gray-900">Hoạt động</p>
                            </div>
                        </div>

                        {/* Card 3 */}
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
                                    user?.role === "Counsellor" ? "Tư vấn viên" : "Thành viên"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button className="w-full md:w-auto px-12 py-6 flex items-center justify-between bg-gray-900 text-white rounded-[32px] hover:bg-black transition-colors duration-300 group">
                            <div className="flex items-center">
                                <div className="p-3 bg-white/10 rounded-full mr-5">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-lg">Đổi mật khẩu</p>
                                    <p className="text-sm text-gray-400 font-normal">Tăng cường bảo mật cho tài khoản</p>
                                </div>
                            </div>
                            <ChevronRight className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors ml-8" />
                        </button>
                    </div>

                    <div className="md:hidden mt-12 border-t border-gray-100 pt-8">
                        <button
                            onClick={handleLogout}
                            className="w-full py-4 flex items-center justify-center text-red-500 font-bold text-lg hover:bg-red-50 rounded-2xl transition"
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