import { useState } from "react";

interface Props {
  moods: { day_created: string }[];
  onSubmit: (score: number, note?: string) => void;
  submitting: boolean;
}

const getMoodEmoji = (score: number) => {
  if (score >= 9) return "🤩";
  if (score >= 7) return "🙂";
  if (score >= 5) return "😐";
  if (score >= 3) return "🙁";
  return "😫";
};

const MoodInput = ({ moods, onSubmit, submitting }: Props) => {
  const today = new Date().toISOString().split("T")[0];
  const alreadyLogged = moods.some((m) => m.day_created === today);

  const [score, setScore] = useState(5);
  const [note, setNote] = useState("");

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        How are you feeling?
      </h2>

      <div className="flex-1 flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center mb-8">
          <span className="text-6xl mb-4 transition-transform hover:scale-110 cursor-default">
            {getMoodEmoji(score)}
          </span>
          <span className="text-2xl font-semibold text-slate-700">
            {score}/10
          </span>
        </div>

        <div className="mb-8 px-4">
          <input
            type="range"
            min={1}
            max={10}
            value={score}
            disabled={alreadyLogged}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-600 transition-all"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
            <span>Terrible</span>
            <span>Amazing</span>
          </div>
        </div>

        {!alreadyLogged ?
        <textarea
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all resize-none text-slate-600 placeholder:text-slate-400 outline-none"
          placeholder="Bạn nghĩ nhiều về điều gì nhất trong hôm nay?"
          rows={4}
          disabled={alreadyLogged}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        :
        <></>
        }
      </div>

      <div className="mt-6">
        {alreadyLogged ? (
          <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center font-medium border border-green-100">
            ✨ You've logged your mood today!
          </div>
        ) : (
          <button
            onClick={() => onSubmit(score, note)}
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : "Save Today's Mood"}
          </button>
        )}
      </div>
    </div>
  );
};

export default MoodInput;
