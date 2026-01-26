import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext';

import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home';
import AddTodo from './pages/AddTodo';
import Summary from './pages/Summary';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';



const App = () => {

  const user = JSON.parse(localStorage.getItem("user")) || null;
  // Ensure user is valid before accessing role
  console.log(user)
  const role = user?.role || null;
  console.log(role)
  const isUserLoggedIn = !!user && !!role;
  // alert(isUserLoggedIn)
  console.log(isUserLoggedIn)
  // console.log(user?.user)
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Role-based Routes */}
          {role === "admin" && (
            <Route path="/admin" element={<AdminPanel />} />
          )}
          {(role === "user" || role === "guest") && (
            <Route path="/profile" element={<Profile />} />
          )}

          {/* Public Routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/add-todo" element={<AddTodo />} />
          <Route path="/summary" element={<Summary />} />

          {/* Redirects and Auth Routes */}
          <Route
            path="/"
            element={isUserLoggedIn ? <Navigate to="/dashboard" /> : <Home />}
          />
          <Route
            path="/login"
            element={isUserLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/dashboard"
            element={isUserLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
