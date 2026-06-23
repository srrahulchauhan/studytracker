import React from 'react';

const generateHeatmapData = () => {
  const data = [];
  const today = new Date();
  
  // Generate last 365 days
  for (let i = 365; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    
    // Randomize for visual purposes
    const val = Math.floor(Math.random() * 5); // 0 to 4
    
    data.push({
      date: d.toISOString().split('T')[0],
      count: val
    });
  }
  return data;
};

const HeatMap = () => {
  const data = generateHeatmapData();
  
  // Group by weeks
  const weeks = [];
  let currentWeek = [];
  
  data.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === data.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getColor = (count) => {
    switch(count) {
      case 0: return 'bg-gray-100 dark:bg-gray-800';
      case 1: return 'bg-primary-200 dark:bg-primary-900/50';
      case 2: return 'bg-primary-300 dark:bg-primary-800/60';
      case 3: return 'bg-primary-500 dark:bg-primary-600';
      case 4: return 'bg-primary-700 dark:bg-primary-500';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <div className="glass-card p-6 overflow-x-auto scrollbar-hide">
      <h3 className="text-lg font-semibold mb-4">Study Heatmap</h3>
      
      <div className="flex gap-1 min-w-max pb-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <div 
                key={dayIndex}
                className={`w-3 h-3 rounded-sm ${getColor(day.count)} transition-colors hover:ring-2 ring-primary-400`}
                title={`${day.count} hours on ${day.date}`}
              ></div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-light-textMuted dark:text-dark-textMuted">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800"></div>
        <div className="w-3 h-3 rounded-sm bg-primary-200 dark:bg-primary-900/50"></div>
        <div className="w-3 h-3 rounded-sm bg-primary-300 dark:bg-primary-800/60"></div>
        <div className="w-3 h-3 rounded-sm bg-primary-500 dark:bg-primary-600"></div>
        <div className="w-3 h-3 rounded-sm bg-primary-700 dark:bg-primary-500"></div>
        <span>More</span>
      </div>
    </div>
  );
};

export default HeatMap;
