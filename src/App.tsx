import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from './store/authSlice';
import Home from './components/home/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import Dashboard from './components/Dasboard';
import ListAllCalls from './components/admin/ListAllCalls';
import CallsTable from './components/calls/CallsTable';
import Profile from './components/auth/Profile';
import AdminUI from './components/admin/AdminUI';
import Footer from './components/layout/Footer';
import NavBar from './components/layout/NavBar';
import Payment from './components/payment/Payment';
import RequireAuth from './components/auth/RequireAuth';
import AdminInvoiceTable from './components/admin/InvoiceList';
import UserInvoiceTable from './components/invoice/UserInvoiceTable';
import MakeCall from './components/calls/MakeCall';
import UserList from './components/admin/UserList';
import PaymentList from './components/admin/PaymentList';
import NotFound from './components/notFound/NotFound';
import NewTelephoneNumberPage from './components/callReceiver/NewTelephoneNumberPage';
import InvoiceTable from './components/invoice/InvoiceTable';
import PaymentTable from './components/payment/PaymentTable';
import HeaderMain from './components/layout/HeaderMain';
import ForgotPassword from './components/ForgotPassword';
import { RootState } from './store/store';
import AuthProvider from './components/auth/AuthProvider';
import UserPaidTable from "./components/payment/UserPaidTable";
import ResponsiveAppBar from "./components/layout/Nav";
import UserCallReceiverListTable from "./components/admin/UserCallReceiverListTable";
import CallReceiverList from './components/admin/CallReceiverList';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user?.username);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        dispatch(loginSuccess(parsedUser));
      } catch (error) {
        console.error('Error parsing stored user data', error);
        localStorage.removeItem('user');
      }
    }
  }, [dispatch]);

  return (
    <AuthProvider>
      <HeaderMain />
      <main className="container mt-5" >
        <ResponsiveAppBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/get-all-payments" element={<RequireAuth><PaymentList /></RequireAuth>} />
          <Route path="/get-all-users" element={<RequireAuth><UserList /></RequireAuth>} />
          <Route path="/get-all-calls" element={<RequireAuth><ListAllCalls /></RequireAuth>} />
          <Route path="/get-all-receivers" element={<RequireAuth><CallReceiverList /></RequireAuth>} />
          <Route path="/make-call" element={<RequireAuth><MakeCall /></RequireAuth>} />
          <Route path="/user-calls/pending" element={<RequireAuth><CallsTable userId={user || ''} status="Pending AdminInvoiceTable" /></RequireAuth>} />
          <Route path="/calls/invoiced" element={<RequireAuth><InvoiceTable /></RequireAuth>} />
          <Route path="/user-calls/invoiced" element={<RequireAuth><UserInvoiceTable username={user!} /></RequireAuth>} />
          <Route path="/user-calls/payment" element={<RequireAuth><PaymentTable /></RequireAuth>} />
          <Route path="/user-call-receiver-list" element={<RequireAuth><UserCallReceiverListTable username={user!} /></RequireAuth>} />
          <Route path="/user-calls/paid" element={<RequireAuth><UserPaidTable username={user!} /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><AdminUI /></RequireAuth>} />
          <Route path="/payment" element={<RequireAuth><Payment /></RequireAuth>} />
          <Route path="/add-new-receiver" element={<RequireAuth><NewTelephoneNumberPage /></RequireAuth>} />
          <Route path="/get-all-invoices" element={<RequireAuth><AdminInvoiceTable /></RequireAuth>} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  );
};

export default App;



/*
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './components/auth/authSlice';
import { RootState } from './components/auth/store';
import Home from './components/home/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import Dashboard from './components/Dasboard';
import ListAllCalls from './components/calls/ListAllCalls';
import CallsTable from './components/calls/CallsTable';
import Profile from './components/auth/Profile';
import AdminUI from './components/admin/AdminUI';
import Footer from './components/layout/Footer';
import NavBar from './components/layout/NavBar';
import Payment from './components/payment/Payment';
import RequireAuth from './components/auth/RequireAuth';
import AdminInvoiceTable from './components/invoice/AdminInvoiceTable';
import MakeCall from './components/calls/MakeCall';
import UserList from './components/users/UserList';
import PaymentList from './components/payment/PaymentList';
import NotFound from './components/notFound/NotFound';
import NewTelephoneNumberPage from './components/calls/NewTelephoneNumberPage';
import InvoiceTable from './components/invoice/InvoiceTable';
import PaymentTable from './components/payment/PaymentTable';
import HeaderMain from './components/layout/HeaderMain';
import ForgotPassword from './components/ForgotPassword';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(login(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return (
    <>
      <HeaderMain />
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/get-all-payments" element={<RequireAuth><PaymentList /></RequireAuth>} />
          <Route path="/get-all-users" element={<RequireAuth><UserList /></RequireAuth>} />
          <Route path="/get-all-calls" element={<RequireAuth><ListAllCalls /></RequireAuth>} />
          <Route path="/make-call" element={<RequireAuth><MakeCall /></RequireAuth>} />
          <Route path="/user-calls/pending" element={<RequireAuth><CallsTable userId={user?.id || ''} status="Pending AdminInvoiceTable" /></RequireAuth>} />
          <Route path="/user-calls/invoiced" element={<RequireAuth><InvoiceTable /></RequireAuth>} />
          <Route path="/user-calls/paid" element={<RequireAuth><PaymentTable /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><AdminUI /></RequireAuth>} />
          <Route path="/payment" element={<RequireAuth><Payment /></RequireAuth>} />
          <Route path="/add-new-receiver" element={<RequireAuth><NewTelephoneNumberPage /></RequireAuth>} />
          <Route path="/get-all-invoices" element={<RequireAuth><AdminInvoiceTable /></RequireAuth>} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;


* /


/*

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
import AdminInvoiceTable from './components/invoice/AdminInvoiceTable';
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
              <CallsTable userId={userId} status="Pending AdminInvoiceTable" />
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
              <AdminInvoiceTable />
            </RequireAuth>} />
          
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  );
};

export default App
*/


