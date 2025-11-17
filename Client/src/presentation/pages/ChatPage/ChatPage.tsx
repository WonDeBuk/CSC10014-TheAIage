import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '@/presentation/pages/ChatPage/ChatPage.css';
import home_icon from '@/assets/Icon/home_icon.png';
import setting_icon from '@/assets/Icon/setting_icon.png'
import send_icon from '@/assets/Icon/send_icon.png';

export default function ChatPage() {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [log, setLog] = useState(
        [
            { sender: "user", message: "Hello!" },
            { sender: "bot", message: "Hi there! How can I assist you today?" },
            { sender: "user", message: "Can you tell me a joke?" },
            { sender: "bot", message: "Sure! Why did the scarecrow win an award? Because he was outstanding in his field!" },
            { sender: "user", message: "Hello!" },
            { sender: "bot", message: "Hi there! How can I assist you today?" },
            { sender: "user", message: "Can you tell me a joke?" },
            { sender: "bot", message: "Sure! Why did the scarecrow win an award? Because he was outstanding in his field!" },
            { sender: "user", message: "Hello!" },
            { sender: "bot", message: "Hi there! How can I assist you today?" },
            { sender: "user", message: "Can you tell me a joke?" },
            { sender: "bot", message: "Sure! Why did the scarecrow win an award? Because he was outstanding in his field!" },
            { sender: "user", message: "Hello!" },
            { sender: "bot", message: "Hi there! How can I assist you today?" },
            { sender: "user", message: "Can you tell me a joke?" },
            { sender: "bot", message: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc," },
        ]
    )
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
    const currentMessageField = React.useRef<HTMLDivElement | null>(null)

    const sendMessage = () => {
        if (!message) return;
        const newData = { sender: "user", message: message };
        const el = currentMessageField.current;
        if (!el) return;
        setMessage("");
        const update = [...log, newData];
        setLog(update);
    }
    const convoData = [
        { sender: "david", message: "im on my way yooooooooooo" },
        { sender: "sarah", message: "great, see you soon!" },
        { sender: "mom", message: "what? no way im gonna tell your father!" },
        { sender: "evil_david", message: "yes way, im the king of the road" },
        { sender: "n00b_k1ng", message: "hey how do i change usernames?" },
        { sender: "david", message: "im on my way yooooooooooo" },
        { sender: "sarah", message: "great, see you soon!" },
        { sender: "mom", message: "what? no way im gonna tell your father!" },
        { sender: "evil_david", message: "yes way, im the king of the road" },
        { sender: "n00b_k1ng", message: "hey how do i change usernames?" },
        { sender: "david", message: "im on my way yooooooooooo" },
        { sender: "sarah", message: "great, see you soon!" },
        { sender: "mom", message: "what? no way im gonna tell your father!" },
        { sender: "evil_david", message: "yes way, im the king of the road" },
        { sender: "n00b_k1ng", message: "hey how do i change usernames?" },
    ]

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const el = textareaRef.current;
        if (!el) return;

        setMessage(e.target.value);
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
    };

    const keyDownInput = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    }

    useEffect(() => {
        const el = currentMessageField.current;
        if (!el) return;
        console.log("init");
        el.scrollIntoView(true);
        el.scrollIntoView({ behavior: "smooth"});
    }, [log]);

    return (
        <div className="w-1/1 h-1/1 bg-blue-200 fixed top-0 flex">
            <div className="bg-green-100 w-2/10 flex flex-col justify-start items-center">
                <div className="overflow-y-scroll overflow-x-hidden w-full pl-2">
                    {convoData.map((chat, index) => (
                        <div key={index} className="flex w-full bg-white justify-start items-center my-2 py-2 rounded-[15px] hover:bg-gray-200">
                            <div className="h-full w-2/7 flex justify-center items-center">
                                <div className="w-[50px] h-[50px] rounded-[50px] bg-black"></div>
                            </div>
                            <div className="flex flex-col justify-center items-start w-5/7 pr-10">
                                <p className="top-0 text-[24px] font-[450]">{chat.sender}</p>
                                <p className="text-[15px] w-full max-h-[20px] text-nowrap bg-gradient-to-r from-black to-[rgba(255, 255, 255, 1)] bg-clip-text text-transparent overflow-hidden">{chat.message}</p>

                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full h-2/11 bg-inherit flex justify-start items-center pl-3 gap-2">
                    <div><img src={home_icon} className="w-[40px] h-[40px]" onClick={() => { navigate('/') }} /></div>
                    <div><img src={setting_icon} className="w-[40px] h-[40px]" onClick={() => { navigate('/') }} /></div>
                </div>
            </div>
            <div className="bg-green-200 w-6/10 h-1/1 flex flex-col justify-between">
                <div className="top-0 w-1/1 h-[225px] bg-black flex items-center px-5 rounded-b-[15px]">
                    <div className="w-[56px] h-[56px] rounded-full bg-white mr-5"></div>
                    <p className="text-white">EDWIN</p>
                </div>
                <div className="overflow-y-scroll">
                    {log.map((chat, index) => (

                        <div key={index} ref={index === log.length - 1 ? currentMessageField : null} className={`m-1 flex m-2 ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`text-justify text-[18px] block m-2 w-auto max-w-3/5 px-4 py-2 rounded-[20px] ${chat.sender === "bot" ? "bg-gray-500 text-white" : "bg-blue-500 text-white"}`}>
                                {chat.message}
                            </div>
                        </div>

                    ))}
                </div>
                <div className="w-full p-3 flex items-center justify-between ">
                    <textarea ref={textareaRef} className="bg-white rounded-2xl w-10/11 p-3 outline-none text-[15px] resize-none overflow-y-auto ring-1 ring-gray-300 focus:ring-2"
                        value={message} rows={1} onChange={handleInput} onKeyDown={keyDownInput} placeholder="Type your message here..." />
                    <div className="w-[50px] h-[50px] rounded-[50px] bg-blue-500 hover:bg-blue-7 00 flex justify-center items-center" onClick={sendMessage}><img className="w-[30px] h-[30px]" src={send_icon} /></div>
                </div>
            </div>
            <div className="bg-purple-200 min-w-2/10 resize-x">

            </div>
        </div>
    )
}