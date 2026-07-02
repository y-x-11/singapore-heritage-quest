import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ExploreLayout from './components/ExploreLayout';
import TeacherLogin from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentDetail from './pages/StudentDetail';
import Classes from './pages/Classes';
import Content from './pages/Content';
import ExploreHome from './pages/explore/ExploreHome';
import LocationScan from './pages/explore/LocationScan';
import LocationView from './pages/explore/LocationView';
import StudentLogin from './pages/explore/StudentLogin';
import StudentProfile from './pages/explore/StudentProfile';

function TeacherRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== 'teacher') return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public heritage explorer — no login required */}
      <Route path="/explore" element={<ExploreLayout />}>
        <Route index element={<ExploreHome />} />
        <Route path="scan" element={<LocationScan />} />
        <Route path="location/:id" element={<LocationView />} />
        <Route path="login" element={<StudentLogin />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      <Route path="/login" element={<StudentLogin />} />
      <Route path="/teacher/login" element={<TeacherLogin />} />
      <Route
        path="/"
        element={
          <TeacherRoute>
            <Layout />
          </TeacherRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<StudentDetail />} />
        <Route path="classes" element={<Classes />} />
        <Route path="content" element={<Content />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
