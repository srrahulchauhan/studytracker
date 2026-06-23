import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { FiTrendingUp, FiClock, FiCalendar, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';

const dailyData = [
  { name: 'Mon', hours: 2.5 }, { name: 'Tue', hours: 3.8 }, { name: 'Wed', hours: 1.5 },
  { name: 'Thu', hours: 4.2 }, { name: 'Fri', hours: 3.0 }, { name: 'Sat', hours: 5.5 },
  { name: 'Sun', hours: 4.0 },
];

const monthlyData = [
  { name: 'Week 1', hours: 15 }, { name: 'Week 2', hours: 22 }, 
  { name: 'Week 3', hours: 18 }, { name: 'Week 4', hours: 28 },
];

const subjectData = [
  { name: 'Math', value: 40, color: '#3b82f6' },
  { name: 'Physics', value: 30, color: '#10b981' },
  { name: 'Coding', value: 50, color: '#8b5cf6' },
  { name: 'Literature', value: 20, color: '#f59e0b' },
];

const StatCard = ({ title, value, subtitle, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="glass-card p-6 flex items-center justify-between"
  >
    <div>
      <p className="text-sm text-light-textMuted dark:text-dark-textMuted mb-1">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
      {subtitle && <p className="text-xs text-green-500 mt-1">{subtitle}</p>}
    </div>
    <div className={`p-4 rounded-xl ${color}`}>
      <Icon size={24} />
    </div>
  </motion.div>
);

const Analytics = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Analytics</h1>
        <p className="text-light-textMuted dark:text-dark-textMuted mt-1">
          Deep dive into your study patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard title="Average Daily Hours" value="3.5h" subtitle="+12% from last week" icon={FiClock} color="text-blue-500 bg-blue-100 dark:bg-blue-900/30" delay={0.1} />
        <StatCard title="Most Active Day" value="Saturday" subtitle="Avg 5.5 hours" icon={FiCalendar} color="text-purple-500 bg-purple-100 dark:bg-purple-900/30" delay={0.2} />
        <StatCard title="Study Streak" value="7 Days" subtitle="Personal Best!" icon={FiTrendingUp} color="text-orange-500 bg-orange-100 dark:bg-orange-900/30" delay={0.3} />
        <StatCard title="Total Sessions" value="42" subtitle="This month" icon={FiActivity} color="text-green-500 bg-green-100 dark:bg-green-900/30" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6">Daily Study Hours (Current Week)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="hours" stroke="#14b8a6" fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6">Monthly Study Hours</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'rgba(226, 232, 240, 0.4)'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 xl:col-span-2">
          <h3 className="text-lg font-semibold mb-6">Subject Wise Distribution</h3>
          <div className="h-72 flex flex-col md:flex-row items-center justify-center">
            <ResponsiveContainer width="100%" height="100%" className="max-w-md">
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4 mt-6 md:mt-0 ml-0 md:ml-12">
              {subjectData.map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-light-bg dark:bg-dark-bg p-3 rounded-lg border border-light-border dark:border-dark-border w-40">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-light-textMuted dark:text-dark-textMuted">{item.value} hours</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
