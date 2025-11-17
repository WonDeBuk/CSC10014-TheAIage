import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";

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
    await login(formData.email, formData.password);
    navigate("/");
  } catch (error: any) {
    console.error("Login error:", error);
    if (error.response) {
      const data = error.response.data;
      setErrorMessage(
        data.Message || data.Error || "Login failed with status " + error.response.status
      );
    } else {
      setErrorMessage("Network error. Please check server.");
    }
  }
  };

  return (
    <div className="flex flex-col items-center gap-10 w-dvw h-dvh bg-[#edeffd] fixed top-0">
      <div className="mt-8">
        <p className="text-[36px] text-center">
          User Login
        </p>

        <p className="text-[18px] text-center text-[#a2abb7]">
            Access your counseling portal
        </p>
      </div>

      <div className="flex flex-col 
                      items-start bg-[#fffeff] 
                      gap-8 p-5 rounded-lg 
                      min-w-2/7">
        <div className="w-full">
          <div className="flex items-end justify-between">
            <p className="text-[22px] font-[500]">
              Sign in
            </p>
            {errorMessage && (
              <div className="text-red-600 text-[15px]">{errorMessage}</div>
            )}
          </div>
          
          <hr className="pos-relative 
                         translate-y-[10px] 
                         w-full"> 
          </hr>

        </div>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="w-full">
            <div className="w-full mb-3">
              <label className="block text-[18px] font-[400]" htmlFor="email">
                Email:
              </label>

              <input onChange={handleChange} 
                     value={formData.email} 
                     type="email" 
                     name="email" 
                     className={`w-full text-sm 
                                 h-[20px] bg-[#efebef] 
                                 min-h-10 rounded-lg p-3 
                     ${formData.email ? "text-black" : "text-[#8c8097]"}`} 
                     placeholder="example@gmail.com" />
            </div>

            <div className="w-full">
              <label className="block text-[18px] font-[400]" 
                     htmlFor="password">
                     Password:
              </label>

              <input onChange={handleChange} 
                     value={formData.password} 
                     type="password" 
                     name="password" 
                     className={`w-full text-sm 
                     h-[20px] bg-[#efebef] 
                     min-h-10 rounded-lg p-3 
                     ${formData.password ? "text-black" : "text-[#8c8097]"}`} 
                     placeholder="Please check for capitalizations and miscellaneous symbols." />

            </div>
          </div>

          <div className="w-full mt-8">
            <input type="submit" 
                   className="text-white text-sm 
                              bg-black h-[50px] 
                              text-center w-full 
                              rounded-lg" 
                   value="LOGIN"></input>
          </div>
        </form>
      </div>
    </div>
  );
}
