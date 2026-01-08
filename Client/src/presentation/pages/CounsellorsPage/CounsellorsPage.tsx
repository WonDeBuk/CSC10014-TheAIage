import React, { useState, useEffect } from "react";
import AxiosInstance from "@/util/AxiosInstance";
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProfileCard from "@/presentation/components/CounsellorsComponents/ProfileCard";
import NavBar from "@/presentation/components/LandingPage/NaviBar";
import Footer from "@/presentation/components/LandingPage/Footer";
import { useAuth } from "@/app/providers/AuthProvider";
import { Search, ListFilter } from "lucide-react";

interface user {
  user_id: string,
  username: string,
  email: string
  description: string,
  expertise: string[],
  flavor: string
}

interface page {
  index: number,
  count: number,
  items: number
}

const CounsellorsPage = () => {
  const { user } = useAuth()
  const [curPage, setCurPage] = useState<page>({"index": 0, "count": 3, "items": 0})
  const [counsellorList, setCounsList] = useState<user[]>([])
  const [filteredList, setFilteredList] = useState<user[]>([]) //list achieved from filter
  const [displayList, setDisplayList] = useState<user[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterList, setFilterList] = useState<string[]>([]) //user selection
  const [displayPage, setDisplayPage] = useState<string>("1")

  const [isFilter, setIsFilter] = useState(false)

  const mentalDisorders = [ 
    "Anxiety",
    "Bipolar",
    "Depressive",
    "Dissociative",
    "Eating",
    "Elimination",
    "Gender Dysphoria",
    "Impulse-Control",
    "Neurocognitive",
    "Neurodevelopmental",
    "Obsessive-Compulsive",
    "Paraphilic",
    "Personality",
    "Psychotic",
    "Sexual",
    "Sleep-Wake",
    "Somatic",
    "Substance-Addictive",
    "Trauma-Stressor"
  ]

    const isSubset = (subset: string[], superset: string[]) => {
      const superSet = new Set(superset)
      return subset.every(item => superSet.has(item))
    }

    useEffect(() => {
    const fetchCounsellors = async () => {
      try {
        const list = await AxiosInstance.get("/connection/counsellor")
        setCounsList(list.data)
        setCurPage((prev) => ({...prev, "items": list.data.length}))
      }
      catch (e: any) {
        console.log(e)
      }
    }

    fetchCounsellors()
  },[])

  useEffect(() => {
    if (searchQuery !== "") {
      const filtered = counsellorList.filter(c => (c.username.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase())) && (filterList.length === 0 || isSubset(filterList, c.expertise)))
      setFilteredList(filtered)
    }
    else setFilteredList(counsellorList)
    setCurPage((prev) => ({...prev, index: 0, items: filteredList.length}))
  }, [searchQuery, counsellorList, filterList])

  useEffect(() => {
    const start = curPage.index * curPage.count
    const end = curPage.count + start
    const copy = [...filteredList]
    setDisplayList(copy.slice(start, end))
  }, [filteredList, curPage])

  useEffect(() => {
    setDisplayPage(String(curPage.index + 1))
  }, [curPage])

  return (
    <div className="w-full min-h-full flex gap-5 justify-between flex-col pt-40 overflow-y-auto overflow-x-hidden hero-bg">
      <NavBar></NavBar>
      <div className="w-full h-[120px] flex justify-center items-center text-[36px] font-[720] italic p-5"><p>CÁC CHUYÊN GIA TƯ VẤN TRÊN NỀN TẢNG</p></div>

      <div className="w-full h-[130px] flex items-center justify-center gap-2">
        <Search className="text-white" size={42}></Search>
        <input className="w-[900px] h-10 bg-white rounded-md text-[20px] p-2" placeholder="Tìm kiếm tư vấn viên." value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}/>
        <ListFilter className="text-white hover:text-black hover:scale-120 transition-all duration-200" size={42}
        onClick={() => setIsFilter(!isFilter)}></ListFilter>
      </div>

      {isFilter ? 
      <div className="">

      </div>
      :
      <></>
      }

      <div className="w-full max-w-[1200px] mx-auto grid grid-cols-3 grid-rows-1 justify-items-center gap-6 px-6">
        {displayList.map((c, _) =>
          <ProfileCard {...c} chattable={user?.role === "Student"}/>
        )}
      </div>

      <div className="w-full h-[100px] p-4 flex items-center justify-center select-none">
        <div className="w-[450px] h-full flex justify-between">
          <div onClick={() => setCurPage((prev) => ({...prev, index: prev.index - 1}))} className={`text-white font-[525] flex justify-center items-center p-3 w-[100px] rounded-md hover:scale-115 transition-all duration-100 ${curPage.index === 0 ? "pointer-events-none opacity-50 bg-gray-500 scale-90" : "bg-blue-500"}`}><p>PREV</p></div>
          <div className="bg-white w-[120px] rounded-md p-3 flex justify-center items-center">
            <input className="h-full text-center rounded-md bg-gray-100 w-10" value={displayPage}
            onChange={(e) => {
              if (e.target.value === "") setDisplayPage("")
              else if (Number.isNaN(Number(e.target.value)) || Number(e.target.value) <= 0 || Number(e.target.value) > Math.floor(curPage.items / curPage.count)) {
                setDisplayPage(String(curPage.index + 1))
              }
              else setCurPage((prev) => ({...prev, index: Number(e.target.value) - 1}))
            }}/>
            <div className="text-center flex items-center justify-center text-black w-[25px]"> / </div>
            <div className="text-center flex items-center justify-center text-black w-10"><p>{Math.floor(curPage.items / curPage.count)}</p></div>
          </div>
          <div onClick={() => setCurPage((prev) => ({...prev, index: prev.index + 1}))} className={`text-white font-[525] flex justify-center items-center p-3 w-[100px] rounded-md hover:scale-115 transition-all duration-100 ${Math.ceil(curPage.items / curPage.count) - 1 === curPage.index ? "pointer-events-none opacity-50 bg-gray-500 scale-90": "bg-blue-500"}`}><p>NEXT</p></div>
        </div>
      </div>

      <Footer></Footer>
    </div>
  )
} 

export default CounsellorsPage