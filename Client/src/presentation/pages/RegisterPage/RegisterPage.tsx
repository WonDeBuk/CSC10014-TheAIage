import React, { useState, ChangeEvent, FormEvent } from "react";
import AxiosInstance from "@/util/AxiosInstance";
import { useNavigate } from "react-router-dom";

interface FormData {
    name: string;
    email: string;
    password: string;
    role: string;
}

export default function RegisterPage() {
    const [formData, setFormData] = useState<FormData>({ name: "", email: "", password: "", role: "" });
    const [errorMessage, setErrorMessage] = useState<string>("");


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

        try {
            const Respone = await AxiosInstance.post("/auth/register", {
                "Name": formData.name,
                "Email": formData.email,
                "PlainPassword": formData.password,
                "Role": formData.role
            },
            { 
                withCredentials: true,
                validateStatus: (status) => status < 400 || status === 401
            });

            console.log(Respone);
            if (Respone.status === 401) {
                setErrorMessage(Respone.data.Message || "Registration failed.");
            }

            else {
                console.log("Registration successful");
            }
            setFormData({ name: "", email: "", password: "", role: "" });
        }
        catch (Error: any) {
            setErrorMessage("Unexpected error occurred. Please try again later.");
        }
    };

    return (
        <div className="bg-[linear-gradient(to_right,rgba(196, 220, 89, 0.7),rgba(147,51,234,0.7)),url('assets/login_bg.png')] bg-cover bg-center flex flex-col items-center gap-10 w-dvw h-dvh bg-[#edeffd] fixed top-0">
            <div className="mt-8">
                <p className="text-[36px] text-center">User Registration</p>
                <p className="text-[18px] text-center text-[#a2abb7]">Welcome to our website</p>
            </div>

            <div className="flex flex-col items-start bg-[#fffeff] gap-8 p-5 rounded-lg min-w-2/7">
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
                        <div className="w-full">
                            <p className="block text-[18px] font-[400]">Role:</p>
                            <div className="w-full flex justify-between items-center">
                                <div className={`flex justify-start items-center gap-1  px-5 rounded-lg ${formData.role === "" ? "bg-black text-white" : "bg-[#efebef] text-black"}`} onClick={() => setFormData((prev) => ({ ...prev, role: "" }))}>
                                    <input onChange={handleChange} value="" checked={formData.role === ""} type="radio" name="role" className="w-full text-sm h-[20px] bg-[#6f6c81] text-white min-h-10 rounded-lg p-3" placeholder="Password should be at least 8 character-long." />
                                    <label className="text-[15px] font-[400]" htmlFor="role">None</label>
                                </div>
                                <div className={`flex justify-start items-center gap-1  px-5 rounded-lg ${formData.role === "student" ? "bg-black text-white" : "bg-[#efebef] text-black"}`} onClick={() => setFormData((prev) => ({ ...prev, role: "student" }))}>
                                    <input onChange={handleChange} value="student" checked={formData.role === "student"} type="radio" name="role" className="w-full text-sm h-[20px] bg-[#6f6c81] text-white min-h-10 rounded-lg p-3" placeholder="Password should be at least 8 character-long." />
                                    <label className="text-[15px] font-[400]" htmlFor="role">Student</label>
                                </div>
                                <div className={`flex justify-start items-center gap-1  px-5 rounded-lg ${formData.role === "counsellor" ? "bg-black text-white" : "bg-[#efebef] text-black"}`} onClick={() => setFormData((prev) => ({ ...prev, role: "counsellor" }))}>
                                    <input onChange={handleChange} value="counsellor" checked={formData.role === "counsellor"} type="radio" name="role" className="w-full text-sm h-[20px] bg-[#6f6c81] text-white min-h-10 rounded-lg p-3" placeholder="Password should be at least 8 character-long." />
                                    <label className="text-[15px] font-[400]" htmlFor="role">Counsellor</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full mt-8">
                        <input type="submit" className="text-white text-sm bg-black h-[50px] text-center w-full rounded-lg" value="CONTINUE"></input>
                    </div>
                </form>
            </div>
        </div>
    );
}
