import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import AxiosInstance from "@/util/AxiosInstance";

import ProfileCard from "@/presentation/components/CounsellorsComponents/ProfileCard";

interface user {
  user_id: string,
  username: string,
  email: string
}


export default function FileUpload() {
  const [counsellorList, setCounsList] = useState<user[]>([])

  useEffect(() => {
    const fetchCounsellors = async () => {
      try {
        const list = await AxiosInstance.get("/connection/counsellor")
        setCounsList(list.data.list)
      }
      catch (e: any) {
        console.log(e)
      }
    }

    fetchCounsellors()
  },[])

  return (
    <div className="h-full w-full p-2.5">
      {counsellorList.length ? (
        <div className="flex gap-1 justify-center items-start">
        {/* {counsellorList.map((items, index) => 
          <ProfileCard {...items}/>
        )} */}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
    // const [file, setFile] = useState<File | null>(null)
    // const [deadline, setDeadline] = useState<string>("")
    // const [uploadProgress, setUploadProgress] = useState<number>(0);
    // const [isUploading, setIsUploading] = useState<boolean>(false);


    // function formatDate(dateString: string) {
    //     const d = new Date(dateString);
    //     const year = d.getFullYear();
    //     const month = String(d.getMonth() + 1).padStart(2, "0");
    //     const day = String(d.getDate()).padStart(2, "0");
    //     return `${year}-${month}-${day}`;
    // }

    // const upload = async () => {
    //     if (!file || file.size > 5 * 1024 * 1024 || !deadline) {
    //         setFile(null)
    //         return
    //     }

    //     const future = new Date(deadline)
    //     const now = new Date()

    //     if (now > future) return

    //     const formData = new FormData()

    //     let formated = formatDate(deadline)
    //     formData.append("file", file)
    //     formData.append("deadline", formated)

    //     try {
    //         setIsUploading(true)
    //         const res = await AxiosInstance.post("/test_upload", formData, {
    //             headers: { "Content-Type": "multipart/form-data" }, onUploadProgress:(e) => {
    //                 if (e.total) {
    //                     setUploadProgress(Math.round(e.loaded * 100) / e.total)
    //                 }
    //             }})
    //         console.log(res.data)
    //     }
    //     catch (er: any) {
    //         console.log(er)
    //     }
    //     finally {
    //         setIsUploading(false);
    //         setUploadProgress(0);
    //         setFile(null);
    //         setDeadline("");
    //     }
    // }

    // return (
    //     <div className="flex w-full h-full items-center justify-between bg-blue-200">
    //         <div>
    //         <input id="fileInput" type="file" className="hidden" onChange={(e) => { if (e.target.files && e.target.files[0]) {setFile(e.target.files[0])}}} />
    //         <label htmlFor="fileInput" className="bg-sky-300 w-20 h-20 rounded-lg flex justify-center items-center cursor-pointer hover:bg-sky-400">File</label>
    //         {file !== null ? (
    //             <div className="text-black text-center mt-10">{file.name}</div>
    //         ): (
    //             <div></div>
    //         )}
    //         </div>
    //         <input
    //         type="date"
    //         value={deadline}
    //         onChange={(e) => setDeadline(e.target.value)}
    //         />

    //         <div className="w-[300px] h-[20px] bg-black">
    //             <div
    //                 className="h-full bg-green-500"
    //                 style={{ width: `${uploadProgress}%` }}
    //             ></div>
    //         </div>

    //         <button onClick={upload} disabled={isUploading} className={`${isUploading ? "bg-gray-300 text-gray-500" : "bg-white text-black"}`}>Upload</button>
    //     </div>
    // )
}