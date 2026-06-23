import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { useStudySessions } from '../../hooks/useStudySessions';

const subjectColors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

const DashboardCharts = () => {
  const { sessions } = useStudySessions();

  const chartData = useMemo(() => {
    // Initialize week data
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekMap = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };
    
    // Initialize subjects
    const subjectsMap = {};

    const now = new Date();
    // Start of current week (Monday)
    const currentDay = now.getDay();
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - distanceToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    sessions.forEach(session => {
      const sessionDate = new Date(session.startTime);
      const hours = (session.duration || 0) / 3600;

      // Subject distribution (All time)
      const subj = session.subject || 'General Study';
      subjectsMap[subj] = (subjectsMap[subj] || 0) + hours;

      // Weekly data
      if (sessionDate >= startOfWeek) {
        const dayName = days[sessionDate.getDay()];
        weekMap[dayName] += hours;
      }
    });

    const weeklyData = [
      { name: 'Mon', hours: Number(weekMap['Mon'].toFixed(1)) },
      { name: 'Tue', hours: Number(weekMap['Tue'].toFixed(1)) },
      { name: 'Wed', hours: Number(weekMap['Wed'].toFixed(1)) },
      { name: 'Thu', hours: Number(weekMap['Thu'].toFixed(1)) },
      { name: 'Fri', hours: Number(weekMap['Fri'].toFixed(1)) },
      { name: 'Sat', hours: Number(weekMap['Sat'].toFixed(1)) },
      { name: 'Sun', hours: Number(weekMap['Sun'].toFixed(1)) },
    ];

    const subjectData = Object.keys(subjectsMap).map((key, index) => ({
      name: key,
      value: Number(subjectsMap[key].toFixed(1)),
      color: subjectColors[index % subjectColors.length]
    })).filter(s => s.value > 0);

    if (subjectData.length === 0) {
      subjectData.push({ name: 'No Data', value: 1, color: '#94a3b8' });
    }

    return { weeklyData, subjectData };
  }, [sessions]);

  // Dummy monthly data as calculating weeks of month is complex for this view
  const monthlyProgressData = [
    { name: 'Week 1', progress: 20 },
    { name: 'Week 2', progress: 35 },
    { name: 'Week 3', progress: 50 },
    { name: 'Week 4', progress: 80 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-white">Weekly Focus (Hours)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData.weeklyData}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
              <Area type="monotone" dataKey="hours" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHours)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-white">Subject Distribution</h3>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.subjectData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.subjectData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="ml-4 flex flex-col gap-2">
            {chartData.subjectData.slice(0, 4).map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
