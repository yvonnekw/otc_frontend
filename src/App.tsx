
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
import NewTelephoneNumberPage from './components/calls/NewTelephoneNumberPage'
import InvoiceTable from './components/invoice/InvoiceTable';
import PaymentTable from './components/payment/PaymentTable';
import HeaderMain from './components/layout/HeaderMain';
import ForgotPassword from './components/ForgotPassword';


const App: React.FC = () => {

  const userId = localStorage.getItem("userId") ?? '';

  return (
    <AuthProvider>
      <main>
        <HeaderMain />
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
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
          <Route
            path="/get-all-users"
            element={
              <RequireAuth>
                <UserList />
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
          <Route path="/user-calls/pending" element={
            <RequireAuth>
              <CallsTable userId={userId} status="Pending Invoice" />
            </RequireAuth>} />
          <Route path="/user-calls/invoiced" element={
            <RequireAuth>
              <InvoiceTable />
            </RequireAuth>} />
          <Route path="/user-calls/paid" element={
            <RequireAuth>
              <PaymentTable />
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
          <Route path="/add-new-receiver" element={
            <RequireAuth>
              <NewTelephoneNumberPage />
            </RequireAuth>} />
          <Route path="/get-all-invoices" element={
            <RequireAuth>
              <Invoice />
            </RequireAuth>} />
          
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  );
};

export default App



