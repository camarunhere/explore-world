import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Submit from './pages/Submit';
import About from './pages/About';
import Admin from './pages/Admin';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="loading-container"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-container"><div className="spinner" /></div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<PrivateRoute><Destinations /></PrivateRoute>} />
          <Route path="/destinations/:id" element={<PrivateRoute><DestinationDetail /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
