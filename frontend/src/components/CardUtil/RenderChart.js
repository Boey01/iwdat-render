import React from "react";
import {
  BarChart,
  LineChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from "recharts";

export default function RenderChart({ data, type, ...chartProps }) {
  let chartComponent;

  switch (type) {
    case "bar-chart":
      chartComponent = renderBarChart(data,chartProps);
      break;
    case "line-chart":
      chartComponent = renderLineChart(data,chartProps);
      break;
    // Add more cases for other chart types if needed
    default:
      chartComponent = null;
      break;
  }

  return <>{chartComponent}</>;
}

function renderBarChart(data, { dataKey, horizontal, colors, showGrid }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} 
      layout={horizontal ? "horizontal" : "vertical"} 
      margin={{ top: 30, right: 30, left: 0, bottom: 0 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
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
            <Bar key={key} dataKey={key} fill={colors[key]} />
          ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

function renderLineChart(data, { dataKey, horizontal, colors, showGrid, dot, hollow }) {

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} 
      layout={horizontal ? "horizontal" : "vertical"} 
      margin={{ top: 30, right: 30, left: 0, bottom: 0 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="5 5" />}
        {horizontal ? (
          <>
            <XAxis dataKey={dataKey} type="category"/>
            <YAxis />
          </>
        ) : (
          <>
            <XAxis type="number" />
            <YAxis dataKey={dataKey} type="category" label={data[0][0]} />
          </>
        )}
        <Tooltip />
        <Legend />
        {Object.keys(data[0])
          .slice(1)
          .map((key) => (
            <Line
              key={key}
              dataKey={key}
              stroke={colors[key]}
              dot={
                dot
                  ? hollow
                    ? { stroke: colors[key] } 
                    : { stroke: colors[key], fill: colors[key] }
                  : false
              }
            />
          ))}
        
      </LineChart>
    </ResponsiveContainer>
  );
}