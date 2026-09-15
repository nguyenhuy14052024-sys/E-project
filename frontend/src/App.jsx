import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GrammarSection from './pages/GrammarSection';
import PracticeZone from './pages/PracticeZone';
import { isAuthenticated } from './services/authService';
import MiniTest from './pages/MiniTest';
import FlashcardPage from './pages/FlashcardPage';
import ReviewPage from './pages/ReviewPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageUnits from './pages/Admin/ManageUnits';
import ManageQuestions from './pages/Admin/ManageQuestions';
import ManageUsers from './pages/Admin/ManageUsers';

const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                <Route path="/learn/:unitId" element={
                    <PrivateRoute>
                        <GrammarSection />
                    </PrivateRoute>
                } />
                <Route path="/practice/:unitId" element={
                    <PrivateRoute>
                        <PracticeZone />
                    </PrivateRoute>
                } />
                <Route path="/mini-test" element={
                     <PrivateRoute>
                        <MiniTest />
                    </PrivateRoute>
                } />
                <Route path="/error-log" element={
                     <PrivateRoute>
                         <ErrorLog />
                    </PrivateRoute>
                } />
                <Route path="/flashcards" element={
                     <PrivateRoute>
                         <FlashcardPage />
                    </PrivateRoute>
                } />
                <Route path="/review" element={
                     <PrivateRoute>
                         <ReviewPage />
                     </PrivateRoute>
                } />
                <Route path="/admin" element={
    <PrivateRoute>
        <AdminDashboard />
    </PrivateRoute>
} />
<Route path="/admin/units" element={
    <PrivateRoute>
        <ManageUnits />
    </PrivateRoute>
} />
<Route path="/admin/questions" element={
    <PrivateRoute>
        <ManageQuestions />
    </PrivateRoute>
} />
<Route path="/admin/users" element={
    <PrivateRoute>
        <ManageUsers />
    </PrivateRoute>
} />
            </Routes>
        </Router>
    );
}

export default App;
import ErrorLog from './pages/ErrorLog';