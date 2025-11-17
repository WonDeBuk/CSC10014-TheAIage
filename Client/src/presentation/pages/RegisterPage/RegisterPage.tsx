import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../util/AxiosInstance";

interface FormData {
    name: string;
    email: string;
    password: string;
    role: string;
}

export default function RegisterPage() {
    const [formData, setFormData] = useState<FormData>({ name: "", email: "", password: "", role: "" });
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setErrorMessage("");
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        //Validation
        if (!formData.email || !formData.password || !formData.name) {
            setErrorMessage("Please fill in all fields.");
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setErrorMessage("Password must be at least 8 characters.");
            setLoading(false);
            return;
        }

        try {
            // Call backend register API
            const response = await axiosInstance.post("/auth/register", {
                Email: formData.email,
                PlainPassword: formData.password,
            });

            console.log("Registration successful:", response.data);
            
            // After successful registration, redirect to login
            navigate("/login");
        } catch (error: any) {
            console.error("Registration error:", error);
            setErrorMessage(
                error.response?.data?.error || 
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        //add scroll to overflow-y-auto
        <div className="bg-[linear-gradient(to_right,rgba(196, 220, 89, 0.7),rgba(147,51,234,0.7)),url('assets/login_bg.png')] bg-cover bg-center flex flex-col items-center w-dvw h-dvh bg-[#edeffd] fixed top-0 overflow-y-auto">
            <div className="mt-8 mb-8">
                <p className="text-[36px] text-center">User Registration</p>
                <p className="text-[18px] text-center text-[#a2abb7]">Welcome to our website</p>
            </div>

            <div className="flex flex-col items-start bg-[#fffeff] gap-8 p-5 rounded-lg min-w-2/7 mb-8 max-h-[80vh] overflow-y-auto">
                <div className="w-full">
                    <div className="flex items-end justify-between">
                        <p className="text-[22px] font-[500]">Register</p>
                        {errorMessage && (
                            <div className="text-red-600 text-[15px]">{errorMessage}</div>
                        )}
                    </div>
                    <hr className="pos-relative translate-y-[10px] w-full"></hr>

                </div>
                <form className="w-full" onSubmit={handleSubmit}>
                    <div className="w-full">
                        <div className="w-full mb-3">
                            <label className="block text-[18px] font-[400]" htmlFor="name">Name:</label>
                            <input onChange={handleChange} value={formData.name} type="text" name="name" className={`w-full text-sm h-[20px] bg-[#efebef] min-h-10 rounded-lg p-3 ${formData.name ? "text-black" : "text-[#8c8097]"}`} placeholder="Your name here." />
                        </div>
                        <div className="w-full mb-3">
                            <label className="block text-[18px] font-[400]" htmlFor="email">Email:</label>
                            <input onChange={handleChange} value={formData.email} type="email" name="email" className={`w-full text-sm h-[20px] bg-[#efebef] min-h-10 rounded-lg p-3 ${formData.name ? "text-black" : "text-[#8c8097]"}`} placeholder="example@gmail.com" />
                        </div>
                        <div className="w-full mb-3">
                            <label className="block text-[18px] font-[400]" htmlFor="password">Password:</label>
                            <input onChange={handleChange} value={formData.password} type="password" name="password" className={`w-full text-sm h-[20px] bg-[#efebef] min-h-10 rounded-lg p-3 ${formData.name ? "text-black" : "text-[#8c8097]"}`} placeholder="Your password should be at least 8 character-long." />
                        </div>
                        <div className="w-full mb-6">
                            <p className="block text-[18px] font-[400] mb-3">Role:</p>
                            <div className="w-full flex flex-col gap-2">
                                <div className={`flex justify-start items-center gap-2 px-5 py-2 rounded-lg cursor-pointer ${formData.role === "" ? "bg-black text-white" : "bg-[#efebef] text-black"}`} onClick={() => setFormData((prev) => ({ ...prev, role: "" }))}>
                                    <input onChange={handleChange} value="" checked={formData.role === ""} type="radio" name="role" className="cursor-pointer" />
                                    <label className="text-[15px] font-[400] cursor-pointer" htmlFor="role">None</label>
                                </div>
                                <div className={`flex justify-start items-center gap-2 px-5 py-2 rounded-lg cursor-pointer ${formData.role === "student" ? "bg-black text-white" : "bg-[#efebef] text-black"}`} onClick={() => setFormData((prev) => ({ ...prev, role: "student" }))}>
                                    <input onChange={handleChange} value="student" checked={formData.role === "student"} type="radio" name="role" className="cursor-pointer" />
                                    <label className="text-[15px] font-[400] cursor-pointer" htmlFor="role">Student</label>
                                </div>
                                <div className={`flex justify-start items-center gap-2 px-5 py-2 rounded-lg cursor-pointer ${formData.role === "counsellor" ? "bg-black text-white" : "bg-[#efebef] text-black"}`} onClick={() => setFormData((prev) => ({ ...prev, role: "counsellor" }))}>
                                    <input onChange={handleChange} value="counsellor" checked={formData.role === "counsellor"} type="radio" name="role" className="cursor-pointer" />
                                    <label className="text-[15px] font-[400] cursor-pointer" htmlFor="role">Counsellor</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <input type="submit" className="text-white text-sm bg-black h-[50px] text-center w-full rounded-lg cursor-pointer" value="CONTINUE"></input>
                    </div>
                </form>
            </div>
        </div>
    );
}
