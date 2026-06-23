import React, { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTasks } from '../../hooks/useTasks';
import TaskForm from '../../components/TaskForm/TaskForm';
import './CalendarCustom.css'; // Custom styles to override default big-calendar styles for dark mode

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Calendar = () => {
  const { tasks, updateTask, addTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Convert tasks to events format required by react-big-calendar
  const events = tasks.map(task => {
    const startDate = new Date(`${task.date}T${task.startTime}`);
    const endDate = new Date(`${task.date}T${task.endTime}`);
    
    return {
      id: task.id,
      title: task.topic,
      start: startDate,
      end: endDate,
      resource: task,
    };
  });

  const eventStyleGetter = (event) => {
    const task = event.resource;
    let backgroundColor = '#3b82f6'; // default blue
    
    if (task.status === 'Completed') {
      backgroundColor = '#10b981'; // green
    } else if (task.status === 'Pending') {
      backgroundColor = '#ef4444'; // red
    } else if (task.status === 'In Progress') {
      backgroundColor = '#f59e0b'; // yellow
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        display: 'block'
      }
    };
  };

  const handleSelectEvent = (event) => {
    setEditingTask(event.resource);
    setIsModalOpen(true);
  };

  const handleSelectSlot = (slotInfo) => {
    const newDate = format(slotInfo.start, 'yyyy-MM-dd');
    setEditingTask(null);
    setIsModalOpen(true);
    // We pass a dummy initialData to preset the date
    // You could also enhance TaskForm to receive initialDate explicitly
  };

  const handleSubmit = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col h-full min-h-[80vh]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Calendar</h1>
        <p className="text-light-textMuted dark:text-dark-textMuted mt-1">
          Schedule and manage your study sessions
        </p>
      </div>

      <div className="glass-card p-4 flex-1">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', minHeight: '600px' }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          views={['month', 'week', 'day']}
          className="dark:text-white"
        />
      </div>

      <TaskForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSubmit}
        initialData={editingTask}
      />
    </div>
  );
};

export default Calendar;
