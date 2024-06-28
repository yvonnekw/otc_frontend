
import React, { useState, useEffect, useContext } from "react";
import { Container, Card, TextField, Button, Typography, Box, CircularProgress, Grid } from "@mui/material";
import moment from "moment";
import CallReceiverSelector from "../common/CallReceiverSelector";
import CallsTable from "./CallsTable";
import { AuthContext } from "../auth/AuthProvider";
import { invoice } from "../../services/InvoiceService";
import { checkPhoneNumberExists, enterCall, getCallsByUsernameAndStatus } from "../../services/CallService";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { setCalls as setCallsAction } from "../../store/actions";

const MakeCall: React.FC = () => {
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [discount, setDiscount] = useState<number | string>("");
    const [selectedTelephoneNumber, setSelectedTelephoneNumber] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [selectedCallIds, setSelectedCallIds] = useState<number[]>([]);
    const [callDate, setCallDate] = useState(moment().format("DD/MM/YYYY"));
    const [loading, setLoading] = useState<boolean>(false);
    const [activeCalls, setActiveCalls] = useState<{ startTime: string; endTime: string }[]>([]);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
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
        const invoiceBody = { callIds: selectedCallIds };
        try {
            const response = await invoice(invoiceBody);
            setSuccessMessage("Invoice created successfully.");
            setSelectedCallIds([]);
            dispatch(setCallsAction([]));
            setActiveCalls([]);
        } catch (error) {
            setErrorMessage("Error creating invoice.");
        }
    };

    const handleTelephoneNumberInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedTelephoneNumber(value);
    };

    const handleDiscountInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const discountValue = isNaN(parseFloat(value)) ? "" : parseFloat(value);
        setDiscount(discountValue);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!authContext?.isLoggedIn()) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        const call = {
            startTime: startTime,
            endTime: endTime,
            discountForCalls: discount,
            username: username,
            telephone: selectedTelephoneNumber,
        };

        try {
            const isValid = await checkPhoneNumberExists(username, selectedTelephoneNumber);
            if (isValid) {
                const response = await enterCall(call);
                if (response && response.data && response.data.callId) {
                    setSelectedCallIds([...selectedCallIds, response.data.callId]);
                    const data = await getCallsByUsernameAndStatus(username, "Pending Invoice");
                    setSelectedCallIds(data.map((call: { callId: number }) => call.callId));
                    dispatch(setCallsAction(data));
                    setSuccessMessage("A new call has been recorded in the database.");
                    resetForm();
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
        }, 3000);
    };

    const resetForm = () => {
        setStartTime("");
        setEndTime("");
        setDiscount("");
        setSelectedTelephoneNumber("");
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
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
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
                                margin="normal"
                                InputProps={{ readOnly: true }}
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
                                margin="normal"
                                InputProps={{ readOnly: true }}
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
            <CallsTable userId={username} status="Pending Invoice" />
            {activeCalls.length > 0 && (
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
            )}
        </Container>
    );
};

export default MakeCall;


/*
import React, { useState, useEffect, useContext } from "react";
import { Container, Card, TextField, Button, Typography, Box, CircularProgress, Grid } from "@mui/material";
import moment from "moment";
import CallReceiverSelector from "../common/CallReceiverSelector";
import CallsTable from "./CallsTable";
import { AuthContext } from "../auth/AuthProvider";
import { invoice } from "../../services/InvoiceService";
import { checkPhoneNumberExists, enterCall, getCallsByUsernameAndStatus } from "../../services/CallService";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setCalls } from "../../store/actions";

const MakeCall: React.FC = () => {
   // const currentUser = localStorage.getItem("userId") || "";
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [discount, setDiscount] = useState<number | string>("");
    const [selectedTelephoneNumber, setSelectedTelephoneNumber] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [selectedCallIds, setSelectedCallIds] = useState<number[]>([]);
    const [callDate, setCallDate] = useState(moment().format("DD/MM/YYYY"));
    const [loading, setLoading] = useState<boolean>(false);
    //const [calls, setCalls] = useState<any[]>([]);
    const [activeCalls, setActiveCalls] = useState<{ startTime: string; endTime: string }[]>([]);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
    const authContext = useContext(AuthContext);
    const userData = useSelector((state: RootState) => state.user.user);
    const calls = useSelector((state: RootState) => state.calls.calls);
    const storedUser = localStorage.getItem('user');
    const username = storedUser ? JSON.parse(storedUser).username : null;

    const location = useLocation();
    const message = location.state && location.state.message;
    
    useEffect(() => {
        setLoading(true);
        getCallsByUsernameAndStatus(username, "Pending Invoice")
            .then((data: any[]) => {  
                setSelectedCallIds(data.map((call) => call.callId));
                setCalls(data);
                setLoading(false);
            })
            .catch((error: { message: React.SetStateAction<string>; }) => {
                setErrorMessage(error.message);
                setLoading(false);
            });
    }, [username]);

    const startCall = () => {
        const start = moment().format("HH:mm:ss");
        setStartTime(start);
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
        const invoiceBody = { callIds: selectedCallIds };
        try {
            const response = await invoice(invoiceBody);
            setSuccessMessage("Invoice created successfully.");
            setSelectedCallIds([]);
            setCalls([]);
            setActiveCalls([]);
        } catch (error) {
            setErrorMessage("Error creating invoice.");
        }
    };

    const handleTelephoneNumberInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedTelephoneNumber(value);
    };

    const handleDiscountInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const discountValue = isNaN(parseFloat(value)) ? "" : parseFloat(value);
        setDiscount(discountValue);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!authContext?.isLoggedIn()) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        const call = {
            startTime: startTime,
            endTime: endTime,
            discountForCalls: discount,
            username: username,
            telephone: selectedTelephoneNumber,
        };

        try {
            const isValid = await checkPhoneNumberExists(username, selectedTelephoneNumber);
            if (isValid) {
                const response = await enterCall(call);
                if (response && response.data && response.data.callId) {
                    setSelectedCallIds([...selectedCallIds, response.data.callId]);
                    const data = await getCallsByUsernameAndStatus(username, "Pending Invoice");
                    setSelectedCallIds(data.map((call: { callId: number }) => call.callId));
                    setCalls(data);
                    setSuccessMessage("A new call has been recorded in the database.");
                    resetForm();
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
        }, 3000);
    };

    const resetForm = () => {
        setStartTime("");
        setEndTime("");
        setDiscount("");
        setSelectedTelephoneNumber("");
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
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
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
                                user={username} newCall={{
                                    telephone: ""
                                }}                            />
                        </Grid>
                        </Grid>
                        <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Start Time"
                                placeholder="HH:mm:ss"
                                value={startTime}
                                margin="normal"
                                InputProps={{ readOnly: true }}
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
                                margin="normal"
                                InputProps={{ readOnly: true }}
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
            <CallsTable userId={username} status="Pending Invoice" />
            {activeCalls.length > 0 && (
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
            )}
        </Container>
    );
};

export default MakeCall;

*/

/*
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { enterCall, getCallsByUsernameAndStatus } from "../../services/CallService";
import CallReceiverSelector from "../common/CallReceiverSelector";
import { AuthContext } from "../auth/AuthProvider";
import CallsTable from "./CallsTable";
import { invoice } from "../../services/InvoiceService";
import {
    Container,
    Card,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
    Grid,
} from "@mui/material";

const MakeCall: React.FC = () => {
    const currentUser = localStorage.getItem("userId") || "";
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [discount, setDiscount] = useState<number | string>("");
    const [selectedTelephoneNumber, setSelectedTelephoneNumber] =
        useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [selectedCallIds, setSelectedCallIds] = useState<number[]>([]);
    const [invoiceId, setInvoiceId] = useState<string>("");
    const [callDate, setCallDate] = useState(moment().format("DD/MM/YYYY"));
    const [loading, setLoading] = useState<boolean>(false);
    const [calls, setCalls] = useState([]);
    const [activeCalls, setActiveCalls] = useState<
        { startTime: string; endTime: string }[]
    >([]);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    const userId = localStorage.getItem("userId") ?? "";
    const token = localStorage.getItem("token");
    const { isLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        setLoading(true);
        getCallsByUsernameAndStatus(currentUser, "Pending Invoice")
            .then((data) => {
                setSelectedCallIds(data.map((call: { callId: number }) => call.callId));
                setCalls(data);
                setLoading(false);
            })
            .catch((error) => {
                setErrorMessage(error.message);
                setLoading(false);
            });
    }, [currentUser]);

    const startCall = () => {
        const start = moment().format("HH:mm:ss");
        setStartTime(start);
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
        const invoiceBody = { callIds: selectedCallIds };
        try {
            const response = await invoice(invoiceBody);
            setInvoiceId(response.invoiceId);
            setSuccessMessage("Invoice created successfully.");
        } catch (error) {
            setErrorMessage("Error creating invoice.");
        }
    };

    const handleTelephoneNumberInputChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = e.target.value;
        setSelectedTelephoneNumber(value);
    };

    const handleDiscountInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        const discountValue = isNaN(parseFloat(value)) ? "" : parseFloat(value);
        setDiscount(discountValue);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (isLoggedIn() && validateForm()) {
            if (isDuplicateCall(startTime, endTime)) {
                setErrorMessage(
                    "A call with the same start time or end time already exists."
                );
                return;
            }

            const call = {
                startTime: startTime,
                endTime: endTime,
                discountForCalls: discount,
                username: currentUser,
                telephone: selectedTelephoneNumber,
            };

            try {
                const isValid = await checkPhoneNumberExists(
                    currentUser,
                    selectedTelephoneNumber
                );
                if (isValid) {
                    const response = await enterCall(call);
                    if (response && response.data && response.data.callId) {
                        setSelectedCallIds([...selectedCallIds, response.data.callId]);
                        const data = await getCallsByUsernameAndStatus(
                            currentUser,
                            "Pending Invoice"
                        );
                        setSelectedCallIds(
                            data.map((call: { callId: number }) => call.callId)
                        );
                        setCalls(data);
                        setSuccessMessage("A new call has been recorded in the database.");
                        resetForm();
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
            }, 3000);
        }
    };

    const resetForm = () => {
        setStartTime("");
        setEndTime("");
        setDiscount("");
        setSelectedTelephoneNumber("");
        setErrorMessage("");
    };

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

        return valid;
    };

    const isDuplicateCall = (start: string, end: string): boolean => {
        return calls.some(
            (call: { startTime: string; endTime: string }) =>
                call.startTime === start ||
                call.endTime === end ||
                call.startTime === end ||
                call.endTime === start
        );
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
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
                                user={currentUser}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Start Time"
                                placeholder="HH:mm:ss"
                                value={startTime}
                                margin="normal"
                                InputProps={{ readOnly: true }}
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
                                margin="normal"
                                InputProps={{ readOnly: true }}
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
            <CallsTable userId={userId} status="Pending Invoice" />
            {activeCalls.length > 0 && (
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
            )}
        </Container>
    );
};

export default MakeCall;
*/

/*
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { checkPhoneNumberExists, enterCall, getCallsByUsernameAndStatus } from "../../services/CallService";
import CallReceiverSelector from "../common/CallReceiverSelector";
import { AuthContext } from "../auth/AuthProvider";
import CallsTable from "./CallsTable";
import { invoice } from "../../services/InvoiceService";
import { Container, Card, TextField, Button, Typography, Box, CircularProgress, Grid } from "@mui/material";

const MakeCall: React.FC = () => {
    const currentUser = localStorage.getItem("userId") || '';
    const [startTime, setStartTime] = useState<string>(moment().format("HH:mm:ss")); // Initialize with current time
    const [endTime, setEndTime] = useState<string>("");
    const [discount, setDiscount] = useState<number | string>("");
    const [selectedTelephoneNumber, setSelectedTelephoneNumber] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [selectedCallIds, setSelectedCallIds] = useState<number[]>([]);
    const [invoiceId, setInvoiceId] = useState<string>("");
    const [callDate, setCallDate] = useState(moment().format("DD/MM/YYYY"));
    const [loading, setLoading] = useState<boolean>(false);
    const [calls, setCalls] = useState([]);
    const [errors, setErrors] = useState({
        startTime: "",
        endTime: "",
        discount: "",
        callDate: "",
    });
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    const userId = localStorage.getItem("userId") ?? '';
    const token = localStorage.getItem("token");
    const { isLoggedIn } = useContext(AuthContext);

    const [newCall, setNewCall] = useState({
        startTime: startTime,
        endTime: "",
        discount: "",
        telephone: "",
        callDate: "",
    });

    useEffect(() => {
        setLoading(true);
        getCallsByUsernameAndStatus(currentUser, "Pending Invoice")
            .then((data) => {
                setSelectedCallIds(data.map((call: { callId: number }) => call.callId));
                setCalls(data);
                setLoading(false);
            })
            .catch((error) => {
                setErrorMessage(error.message);
                setLoading(false);
            });
    }, [currentUser]);

    useEffect(() => {
        validateTimeRange(startTime, endTime);
    }, [startTime, endTime]);

    const createInvoice = async (callIds: number[]) => {
        const invoiceBody = { callIds };
        try {
            const response = await invoice(invoiceBody);
            return response.invoiceId;
        } catch (error) {
            console.error("Error creating invoice: ", error);
            throw error;
        }
    };

    const endCalls = async () => {
        if (selectedCallIds.length === 0) {
            console.error("No call IDs selected for invoice creation.");
            return;
        }
        try {
            const invoiceId = await createInvoice(selectedCallIds);
            setInvoiceId(invoiceId);
        } catch (error) {
            console.error("Error creating invoice:", error);
        }
    };

    const navigate = useNavigate();

    const handleTelephoneNumberInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedTelephoneNumber(value);
        setNewCall({ ...newCall, telephone: value });
    };

    const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value;
        setStartTime(time);
        setErrors({ ...errors, startTime: "" });
    };

    const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value;
        setEndTime(time);
        setErrors({ ...errors, endTime: "" });
    };

    const handleDiscountInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const discountValue = isNaN(parseFloat(value)) ? "" : parseFloat(value);
        setDiscount(discountValue);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (isLoggedIn() && validateForm() && validateTimeRange(startTime, endTime)) {
            if (isDuplicateCall(startTime, endTime)) {
                setErrorMessage("A call with the same start time or end time already exists.");
                return;
            }

            const call = {
                startTime: startTime,
                endTime: endTime,
                discountForCalls: discount,
                username: currentUser,
                telephone: selectedTelephoneNumber,
            };

            try {
                const isValid = await checkPhoneNumberExists(currentUser, selectedTelephoneNumber);
                if (isValid) {
                    const response = await enterCall(call);
                    if (response && response.data && response.data.callId) {
                        setSelectedCallIds([...selectedCallIds, response.data.callId]);
                        const data = await getCallsByUsernameAndStatus(currentUser, "Pending Invoice");
                        setSelectedCallIds(data.map((call: { callId: number }) => call.callId));
                        setCalls(data);
                        setSuccessMessage("A new call has been recorded in the database.");
                        resetForm();
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
            }, 3000);
        }
    };

    const resetForm = () => {
        setNewCall({
            startTime: moment().format("HH:mm:ss"), // Reset to current time
            endTime: "",
            discount: "",
            telephone: "",
            callDate: ""
        });
        setStartTime(moment().format("HH:mm:ss")); // Reset to current time
        setEndTime("");
        setDiscount("");
        setErrorMessage("");
    };

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (startTime.trim()) {
            errorsCopy.startTime = "";
        } else {
            errorsCopy.startTime = "Start time required";
            valid = false;
        }

        if (endTime.trim()) {
            errorsCopy.endTime = "";
        } else {
            errorsCopy.endTime = "End Time required";
            valid = false;
        }

        setErrors(errorsCopy);

        return valid;
    };

    const validateTimeRange = (start: string, end: string): boolean => {
        const startTimeMoment = moment(start, "HH:mm:ss");
        const endTimeMoment = moment(end, "HH:mm:ss");

        const isValid = endTimeMoment.isAfter(startTimeMoment); // Check if end time is strictly after start time
        setIsSubmitDisabled(!isValid);

        return isValid;
    };

    const isDuplicateCall = (start: string, end: string): boolean => {
        return calls.some((call: { startTime: string; endTime: string }) =>
            call.startTime === start ||
            call.endTime === end ||
            call.startTime === end ||
            call.endTime === start
        );
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
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
                                newCall={newCall}
                                user={currentUser}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Start Time"
                                placeholder="HH:mm:ss"
                                value={startTime}
                                onChange={handleStartTimeChange}
                                margin="normal"
                                error={!!errors.startTime}
                                helperText={errors.startTime}
                                inputProps={{ pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$" }} // HH:mm:ss format
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="End Time"
                                placeholder="HH:mm:ss"
                                value={endTime}
                                onChange={handleEndTimeChange}
                                margin="normal"
                                error={!!errors.endTime}
                                helperText={errors.endTime}
                                inputProps={{ pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$" }} // HH:mm:ss format
                            />
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
                            <Button type="submit" variant="contained" color="primary" disabled={isSubmitDisabled}>
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
            <CallsTable userId={userId} status="Pending Invoice" />
        </Container>
    );
};

export default MakeCall;

*/

/*
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { checkPhoneNumberExists, enterCall, getCallsByUsernameAndStatus } from "../../services/CallService";
import CallReceiverSelector from "../common/CallReceiverSelector";
import { AuthContext } from "../auth/AuthProvider";
import CallsTable from "./CallsTable";
import { invoice } from "../../services/InvoiceService";
import { Container, Card, TextField, Button, Typography, Box, CircularProgress, Grid } from "@mui/material";

const MakeCall: React.FC = () => {
    const currentUser = localStorage.getItem("userId") || '';
    const [startTime, setStartTime] = useState<string>(moment().format("HH:mm:ss")); // Initialize with current time
    const [endTime, setEndTime] = useState<string>("");
    const [discount, setDiscount] = useState<number | string>("");
    const [selectedTelephoneNumber, setSelectedTelephoneNumber] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [selectedCallIds, setSelectedCallIds] = useState<number[]>([]);
    const [invoiceId, setInvoiceId] = useState<string>("");
    const [callDate, setCallDate] = useState(moment().format("DD/MM/YYYY"));
    const [loading, setLoading] = useState<boolean>(false);
    const [calls, setCalls] = useState([]);
    const [errors, setErrors] = useState({
        startTime: "",
        endTime: "",
        discount: "",
        callDate: "",
    });
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    const userId = localStorage.getItem("userId") ?? '';
    const token = localStorage.getItem("token");
    const { isLoggedIn } = useContext(AuthContext);

    const [newCall, setNewCall] = useState({
        startTime: startTime,
        endTime: "",
        discount: "",
        telephone: "",
        callDate: "",
    });

    useEffect(() => {
        setLoading(true);
        getCallsByUsernameAndStatus(currentUser, "Pending Invoice")
            .then((data) => {
                setSelectedCallIds(data.map((call: { callId: number }) => call.callId));
                setCalls(data);
                setLoading(false);
            })
            .catch((error) => {
                setErrorMessage(error.message);
                setLoading(false);
            });
    }, [currentUser]);

    useEffect(() => {
        validateTimeRange(startTime, endTime);
    }, [startTime, endTime]);

    const createInvoice = async (callIds: number[]) => {
        const invoiceBody = { callIds };
        try {
            const response = await invoice(invoiceBody);
            return response.invoiceId;
        } catch (error) {
            console.error("Error creating invoice: ", error);
            throw error;
        }
    };

    const endCalls = async () => {
        if (selectedCallIds.length === 0) {
            console.error("No call IDs selected for invoice creation.");
            return;
        }
        try {
            const invoiceId = await createInvoice(selectedCallIds);
            setInvoiceId(invoiceId);
        } catch (error) {
            console.error("Error creating invoice:", error);
        }
    };

    const navigate = useNavigate();

    const handleTelephoneNumberInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedTelephoneNumber(value);
        setNewCall({ ...newCall, telephone: value });
    };

    const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value;
        setStartTime(time);
        setErrors({ ...errors, startTime: "" });
    };

    const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value;
        setEndTime(time);
        setErrors({ ...errors, endTime: "" });
    };

    const handleDiscountInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const discountValue = isNaN(parseFloat(value)) ? "" : parseFloat(value);
        setDiscount(discountValue);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (isLoggedIn() && validateForm() && validateTimeRange(startTime, endTime)) {
            if (isDuplicateCall(startTime, endTime)) {
                setErrorMessage("A call with the same start time and end time already exists.");
                return;
            }

            const call = {
                startTime: startTime,
                endTime: endTime,
                discountForCalls: discount,
                username: currentUser,
                telephone: selectedTelephoneNumber,
            };

            try {
                const isValid = await checkPhoneNumberExists(currentUser, selectedTelephoneNumber);
                if (isValid) {
                    const response = await enterCall(call);
                    if (response && response.data && response.data.callId) {
                        setSelectedCallIds([...selectedCallIds, response.data.callId]);
                        const data = await getCallsByUsernameAndStatus(currentUser, "Pending Invoice");
                        setSelectedCallIds(data.map((call: { callId: number }) => call.callId));
                        setCalls(data);
                        setSuccessMessage("A new call has been recorded in the database.");
                        resetForm();
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
            }, 3000);
        }
    };

    const resetForm = () => {
        setNewCall({
            startTime: moment().format("HH:mm:ss"), // Reset to current time
            endTime: "",
            discount: "",
            telephone: "",
            callDate: ""
        });
        setStartTime(moment().format("HH:mm:ss")); // Reset to current time
        setEndTime("");
        setDiscount("");
        setErrorMessage("");
    };

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (startTime.trim()) {
            errorsCopy.startTime = "";
        } else {
            errorsCopy.startTime = "Start time required";
            valid = false;
        }

        if (endTime.trim()) {
            errorsCopy.endTime = "";
        } else {
            errorsCopy.endTime = "End Time required";
            valid = false;
        }

        setErrors(errorsCopy);

        return valid;
    };

    const validateTimeRange = (start: string, end: string): boolean => {
        const startTimeMoment = moment(start, "HH:mm:ss");
        const endTimeMoment = moment(end, "HH:mm:ss");

        const isValid = endTimeMoment.isAfter(startTimeMoment); // Check if end time is strictly after start time
        setIsSubmitDisabled(!isValid);

        return isValid;
    };

    const isDuplicateCall = (start: string, end: string): boolean => {
        return calls.some((call: { startTime: string; endTime: string }) =>
            call.startTime === start && call.endTime === end
        );
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
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
                                newCall={newCall}
                                user={currentUser}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Start Time"
                                placeholder="HH:mm:ss"
                                value={startTime}
                                onChange={handleStartTimeChange}
                                margin="normal"
                                error={!!errors.startTime}
                                helperText={errors.startTime}
                                inputProps={{ pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$" }} // HH:mm:ss format
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="End Time"
                                placeholder="HH:mm:ss"
                                value={endTime}
                                onChange={handleEndTimeChange}
                                margin="normal"
                                error={!!errors.endTime}
                                helperText={errors.endTime}
                                inputProps={{ pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$" }} // HH:mm:ss format
                            />
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
                            <Button type="submit" variant="contained" color="primary" disabled={isSubmitDisabled}>
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
            <CallsTable userId={userId} status="Pending Invoice" />
        </Container>
    );
};

export default MakeCall;
*/
/*
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { checkPhoneNumberExists, enterCall, getCallsByUsernameAndStatus } from "../../services/CallService";
import CallReceiverSelector from "../common/CallReceiverSelector";
import { AuthContext } from "../auth/AuthProvider";
import CallsTable from "./CallsTable";
import { invoice } from "../../services/InvoiceService";
import { Container, Card, TextField, Button, Typography, Box, CircularProgress, Grid } from "@mui/material";

const MakeCall: React.FC = () => {
    const currentUser = localStorage.getItem("userId") || '';
    const [startTime, setStartTime] = useState<string>(moment().format("HH:mm:ss")); // Initialize with current time
    const [endTime, setEndTime] = useState<string>("");
    const [discount, setDiscount] = useState<number | string>("");
    const [selectedTelephoneNumber, setSelectedTelephoneNumber] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [selectedCallIds, setSelectedCallIds] = useState<number[]>([]);
    const [invoiceId, setInvoiceId] = useState<string>("");
    const [callDate, setCallDate] = useState(moment().format("DD/MM/YYYY"));
    const [loading, setLoading] = useState<boolean>(false);

    const [calls, setCalls] = useState([]);
    const [errors, setErrors] = useState({
        startTime: "",
        endTime: "",
        discount: "",
        callDate: "",
    });

    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    const userId = localStorage.getItem("userId") ?? '';
    const token = localStorage.getItem("token");
    const { isLoggedIn } = useContext(AuthContext);

    const [newCall, setNewCall] = useState({
        startTime: startTime,
        endTime: "",
        discount: "",
        telephone: "",
        callDate: "",
    });

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            getCallsByUsernameAndStatus(currentUser, "Pending Invoice").then((data) => {
                setSelectedCallIds(data.map((call: { callId: number }) => call.callId));
                setCalls(data);
                setLoading(false);
            }).catch((error) => {
                setErrorMessage(error.message);
                setLoading(false);
            });
        }, 1000);
    }, [currentUser]);

    useEffect(() => {
        validateTimeRange(startTime, endTime);
    }, [startTime, endTime]);

    const createInvoice = async (callIds: number[]) => {
        const invoiceBody = {
            callIds
        };

        try {
            const response = await invoice(invoiceBody);
            return response.invoiceId;
        } catch (error) {
            console.error("Error creating invoice: ", error);
            throw error;
        }
    };

    const endCalls = async () => {
        if (selectedCallIds.length === 0) {
            console.error("No call IDs selected for invoice creation.");
            return;
        }
        try {
            const invoiceId = await createInvoice(selectedCallIds);
            setInvoiceId(invoiceId);
        } catch (error) {
            console.error("Error creating invoice:", error);
        }
    };

    const navigate = useNavigate();

    const handleTelephoneNumberInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedTelephoneNumber(value);
        setNewCall({ ...newCall, telephone: value });
    };

    const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value;
        setStartTime(time);
        setErrors({ ...errors, startTime: "" });
    };

    const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value;
        setEndTime(time);
        setErrors({ ...errors, endTime: "" });
    };

    const handleDiscountInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const discountValue = isNaN(parseFloat(value)) ? "" : parseFloat(value);
        setDiscount(discountValue);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (isLoggedIn() && validateForm() && validateTimeRange(startTime, endTime)) {
            const call = {
                startTime: startTime,
                endTime: endTime,
                discountForCalls: discount,
                username: currentUser,
                telephone: selectedTelephoneNumber,
            };

            try {
                const isValid = await checkPhoneNumberExists(currentUser, selectedTelephoneNumber);
                if (isValid) {
                    const response = await enterCall(call);
                    if (response && response.data && response.data.callId) {
                        setSelectedCallIds([...selectedCallIds, response.data.callId]);
                        const data = await getCallsByUsernameAndStatus(currentUser, "Pending Invoice");
                        setSelectedCallIds(data.map((call: { callId: number }) => call.callId));
                        setCalls(data);
                        setSuccessMessage("A new call has been recorded in the database.");
                        resetForm();
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
            }, 3000);
        }
    };

    const resetForm = () => {
        setNewCall({
            startTime: moment().format("HH:mm:ss"), // Reset to current time
            endTime: "",
            discount: "",
            telephone: "",
            callDate: ""
        });
        setStartTime(moment().format("HH:mm:ss")); // Reset to current time
        setEndTime("");
        setDiscount("");
        setErrorMessage("");
    };

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (startTime.trim()) {
            errorsCopy.startTime = "";
        } else {
            errorsCopy.startTime = "Start time required";
            valid = false;
        }

        if (endTime.trim()) {
            errorsCopy.endTime = "";
        } else {
            errorsCopy.endTime = "End Time required";
            valid = false;
        }

        setErrors(errorsCopy);

        return valid;
    };

    const validateTimeRange = (start: string, end: string): boolean => {
        const startTimeMoment = moment(start, "HH:mm:ss");
        const endTimeMoment = moment(end, "HH:mm:ss");

        const isValid = endTimeMoment.isAfter(startTimeMoment); // Check if end time is strictly after start time
        setIsSubmitDisabled(!isValid);

        return isValid;
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
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
                                newCall={newCall}
                                user={currentUser}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Start Time"
                                placeholder="HH:mm:ss"
                                value={startTime}
                                onChange={handleStartTimeChange}
                                margin="normal"
                                error={!!errors.startTime}
                                helperText={errors.startTime}
                                inputProps={{ pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$" }} // HH:mm:ss format
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="End Time"
                                placeholder="HH:mm:ss"
                                value={endTime}
                                onChange={handleEndTimeChange}
                                margin="normal"
                                error={!!errors.endTime}
                                helperText={errors.endTime}
                                inputProps={{ pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$" }} // HH:mm:ss format
                            />
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
                            <Button type="submit" variant="contained" color="primary" disabled={isSubmitDisabled}>
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
            <CallsTable userId={userId} status="Pending Invoice" />
        </Container>
    );
};

export default MakeCall;


*/

/*
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { checkPhoneNumberExists, enterCall, getCallsByUsernameAndStatus } from "../../services/CallService";
import CallReceiverSelector from "../common/CallReceiverSelector";
import { AuthContext } from "../auth/AuthProvider";
import CallsTable from "./CallsTable";
import { invoice } from "../../services/InvoiceService";
import { Container, Card, TextField, Button, Typography, Box, CircularProgress, Grid } from "@mui/material";

const MakeCall: React.FC = () => {
    const currentUser = localStorage.getItem("userId") || '';
    const [startTime, setStartTime] = useState<string>(moment().format("HH:mm:ss")); // Initialize with current time
    const [endTime, setEndTime] = useState<string>("");
    const [discount, setDiscount] = useState<number | string>("");
    const [selectedTelephoneNumber, setSelectedTelephoneNumber] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [selectedCallIds, setSelectedCallIds] = useState<number[]>([]);
    const [invoiceId, setInvoiceId] = useState<string>("");
    const [callDate, setCallDate] = useState(moment().format("DD/MM/YYYY"));
    const [loading, setLoading] = useState<boolean>(false);

    const [calls, setCalls] = useState([]);

    const [errors, setErrors] = useState({
        startTime: "",
        endTime: "",
        discount: "",
        callDate: "",
    });

    const userId = localStorage.getItem("userId") ?? '';
    const token = localStorage.getItem("token");
    const { isLoggedIn } = useContext(AuthContext);

    const [newCall, setNewCall] = useState({
        startTime: startTime,
        endTime: "",
        discount: "",
        telephone: "",
        callDate: "",
    });

    useEffect(() => {
        setTimeout(() => {
            getCallsByUsernameAndStatus(currentUser, "Pending Invoice").then((data) => {
                setSelectedCallIds(data.map((call: { callId: number }) => call.callId));
                setCalls(data);
                setLoading(false);
            }).catch((error) => {
                setErrorMessage(error.message);
                setLoading(false);
            });
        }, 1000);
    }, [currentUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const createInvoice = async (callIds: number[]) => {
        const invoiceBody = {
            callIds
        };

        try {
            const response = await invoice(invoiceBody);
            return response.invoiceId;
        } catch (error) {
            console.error("Error creating invoice: ", error);
            throw error;
        }
    };

    const endCalls = async () => {
        if (selectedCallIds.length === 0) {
            console.error("No call IDs selected for invoice creation.");
            return;
        }
        try {
            const invoiceId = await createInvoice(selectedCallIds);
            setInvoiceId(invoiceId);
        } catch (error) {
            console.error("Error creating invoice:", error);
        }
    };

    const navigate = useNavigate();

    const handleTelephoneNumberInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedTelephoneNumber(value);
        setNewCall({ ...newCall, telephone: value });
    };

    const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value;
        setStartTime(time);
        setErrors({ ...errors, startTime: "" });
    };

    const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value;
        setEndTime(time);
        setErrors({ ...errors, endTime: "" });
    };

    const handleDiscountInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const discountValue = isNaN(parseFloat(value)) ? "" : parseFloat(value);
        setDiscount(discountValue);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (isLoggedIn()) {
            if (validateForm()) {
                if (!validateTimeRange(startTime, endTime)) {
                    setErrors({ ...errors, endTime: "End Time cannot be earlier than Start Time." });
                    return;
                }

                const call = {
                    startTime: startTime,
                    endTime: endTime,
                    discountForCalls: discount,
                    username: currentUser,
                    telephone: selectedTelephoneNumber,
                };

                try {
                    const isValid = await checkPhoneNumberExists(currentUser, selectedTelephoneNumber);
                    if (isValid) {
                        const response = await enterCall(call);
                        if (response && response.data && response.data.callId) {
                            setSelectedCallIds([...selectedCallIds, response.data.callId]);
                            const data = await getCallsByUsernameAndStatus(currentUser, "Pending Invoice");
                            setSelectedCallIds(data.map((call: { callId: number }) => call.callId));
                            setCalls(data);
                            setSuccessMessage("A new call has been recorded in the database.");
                            resetForm();
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
                }, 3000);
            }
        }
    };

    const resetForm = () => {
        setNewCall({
            startTime: moment().format("HH:mm:ss"), // Reset to current time
            endTime: "",
            discount: "",
            telephone: "",
            callDate: ""
        });
        setStartTime(moment().format("HH:mm:ss")); // Reset to current time
        setEndTime("");
        setDiscount("");
        setErrorMessage("");
    };

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (startTime.trim()) {
            errorsCopy.startTime = "";
        } else {
            errorsCopy.startTime = "Start time required";
            valid = false;
        }

        if (endTime.trim()) {
            errorsCopy.endTime = "";
        } else {
            errorsCopy.endTime = "End Time required";
            valid = false;
        }

        setErrors(errorsCopy);

        return valid;
    };

    const validateTimeRange = (start: string, end: string): boolean => {
        const startTimeMoment = moment(start, "HH:mm:ss");
        const endTimeMoment = moment(end, "HH:mm:ss");

        return endTimeMoment.isSameOrAfter(startTimeMoment);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
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
                                newCall={newCall}
                                user={currentUser}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Start Time"
                                placeholder="HH:mm:ss"
                                value={startTime}
                                onChange={handleStartTimeChange}
                                margin="normal"
                                error={!!errors.startTime}
                                helperText={errors.startTime}
                                inputProps={{ pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$" }} // HH:mm:ss format
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="End Time"
                                placeholder="HH:mm:ss"
                                value={endTime}
                                onChange={handleEndTimeChange}
                                margin="normal"
                                error={!!errors.endTime}
                                helperText={errors.endTime}
                                inputProps={{ pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$" }} // HH:mm:ss format
                            />
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
                        <Grid item xs={12} sm={12} sx={{ textAlign: 'center' }}>
                            <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                {errorMessage && (
                    <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                        {errorMessage}
                    </Typography>
                )}
                {successMessage && (
                    <Typography variant="body1" color="success" sx={{ mt: 2 }}>
                        {successMessage}
                    </Typography>
                )}
            </Card>

            <CallsTable userId={userId} status="Pending Invoice" />

            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" onClick={endCalls}>
                    End Calls
                </Button>
            </Grid>

            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Link to="/payment" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" color="secondary">
                        Proceed To Payment
                    </Button>
                </Link>
            </Grid>
        </Container>
    );
};

export default MakeCall;
*/
/*
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { checkPhoneNumberExists, enterCall, getCallsByUsernameAndStatus } from "../../services/CallService";
import CallReceiverSelector from "../common/CallReceiverSelector";
import { AuthContext } from "../auth/AuthProvider";
import CallsTable from "./CallsTable";
import { invoice } from "../../services/InvoiceService";
import { Container, Card, TextField, Button, Typography, Box, CircularProgress, Grid } from "@mui/material";

const MakeCall: React.FC = () => {
    const currentUser = localStorage.getItem("userId") || '';
    const [startTime, setStartTime] = useState<string>(moment().format("HH:mm:ss")); // Initialize with current time
    const [endTime, setEndTime] = useState<string>("");
    const [discount, setDiscount] = useState<number | string>("");
    const [selectedTelephoneNumber, setSelectedTelephoneNumber] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [selectedCallIds, setSelectedCallIds] = useState<number[]>([]);
    const [invoiceId, setInvoiceId] = useState<string>("");
    const [callDate, setCallDate] = useState(moment().format("DD/MM/YYYY"));
    const [loading, setLoading] = useState<boolean>(false);

    const [calls, setCalls] = useState([]);

    const [errors, setErrors] = useState({
        startTime: "",
        endTime: "",
        discount: "",
        callDate: "",
    });

    const userId = localStorage.getItem("userId") ?? '';
    const token = localStorage.getItem("token");
    const { isLoggedIn } = useContext(AuthContext);

    const [newCall, setNewCall] = useState({
        startTime: startTime,
        endTime: "",
        discount: "",
        telephone: "",
        callDate: "",
    });

    useEffect(() => {
        setTimeout(() => {
            getCallsByUsernameAndStatus(currentUser, "Pending Invoice").then((data) => {
                setSelectedCallIds(data.map((call: { callId: number }) => call.callId));
                setCalls(data);
                setLoading(false)
            }).catch((error) => {
                setErrorMessage(error.message)
                setLoading(false)
            });

        }, 1000);
       
    }, [currentUser]);

    if (loading) {
        return <div>Loading...</div>;
    }


    const createInvoice = async (callIds: number[]) => {
        const invoiceBody = {
            callIds
        };

        try {
            const response = await invoice(invoiceBody);
            return response.invoiceId;
        } catch (error) {
            console.error("Error creating invoice: ", error);
            throw error;
        }
    };

    const endCalls = async () => {
        if (selectedCallIds.length === 0) {
            console.error("No call IDs selected for invoice creation.");
            return;
        }
        try {
            const invoiceId = await createInvoice(selectedCallIds);
            setInvoiceId(invoiceId);
        } catch (error) {
            console.error("Error creating invoice:", error);
        }
    };

    const navigate = useNavigate();

    const handleTelephoneNumberInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedTelephoneNumber(value);
        setNewCall({ ...newCall, telephone: value });
    };

    const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value;
        setStartTime(time);
        setErrors({ ...errors, startTime: "" });
    };

    const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value;
        setEndTime(time);
        setErrors({ ...errors, endTime: "" });
    };

    const handleDiscountInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const discountValue = isNaN(parseFloat(value)) ? "" : parseFloat(value);
        setDiscount(discountValue);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (isLoggedIn()) {
            if (validateForm()) {
                if (!validateTimeRange(startTime, endTime)) {
                    setErrors({ ...errors, endTime: "End Time cannot be earlier than Start Time." });
                    return;
                }

                const call = {
                    startTime: startTime,
                    endTime: endTime,
                    discountForCalls: discount,
                    username: currentUser,
                    telephone: selectedTelephoneNumber,
                };

                try {
                    const isValid = await checkPhoneNumberExists(currentUser, selectedTelephoneNumber);
                    if (isValid) {
                        const response = await enterCall(call);
                        if (response && response.data && response.data.callId) {
                            setSelectedCallIds([...selectedCallIds, response.data.callId]);
                            const data = await getCallsByUsernameAndStatus(currentUser, "Pending Invoice");
                            setSelectedCallIds(data.map((call: { callId: number }) => call.callId));
                            setCalls(data); 
                            setSuccessMessage("A new call has been recorded in the database.");
                            resetForm();
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
                }, 3000);
            }
        }
    };

    const resetForm = () => {
        setNewCall({
            startTime: moment().format("HH:mm:ss"), // Reset to current time
            endTime: "",
            discount: "",
            telephone: "",
            callDate: ""
        });
        setStartTime(moment().format("HH:mm:ss")); // Reset to current time
        setEndTime("");
        setDiscount("");
        setErrorMessage("");
    };

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (startTime.trim()) {
            errorsCopy.startTime = "";
        } else {
            errorsCopy.startTime = "Start time required";
            valid = false;
        }

        if (endTime.trim()) {
            errorsCopy.endTime = "";
        } else {
            errorsCopy.endTime = "End Time required";
            valid = false;
        }

        //if (endTime <= startTime) {
          //  errorsCopy.endTime = "End Time must be greater than start time";
           // valid = false;
       // } else {
           // errorsCopy.endTime = "";
       // }

        setErrors(errorsCopy);

        return valid;
    };

    const validateTimeRange = (start: string, end: string): boolean => {
        const startTimeMoment = moment(start, "HH:mm:ss");
        const endTimeMoment = moment(end, "HH:mm:ss");

        return endTimeMoment.isSameOrAfter(startTimeMoment);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
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
                                newCall={newCall}
                                user={currentUser}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" gutterBottom>
                                Start Time: {startTime}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="End Time"
                                placeholder="HH:mm:ss"
                                value={endTime}
                                onChange={handleEndTimeChange}
                                margin="normal"
                                error={!!errors.endTime}
                                helperText={errors.endTime}
                                inputProps={{ pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$" }} // HH:mm:ss format
                            />
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
                        <Grid item xs={12} sm={12} sx={{ textAlign: 'center' }}>
                            <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                {errorMessage && (
                    <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                        {errorMessage}
                    </Typography>
                )}
                {successMessage && (
                    <Typography variant="body1" color="success" sx={{ mt: 2 }}>
                        {successMessage}
                    </Typography>
                )}
            </Card>

            <CallsTable userId={userId} status="Pending Invoice" />

            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" onClick={endCalls}>
                    End Calls
                </Button>
            </Grid>

            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Link to="/payment" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" color="secondary">
                        Proceed To Payment
                    </Button>
                </Link>
            </Grid>
        </Container>
    );
};

export default MakeCall;

* /


/*

import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { checkPhoneNumberExists, enterCall, getCallsByUsernameAndStatus } from "../../services/CallService";
import CallReceiverSelector from "../common/CallReceiverSelector";
import { AuthContext } from "../auth/AuthProvider";
import CallsTable from "./CallsTable";
import { invoice } from "../../services/InvoiceService";
import { Container, Card, TextField, Button, Typography, Box, CircularProgress, Grid } from "@mui/material";

const MakeCall: React.FC = () => {
    const currentUser = localStorage.getItem("userId") || '';
    const [startTime, setStartTime] = useState<string>(moment().format("HH:mm:ss")); // Initialize with current time
    const [endTime, setEndTime] = useState<string>("");
    const [discount, setDiscount] = useState<number | string>("");
    const [selectedTelephoneNumber, setSelectedTelephoneNumber] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [selectedCallIds, setSelectedCallIds] = useState<number[]>([]);
    const [invoiceId, setInvoiceId] = useState<string>("");
    const [callDate, setCallDate] = useState(moment().format("DD/MM/YYYY"));
    const [loading, setLoading] = useState<boolean>(true);
    const [errors, setErrors] = useState({
        startTime: "",
        endTime: "",
        discount: "",
        callDate: "",
    });

    const userId = localStorage.getItem("userId") ?? '';
    const token = localStorage.getItem("token");
    const { isLoggedIn } = useContext(AuthContext);

    const [newCall, setNewCall] = useState({
        startTime: startTime,
        endTime: "",
        discount: "",
        telephone: "",
        callDate: "",
    });
/*
    useEffect(() => {
        const fetchPendingCalls = async () => {
            try {
                const pendingCalls = await getCallsByUsernameAndStatus(currentUser, "Pending Invoice");
                setSelectedCallIds(pendingCalls.map((call: { callId: number }) => call.callId));
            } catch (error) {
                console.error("Error fetching pending calls:", error);
            }
        };

        fetchPendingCalls();
    }, [currentUser]);

    

    useEffect(() => {
       // const fetchPendingCalls = async () => {
            //try {
        setTimeout(() => {
            getCallsByUsernameAndStatus(currentUser, "Pending Invoice").then((data) => {
                setSelectedCallIds(data.map((call: { callId: number }) => call.callId)); 
                setLoading(false)
            }).catch((error) => {
                setErrorMessage(error.message) 
                setLoading(false)
            });
           
        }, 1000);
               // const pendingCalls = await getCallsByUsernameAndStatus(currentUser, "Pending Invoice");
                //setSelectedCallIds(pendingCalls.map((call: { callId: number }) => call.callId));
            //} catch (error) {
                //console.error("Error fetching pending calls:", error);
            //}
       // };

       //fetchPendingCalls();
    }, [currentUser]);

    if (loading) {
        return <CircularProgress />;
    }

    const createInvoice = async (callIds: number[]) => {
        const invoiceBody = {
            callIds
        };

        try {
            const response = await invoice(invoiceBody);
            return response.invoiceId;
        } catch (error) {
            console.error("Error creating invoice: ", error);
            throw error;
        }
    };

    const endCalls = async () => {
        if (selectedCallIds.length === 0) {
            console.error("No call IDs selected for invoice creation.");
            return;
        }
        try {
            const invoiceId = await createInvoice(selectedCallIds);
            setInvoiceId(invoiceId);
        } catch (error) {
            console.error("Error creating invoice:", error);
        }
    };

    const navigate = useNavigate();

    const handleTelephoneNumberInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setSelectedTelephoneNumber(value);
        setNewCall({ ...newCall, [name]: value });
    };

    const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value;
        setStartTime(time);
        // Clear previous error message when start time changes
        setErrors({ ...errors, startTime: "" });
    };

    const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value;
        setEndTime(time);
        // Clear previous error message when end time changes
        setErrors({ ...errors, endTime: "" });
    };

    const handleDiscountInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const discountValue = isNaN(parseFloat(value)) ? "" : parseFloat(value);
        setDiscount(discountValue);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (isLoggedIn()) {
            if (validateForm()) {
                const isValidTimeRange = validateTimeRange(startTime, endTime);
                if (!isValidTimeRange) {
                    setErrors({ ...errors, endTime: "End Time cannot be earlier than Start Time." });
                    return;
                }

                const call = {
                    startTime: startTime,
                    endTime: endTime,
                    discountForCalls: discount,
                    username: currentUser,
                    telephone: selectedTelephoneNumber,
                };

                try {
                    const isValid = await checkPhoneNumberExists(currentUser, selectedTelephoneNumber);
                    const response = await enterCall(call);
                    if (response && response.data && response.data.callId) {
                        setSelectedCallIds([...selectedCallIds, response.data.callId]);
                        setSuccessMessage("A new call has been recorded in the database.");
                        setNewCall({
                            startTime: moment().format("HH:mm:ss"), // Reset to current time
                            endTime: "",
                            discount: "",
                            telephone: "",
                            callDate: ""
                        });
                        setStartTime(moment().format("HH:mm:ss")); // Reset to current time
                        setEndTime("");
                        setDiscount("");
                        setErrorMessage("");
                    } else {
                        setErrorMessage("Error adding call to the database");
                    }
                } catch (error) {
                    setErrorMessage(error.message);
                }
                setTimeout(() => {
                    setSuccessMessage("");
                    setErrorMessage("");
                }, 3000);
            }
        }
    };

    function validateForm() {
        let valid = true;
        const errorsCopy = { ...errors };

        if (startTime.trim()) {
            errorsCopy.startTime = "";
        } else {
            errorsCopy.startTime = "Start time required";
            valid = false;
        }

        if (endTime.trim()) {
            errorsCopy.endTime = "";
        } else {
            errorsCopy.endTime = "End Time required";
            valid = false;
        }

        if (endTime <= startTime) {
            errorsCopy.endTime = "";
        } else {
            errorsCopy.endTime = "End Time must be greater than start time";
            valid = false;
        }
        setErrors(errorsCopy);

        return valid;
    }

    function validateTimeRange(start: string, end: string): boolean {
        const startTimeMoment = moment(start, "HH:mm:ss");
        const endTimeMoment = moment(end, "HH:mm:ss");

        return endTimeMoment.isSameOrAfter(startTimeMoment);
    }

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
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
                                newCall={newCall}
                                user={currentUser}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" gutterBottom>
                                Start Time: {startTime}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="End Time"
                                placeholder="HH:mm:ss"
                                value={endTime}
                                onChange={handleEndTimeChange}
                                margin="normal"
                                error={!!errors.endTime}
                                helperText={errors.endTime}
                                inputProps={{ pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$" }} // HH:mm:ss format
                            />
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
                        <Grid item xs={12} sm={12} sx={{ textAlign: 'center' }}>
                            <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                {errorMessage && (
                    <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                        {errorMessage}
                    </Typography>
                )}
            </Card>

            <CallsTable userId={userId} status="Pending Invoice" />

            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" onClick={endCalls}>
                    End Calls
                </Button>
            </Grid>

            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Link to="/payment" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" color="secondary">
                        Proceed To Payment
                    </Button>
                </Link>
            </Grid>
        </Container>
    );
};

export default MakeCall;
*/
/*
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { checkPhoneNumberExists, enterCall, getCallsByUsernameAndStatus } from "../../services/CallService";
import CallReceiverSelector from "../common/CallReceiverSelector";
import { AuthContext } from "../auth/AuthProvider";
import CallsTable from "./CallsTable";
import { invoice } from "../../services/InvoiceService";
import { Container, Card, TextField, Button, Typography, Box, CircularProgress, Grid } from "@mui/material";

const MakeCall: React.FC = () => {
    const currentUser = localStorage.getItem("userId") || '';
    const [startTime, setStartTime] = useState<string>(moment().format("HH:mm:ss")); // Initialize with current time
    const [endTime, setEndTime] = useState<string>("");
    const [discount, setDiscount] = useState<number | string>("");
    const [selectedTelephoneNumber, setSelectedTelephoneNumber] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [selectedCallIds, setSelectedCallIds] = useState<number[]>([]);
    const [invoiceId, setInvoiceId] = useState<string>("");
    const [callDate, setCallDate] = useState(moment().format("DD/MM/YYYY"));
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState({
        startTime: "",
        endTime: "",
        discount: "",
        callDate: "",
    });

    const userId = localStorage.getItem("userId") ?? '';
    const token = localStorage.getItem("token");
    const { isLoggedIn } = useContext(AuthContext);

    const [newCall, setNewCall] = useState({
        startTime: startTime,
        endTime: "",
        discount: "",
        telephone: "",
        callDate: "",
    });

    useEffect(() => {
        const fetchPendingCalls = async () => {
            try {
                const pendingCalls = await getCallsByUsernameAndStatus(currentUser, "Pending Invoice");
                setSelectedCallIds(pendingCalls.map((call: { callId: number }) => call.callId));
            } catch (error) {
                console.error("Error fetching pending calls:", error);
            }
        };

        fetchPendingCalls();
    }, [currentUser]);

    if (loading) {
        return <CircularProgress />;
    }

    const createInvoice = async (callIds: number[]) => {
        const invoiceBody = {
            callIds
        };

        try {
            const response = await invoice(invoiceBody);
            return response.invoiceId;
        } catch (error) {
            console.error("Error creating invoice: ", error);
            throw error;
        }
    };

    const endCalls = async () => {
        if (selectedCallIds.length === 0) {
            console.error("No call IDs selected for invoice creation.");
            return;
        }
        try {
            const invoiceId = await createInvoice(selectedCallIds);
            setInvoiceId(invoiceId);
        } catch (error) {
            console.error("Error creating invoice:", error);
        }
    };

    const navigate = useNavigate();

    const handleTelephoneNumberInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setSelectedTelephoneNumber(value);
        setNewCall({ ...newCall, [name]: value });
    };

    const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value;
        setStartTime(time);
    };

    const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value;
        setEndTime(time);
    };

    const handleDiscountInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const discountValue = isNaN(parseFloat(value)) ? "" : parseFloat(value);
        setDiscount(discountValue);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (isLoggedIn()) {
            if (validateForm()) {
                const isValidTimeRange = validateTimeRange(startTime, endTime);
                if (!isValidTimeRange) {
                    setErrorMessage("End Time cannot be earlier than Start Time.");
                    return;
                }

                const call = {
                    startTime: startTime,
                    endTime: endTime,
                    discountForCalls: discount,
                    username: currentUser,
                    telephone: selectedTelephoneNumber,
                };

                try {
                    const isValid = await checkPhoneNumberExists(currentUser, selectedTelephoneNumber);
                    const response = await enterCall(call);
                    if (response && response.data && response.data.callId) {
                        setSelectedCallIds([...selectedCallIds, response.data.callId]);
                        setSuccessMessage("A new call has been recorded in the database.");
                        setNewCall({
                            startTime: moment().format("HH:mm:ss"), // Reset to current time
                            endTime: "",
                            discount: "",
                            telephone: "",
                            callDate: ""
                        });
                        setStartTime(moment().format("HH:mm:ss")); // Reset to current time
                        setEndTime("");
                        setDiscount("");
                        setErrorMessage("");
                    } else {
                        setErrorMessage("Error adding call to the database");
                    }
                } catch (error) {
                    setErrorMessage(error.message);
                }
                setTimeout(() => {
                    setSuccessMessage("");
                    setErrorMessage("");
                }, 3000);
            }
        }
    };

    function validateForm() {
        let valid = true;
        const errorsCopy = { ...errors };

        if (startTime.trim()) {
            errorsCopy.startTime = "";
        } else {
            errorsCopy.startTime = "Start time required";
            valid = false;
        }

        if (endTime.trim()) {
            errorsCopy.endTime = "";
        } else {
            errorsCopy.endTime = "End Time required";
            valid = false;
        }
        setErrors(errorsCopy);

        return valid;
    }

    function validateTimeRange(start: string, end: string): boolean {
        const startTimeMoment = moment(start, "HH:mm:ss");
        const endTimeMoment = moment(end, "HH:mm:ss");

        return endTimeMoment.isSameOrAfter(startTimeMoment);
    }

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
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
                                newCall={newCall}
                                user={currentUser}
                            />
                        </Grid>
                        </Grid> 
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" gutterBottom>
                                Start Time: {startTime}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="End Time"
                                placeholder="HH:mm:ss"
                                value={endTime}
                                onChange={handleEndTimeChange}
                                margin="normal"
                                error={!!errors.endTime}
                                helperText={errors.endTime}
                                inputProps={{ pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$" }} // HH:mm:ss format
                            />
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
                        <Grid item xs={12} sm={12} sx={{ textAlign: 'center' }}>
                            <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Card>

            <CallsTable userId={userId} status="Pending Invoice" />

            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" onClick={endCalls}>
                    End Calls
                </Button>
            </Grid>

            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Link to="/payment" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" color="secondary">
                        Proceed To Payment
                    </Button>
                </Link>
            </Grid>
        </Container>
    );
};

export default MakeCall;

*/
/*import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { checkPhoneNumberExists, enterCall, getCallsByUsernameAndStatus } from "../../services/CallService";
import CallReceiverSelector from "../common/CallReceiverSelector";
import { AuthContext } from "../auth/AuthProvider";
import CallsTable from "./CallsTable";
import { invoice } from "../../services/InvoiceService";
import { Container, Card, TextField, Button, Typography, Box, CircularProgress, Grid } from "@mui/material";

const MakeCall: React.FC = () => {
    const currentUser = localStorage.getItem("userId") || '';
    const [startTime, setStartTime] = useState<string>(moment().format("HH:mm:ss")); // Initialize with current time
    const [endTime, setEndTime] = useState<string>("");
    const [discount, setDiscount] = useState<number | string>("");
    const [selectedTelephoneNumber, setSelectedTelephoneNumber] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [selectedCallIds, setSelectedCallIds] = useState<number[]>([]);
    const [invoiceId, setInvoiceId] = useState<string>("");
    const [callDate, setCallDate] = useState(moment().format("DD/MM/YYYY"));
    const [loading, setLoading] = useState<boolean>(false);

    const userId = localStorage.getItem("userId") ?? '';
    const token = localStorage.getItem("token");
    const { isLoggedIn } = useContext(AuthContext);

    const [newCall, setNewCall] = useState({
        startTime: startTime,
        endTime: "",
        discount: "",
        telephone: "",
        callDate: "",
    });

    const [errors, setErrors] = useState({
        startTime: "",
        endTime: "",
        discount: "",
        callDate: "",
    });

    useEffect(() => {
        const fetchPendingCalls = async () => {
            try {
                const pendingCalls = await getCallsByUsernameAndStatus(currentUser, "Pending Invoice");
                setSelectedCallIds(pendingCalls.map((call: { callId: number }) => call.callId));
            } catch (error) {
                console.error("Error fetching pending calls:", error);
            }
        };

        fetchPendingCalls();
    }, [currentUser]);

    if (loading) {
        return <CircularProgress />;
    }

    const createInvoice = async (callIds: number[]) => {
        const invoiceBody = {
            callIds
        };

        try {
            const response = await invoice(invoiceBody);
            return response.invoiceId;
        } catch (error) {
            console.error("Error creating invoice: ", error);
            throw error;
        }
    };

    const endCalls = async () => {
        if (selectedCallIds.length === 0) {
            console.error("No call IDs selected for invoice creation.");
            return;
        }
        try {
            const invoiceId = await createInvoice(selectedCallIds);
            setInvoiceId(invoiceId);
        } catch (error) {
            console.error("Error creating invoice:", error);
        }
    };

    const navigate = useNavigate();

    const handleTelephoneNumberInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setSelectedTelephoneNumber(value);
        setNewCall({ ...newCall, [name]: value });
    };

    const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value;
        setStartTime(time);
    };

    const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value;
        setEndTime(time);
    };

    const handleDiscountInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const discountValue = isNaN(parseFloat(value)) ? "" : parseFloat(value);
        setDiscount(discountValue);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (isLoggedIn()) {
            if (validateForm()) {
                const call = {
                    startTime: startTime,
                    endTime: endTime,
                    discountForCalls: discount,
                    username: currentUser,
                    telephone: selectedTelephoneNumber,
                };

                try {
                    const isValid = await checkPhoneNumberExists(currentUser, selectedTelephoneNumber);
                    const response = await enterCall(call);
                    if (response && response.data && response.data.callId) {
                        setSelectedCallIds([...selectedCallIds, response.data.callId]);
                        setSuccessMessage("A new call has been recorded in the database.");
                        setNewCall({
                            startTime: moment().format("HH:mm:ss"), // Reset to current time
                            endTime: "",
                            discount: "",
                            telephone: "",
                            callDate: ""
                        });
                        setStartTime(moment().format("HH:mm:ss")); // Reset to current time
                        setEndTime("");
                        setDiscount("");
                        setErrorMessage("");
                    } else {
                        setErrorMessage("Error adding call to the database");
                    }
                } catch (error) {
                    setErrorMessage(error.message);
                }
                setTimeout(() => {
                    setSuccessMessage("");
                    setErrorMessage("");
                }, 3000);
            }
        }
    };

    function validateForm() {
        let valid = true;
        const errorsCopy = { ...errors };

        if (startTime.trim()) {
            errorsCopy.startTime = "";
        } else {
            errorsCopy.startTime = "Start time required";
            valid = false;
        }

        if (endTime.trim()) {
            errorsCopy.endTime = "";
        } else {
            errorsCopy.endTime = "End Time required";
            valid = false;
        }
        setErrors(errorsCopy);

        return valid;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
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
                                newCall={newCall}
                                user={currentUser}
                            />
                        </Grid>
                        </Grid>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" gutterBottom>
                                Start Time: {startTime}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="End Time"
                                placeholder="HH:mm:ss"
                                value={endTime}
                                onChange={handleEndTimeChange}
                                margin="normal"
                                error={!!errors.endTime}
                                helperText={errors.endTime}
                                inputProps={{ pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$" }} // HH:mm:ss format
                            />
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
                        <Grid item xs={12} sm={12} sx={{ textAlign: 'center' }}>
                            <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Card>

            <CallsTable userId={userId} status="Pending Invoice" />

            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" onClick={endCalls}>
                    End Calls
                </Button>
            </Grid>

            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Link to="/payment" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" color="secondary">
                        Proceed To Payment
                    </Button>
                </Link>
            </Grid>
        </Container>
    );
};

export default MakeCall;
*/

/*import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { checkPhoneNumberExists, enterCall, getCallsByUsernameAndStatus } from "../../services/CallService";
import CallReceiverSelector from "../common/CallReceiverSelector";
import { AuthContext } from "../auth/AuthProvider";
import CallsTable from "./CallsTable";
import { invoice } from "../../services/InvoiceService";
import { Container, Card, TextField, Button, Typography, Box, CircularProgress, Grid } from "@mui/material";

const MakeCall: React.FC = () => {
    const currentUser = localStorage.getItem("userId") || '';
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [discount, setDiscount] = useState<number | string>("");
    const [selectedTelephoneNumber, setSelectedTelephoneNumber] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [selectedCallIds, setSelectedCallIds] = useState<number[]>([]);
    const [invoiceId, setInvoiceId] = useState<string>("");
    const [callDate, setCallDate] = useState(moment().format("DD/MM/YYYY"));
    const [loading, setLoading] = useState<boolean>(false);

    const userId = localStorage.getItem("userId") ?? '';
    const token = localStorage.getItem("token");
    const { isLoggedIn } = useContext(AuthContext);

    const [newCall, setNewCall] = useState({
        startTime: "",
        endTime: "",
        discount: "",
        telephone: "",
        callDate: "",
    });

    const [errors, setErrors] = useState({
        startTime: "",
        endTime: "",
        discount: "",
        callDate: "",
    });

    useEffect(() => {
        const fetchPendingCalls = async () => {
            try {
                const pendingCalls = await getCallsByUsernameAndStatus(currentUser, "Pending Invoice");
                setSelectedCallIds(pendingCalls.map((call: { callId: number }) => call.callId));
            } catch (error) {
                console.error("Error fetching pending calls:", error);
            }
        };

        fetchPendingCalls();
    }, [currentUser]);

    if (loading) {
        return <CircularProgress />;
    }

    const createInvoice = async (callIds: number[]) => {
        const invoiceBody = {
            callIds
        };

        try {
            const response = await invoice(invoiceBody);
            return response.invoiceId;
        } catch (error) {
            console.error("Error creating invoice: ", error);
            throw error;
        }
    };

    const endCalls = async () => {
        if (selectedCallIds.length === 0) {
            console.error("No call IDs selected for invoice creation.");
            return;
        }
        try {
            const invoiceId = await createInvoice(selectedCallIds);
            setInvoiceId(invoiceId);
        } catch (error) {
            console.error("Error creating invoice:", error);
        }
    };

    const navigate = useNavigate();

    const handleTelephoneNumberInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setSelectedTelephoneNumber(value);
        setNewCall({ ...newCall, [name]: value });
    };

    const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value;
        setStartTime(time);
    };

    const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time = event.target.value;
        setEndTime(time);
    };

    const handleDiscountInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const discountValue = isNaN(parseFloat(value)) ? "" : parseFloat(value);
        setDiscount(discountValue);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (isLoggedIn()) {
            if (validateForm()) {
                const call = {
                    startTime: startTime,
                    endTime: endTime,
                    discountForCalls: discount,
                    username: currentUser,
                    telephone: selectedTelephoneNumber,
                };

                try {
                    const isValid = await checkPhoneNumberExists(currentUser, selectedTelephoneNumber);
                    const response = await enterCall(call);
                    if (response && response.data && response.data.callId) {
                        setSelectedCallIds([...selectedCallIds, response.data.callId]);
                        setSuccessMessage("A new call has been recorded in the database.");
                        setNewCall({
                            startTime: "",
                            endTime: "",
                            discount: "",
                            telephone: "",
                            callDate: ""
                        });
                        setStartTime("");
                        setEndTime("");
                        setDiscount("");
                        setErrorMessage("");
                    } else {
                        setErrorMessage("Error adding call to the database");
                    }
                } catch (error) {
                    setErrorMessage(error.message);
                }
                setTimeout(() => {
                    setSuccessMessage("");
                    setErrorMessage("");
                }, 3000);
            }
        }
    };

    function validateForm() {
        let valid = true;
        const errorsCopy = { ...errors };

        if (startTime.trim()) {
            errorsCopy.startTime = "";
        } else {
            errorsCopy.startTime = "Start time required";
            valid = false;
        }

        if (endTime.trim()) {
            errorsCopy.endTime = "";
        } else {
            errorsCopy.endTime = "End Time required";
            valid = false;
        }
        setErrors(errorsCopy);

        return valid;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
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
                                newCall={newCall}
                                user={currentUser}
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
                                onChange={handleStartTimeChange}
                                margin="normal"
                                error={!!errors.startTime}
                                helperText={errors.startTime}
                                inputProps={{ pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$" }} // HH:mm:ss format
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="End Time"
                                placeholder="HH:mm:ss"
                                value={endTime}
                                onChange={handleEndTimeChange}
                                margin="normal"
                                error={!!errors.endTime}
                                helperText={errors.endTime}
                                inputProps={{ pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$" }} // HH:mm:ss format
                            />
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
                        <Grid item xs={12} sm={12} sx={{ textAlign: 'center' }}>
                            <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Card>

            <CallsTable userId={userId} status="Pending Invoice" />

            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" onClick={endCalls}>
                    End Calls
                </Button>
            </Grid>

            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Link to="/payment" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" color="secondary">
                        Proceed To Payment
                    </Button>
                </Link>
            </Grid>
        </Container>
    );
};

export default MakeCall;

*/
/*
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { checkPhoneNumberExists, enterCall, getCallsByUsernameAndStatus } from "../../services/CallService";
import CallReceiverSelector from "../common/CallReceiverSelector";
import { AuthContext } from "../auth/AuthProvider";
import CallsTable from "./CallsTable";
import { invoice } from "../../services/InvoiceService";
import { Container, Card, TextField, Button, Typography, Box, CircularProgress } from "@mui/material";

const MakeCall: React.FC = () => {
    const currentUser = localStorage.getItem("userId") || '';
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [discount, setDiscount] = useState<number>(0);
    const [selectedTelephoneNumber, setSelectedTelephoneNumber] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [selectedCallIds, setSelectedCallIds] = useState<number[]>([]);
    const [invoiceId, setInvoiceId] = useState<string>("");
    const [callDate, setCallDate] = useState(moment().format("DD/MM/YYYY"));
    const [loading, setLoading] = useState<boolean>(false);

    const userId = localStorage.getItem("userId") ?? '';
    const token = localStorage.getItem("token");
    const { isLoggedIn } = useContext(AuthContext);

    const [newCall, setNewCall] = useState({
        startTime: "",
        endTime: "",
        discount: "",
        telephone: "",
        callDate: "",
    });

    const [errors, setErrors] = useState({
        startTime: "",
        endTime: "",
        discount: "",
        callDate: "",
    });

    useEffect(() => {
        const fetchPendingCalls = async () => {
            try {
                const pendingCalls = await getCallsByUsernameAndStatus(currentUser, "Pending Invoice");
                setSelectedCallIds(pendingCalls.map((call: { callId: number }) => call.callId));
            } catch (error) {
                console.error("Error fetching pending calls:", error);
            }
        };

        fetchPendingCalls();
    }, [currentUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const createInvoice = async (callIds: number[]) => {
        const invoiceBody = {
            callIds
        };

        try {
            const response = await invoice(invoiceBody);
            return response.invoiceId;
        } catch (error) {
            console.error("Error creating invoice: ", error);
            throw error;
        }
    };

    const endCalls = async () => {
        if (selectedCallIds.length === 0) {
            console.error("No call IDs selected for invoice creation.");
            return;
        }
        try {
            const invoiceId = await createInvoice(selectedCallIds);
            setInvoiceId(invoiceId);
        } catch (error) {
            console.error("Error creating invoice:", error);
        }
    };

    const navigate = useNavigate();

    const handleTelephoneNumberInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setSelectedTelephoneNumber(value);
        setNewCall({ ...newCall, [name]: value });
    };

    const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStartTime(event.target.value);
    };

    const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEndTime(event.target.value);
    };

    const handleDiscountInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDiscount(parseFloat(event.target.value));
    };

    const handleCallDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCallDate(e.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (isLoggedIn()) {
            if (validateForm()) {
                const call = {
                    startTime: startTime,
                    endTime: endTime,
                    discountForCalls: discount,
                    username: currentUser,
                    telephone: selectedTelephoneNumber,
                };

                try {
                    const isValid = await checkPhoneNumberExists(currentUser, selectedTelephoneNumber);
                    const response = await enterCall(call);
                    if (response && response.data && response.data.callId) {
                        setSelectedCallIds([...selectedCallIds, response.data.callId]);
                        setSuccessMessage("A new call has been recorded in the database.");
                        setNewCall({
                            startTime: "",
                            endTime: "",
                            discount: "",
                            telephone: "",
                            callDate: ""
                        });
                        setStartTime("");
                        setEndTime("");
                        setDiscount(0);
                        setErrorMessage("");
                    } else {
                        setErrorMessage("Error adding call to the database");
                    }
                } catch (error) {
                    setErrorMessage(error.message);
                }
                setTimeout(() => {
                    setSuccessMessage("");
                    setErrorMessage("");
                }, 3000);
            }
        }
    };

    function validateForm() {
        let valid = true;
        const errorsCopy = { ...errors };

        if (startTime.trim()) {
            errorsCopy.startTime = "";
        } else {
            errorsCopy.startTime = "Start time required";
            valid = false;
        }

        if (endTime.trim()) {
            errorsCopy.endTime = "";
        } else {
            errorsCopy.endTime = "End Time required";
            valid = false;
        }
        setErrors(errorsCopy);

        return valid;
    }

    return (
        <Container maxWidth="sm">
            <Card variant="outlined" sx={{ mt: 5, p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    New Call
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
                    <TextField
                        fullWidth
                        label="Call Date"
                        value={callDate}
                        onChange={handleCallDateChange}
                        margin="normal"
                        error={!!errors.callDate}
                        helperText={errors.callDate}
                    />
                    <CallReceiverSelector
                        handleTelephoneNumberInputChange={handleTelephoneNumberInputChange}
                        newCall={newCall}
                        user={currentUser}
                    />
                    <TextField
                        fullWidth
                        label="Start Time"
                        placeholder="Enter start time (HH:mm:ss)"
                        value={startTime}
                        onChange={handleStartTimeChange}
                        margin="normal"
                        error={!!errors.startTime}
                        helperText={errors.startTime}
                    />
                    <TextField
                        fullWidth
                        label="End Time"
                        placeholder="Enter end time (HH:mm:ss)"
                        value={endTime}
                        onChange={handleEndTimeChange}
                        margin="normal"
                        error={!!errors.endTime}
                        helperText={errors.endTime}
                    />
                    <TextField
                        fullWidth
                        label="Discount (%)"
                        placeholder="Enter discount"
                        value={discount}
                        onChange={handleDiscountInputChange}
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                        Submit
                    </Button>
                </Box>
                {loading && <CircularProgress />}
                <CallsTable userId={userId} status="Pending Invoice" />
                <Button variant="contained" color="primary" onClick={endCalls} sx={{ mt: 2 }}>
                    End Calls
                </Button>
                <Link to="/payment" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" color="secondary" sx={{ mt: 2 }}>
                        Proceed To Payment
                    </Button>
                </Link>
            </Card>
        </Container>
    );
};

export default MakeCall;
*/

/*
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { checkPhoneNumberExists, enterCall, getCallsByUsernameAndStatus } from "../../services/CallService";
import CallReceiverSelector from "../common/CallReceiverSelector";
import { AuthContext } from "../auth/AuthProvider";
import CallsTable from "./CallsTable";
import { invoice } from "../../services/InvoiceService";

const MakeCall: React.FC = () => {
    const currentUser = localStorage.getItem("userId") || '';
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [discount, setDiscount] = useState<number>(0);
    const [selectedTelephoneNumber, setSelectedTelephoneNumber] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [selectedCallIds, setSelectedCallIds] = useState<number[]>([]);
    const [invoiceId, setInvoiceId] = useState<string>("");
    const [callDate, setCallDate] = useState(moment().format("DD/MM/YYYY"));
    const [loading, setLoading] = useState<boolean>(false);

    const userId = localStorage.getItem("userId") ?? '';
    const token = localStorage.getItem("token");
    const { isLoggedIn } = useContext(AuthContext);

    const [newCall, setNewCall] = useState({
        startTime: "",
        endTime: "",
        discount: "",
        telephone: "",
        callDate: "",
    });

    const [errors, setErrors] = useState({
        startTime: "",
        endTime: "",
        discount: "",
        callDate: "",
    });
    

    useEffect(() => {
        const fetchPendingCalls = async () => {
            try {
                //setLoading(true)
                const pendingCalls = await getCallsByUsernameAndStatus(currentUser, "Pending Invoice");
                setSelectedCallIds(pendingCalls.map((call: { callId: number }) => call.callId));
            } catch (error) {
                console.error("Error fetching pending calls:", error);
            }finally{
               // setLoading(false)
            }
        };

        fetchPendingCalls();
    }, [currentUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const createInvoice = async (callIds: number[]) => {
        const invoiceBody = {
            callIds
        };

        try {
            const response = await invoice(invoiceBody);
            return response.invoiceId;
        } catch (error) {
            console.error("Error creating invoice: ", error);
            throw error;
        }
    };

    const endCalls = async () => {
        if (selectedCallIds.length === 0) {
            console.error("No call IDs selected for invoice creation.");
            return;
        }
        try {
            const invoiceId = await createInvoice(selectedCallIds);
            setInvoiceId(invoiceId);
        } catch (error) {
            console.error("Error creating invoice:", error);
        }
    };
    const selectedCallIdsMapped = selectedCallIds.map((callId) => ({
        callId: callId,
    }));

    const navigate = useNavigate();

    const handleTelephoneNumberInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setSelectedTelephoneNumber(value);
        setNewCall({ ...newCall, [name]: value });
    };

    const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStartTime(event.target.value);
    };

    const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEndTime(event.target.value);
    };

    const handleDiscountInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDiscount(parseFloat(event.target.value));
    };

    const handleCallDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCallDate(e.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (isLoggedIn()) {
            if (validateForm()) {
                const call = {
                    startTime: startTime,
                    endTime: endTime,
                    discountForCalls: discount,
                    username: currentUser,
                    telephone: selectedTelephoneNumber,
                };

                try {
                    const isValid = await checkPhoneNumberExists(currentUser, selectedTelephoneNumber);
                    const response = await enterCall(call);
                    if (response && response.data && response.data.callId) {
                        setSelectedCallIds([...selectedCallIds, response.data.callId]);
                        setSuccessMessage("A new call has been recorded in the database.");
                        setNewCall({
                            startTime: "",
                            endTime: "",
                            discount: "",
                            telephone: "",
                            callDate: ""
                        });
                        setStartTime("");
                        setEndTime("");
                        setDiscount(0);
                        setErrorMessage("");
                    } else {
                        setErrorMessage("Error adding call to the database");
                    }
                } catch (error) {
                    setErrorMessage(error.message);
                }
                setTimeout(() => {
                    setSuccessMessage("");
                    setErrorMessage("");
                }, 3000);
            }
        }
    };

    function validateForm() {
        let valid = true;
        const errorsCopy = { ...errors };

        if (startTime.trim()) {
            errorsCopy.startTime = "";
        } else {
            errorsCopy.startTime = "Start time required"

            valid = false;
        }

        if (endTime.trim()) {
            errorsCopy.endTime = "";
        } else {
            errorsCopy.endTime = "End Time required";
            valid = false;
        }
        setErrors(errorsCopy);

        return valid;
    }

    return (
        <div className="container">
            <br /> <br />
            <div className="row">
                <div className="card col-md-6 offset-md-3 offset-md-3">
                    <h2 className="text-center">New call</h2>

                    <div className="form-group mb-2">
                        <label className="form-label">Call Date</label>
                        <input
                            type="text"
                            name="callDate"
                            value={callDate}
                            className={`form-control ${errors.callDate ? "is-invalid" : ""}`}
                            onChange={handleCallDateChange}
                        />
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-2">
                                <label className="form-label">Call Receiver phone number</label>
                                <div>
                                    <CallReceiverSelector
                                        handleTelephoneNumberInputChange={handleTelephoneNumberInputChange}
                                        newCall={newCall}
                                        user={currentUser}
                                    />
                                </div>
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label">Start Time</label>
                                <input
                                    type="text"
                                    placeholder="Enter start time (HH:mm:ss)"
                                    name="startTime"
                                    value={startTime}
                                    className={`form-control ${errors.startTime ? "is-invalid" : ""}`}
                                    onChange={handleStartTimeChange}
                                />
                                {errors.startTime && <div className="invalid-feedback">{errors.startTime}</div>}
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label">End Time</label>
                                <input
                                    type="text"
                                    placeholder="Enter end time (HH:mm:ss)"
                                    name="endTime"
                                    value={endTime}
                                    className={`form-control ${errors.endTime ? "is-invalid" : ""}`}
                                    onChange={handleEndTimeChange}
                                />
                                {errors.endTime && <div className="invalid-feedback">{errors.endTime}</div>}
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label">Discount (%)</label>
                                <input
                                    type="text"
                                    placeholder="Enter discount"
                                    name="discount"
                                    value={discount}
                                    className="form-control"
                                    onChange={handleDiscountInputChange}
                                />
                            </div>
                            <button type="submit" className='btn-otc btn-otc:hover'>
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <CallsTable userId={userId} status="Pending Invoice" />

            <div>When finished, click the button below to end Calls</div>
            <button className='btn-otc btn-otc:hover' onClick={endCalls}>
                End Calls
            </button>
            <div>
                <br />
            </div>
            <Link to="/payment" className="mb-2 md-mb-0">
                Proceed To Payment
            </Link>
        </div>

    );
};

export default MakeCall;
*/