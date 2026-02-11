import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './context';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Events } from './pages/Events';
import { InstagramManager } from './pages/Instagram';
import { Reports } from './pages/Reports';
import { Files } from './pages/Files';
import { MyHondaCampaigns } from './pages/MyHonda';
import { Settings } from './pages/Settings';
import { DavidTasks } from './pages/DavidTasks';
import { Login } from './pages/Login';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useApp();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Protected Layout with Outlet
const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/events" element={<Events />} />
                <Route path="/instagram" element={<InstagramManager />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/files" element={<Files />} />
                <Route path="/myhonda" element={<MyHondaCampaigns />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/david-tasks" element={<DavidTasks />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};

export default App;