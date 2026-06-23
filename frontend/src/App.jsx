import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GrammarSection from './pages/GrammarSection';
import PracticeZone from './pages/PracticeZone';
import { isAuthenticated } from './services/authService';

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
            </Routes>
        </Router>
    );
}

export default App;