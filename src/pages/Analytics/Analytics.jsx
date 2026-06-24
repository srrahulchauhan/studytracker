import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { FiTrendingUp, FiClock, FiCalendar, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useStudySessions } from '../../hooks/useStudySessions';

const subjectColors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#14b8a6', '#f43f5e'];

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
  const { sessions } = useStudySessions();

  const { 
    dailyData, 
    monthlyData, 
    subjectData, 
    stats 
  } = useMemo(() => {
    const now = new Date();
    
    // Data structures for charts
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekMap = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };
    const monthMap = { 'Week 1': 0, 'Week 2': 0, 'Week 3': 0, 'Week 4': 0, 'Week 5': 0 };
    const subjMap = {};
    const dailyTotalMap = {}; // { 'YYYY-MM-DD': totalHours }
    let totalSessions = sessions.length;

    // Start of current week (Monday)
    const currentDay = now.getDay();
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - distanceToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // Current month info
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    sessions.forEach(session => {
      if (!session.startTime) return;
      
      const sessionDate = new Date(session.startTime);
      const hours = (session.duration || 0) / 3600;
      const dateStr = session.startTime.split('T')[0];

      // Subject mapping
      const subj = session.subject || 'General Study';
      subjMap[subj] = (subjMap[subj] || 0) + hours;

      // Daily Total Mapping for Streak and Avg
      dailyTotalMap[dateStr] = (dailyTotalMap[dateStr] || 0) + hours;

      // Weekly Chart (Current Week)
      if (sessionDate >= startOfWeek) {
        const dayName = daysOfWeek[sessionDate.getDay()];
        weekMap[dayName] += hours;
      }

      // Monthly Chart (Current Month)
      if (sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear) {
        const date = sessionDate.getDate();
        if (date <= 7) monthMap['Week 1'] += hours;
        else if (date <= 14) monthMap['Week 2'] += hours;
        else if (date <= 21) monthMap['Week 3'] += hours;
        else if (date <= 28) monthMap['Week 4'] += hours;
        else monthMap['Week 5'] += hours;
      }
    });

    // Format Weekly Data
    const formattedDailyData = [
      { name: 'Mon', hours: Number(weekMap['Mon'].toFixed(1)) },
      { name: 'Tue', hours: Number(weekMap['Tue'].toFixed(1)) },
      { name: 'Wed', hours: Number(weekMap['Wed'].toFixed(1)) },
      { name: 'Thu', hours: Number(weekMap['Thu'].toFixed(1)) },
      { name: 'Fri', hours: Number(weekMap['Fri'].toFixed(1)) },
      { name: 'Sat', hours: Number(weekMap['Sat'].toFixed(1)) },
      { name: 'Sun', hours: Number(weekMap['Sun'].toFixed(1)) },
    ];

    // Format Monthly Data
    const formattedMonthlyData = Object.keys(monthMap)
      .filter(key => key !== 'Week 5' || monthMap['Week 5'] > 0) // Only show Week 5 if there's data
      .map(key => ({
        name: key,
        hours: Number(monthMap[key].toFixed(1))
      }));

    // Format Subject Data
    let formattedSubjectData = Object.keys(subjMap).map((key, idx) => ({
      name: key,
      value: Number(subjMap[key].toFixed(1)),
      color: subjectColors[idx % subjectColors.length]
    })).filter(s => s.value > 0);

    if (formattedSubjectData.length === 0) {
      formattedSubjectData.push({ name: 'No Data', value: 1, color: '#94a3b8' });
    }

    // Stats Calculation
    const activeDaysCount = Object.keys(dailyTotalMap).length;
    const totalHoursAllTime = Object.values(dailyTotalMap).reduce((a, b) => a + b, 0);
    const avgDailyHours = activeDaysCount > 0 ? (totalHoursAllTime / activeDaysCount).toFixed(1) : "0.0";

    // Calculate Most Active Day of the week (all time)
    const overallWeekMap = { 'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0 };
    sessions.forEach(session => {
      if (!session.startTime) return;
      const d = new Date(session.startTime);
      overallWeekMap[daysOfWeek[d.getDay()]] += (session.duration || 0) / 3600;
    });
    
    let mostActiveDayName = "-";
    let maxDayHours = 0;
    Object.entries(overallWeekMap).forEach(([day, hrs]) => {
      if (hrs > maxDayHours) {
        maxDayHours = hrs;
        mostActiveDayName = day;
      }
    });

    // Calculate Streak
    let currentStreak = 0;
    const sortedDates = Object.keys(dailyTotalMap).sort((a, b) => new Date(b) - new Date(a)); // Descending
    
    if (sortedDates.length > 0) {
      let checkDate = new Date();
      checkDate.setHours(0, 0, 0, 0);
      
      const todayStr = checkDate.toISOString().split('T')[0];
      let todayOrYesterday = false;
      
      // If the first date is today or yesterday, we have an active streak
      if (sortedDates[0] === todayStr) {
        todayOrYesterday = true;
      } else {
        let yesterday = new Date(checkDate);
        yesterday.setDate(yesterday.getDate() - 1);
        if (sortedDates[0] === yesterday.toISOString().split('T')[0]) {
          todayOrYesterday = true;
          checkDate = yesterday;
        }
      }

      if (todayOrYesterday) {
        currentStreak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          checkDate.setDate(checkDate.getDate() - 1);
          if (sortedDates[i] === checkDate.toISOString().split('T')[0]) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    // Full names for Most Active Day
    const fullDayNames = { 'Sun': 'Sunday', 'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday', 'Thu': 'Thursday', 'Fri': 'Friday', 'Sat': 'Saturday', '-': '-' };

    return {
      dailyData: formattedDailyData,
      monthlyData: formattedMonthlyData,
      subjectData: formattedSubjectData,
      stats: {
        avgHours: avgDailyHours,
        mostActiveDay: fullDayNames[mostActiveDayName],
        maxDayHours: maxDayHours.toFixed(1),
        streak: currentStreak,
        totalSessions
      }
    };
  }, [sessions]);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Analytics</h1>
        <p className="text-light-textMuted dark:text-dark-textMuted mt-1">
          Deep dive into your study patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard 
          title="Average Daily Hours" 
          value={`${stats.avgHours}h`} 
          subtitle="On active days" 
          icon={FiClock} 
          color="text-blue-500 bg-blue-100 dark:bg-blue-900/30" 
          delay={0.1} 
        />
        <StatCard 
          title="Most Active Day" 
          value={stats.mostActiveDay} 
          subtitle={stats.maxDayHours > 0 ? `Avg ${stats.maxDayHours} total hrs` : 'No data yet'} 
          icon={FiCalendar} 
          color="text-purple-500 bg-purple-100 dark:bg-purple-900/30" 
          delay={0.2} 
        />
        <StatCard 
          title="Study Streak" 
          value={`${stats.streak} Days`} 
          subtitle={stats.streak > 0 ? "Keep it up!" : "Start studying today!"} 
          icon={FiTrendingUp} 
          color="text-orange-500 bg-orange-100 dark:bg-orange-900/30" 
          delay={0.3} 
        />
        <StatCard 
          title="Total Sessions" 
          value={stats.totalSessions.toString()} 
          subtitle="All time" 
          icon={FiActivity} 
          color="text-green-500 bg-green-100 dark:bg-green-900/30" 
          delay={0.4} 
        />
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
              {subjectData.slice(0, 8).map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-light-bg dark:bg-dark-bg p-3 rounded-lg border border-light-border dark:border-dark-border w-40">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
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
