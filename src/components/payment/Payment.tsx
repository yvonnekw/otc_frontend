import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { makePayment } from '../../services/PaymentService';
import { searchInvoiceById } from '../../services/InvoiceService';
import CallsTable from '../calls/CallsTable';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';

const Payment: React.FC = () => {
  const navigateTo = useNavigate();
  const paymentDate = moment().format('DD/MM/YYYY');

  const [fullName, setFullName] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiringDate, setExpiringDate] = useState<string>('');
  const [issueNumber, setIssueNumber] = useState<string>('');
  const [securityNumber, setSecurityNumber] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [netCost, setNetCost] = useState<string>('');
  const [invoiceNotFound, setInvoiceNotFound] = useState<boolean>(false);

  const userId = localStorage.getItem('userId') ?? '';

  const handleSearchInvoice = async () => {
    try {
      if (invoiceId) {
        const invoiceData = await searchInvoiceById(invoiceId);
        setNetCost(invoiceData.totalAmount);
        setSuccessMessage('Invoice Found.');
        setErrorMessage('');
      } else {
        setErrorMessage('Please enter an invoice ID.');
      }
    } catch (error) {
      console.error('Error searching for invoice: ', error);
      setNetCost('');
      setSuccessMessage('');
      setInvoiceNotFound(true);
      setErrorMessage('Invoice not found.');
    }
  };

  const handlePayment = async () => {
    const paymentBody = {
      paymentDate: paymentDate,
      fullNameOnPaymentCard: fullName,
      cardNumber: cardNumber,
      expiringDate: expiringDate,
      issueNumber: issueNumber,
      securityNumber: securityNumber,
      invoiceId: invoiceId,
    };
    try {
      const response = await makePayment(paymentBody);
      console.log('Payment response: ', response.data);
      setSuccessMessage('Payment successful!');
    } catch (error) {
      console.error('Error making payment: ', error);
      setErrorMessage('Error making payment. Please try again later.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Payment
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Invoice ID"
                value={invoiceId || ''}
                onChange={(e) => setInvoiceId(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearchInvoice}
                sx={{ mt: 1 }}
              >
                Search Invoice
              </Button>
              {invoiceNotFound && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  Invoice not found.
                </Alert>
              )}
              {!invoiceNotFound && (
                <div>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Invoice found:
                  </Typography>
                  <Typography variant="body1">Amount: {netCost}</Typography>
                  <Typography variant="body1">Invoice ID: {invoiceId}</Typography>
                  <Typography variant="body1">Payment Date: {paymentDate}</Typography>
                </div>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name on Payment Card"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiring Date"
                value={expiringDate}
                onChange={(e) => setExpiringDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Issue Number"
                value={issueNumber}
                onChange={(e) => setIssueNumber(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Security Number"
                value={securityNumber}
                onChange={(e) => setSecurityNumber(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePayment}
                sx={{ mt: 2 }}
              >
                Confirm Payment
              </Button>
            </Grid>
            <Grid item xs={12}>
              <CallsTable userId={userId} status="Paid" />
            </Grid>
            {errorMessage && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Alert>
            )}
            {successMessage && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {successMessage}
              </Alert>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Payment;

/*
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { makePayment } from "../../services/PaymentService";
import { searchInvoiceById } from "../../services/InvoiceService";
import CallsTable from "../calls/CallsTable";

const Payment: React.FC = () => {
  const navigateTo = useNavigate();
  const paymentDate = moment().format("DD/MM/YYYY");

  const [fullName, setFullName] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiringDate, setExpiringDate] = useState<string>("");
  const [issueNumber, setIssueNumber] = useState<string>("");
  const [securityNumber, setSecurityNumber] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [netCost, setNetCost] = useState<string>("");
  const [invoiceNotFound, setInvoiceNotFound] = useState<boolean>(false);

  const userId = localStorage.getItem("userId") ?? '';

  const handleSearchInvoice = async () => {
    try {
      if (invoiceId) { 
        const invoiceData = await searchInvoiceById(invoiceId); 
        setNetCost(invoiceData.totalAmount);
        setSuccessMessage("Invoice Found.");
        setErrorMessage(" ");
      } else {
        setErrorMessage("Please enter an invoice ID.");
      }
    } catch (error) {
      console.error("Error searching for invoice: ", error);
      setNetCost(" ");
      setSuccessMessage(" ");
      setInvoiceNotFound(true);
      setErrorMessage("Invoice not found.");
    }
  };

  const handlePayment = async () => {
    const paymentBody = {
      paymentDate: paymentDate,
      fullNameOnPaymentCard: fullName,
      cardNumber: cardNumber,
      expiringDate: expiringDate,
      issueNumber: issueNumber,
      securityNumber: securityNumber,
      invoiceId: invoiceId,
    };
    try {
      const response = await makePayment(paymentBody);
      console.log("Payment response: ", response.data);
      setSuccessMessage("Payment successful!");
    } catch (error) {
      console.error("Error making payment: ", error);
      setErrorMessage("Error making payment. Please try again later.");
    }
  };

  return (
    <section className="container col-6 mt-5 mb-5">
      <div className="row">
        <div className="card col-md-6 offset-md-3 offset-md-3">
          <h2 className="text-center">Payment</h2>
          <div className="card-body">
            <div className="row">
              <div className="form-group mb-2">
                <label>Invoice ID:</label>
                <input
                  type="text"
                  className="form-control"
                  value={invoiceId || ''}
                  onChange={(e) => setInvoiceId(e.target.value)}
                />
                <button
                  className="btn btn-success"
                  onClick={handleSearchInvoice}
                >
                  Search Invoice
                </button>
                {invoiceNotFound && <p>Invoice not found.</p>}
                {!invoiceNotFound &&
                  (<p> Invoice found. </p>) && (
                    <div>
                      <p>amount: {netCost}</p>
                      <p>Invoice ID: {invoiceId}</p>
                      <p>Payment Date: {paymentDate}</p>
                    </div>
                  )}
              </div>
              <div className="card-body"></div>
              <form>
                <div className="form-group mb-2">
                  <label>Full Name on Payment Card:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="form-group mb-2">
                  <label>Card Number:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div className="form-group mb-2">
                  <label>Expiring Date:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={expiringDate}
                    onChange={(e) => setExpiringDate(e.target.value)}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Issue Number:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={issueNumber}
                    onChange={(e) => setIssueNumber(e.target.value)}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Security Number:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={securityNumber}
                    onChange={(e) => setSecurityNumber(e.target.value)}
                  />
                </div>
              </form>
              <div className="mb-3">
                <button className="btn btn-success" onClick={handlePayment}>
                  Confirm Payment
                </button>
              </div>
              <div>
                <CallsTable userId={userId} status="Paid" />
              </div>
              {errorMessage && (
                <p className="alert alert-danger">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="alert alert-success">{successMessage}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;

*/