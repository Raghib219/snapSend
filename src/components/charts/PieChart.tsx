
import { Pie } from "recharts";
import { ResponsiveContainer, Cell } from "recharts";

interface PieChartData {
  category: string;
  total: number;
  percentage: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
}

const PieChart = ({ data }: PieChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={80}
        dataKey="total"
        label={({ category, percentage }) => `${category}: ${percentage}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
    </ResponsiveContainer>
  );
};

export default PieChart;
