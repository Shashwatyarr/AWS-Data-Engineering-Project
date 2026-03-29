import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const BarChartComp = ({ data }) => {
  // safety check
  if (!data || data.length === 0) return null;

  const keys = Object.keys(data[0]);

  // if less than 2 columns → don't render
  if (keys.length < 2) return null;

  const xKey = keys[0];
  const yKey = keys[1];

  return (
    <div style={{ width: "100%", height: 300, marginTop: "20px" }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={yKey} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComp;