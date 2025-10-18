"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Card } from "../ui/card";

const Chart = ({ data }: { data: { name: string; total: number }[] }) => {
  return (
    <Card className="p-4 shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Course Revenue
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            stroke="#4b5563"
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="#4b5563"
            fontSize={12}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value: number) => [`$${value}`, "Total Revenue"]}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            payload={[
              { value: "Total Revenue", type: "square", color: "#8b5cf6" },
            ]}
          />
          <Bar
            dataKey="total"
            fill="#8b5cf6"
            radius={[8, 8, 0, 0]}
            barSize={40}
            animationBegin={0}
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default Chart;
