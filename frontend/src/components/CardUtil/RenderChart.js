import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function RenderChart({ data, type, ...chartProps }) {
  let chartComponent;

  switch (type) {
    case "bar-chart":
      chartComponent = renderBarChart(data,chartProps);
      break;
    case "line-chart":
      // Add logic for rendering line chart
      break;
    // Add more cases for other chart types if needed
    default:
      chartComponent = null;
      break;
  }

  return <>{chartComponent}</>;
}

function renderBarChart(data, { dataKey, horizontal, colors }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout={horizontal ? "horizontal" : "vertical"}>
        <CartesianGrid strokeDasharray="3 3" />
        {horizontal ? (
          <>
            <XAxis dataKey={dataKey} type="category" />
            <YAxis />
          </>
        ) : (
          <>
            <XAxis type="number" />
            <YAxis dataKey={dataKey} type="category" />
          </>
        )}
        <Tooltip />
        <Legend />
        {Object.keys(data[0])
          .slice(1)
          .map((key) => (
            <>
           { console.log("colors:", colors)}
            <Bar key={key} dataKey={key} fill={colors[key]} />
            </>
          ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
