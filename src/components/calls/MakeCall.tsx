import React, { useState, useEffect, useContext } from "react";
import { Container, Card, TextField, Button, Typography, Box, CircularProgress, Grid } from "@mui/material";
import moment from "moment";
import CallReceiverSelector from "../callReceiver/CallReceiverSelector";
import CallsTable from "./CallsTable";
import { AuthContext } from "../auth/AuthProvider";
import { invoice } from "../../services/InvoiceService";
import { checkPhoneNumberExists, enterCall, getCallsByUsernameAndStatus } from "../../services/CallService";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { setCalls as setCallsAction } from "../../store/actions";
import { UserCall } from "../../store/types";

const MakeCall: React.FC = () => {
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [discount, setDiscount] = useState<string>("0");
    const [selectedTelephoneNumber, setSelectedTelephoneNumber] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [selectedCallIds, setSelectedCallIds] = useState<number[]>([]);
    const [callDate, setCallDate] = useState(moment().format("DD/MM/YYYY"));
    const [loading, setLoading] = useState<boolean>(false);
    const [activeCalls, setActiveCalls] = useState<{ startTime: string; endTime: string }[]>([]);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
    const [isStartTimeEditable, setIsStartTimeEditable] = useState<boolean>(false);

    const [refresh, setRefresh] = useState(false); // Add refresh state

    const authContext = useContext(AuthContext);
    const userData = useSelector((state: RootState) => state.user.user);
    const calls = useSelector((state: RootState) => state.calls.calls);
    const storedUser = localStorage.getItem('user');
    const username = storedUser ? JSON.parse(storedUser).username : null;

    const dispatch = useDispatch<any>();
    const location = useLocation();
    const message = location.state && location.state.message;

    useEffect(() => {
        setLoading(true);
        getCallsByUsernameAndStatus(username, "Pending Invoice")
            .then((data: any[]) => {
                setSelectedCallIds(data.map((call) => call.callId));
                dispatch(setCallsAction(data));
                setLoading(false);
            })
            .catch((error: { message: React.SetStateAction<string>; }) => {
                setErrorMessage(error.message);
                setLoading(false);
            });
    }, [username, dispatch]);

    const startCall = () => {
        const start = moment().format("HH:mm:ss");
        setStartTime(start);
        setIsStartTimeEditable(true);
        setActiveCalls([...activeCalls, { startTime: start, endTime: "" }]);
    };

    const endCall = () => {
        const end = moment().format("HH:mm:ss");
        setEndTime(end);
        const updatedActiveCalls = activeCalls.map((call) =>
            call.endTime ? call : { ...call, endTime: end }
        );
        setActiveCalls(updatedActiveCalls);
    };

    const createInvoice = async () => {
        const invoiceBody = { callIds: selectedCallIds, username };
        try {
            const response = await invoice(invoiceBody);
            console.log('Invoice response:', response);

            const invoiceNumber = response?.data?.invoiceNumber;

            if (invoiceNumber) {
                setSuccessMessage(`Invoice ${invoiceNumber} created successfully.`);
            } else {
                throw new Error('Invoice number not found in response.');
            }

            setSelectedCallIds([]);
            dispatch(setCallsAction([]));
            setActiveCalls([]);
        } catch (error) {
            console.error('Error creating invoice:', error);
            setErrorMessage("Error creating invoice.");
        }
    };

    const handleTelephoneNumberInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedTelephoneNumber(value);
    };

    const handleDiscountInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (value === "" || !isNaN(Number(value))) {
            setDiscount(value);
        } else {
            console.error("Invalid discount value");
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!authContext?.isLoggedIn()) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        const callSubset: UserCall = {
            startTime: startTime,
            endTime: endTime,
            discountForCalls: discount === "" ? "0" : discount,
            username: username,
            telephone: selectedTelephoneNumber,
        };

        try {
            const isValid = await checkPhoneNumberExists(username, selectedTelephoneNumber);
            if (isValid) {
                console.log("call data before enter call ", callSubset)
                const response = await enterCall(callSubset);
                console.log("call response ", response)
                if (response && response.data && response.data.callId) {
                    setSelectedCallIds([...selectedCallIds, response.data.callId]);
                    const data = await getCallsByUsernameAndStatus(username, "Pending Invoice");
                    setSelectedCallIds(data.map((call: { callId: number }) => call.callId));
                    dispatch(setCallsAction(data));
                    setSuccessMessage("A new call has been recorded in the database.");
                    resetForm();
                    setRefresh(prev => !prev); // Trigger table refresh
                } else {
                    setErrorMessage("Error adding call to the database");
                }
            } else {
                setErrorMessage("Invalid phone number");
            }
        } catch (error) {
            setErrorMessage("Error adding call to the database");
        }

        setTimeout(() => {
            setSuccessMessage("");
            setErrorMessage("");
        }, 5000);
    };

    const resetForm = () => {
        setStartTime("");
        setEndTime("");
        setDiscount("0");
        setSelectedTelephoneNumber("");
        setIsStartTimeEditable(false);
        setErrorMessage("");
    };

    useEffect(() => {
        return () => {
            resetForm();
        };
    }, []);

    const validateForm = () => {
        let valid = true;

        if (!startTime.trim()) {
            setErrorMessage("Start time is required.");
            valid = false;
        }

        if (!endTime.trim()) {
            setErrorMessage("End time is required.");
            valid = false;
        }

        if (!selectedTelephoneNumber.trim()) {
            setErrorMessage("You must select a call receiver.");
            valid = false;
        }

        const discountValue = parseFloat(discount);
        if (isNaN(discountValue) || discountValue < 0) {
            setErrorMessage("Invalid discount value.");
            valid = false;
        }

        return valid;
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const now = moment();
            const updatedActiveCalls = activeCalls.map((call) => ({
                ...call,
                duration: moment.duration(now.diff(moment(call.startTime, "HH:mm:ss"))).asSeconds(),
            }));
            setActiveCalls(updatedActiveCalls);
        }, 1000);

        return () => clearInterval(timer);
    }, [activeCalls]);

    useEffect(() => {
        const isValid = moment(endTime, "HH:mm:ss").isSameOrAfter(moment(startTime, "HH:mm:ss"), "second");
        setIsSubmitDisabled(!isValid);
    }, [startTime, endTime]);

    return (
        <Container sx={{ mt: 5 }}>
            <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h1" gutterBottom align="center">
                    New Call
                </Typography>
                <form onSubmit={handleSubmit} noValidate autoComplete="off">
                    <Typography variant="body1" gutterBottom>
                        Call Date: {callDate}
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6}>
                            <CallReceiverSelector
                                handleTelephoneNumberInputChange={handleTelephoneNumberInputChange}
                                user={username}
                                newCall={{ telephone: "" }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Start Time"
                                placeholder="HH:mm:ss"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                margin="normal"
                                InputProps={{ readOnly: !isStartTimeEditable }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={startCall}
                                disabled={startTime !== ""}
                                sx={{ mt: 2 }}
                            >
                                Start Call
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="End Time"
                                placeholder="HH:mm:ss"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                margin="normal"
                                InputProps={{ readOnly: false }}
                            />
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={endCall}
                                disabled={!startTime || endTime !== ""}
                                sx={{ mt: 2 }}
                            >
                                End Call
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Discount (%)"
                                placeholder="Enter discount"
                                value={discount}
                                onChange={handleDiscountInputChange}
                                margin="normal"
                                type="number"
                                inputProps={{ min: 0, step: 1 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={!endTime || isSubmitDisabled}
                                sx={{ mt: 2 }}
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                {errorMessage && (
                    <Box mt={2}>
                        <Typography color="error">{errorMessage}</Typography>
                    </Box>
                )}
                {successMessage && (
                    <Box mt={2}>
                        <Typography color="primary">{successMessage}</Typography>
                    </Box>
                )}
            </Card>
            {loading && <CircularProgress />}
            <CallsTable userId={username} status="Pending Invoice" refresh={refresh} />

            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={createInvoice}
                    sx={{ mt: 2 }}
                >
                    End Calls and Create Invoice
                </Button>
            </Grid>
        </Container>
    );
};

export default MakeCall;
