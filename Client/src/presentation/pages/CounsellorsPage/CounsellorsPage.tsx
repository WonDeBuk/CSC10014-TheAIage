import React, { useState, useEffect } from "react";
import AxiosInstance from "@/util/AxiosInstance";
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProfileCard from "@/presentation/components/CounsellorsComponents/ProfileCard";
import NavBar from "@/presentation/components/LandingPage/NaviBar";
import Footer from "@/presentation/components/LandingPage/Footer";
import { useAuth } from "@/app/providers/AuthProvider";
import { Search, ListFilter, User, Sparkle } from "lucide-react";

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

  const [recommendList, setRecommendLList] = useState<user[]>([])

  const [userTags, setUserTags] = useState<string[]>([]) 
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

    const fetchUserTags = async () => {
      try {
        const tags = await AxiosInstance.get("/auth/tags/me")
        console.log(tags.data)
        setUserTags(tags.data)
      }
      catch (e: any) {
        console.log(e)
      }
    }

    fetchUserTags()
    fetchCounsellors()
  },[])

  useEffect(() => {
    const filtered = counsellorList.filter(c => (c.username.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase())) && (filterList.length === 0 || isSubset(filterList, c.expertise)))
    setFilteredList(filtered)
    setCurPage((prev) => ({...prev, index: 0, items: filtered.length}))
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

  useEffect(() => {
    if (userTags.length) {
      setRecommendLList(counsellorList.filter(c => (isSubset(userTags, c.expertise))).slice(0, 3))
    }
  }, [userTags])

  return (
    <div className="w-full min-h-full flex gap-20 justify-between flex-col pt-40 overflow-y-auto overflow-x-hidden hero-bg select-none">
      <NavBar></NavBar>
      <div className="w-full flex justify-center items-center text-[60px] font-[720] italic p-5"><p>CÁC CHUYÊN GIA TƯ VẤN TRÊN NỀN TẢNG</p></div>

      <div className="w-full flex flex-col justify-center items-center gap-10">
        <div>
        <div className="w-full h-fit p-3 flex items-center justify-center gap-2">
          <Search className="text-white" size={42}></Search>
          <input className="w-[1000px] h-10 bg-white rounded-md text-[20px] p-2" placeholder="Tìm kiếm tư vấn viên." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}/>
          <ListFilter className="text-white hover:text-black hover:scale-120 transition-all duration-200" size={42}
          onClick={() => {
            if (isFilter) setFilterList([])
            setIsFilter(!isFilter)
          }}></ListFilter>
        </div>

        {isFilter ? 
        <div className="flex flex-wrap gap-x-4 gap-y-3 justify-center w-[1100px]">
          {mentalDisorders.map((item, _) =>
            <div className={`rounded-md px-3 py-1 text-[16px] whitespace-nowrap transition-all hover:scale-115 duration-150 ${filterList.includes(item) ? "bg-black text-white" : "bg-white text-black hover:bg-gray-500 hover:outline hover:outline-black hover:text-white"}`}
            onClick={() => {
              setFilterList((prev) => (prev.includes(item) ? prev.filter(t => t != item) : [...prev, item]))}}>{item}</div>
          )}
        </div>
        :
        <></>
        }
        </div>

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
                else if (Number.isNaN(Number(e.target.value)) || Number(e.target.value) <= 0 || Number(e.target.value) > Math.ceil(curPage.items / curPage.count)) {
                  setDisplayPage(String(curPage.index + 1))
                }
                else setCurPage((prev) => ({...prev, index: Number(e.target.value) - 1}))
              }}/>
              <div className="text-center flex items-center justify-center text-black w-[25px]"> / </div>
              <div className="text-center flex items-center justify-center text-black w-10"><p>{Math.ceil(curPage.items / curPage.count)}</p></div>
            </div>
            <div onClick={() => setCurPage((prev) => ({...prev, index: prev.index + 1}))} className={`text-white font-[525] flex justify-center items-center p-3 w-[100px] rounded-md hover:scale-115 transition-all duration-100 ${Math.ceil(curPage.items / curPage.count) - 1 === curPage.index ? "pointer-events-none opacity-50 bg-gray-500 scale-90": "bg-blue-500"}`}><p>NEXT</p></div>
          </div>
        </div>
      </div>

      <div className={`w-full flex flex-col gap-3 items-center justify-center ${userTags.length ? "visible" : "invisible"}`}>
        <div className="w-[500px] rounded-lg flex items-center justify-center text-[35px] font-[520] text-yellow-500"><Sparkle size={32}/><p className="p-3 rounded-md text-center">PHÙ HỢP VỚI BẠN</p><Sparkle size={32}/></div>
        <div className="w-full max-w-[1200px] mx-auto grid grid-cols-3 grid-rows-1 justify-items-center gap-6 px-6">
          {recommendList.map((c, _) => 
            <ProfileCard {...c} chattable={user?.role === "Student"}/>
          )}
        </div>

      </div>

      <Footer></Footer>
    </div>
  )
} 

export default CounsellorsPage