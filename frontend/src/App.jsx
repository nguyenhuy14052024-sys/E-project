import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GrammarSection from './pages/GrammarSection';
import PracticeZone from './pages/PracticeZone';
import MiniTest from './pages/MiniTest';
import ErrorLog from './pages/ErrorLog';
import FlashcardPage from './pages/FlashcardPage';
import ReviewPage from './pages/ReviewPage';
import ProfilePage from './pages/ProfilePage';
import ResetPassword from './pages/ResetPassword';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageUnits from './pages/Admin/ManageUnits';
import ManageQuestions from './pages/Admin/ManageQuestions';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageFeedbacks from './pages/Admin/ManageFeedbacks';
import { isAuthenticated } from './services/authService';
import ForgotPassword from './pages/ForgotPassword';
import LevelTest from './pages/LevelTest';
import ManageLevelTests from './pages/Admin/ManageLevelTests';
import ManageLevelTestQuestions from './pages/Admin/ManageLevelTestQuestions';
import LevelTestList from './pages/LevelTestList';
import FeedbackPopup from './components/FeedbackPopup';
import Onboarding from './pages/Onboarding'; // Đảm bảo đã import

if (typeof document !== 'undefined') {
    const globalStyle = document.createElement('style');
    globalStyle.textContent = `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
            overflow-x: hidden;
            max-width: 100vw;
            width: 100%;
            margin: 0;
            padding: 0;
            font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        #root { overflow-x: hidden; max-width: 100vw; width: 100%; }
        img { max-width: 100%; height: auto; }
        @media (max-width: 768px) { body { font-size: 14px; } }
    `;
    document.head.appendChild(globalStyle);
}

const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <FeedbackPopup />
            <Routes>
                {/* Route cho Onboarding (Đặt lên đầu) */}
                <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
                
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/learn/:unitId" element={<PrivateRoute><GrammarSection /></PrivateRoute>} />
                <Route path="/practice/:unitId" element={<PrivateRoute><PracticeZone /></PrivateRoute>} />
                <Route path="/mini-test" element={<PrivateRoute><MiniTest /></PrivateRoute>} />
                <Route path="/error-log" element={<PrivateRoute><ErrorLog /></PrivateRoute>} />
                <Route path="/flashcards" element={<PrivateRoute><FlashcardPage /></PrivateRoute>} />
                <Route path="/review" element={<PrivateRoute><ReviewPage /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                
                <Route path="/level-tests" element={<PrivateRoute><LevelTestList /></PrivateRoute>} />
                <Route path="/level-test/:testId" element={<PrivateRoute><LevelTest /></PrivateRoute>} />
                
                <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                <Route path="/admin/units" element={<PrivateRoute><ManageUnits /></PrivateRoute>} />
                <Route path="/admin/questions" element={<PrivateRoute><ManageQuestions /></PrivateRoute>} />
                <Route path="/admin/users" element={<PrivateRoute><ManageUsers /></PrivateRoute>} />
                <Route path="/admin/level-tests" element={<PrivateRoute><ManageLevelTests /></PrivateRoute>} />
                <Route path="/admin/level-tests/:testId" element={<PrivateRoute><ManageLevelTestQuestions /></PrivateRoute>} />
                <Route path="/admin/feedbacks" element={<PrivateRoute><ManageFeedbacks /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App;