import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation, Navigate } from 'react-router-dom';
import './index.css';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Fields from './pages/Fields';
import Booking from './pages/Booking';
import Matchmaking from './pages/Matchmaking';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import Register from './pages/Register';
import Profile from './pages/Profile';
import BookingHistory from './pages/BookingHistory';
import FieldDetail from './pages/FieldDetail';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Teammates from './pages/Teammates';
import ApplyOpponent from './pages/ApplyOpponent';
import ApplyTeammate from './pages/ApplyTeammate';
import MatchDetail from './pages/MatchDetail';
import CreateMatch from './pages/CreateMatch';
import CreateOpponentMatch from './pages/CreateOpponentMatch';
import CreateTeammateMatch from './pages/CreateTeammateMatch';
import CreateMatchBooking from './pages/CreateMatchBooking';
import MyMatches from './pages/MyMatches';
import Notifications from './pages/Notifications';
import PaymentSuccess from './pages/PaymentSuccess';
import Tournaments from './pages/Tournaments';
import TournamentDetail from './pages/TournamentDetail';

// Footer Explorer and Legal Pages
import About from './pages/About';
import BookingGuide from './pages/BookingGuide';
import Careers from './pages/Careers';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

// VIP Checkout
import VIPCheckout from './pages/VIPCheckout';

// New Components
import Header from './components/Header';
import Footer from './components/Footer';
import AIChatBot from './components/AIChatBot';
import ScrollToTop from './components/ScrollToTop';

const AppContent = () => {
    const location = useLocation();
    const { token, user, loading, isAdmin } = useAuth();

    const ProtectedRoute = ({ children, adminOnly = false }) => {
        if (loading) return <div className="flex items-center justify-center min-h-screen font-black italic uppercase tracking-widest text-emerald-800">Đang kiểm tra quyền truy cập...</div>;
        
        if (!token) return <Navigate to="/login" replace />;
        
        if (adminOnly && !isAdmin) {
            return <Navigate to="/" replace />;
        }
        
        return children;
    };
    
    const isAdminMode = location.pathname.startsWith('/admin');

    return (
        <div className="app-wrapper">
            {!isAdminMode && <Header />}

            <main className={isAdminMode ? "admin-layout" : "main-layout"}>
                <Routes>
                    <Route path="/" element={isAdmin ? <Navigate to="/admin" replace /> : <Home />} />
                    <Route path="/login" element={token ? (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />) : <Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/fields" element={<Fields />} />
                    <Route path="/fields/:id" element={<FieldDetail />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/news/:slug" element={<NewsDetail />} />
                    <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
                    <Route path="/matches" element={<Matchmaking />} />
                    <Route path="/teammates" element={<Teammates />} />
                    <Route path="/teammates/:matchId" element={<MatchDetail />} />
                    <Route path="/tournaments" element={<Tournaments />} />
                    <Route path="/tournaments/:id" element={<TournamentDetail />} />
                    <Route path="/apply/opponent/:id" element={<ApplyOpponent />} />
                    <Route path="/apply/teammate/:id" element={<ApplyTeammate />} />
                    <Route path="/matches/:matchId" element={<MatchDetail />} />
                    <Route path="/create-match" element={<CreateMatch />} />
                    <Route path="/create-match-opponent" element={<ProtectedRoute><CreateOpponentMatch /></ProtectedRoute>} />
                    <Route path="/create-match-teammate" element={<ProtectedRoute><CreateTeammateMatch /></ProtectedRoute>} />
                    <Route path="/create-match-booking" element={<ProtectedRoute><CreateMatchBooking /></ProtectedRoute>} />
                    
                    {/* Admin Routes - Có bảo vệ adminOnly */}
                    <Route path="/admin/*" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />

                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/history" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
                    <Route path="/my-matches" element={<ProtectedRoute><MyMatches /></ProtectedRoute>} />
                    <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                    <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
                    <Route path="/vip-checkout" element={<ProtectedRoute><VIPCheckout /></ProtectedRoute>} />

                    {/* Footer Pages */}
                    <Route path="/about" element={<About />} />
                    <Route path="/booking-guide" element={<BookingGuide />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                </Routes>
            </main>

            {!isAdminMode && <Footer />}
            {!isAdminMode && <AIChatBot />}
        </div>
    );
};

function App() {
  return (
    <Router>
        <ScrollToTop />
        <AppContent />
    </Router>
  );
}

export default App;
