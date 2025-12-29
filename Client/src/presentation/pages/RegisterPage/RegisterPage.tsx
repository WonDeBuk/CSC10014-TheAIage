import React, { useState, ChangeEvent, FormEvent, use } from "react";
import AxiosInstance from "@/util/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";

interface FormData {
    username: string;
    email: string;
    password: string;
    role: string;
    description: string;
    expertise: string[];
    flavor: string;
}

export default function RegisterPage() {
    const mentalDisorders = [ 
        "",
    ]
    const [formData, setFormData] = useState<FormData>({ username: "", email: "", password: "", role: "Student", description: "", expertise: [], flavor: "#991313" });
    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigate = useNavigate();
    const { refreshAuth } = useAuth();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setErrorMessage("");
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.role === "Counsellor" && formData.expertise.length < 1) {
            setErrorMessage("Không thể để miền lĩnh vực là trống.")
        }
        else {
            try {
                const response = await AxiosInstance.post("/auth/register", {
                    "username": formData.username,
                    "email": formData.email,
                    "password": formData.password,
                    "role": formData.role,
                    "description": formData.description,
                    "expertise": formData.expertise,
                    "flavor": formData.flavor,
                })
                localStorage.setItem("token", response.data.token);
                await refreshAuth();
                navigate('/')
            }
            catch (error: any) {
                if (error.response) {
                    setErrorMessage(error.response.data.detail || "Đăng kí thất bại.")
                }
                else {
                    setErrorMessage("Đăng kí thất bại.")
                }
            }
        }
        setFormData({ username: "", email: "", password: "", role: formData.role, description: formData.description, expertise: [], flavor: "#991313" });
    };

    return (
        <div className="w-full min-h-full flex flex-col items-center bg-[#edeffd] gap-15 pt-5">
            <div className="w-full flex flex-col items-center">
                <div className="text-[40px]">User Registration</div>
                <div className="text-[26px] text-gray-500 font-extralight">Chào mừng bạn đến với TheAIage</div>
            </div>

            <div className="flex flex-col gap-5 bg-white w-[620px] p-7 rounded-md">
                <div className="w-full flex flex-col gap-2">
                    {errorMessage ? (<div className="translate-y-1">{errorMessage}</div>): (<></>)}
                    <div className="text-[28px] font-medium">Registration</div>
                    <div className="w-full h-px bg-gray-300"></div>
                </div>
                <form className="w-full flex flex-col gap-5"
                onSubmit={handleSubmit}>
                    <div className="w-full flex flex-col gap-1">
                        <label className="text-[20px] font-[350]">Tên:</label>
                        <input className="w-full rounded-md h-[50px] bg-[#efebef] px-2 text-[18px]"
                        maxLength={20}type="text" name="username" value={formData.username} placeholder="Tên tối đa 20 kí tự."
                        onChange={handleChange}/>
                    </div>

                    <div className="w-full flex flex-col gap-1">
                        <label className="text-[20px] font-[350]">Email:</label>
                        <input className="w-full rounded-md h-[50px] bg-[#efebef] px-2 text-[18px]"
                        type="email" name="email" value={formData.email} placeholder="Địa chỉ email phải là địa chỉ chưa được dùng."
                        onChange={handleChange}/>                        
                    </div>

                    <div className="w-full flex flex-col gap-1">
                        <label className="text-[20px] font-[350]">Mật khẩu:</label>
                        <input className="w-full rounded-md h-[50px] bg-[#efebef] px-2 text-[18px]"
                        type="password" name="password" value={formData.password} placeholder="Phải kín đáo và không dễ đoán."
                        onChange={handleChange}/>                        
                    </div>

                    <div className="w-full flex flex-col gap-2">
                        <p className="text-[20px] font-[350]">Vai trò:</p>
                        <div className="flex justify-center gap-10 items-center">
                            <div className={`w-[200px] h-[50px] flex justify-center items-center rounded-md ${formData.role === "Student" ? "text-white bg-black" : "text-black bg-[#efebef]"}`}
                            onClick={() => {setFormData((prev) => ({...prev, role: "Student"}))}}>
                                <p className="text-center text-[18px]">Học Sinh</p>    
                            </div>

                            <div className={`w-[200px] h-[50px] flex justify-center items-center rounded-md ${formData.role === "Counsellor" ? "text-white bg-black" : "text-black bg-[#efebef]"}`}
                            onClick={() => {setFormData((prev) => ({...prev, role: "Counsellor"}))}}>
                                <p className="text-center text-[18px]">Tư Vấn Viên</p>
                            </div>
                        </div>
                    </div>

                    {formData.role === "Counsellor" ? (
                        <div className="w-full flex flex-col items-center gap-5">
                            <div className="w-full flex flex-col gap-1">
                                <p className="text-[20px] font-[350]">Kinh nghiệm:</p>
                                <textarea className="w-full h-[120px] bg-[#efebef] text-[18px] p-2 rounded-md" 
                                name="description" value={formData.description} placeholder="Mô tả kinh nghiệm làm việc của bạn."
                                onChange={handleChange}>
                                </textarea>
                            </div>

                            <div className="w-full flex flex-col gap-1">
                                <p className="text-[20px] font-[350]">Lĩnh vực:</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {mentalDisorders.map((item) => (
                                        <div className={`rounded-md px-3 py-1 text-[16px] whitespace-nowrap ${formData.expertise.includes(item) ? "bg-black text-white": "bg-[#efebef] text-black"}`}
                                        onClick={()=>{setFormData((prev) => ({...prev,expertise: prev.expertise.includes(item) ? prev.expertise.filter(e => e !== item) : [...prev.expertise, item]}))}}>
                                        {item}</div>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full flex flex-col gap-1">
                                <p className="text-[20px] font-[350]">Hương vị:</p>
                                <div className="flex justify-center items-center">
                                    <div className="bg-[#a43737] w-10 h-10 rounded-full"
                                    onClick={() => {setFormData((prev) => ({...prev, flavor: "#a43737"}))}}></div>
                                </div>

                                <div className="flex justify-center items-center">
                                    <div className="bg-[#6da437] w-10 h-10 rounded-full"
                                    onClick={() => {setFormData((prev) => ({...prev, flavor: "#6da437"}))}}></div>
                                </div>

                                <div className="flex justify-center items-center">
                                    <div className="bg-[#3773a4] w-10 h-10 rounded-full"
                                    onClick={() => {setFormData((prev) => ({...prev, flavor: "#3773a4"}))}}></div>
                                </div>

                                <div className="flex justify-center items-center">
                                    <div className="bg-[#4d37a4] w-10 h-10 rounded-full"
                                    onClick={() => {setFormData((prev) => ({...prev, flavor: "#4d37a4"}))}}></div>
                                </div>
                                
                                <div className="flex justify-center items-center">
                                    <div className="bg-[#a46e37a43737] w-10 h-10 rounded-full"
                                    onClick={() => {setFormData((prev) => ({...prev, flavor: "#a46e37"}))}}></div>
                                </div>
                            </div>
                        </div>
                    ) : (<></>)}

                    <div className="w-full flex flex-col gap-10 items-center mt-5">
                        <div className="w-full h-px bg-gray-300"></div>
                        <input className="w-full h-[75px] bg-black flex justify-center items-center text-white rounded-2xl text-[24px] font-[450]"
                        type="submit"
                        value="CREATE"
                        />
                    </div>
                    
                </form>
            </div>
            {/* <div className="mt-8">
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
                            <div className="w-full flex justify-evenly items-center">
                                <div className={`flex justify-start items-center gap-1  px-5 rounded-lg ${formData.role === "Student" ? "bg-black text-white" : "bg-[#efebef] text-black"}`} onClick={() => setFormData((prev) => ({ ...prev, role: "Student" }))}>
                                    <input onChange={handleChange} value="student" checked={formData.role === "Student"} type="radio" name="role" className="w-full text-sm h-[20px] bg-[#6f6c81] text-white min-h-10 rounded-lg p-3" placeholder="Password should be at least 8 character-long." />
                                    <label className="text-[15px] font-[400]" htmlFor="role">Student</label>
                                </div>
                                <div className={`flex justify-start items-center gap-1  px-5 rounded-lg ${formData.role === "Counsellor" ? "bg-black text-white" : "bg-[#efebef] text-black"}`} onClick={() => setFormData((prev) => ({ ...prev, role: "Counsellor" }))}>
                                    <input onChange={handleChange} value="counsellor" checked={formData.role === "Counsellor"} type="radio" name="role" className="w-full text-sm h-[20px] bg-[#6f6c81] text-white min-h-10 rounded-lg p-3" placeholder="Password should be at least 8 character-long." />
                                    <label className="text-[15px] font-[400]" htmlFor="role">Counsellor</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {formData.role === "Counsellor" ? (
                        <div className="h-[1000px] w-full bg-green-200"></div>
                    ) : (
                        <div></div>
                    )}

                    <div className="w-full mt-8">
                        <input type="submit" className="text-white text-sm bg-black h-[50px] text-center w-full rounded-lg" value="CONTINUE"></input>
                    </div>
                </form>
            </div> */}
        </div>
    );
}
