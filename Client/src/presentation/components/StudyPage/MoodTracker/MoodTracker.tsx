import { useEffect, useState } from "react";
import AxiosInstance from "@/util/AxiosInstance";
import MoodInput from "./MoodInput";
import MoodChart from "./MoodChart";

interface MoodEntry {
  mood_id?: string;
  day_created: string;
  score: number;
  note?: string;
}

const MoodTracker = () => {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchMoods = async () => {
    setLoading(true);
    const res = await AxiosInstance.get<MoodEntry[]>("/mood/recent?days=7");
    setMoods(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const handleSubmit = async (score: number, note?: string) => {
    try {
      setSubmitting(true);
      await AxiosInstance.post("/mood", { score, note });
      await fetchMoods();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading mood...</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-10 mt-24">
      <div className="text-center w-full flex flex-col items-center mb-12">
        <h1 className="text-3xl font-bold text-slate-800">Mood Tracker</h1>
        <p className="text-slate-500 mt-2">Track your daily emotions and wellbeing.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 h-fit">
           <MoodInput
            moods={moods}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 h-[500px] flex flex-col">
          <MoodChart moods={moods} />
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
