import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

interface Props {
  moods: {
    day_created: string;
    score: number;
    note?: string;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    let scoreColor = "text-yellow-500";
    if (data.score >= 8) scoreColor = "text-green-500";
    else if (data.score <= 4) scoreColor = "text-red-500";

    return (
      <div className="bg-white/90 backdrop-blur-sm p-4 border border-slate-100 shadow-xl rounded-xl max-w-xs">
        <p className="font-semibold text-slate-800 mb-1">{label}</p>
        <p className={`${scoreColor} font-bold text-lg mb-2`}>
          Score: {data.score}/10
        </p>
        {data.note && (
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Note</p>
            <p className="text-sm text-slate-600 italic whitespace-pre-wrap">"{data.note}"</p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const MoodChart = ({ moods }: Props) => {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Last 7 Days</h2>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={moods} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
                dataKey="day_created" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickMargin={10}
            />
            <YAxis 
                domain={[0, 10]} 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9', radius: 4 }} />
            <Bar 
                dataKey="score" 
                radius={[8, 8, 8, 8]} 
                barSize={40}
                animationDuration={1500}
            >
              {moods.map((entry, index) => {
                let color = "#eab308"; // Default Yellow (Neutral)
                if (entry.score >= 8) color = "#22c55e"; // Green (Good)
                else if (entry.score <= 4) color = "#ef4444"; // Red (Bad)
                
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoodChart;
