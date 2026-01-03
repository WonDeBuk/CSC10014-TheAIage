import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { EmotionData } from "../types/emotion";
import { EMOTION_COLORS } from "../constants/emotions";

interface EmotionChartProps {
  data: EmotionData[];
}

export function EmotionChart({ data }: EmotionChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    fill: EMOTION_COLORS[item.category],
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="mb-6">Individual Emotions</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11 }}
            axisLine={{ stroke: "#e0e0e0" }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: "#e0e0e0" }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
