import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useTasks } from '../../hooks/useTasks';
import { useStudySessions } from '../../hooks/useStudySessions';
import { FiUser, FiMoon, FiSun, FiDownload, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const Settings = () => {
  const { currentUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { tasks } = useTasks();
  const { sessions } = useStudySessions();
  
  const [profileData, setProfileData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    bio: 'Student at University'
  });

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Here we would normally update the user profile in a backend
    toast.success('Profile updated successfully!');
  };

  const completedTasksCount = tasks.filter(t => t.status === 'Completed').length;
  const totalSeconds = sessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const totalHours = (totalSeconds / 3600).toFixed(1);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("StudyFlow Report", 20, 20);
    doc.text(`Name: ${profileData.name}`, 20, 30);
    doc.text(`Email: ${profileData.email}`, 20, 40);
    doc.text(`Total Study Hours: ${totalHours}h`, 20, 60);
    doc.text(`Completed Tasks: ${completedTasksCount}`, 20, 70);
    doc.save("studyflow_report.pdf");
    toast.success('PDF Exported!');
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Name: profileData.name, Email: profileData.email, TotalHours: totalHours, TasksCompleted: completedTasksCount }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "studyflow_report.xlsx");
    toast.success('Excel Exported!');
  };

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Name: profileData.name, Email: profileData.email, TotalHours: totalHours, TasksCompleted: completedTasksCount }
    ]);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "studyflow_report.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Exported!');
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
        <p className="text-light-textMuted dark:text-dark-textMuted mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FiUser className="text-primary-500" /> Profile Information
            </h3>
            
            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-light-border dark:border-dark-border">
              <img 
                src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${currentUser?.email || 'User'}&background=random`} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-primary-100 dark:border-primary-900 object-cover"
              />
              <div>
                <button className="btn-secondary text-sm">Change Avatar</button>
                <p className="text-xs text-light-textMuted dark:text-dark-textMuted mt-2">
                  JPG, GIF or PNG. Max size of 20MB
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" name="name" value={profileData.name} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input type="email" name="email" value={profileData.email} disabled className="input-field opacity-70 cursor-not-allowed" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea name="bio" value={profileData.bio} onChange={handleChange} className="input-field h-24 resize-none"></textarea>
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <FiSave /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preferences & Export */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Preferences</h3>
            
            <div className="flex items-center justify-between py-3 border-b border-light-border dark:border-dark-border">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-xs text-light-textMuted dark:text-dark-textMuted">Toggle light/dark mode</p>
              </div>
              <button 
                onClick={toggleTheme}
                className="p-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isDarkMode ? <FiMoon size={20} className="text-blue-400" /> : <FiSun size={20} className="text-orange-400" />}
              </button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FiDownload className="text-primary-500" /> Export Data
            </h3>
            <p className="text-sm text-light-textMuted dark:text-dark-textMuted mb-4">
              Download your study reports and task history.
            </p>
            
            <div className="space-y-3">
              <button onClick={exportPDF} className="w-full btn-secondary flex items-center justify-center gap-2">
                Export as PDF
              </button>
              <button onClick={exportExcel} className="w-full btn-secondary flex items-center justify-center gap-2">
                Export as Excel
              </button>
              <button onClick={exportCSV} className="w-full btn-secondary flex items-center justify-center gap-2">
                Export as CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
