import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleUserRound, Tag, MessageCircle, SquareUserRound, Hand  } from "lucide-react";

interface profileData {
    user_id: string,
    username: string,
    email: string
    description: string,
    expertise: string[],
    flavor: string,
    chattable: boolean
}

interface testTags {
    name: string,
}

interface availabilityData {
    day: string,
    free: boolean
}

export default function ProfileCard({user_id, username, email, description, expertise, flavor, chattable}: profileData) {
    const navigate = useNavigate()
    const [tags, setTag] = useState<testTags[]>([
        {name: "PhD."}, {name: "Family"}, {name: "Sleep Deprivation"}, {name: "Your Mother"}, {name: "Test123"}, {name: "Oh my mama"}
    ])
    const [days, setDays] = useState<availabilityData[]>([
        {day: "T2", free: true},
        {day: "T3", free: true},
        {day: "T4", free: true},
        {day: "T5", free: false},
        {day: "T6", free: true},
        {day: "T7", free: true},
        {day: "CN", free: false}
    ])

    const [click, setClick] = useState(false)
    const userColor : string = "#4082bf"

    return (
        <div style={{"--flavor": flavor} as React.CSSProperties}
        className="group select-none cursor:pointer w-[350px] h-[520px] bg-white text-black flex flex-col items-center p-4 rounded-2xl shadow-[0_2px_6px_rgba(0,0,0,0.15)] outline-2 hover:outline-8 outline-(--flavor) transition-all duration-200 hover:translate-y-[-5px] hover:shadow-2xl relative"
        onClick={() => setClick((prev) => (!prev))}>
            <div className={`w-full h-full absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-5 items-center justify-center rounded-2xl bg-(--flavor)/20 group-hover:visible text-white *:rounded-lg *:text-[30px] *:font-[425] *:gap-3 ${click ? "visible *:opacity-100" : "invisible"}`}>
                <div className="w-[250px] h-[60px] bg-(--flavor) flex justify-center items-center transition-all duration-125 hover:bg-white hover:border-(--flavor) hover:border-2 hover:text-(--flavor) transition-[width] hover:w-[300px] opacity-0 group-hover:opacity-100"
                onClick={() => {navigate(`/personal/?user=${email}`)}}><SquareUserRound size={23} strokeWidth={1.3} /><p>PROFILE</p></div>
                <div className={`w-[250px] h-[60px] flex justify-center items-center transition-all duration-125 transition-[width] hover:w-[300px] ${chattable ? "bg-(--flavor) hover:bg-white hover:border-(--flavor) hover:border-2 hover:text-(--flavor)" : "pointer-events-none"} opacity-0 group-hover:opacity-100`}
                onClick={()=>{navigate(`/chat/?chat=${email}`)}}>{chattable ? <><MessageCircle size={23} strokeWidth={1.3} /><p>CHAT</p></> : <></>}</div>
            </div>
            
            
            <div className="flex flex-col w-full justify-center items-center">
                <div className="bg-(--flavor) rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.2)]"><CircleUserRound color="#ffffff" size={60} strokeWidth={1.4}/></div>
                <div className="text-center text-[24px] font-bold font-mono text-(--flavor)">{username}</div>
                <div className="text-center text-[12px] text-[rgba(0,0,0,0.4)] -translate-y-2.5">{email}</div>
                <div className="w-full h-px bg-[rgba(0,0,0,0.3)] my-1"></div>
            </div>
            
            <div className="flex-1 w-full px-3 flex flex-col gap-1">
                <div className="flex items-center text-[18px] text-gray-500 gap-2">
                    <Hand size={18}></Hand>
                    <p>GIỚI THIỆU</p>
                </div>
                <p className="line-clamp-9 text-[15px] text-gray-500">
                    {description}
                </p>
            </div>
            <div className="w-full h-px bg-[rgba(0,0,0,0.3)] my-2"></div>

            <div className="w-full h-[100px] flex flex-col gap-2 justify-center">
                <div className="flex items-center text-[18px] text-gray-500 gap-2">
                    <Tag size={18}></Tag>
                    <p>LĨNH VỰC</p>
                </div>
                <div className="flex flex-wrap gap-2 max-h-[75px] overflow-hidden justify-center">
                    {expertise.map((items, index) =>
                        <span key={index} className="text-center bg-(--flavor) text-white w-fit px-3 rounded-2xl text-[15px] h-[26px] inline-flex justify-center items-center">{items}</span>
                    )}
                </div>
            </div>
        </div>
    )
}