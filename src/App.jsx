import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Tasks = lazy(() => import('./pages/Tasks/Tasks'));
const Calendar = lazy(() => import('./pages/Calendar/Calendar'));
const Habits = lazy(() => import('./pages/Habits/Habits'));
const Analytics = lazy(() => import('./pages/Analytics/Analytics'));
const Settings = lazy(() => import('./pages/Settings/Settings'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
  </div>
);

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route 
            path="dashboard" 
            element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            } 
          />
          <Route 
            path="tasks" 
            element={
              <Suspense fallback={<PageLoader />}>
                <Tasks />
              </Suspense>
            } 
          />
          <Route 
            path="calendar" 
            element={
              <Suspense fallback={<PageLoader />}>
                <Calendar />
              </Suspense>
            } 
          />
          <Route 
            path="habits" 
            element={
              <Suspense fallback={<PageLoader />}>
                <Habits />
              </Suspense>
            } 
          />
          <Route 
            path="analytics" 
            element={
              <Suspense fallback={<PageLoader />}>
                <Analytics />
              </Suspense>
            } 
          />
          <Route 
            path="settings" 
            element={
              <Suspense fallback={<PageLoader />}>
                <Settings />
              </Suspense>
            } 
          />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;
