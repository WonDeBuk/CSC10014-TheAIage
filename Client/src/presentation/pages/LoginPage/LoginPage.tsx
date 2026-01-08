import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import logo from "../../../assets/LandingPage/HeroSection/logo.png"
import Footer from "@/presentation/components/LandingPage/Footer";

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();
  const { login } = useAuth();

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

    if (!formData.email || !formData.password) {
      setErrorMessage("Please fill in both email and password.");
      return;
    }

    try {
      await login(formData.email, formData.password)
      navigate("/");
    }
    catch (error: any) {
      if (error.response) {
        const data = error.response.data;
        setErrorMessage(data.detail || "Login failed.")
      }
      else {
        setErrorMessage("Login failed.");
      }
    }
  };

  return (
    <div className="w-full min-h-full flex flex-col gap-5 bg-[#edeffd] select-none">
      {errorMessage ? (<div className="bg-red-500/80 p-2 text-white rounded-md fixed top-5 left-5 transtion-all duration-150 flex justify-center items-center"><p>{errorMessage}</p></div>) : (<></>)}
      <div className="h-full flex flex-col items-center gap-15 p-5 w-full">
        <div className="w-full flex flex-col items-center">
          <img src={logo} className="h-[150px]" />
          <div className="text-[26px] text-gray-500 font-extralight">Chào ngày mới tốt lành</div>
        </div>

        <div className="flex flex-col gap-2 bg-white w-[620px] p-5 rounded-md">
          <div className="w-full flex flex-col gap-2">
            <div className="text-[28px] font-medium">Login</div>
            <div className="w-full h-px bg-gray-300"></div>
          </div>
          <form className="w-full flex flex-col gap-5"
            onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-1">
              <label className="text-[20px] font-[470]">Email:</label>
              <input className="w-full rounded-md h-[50px] bg-[#efebef] px-2 text-[18px]"
                type="email" name="email" value={formData.email} placeholder="Địa chỉ email liên kết với tài khoản."
                onChange={handleChange} />
            </div>

            <div className="w-full flex flex-col gap-1">
              <label className="text-[20px] font-[470]">Mật khẩu:</label>
              <input className="w-full rounded-md h-[50px] bg-[#efebef] px-2 text-[18px]"
                type="password" name="password" value={formData.password} placeholder="Chú ý các chữ cái in hoa, số và kí tự đặc biệt."
                onChange={handleChange} />
            </div>

            <div className="w-full flex flex-col gap-2 items-center mt-5">
              <div className="w-full h-px bg-gray-300"></div>
              <input className="w-full h-[75px] bg-black flex justify-center items-center text-white rounded-2xl text-[24px] font-[450] hover:bg-white hover:text-black hover:border-2 hover:border-black transition-all duration-150"
                type="submit"
                value="ENTER"
              />
            </div>

          </form>
        </div>
      </div>

      <div className="w-full flex gap-1 justify-center flex-col items-center">
        <div className="w-fit text-center font-[350] text-[22px]">CHƯA CÓ TÀI KHOẢN ?</div>
        <a className="w-fit text-center font-[400px] text-blue-500 text-[20px] hover:text-blue-300 transition-all duration-75 hover:scale-120" href="/register">Đăng Ký Ngay</a>
      </div>
      <Footer></Footer>
    </div>
  );
}
