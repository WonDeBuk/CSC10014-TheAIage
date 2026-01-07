import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleUserRound, Tag, CalendarCheck2 } from "lucide-react";

interface profileData {
    user_id: string,
    username: string,
    email: string
}

interface testTags {
    name: string,
}

interface availabilityData {
    day: string,
    free: boolean
}

export default function ProfileCard({user_id, username, email}: profileData) {
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

    const userColor : string = "#4082bf"

    return (
        <div style={{"--flavor": userColor} as React.CSSProperties} onClick={()=>{navigate(`/chat/?chat=${email}`)}}
        className="select-none cursor:pointer w-[350px] h-[620px] bg-white text-black flex flex-col items-center p-4 rounded-2xl shadow-[0_2px_6px_rgba(0,0,0,0.15)] outline-2 hover:outline-8 outline-(--flavor) transition-all duration-200 hover:translate-y-[-5px] hover:shadow-2xl">
            <div className="flex flex-col w-full justify-center items-center">
                <div className="bg-(--flavor) rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.2)]"><CircleUserRound color="#ffffff" size={60} strokeWidth={1.4}/></div>
                <div className="text-center text-[24px] font-bold font-mono text-(--flavor)">{username}</div>
                <div className="text-center text-[12px] text-[rgba(0,0,0,0.4)] -translate-y-2.5">{email}</div>
                <div className="w-full h-px bg-[rgba(0,0,0,0.3)] my-1"></div>
            </div>
            
            <div className="flex-1 w-full px-3">
                <p className="line-clamp-9 text-[15px] text-gray-500">
                This counsellor is a licensed mental health professional dedicated to providing a safe, supportive, and confidential space for individuals seeking guidance and emotional well-being. With experience working with a diverse range of clients, they focus on helping individuals navigate personal challenges, manage stress, and develop healthier coping strategies.

                Their approach is client-centered and collaborative, emphasizing understanding each individual’s unique experiences and goals. They are committed to fostering personal growth, emotional resilience, and long-term well-being through evidence-based practices and compassionate care.
                </p>
            </div>
            <div className="w-full h-px bg-[rgba(0,0,0,0.3)] my-2"></div>

            <div className="w-full h-[120px] flex flex-col gap-2">
                <div className="flex items-center text-[18px] text-gray-500 gap-2">
                    <Tag size={18}></Tag>
                    <p>LĨNH VỰC</p>
                </div>
                <div className="flex flex-wrap gap-2 max-h-[75px] overflow-hidden">
                    {tags.map((items, index) =>
                        <span key={index} className="text-center bg-(--flavor) text-white w-fit px-3 rounded-2xl text-[15px] h-[26px] inline-flex justify-center items-center">{items.name}</span>
                    )}
                </div>
            </div>
            <div className="w-full h-px bg-[rgba(0,0,0,0.3)] my-2"></div>

            <div className="w-full h-[100px] flex flex-col gap-2">
                <div className="flex items-center text-[18px] text-gray-500 gap-2">
                    <CalendarCheck2 size={18}></CalendarCheck2>
                    <p>THỜI GIAN</p>
                </div>
                <div className="flex justify-between items-center w-full">
                    {days.map((items, index) =>
                        <div key={index} className={`text-center ${items.free == true ? "bg-(--flavor)" : "bg-white border-2 border-(--flavor)"} text-white w-10 h-10 rounded-full text-[15px] flex justify-between items-center`}><p className="text-center w-full">{items.day}</p></div>
                    )}
                </div>
            </div>
        </div>
    )
}