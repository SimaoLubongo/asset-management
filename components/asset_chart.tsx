"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function AssetCharts() {
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState({
    bar: true,
    pie: true
  });

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

  useEffect(() => {
    // Fetch bar chart data
    fetch("/api/charts")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch chart data");
        }
        return res.json();
      })
      .then((chartData) => {
        setBarData(chartData);
        setLoading(prev => ({ ...prev, bar: false }));
      })
      .catch((error) => {
        console.error("Error fetching chart data:", error);
        setLoading(prev => ({ ...prev, bar: false }));
      });

    // Fetch pie chart data
    fetch("/api/charts/manufacturers")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch manufacturer data");
        }
        return res.json();
      })
      .then((manufacturerData) => {
        setPieData(manufacturerData);
        setLoading(prev => ({ ...prev, pie: false }));
      })
      .catch((error) => {
        console.error("Error fetching manufacturer data:", error);
        setLoading(prev => ({ ...prev, pie: false }));
      });
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Total Purchase Price per Month</CardTitle>
          <CardDescription>Summary of monthly purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 300 }}>
            {loading.bar ? (
              <div className="flex h-full items-center justify-center">
                <p>Loading chart data...</p>
              </div>
            ) : barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p>No data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Assets by Manufacturer</CardTitle>
          <CardDescription>Distribution across manufacturers</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 300 }}>
            {loading.pie ? (
              <div className="flex h-full items-center justify-center">
                <p>Loading manufacturer data...</p>
              </div>
            ) : pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} assets`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p>No manufacturer data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}