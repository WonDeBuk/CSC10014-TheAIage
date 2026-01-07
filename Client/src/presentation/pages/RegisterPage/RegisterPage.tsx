import React, { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import AxiosInstance from "@/util/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import Footer from "@/presentation/components/LandingPage/Footer";
import logo from "../../../assets/LandingPage/HeroSection/logo.png"

interface FormData {
    username: string;
    email: string;
    password: string;
    role: string;
    description: string;
    expertise: string[];
    flavor: number;
}

function hslToHex(h: number, s: number, l: number): string {
  // normalize percentages
  s /= 100;
  l /= 100;

  const k = (n: number): number => (n + h / 30) % 12;
  const a: number = s * Math.min(l, 1 - l);

  const f = (n: number): number =>
    l - a * Math.max(
      -1,
      Math.min(k(n) - 3, Math.min(9 - k(n), 1))
    );

  const r: number = Math.round(255 * f(0));
  const g: number = Math.round(255 * f(8));
  const b: number = Math.round(255 * f(4));

  return (
    "#" +
    [r, g, b]
      .map((v: number) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

export default function RegisterPage() {
    const mentalDisorders = [ 
        "Neurodevelopmental",
        "Psychotic",
        "Bipolar",
        "Depressive",
        "Anxiety",
        "Obsessive-Compulsive",
        "Trauma-Stressor",
        "Dissociative",
        "Somatic",
        "Eating",
        "Elimination",
        "Sleep-Wake",
        "Sexual",
        "Gender Dysphoria",
        "Impulse-Control",
        "Substance-Addictive",
        "Neurocognitive",
        "Personality",
        "Paraphilic"
    ]
    const [formData, setFormData] = useState<FormData>({ username: "", email: "", password: "", role: "Student", description: "", expertise: [], flavor: 1 });
    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigate = useNavigate();
    const { refreshAuth } = useAuth();

    const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const autoScroll = useRef<HTMLDivElement>(null)
    const [firstTime, setFirstTime] = useState(false)

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
        if (formData.username === "" || formData.email === "" || formData.password === "") {
            setErrorMessage("Không thể để trống miền.")
            return
        }

        if (formData.role === "Counsellor" && formData.description === "") {
            setErrorMessage("Không thể để trống miền.")
            return
        }
        
    
        try {
            const response = await AxiosInstance.post("/auth/register", formData)
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
        
        setFormData({ username: "", email: "", password: "", role: formData.role, description: formData.description, expertise: [], flavor: 1 });
    };

    useEffect(() => {
        if (errorMessage) {
            errorTimer.current = setInterval(() => {
                setErrorMessage("")
            }, 5000)
        }

        return () => {
            if (errorTimer.current) {
                clearInterval(errorTimer.current)
            }
        }
    }, [errorMessage])

    useEffect(() => {
        if (autoScroll.current && !firstTime) {
            setFirstTime(true)
            autoScroll.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
        }
    })

    return (
        <div className="w-full min-h-full flex flex-col gap-5 bg-[#edeffd] select-none">
            {errorMessage ? (<div className="bg-red-500/80 p-2 text-white rounded-md fixed top-5 left-5 transtion-all duration-150 flex justify-center items-center"><p>{errorMessage}</p></div>): (<></>)}
            <div className="h-full flex flex-col items-center gap-15 pt-20 p-5 w-full"
            style={{"--flavor": hslToHex(formData.flavor, 50, 50)} as React.CSSProperties}>
                <div className="w-full flex flex-col items-center">
                    <img src={logo} className="h-[150px]"/>
                    <div className="text-[26px] text-gray-500 font-extralight">Chào mừng bạn đến với TheAIage</div>
                </div>

                <div className="flex flex-col gap-4 bg-white w-[620px] p-5 rounded-md">
                    <div className="w-full flex flex-col gap-2">
                        <div className="text-[28px] font-medium">Registration</div>
                        <div className="w-full h-px bg-gray-300"></div>
                    </div>
                    <form className="w-full flex flex-col gap-10"
                    onSubmit={handleSubmit}>
                        <div className="w-full flex flex-col gap-1"
                        ref={formData.role === "Student" ? autoScroll : null}>
                            <label className="text-[20px] font-[470]">Tên:</label>
                            <input className="w-full rounded-md h-[50px] bg-[#efebef] px-2 text-[18px]"
                            maxLength={20}type="text" name="username" value={formData.username} placeholder="Tên tối đa 20 kí tự."
                            onChange={handleChange}/>
                        </div>

                        <div className="w-full flex flex-col gap-1">
                            <label className="text-[20px] font-[470]">Email:</label>
                            <input className="w-full rounded-md h-[50px] bg-[#efebef] px-2 text-[18px]"
                            type="email" name="email" value={formData.email} placeholder="Địa chỉ email phải là địa chỉ chưa được dùng."
                            onChange={handleChange}/>                        
                        </div>

                        <div className="w-full flex flex-col gap-1">
                            <label className="text-[20px] font-[470]">Mật khẩu:</label>
                            <input className="w-full rounded-md h-[50px] bg-[#efebef] px-2 text-[18px]"
                            type="password" name="password" value={formData.password} placeholder="Phải kín đáo và không dễ đoán."
                            onChange={handleChange}/>                        
                        </div>

                        <div className="w-full flex flex-col gap-2">
                            <p className="text-[20px] font-[470]">Vai trò:</p>
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
                            <>
                                <div className="w-full flex flex-col gap-1"
                                ref={formData.role === "Counsellor" ? autoScroll : null}>
                                    <p className="text-[20px] font-[470]">Kinh nghiệm:</p>
                                    <textarea className="w-full h-[120px] bg-[#efebef] text-[18px] p-2 rounded-md" 
                                    name="description" value={formData.description} placeholder="Mô tả kinh nghiệm làm việc của bạn."
                                    onChange={handleChange}>
                                    </textarea>
                                </div>

                                <div className="w-full flex flex-col gap-1">
                                    <p className="text-[20px] font-[470]">Lĩnh vực:</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {mentalDisorders.map((item) => (
                                            <div className={`rounded-md px-3 py-1 text-[16px] whitespace-nowrap ${formData.expertise.includes(item) ? "bg-black text-white": "bg-[#efebef] text-black"}`}
                                            onClick={()=>{setFormData((prev) => ({...prev,expertise: prev.expertise.includes(item) ? prev.expertise.filter(e => e !== item) : [...prev.expertise, item]}))}}>
                                            {item}</div>
                                        ))}
                                    </div>
                                </div>

                                <div className="w-full flex flex-col gap-1 items-center">
                                    <p className="text-[20px] font-[470] w-full">Hương vị:</p>
                                    <div className="w-full h-10 rounded-md bg-(--flavor)"></div>
                                    <input type="range" min={1} max={255} value={formData.flavor}
                                    className="w-4/5 h-2 rounded-full appearance-none bg-gray-300) outline-2 mt-3"
                                    onChange={(e) => {
                                        setFormData((prev) => ({...prev, flavor: Number(e.target.value)}))
                                    }}></input>
                                </div>
                            </>
                        ) : (<></>)}

                        <div className="w-full flex flex-col gap-10 items-center mt-5">
                            <div className="w-full h-px bg-gray-300"></div>
                            <input className="w-full h-[75px] bg-black flex justify-center items-center text-white rounded-2xl text-[24px] font-[450] hover:bg-white hover:text-black hover:border-2 hover:border-black transition-all duration-150"
                            type="submit"
                            value="CREATE"
                            />
                        </div>
                        
                    </form>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}
