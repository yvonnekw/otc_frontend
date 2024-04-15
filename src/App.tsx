//import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//import {, Routes, Route } from 'react-router-dom';

import Home from './components/home/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import Dashboard from './components/Dasboard';
import ListAllCalls from './components/calls/ListAllCalls';
import CallsTable from './components/calls/CallsTable';
import Profile from './components/auth/Profile';
import AdminUI from './components/admin/AdminUI.jsx';
import Footer from './components/layout/Footer';
import NavBar from './components/layout/NavBar';
import Payment from './components/payment/Payment';
import RequireAuth from './components/auth/RequireAuth';
import AuthProvider from './components/auth/AuthProvider';
import Invoice from './components/invoice/Invoice';
import React from 'react';
import MakeCall from './components/calls/MakeCall';
import UserList from './components/users/UserList';
import PaymentList from './components/payment/PaymentList';
import NotFound from './components/notFound/NotFound';


const App: React.FC = () => {

//export function App() {
  return (
    <AuthProvider>
      <main>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/dashboard" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>} />
          <Route
            path="/get-all-payments"
            element={
              <RequireAuth>
                <PaymentList />
              </RequireAuth>
            } />
          <Route path="/get-all-calls" element={
            <RequireAuth>
              <ListAllCalls />
            </RequireAuth>} />
          <Route path="/make-call" element={
            <RequireAuth>
              <MakeCall />
            </RequireAuth>} />
          <Route path="/user-calls" element={
            <RequireAuth>
              <CallsTable userId={''} />
            </RequireAuth>} />
          <Route path="/profile" element={
            <RequireAuth>
              <Profile />
            </RequireAuth>} />
          <Route path="/get-all-users" element={
            <RequireAuth>
              <UserList />
            </RequireAuth>} />
          <Route path="/admin" element={
            <RequireAuth>
              <AdminUI />
            </RequireAuth>} />
          <Route path="/payment" element={
            <RequireAuth>
              <Payment />
            </RequireAuth>} />
          <Route path="/get-all-invoices" element={
            <RequireAuth>
              <Invoice />
            </RequireAuth>} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </main>
    </AuthProvider>
  );
};

export default App



/*

const App: React.FC = () => {
  return (
    <AuthProvider>
      <main>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>} />
            <Route
              path="/get-all-payments"
              element={
                <RequireAuth>
                  <PaymentList />
                </RequireAuth>
              } />
            <Route path="/get-all-calls" element={
              <RequireAuth>
                <ListAllCalls />
              </RequireAuth>} />
            <Route path="/make-call" element={
              <RequireAuth>
                <MakeCall />
              </RequireAuth>} />
            <Route path="/user-calls" element={
              <RequireAuth>
                <CallsTable userId={''} />
              </RequireAuth>} />
            <Route path="/profile" element={
              <RequireAuth>
                <Profile />
              </RequireAuth>} />
            <Route path="/get-all-users" element={
              <RequireAuth>
                <UserList />
              </RequireAuth>} />
            <Route path="/admin" element={
              <RequireAuth>
                <AdminUI />
              </RequireAuth>} />
            <Route path="/payment" element={
              <RequireAuth>
                <Payment />
              </RequireAuth>} />
            <Route path="/get-all-invoices" element={
              <RequireAuth>
                <Invoice />
              </RequireAuth>} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Router>
      </main>
    </AuthProvider>



  );
};

export default App;
*/