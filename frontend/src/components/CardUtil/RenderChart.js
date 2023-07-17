import React, { useEffect, useState } from "react";
import {
  BarChart,
  LineChart,
  ScatterChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  Scatter,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import CircularProgress from '@mui/material/CircularProgress';

export default function RenderChart({ data, type, ...chartProps }) {
  const [loading, setLoading] = useState(true);
  let chartComponent;

  switch (type) {
    case "bar-chart":
      chartComponent = renderBarChart(data, chartProps);
      break;
    case "line-chart":
      chartComponent = renderLineChart(data, chartProps);
      break;
    case "scatter-plot":
    chartComponent =  renderScatterPlot(data, chartProps);
    break;
    case "pie-chart":
      chartComponent =  renderPieChart(data, chartProps);
      break;
    // Add more cases for other chart types if needed
    default:
      chartComponent = null;
      break;
  }

  useEffect(() => {
    setLoading(false); // Set loading to false once the rendering is done
  }, [chartComponent]);

  return (
    <>
      {loading ? (
         <div
         style={{
           display: "flex",
           justifyContent: "center",
           alignItems: "center",
           height: "100%",
         }}
       >
        <CircularProgress/> 
        </div>
      ) : (
        chartComponent
      )}
    </>
  );
}

function renderBarChart(data, { dataKey, horizontal, colors, showGrid }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout={horizontal ? "horizontal" : "vertical"}
        margin={{ top: 50, right: 50, left: 20, bottom: 20 }}
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
      <LineChart
        data={data}
        layout={horizontal ? "horizontal" : "vertical"}
        margin={{ top: 50, right: 50, left: 20, bottom: 20 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="5 5" />}
        {horizontal ? (
          <>
            <XAxis dataKey={dataKey} type="category" />
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

function renderPieChart(data, { dataKey, colors, hollow, label, legendRight}) {

  const secondRow = Object.keys(data[0]).slice(1)[0];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip />
        {legendRight ? <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{fontSize:"80%"}}/>:<Legend wrapperStyle={{fontSize:"80%"}}/>}

            <Pie dataKey={secondRow} 
             isAnimationActive={true}
            nameKey={dataKey} 
            data={data} 
             innerRadius={hollow ? "45%" : "0%"}
             label={label}>
              {Object.entries(colors).map(([key, value]) => (
            <Cell key={key} fill={value} />
          ))}
              </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}


function renderScatterPlot(data, { scatterConfig, showGrid, axisName, axisUnit }) {
  let unNamedScatter = 1;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{ top: 50, right: 50, left: 20, bottom: 20 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis
          dataKey="x"
          type="number"
          name={axisName.x}
          unit={axisUnit.x}
        />
        <YAxis
          dataKey="y"
          type="number"
          name={axisName.y}
          unit={axisUnit.y}
        />
        <Tooltip labelFormatter={() => { return ''; }} />
        <Legend/>
        {scatterConfig.map((scatter, index) => (
          <Scatter
            key={index}
            name={
              scatter.name.trim() === ""
                ? `Scatter${unNamedScatter++}`
                : scatter.name
            }
            data={data[index]}
            fill={scatter.color}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
