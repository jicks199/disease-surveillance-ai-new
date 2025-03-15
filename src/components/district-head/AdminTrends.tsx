import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { OutbreakAlerts } from './OutbreakAlerts';

const diseaseData = [
  { month: 'Jan', malaria: 65, dengue: 28, covid: 45, chikungunya: 30 },
  { month: 'Feb', malaria: 59, dengue: 32, covid: 49, chikungunya: 25 },
  { month: 'Mar', malaria: 80, dengue: 41, covid: 52, chikungunya: 35 },
  { month: 'Apr', malaria: 81, dengue: 37, covid: 47, chikungunya: 40 },
  { month: 'May', malaria: 56, dengue: 45, covid: 44, chikungunya: 28 },
  { month: 'Jun', malaria: 55, dengue: 35, covid: 48, chikungunya: 32 }
];

const districtData = [
  { name: 'sector-15', value: 400 },
  { name: 'sector-3', value: 300 },
  { name: 'sector-10', value: 200 },
  { name: 'sector-24', value: 150 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminTrends = () => {
  return (
   <div className="space-y-8  ">
  
  {/* Disease Trends Analysis */}
  <div className=' grid grid-cols-1 lg:grid-cols-2 gap-6 '>
  <section className="bg-white p-6 rounded-xl shadow-md">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">
      Disease Trends Analysis
    </h2>
    <div className="h-80 flex">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={diseaseData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {['malaria', 'dengue', 'covid', 'chikungunya'].map((disease, index) => (
            <Line
              key={disease}
              type="monotone"
              dataKey={disease}
              stroke={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index]}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {/* <OutbreakAlerts /> */}
    </div>
  </section>
  <div className="bg-white p-6 rounded-xl shadow-md ">
    <OutbreakAlerts />
  </div>
   {/* Monthly Distribution */}
   <section className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Monthly Distribution
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={diseaseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {['malaria', 'dengue', 'covid', 'chikungunya'].map((disease, index) => (
              <Bar
                key={disease}
                dataKey={disease}
                fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>

    {/* District-wise Distribution */}
    <section className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        District-wise Distribution
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={districtData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {districtData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  </div>
  

  {/* Monthly and District-wise Distribution
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

   
  </div> */}
</div>

  );
};

export default AdminTrends;