import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { checkPhoneNumberExists, enterCall, getCallsByUsernameAndStatus } from "../../services/CallService";
import createInvoice from "../invoice/CreateInvoice";
import CallReceiverSelector from "../common/CallReceiverSelector";
import { AuthContext } from "../auth/AuthProvider";
import CallsTable from "./CallsTable";

const MakeCall: React.FC = () => {
    const currentUser = localStorage.getItem("userId") || '';
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [discount, setDiscount] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number>(0);
    const [netCost, setNetCost] = useState<number>(0);
    const [selectedTelephoneNumber, setSelectedTelephoneNumber] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [calls, setCalls] = useState<any[]>([]);
    const [totalBill, setTotalBill] = useState<number>(0);
    const [selectedCallIds, setSelectedCallIds] = useState<string[]>([]);
    const [invoiceId, setInvoiceId] = useState<string>("");
    const [callDate, setCallDate] = useState(moment().format("DD/MM/YYYY"));

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

    const calculateBill = () => {
        let billAmount = 0;
        calls.forEach((call) => {
            billAmount += parseFloat(call.netCost);
        });

        setTotalBill(parseFloat(billAmount.toFixed(2)));

        createInvoice(totalBill, calls).then((invoiceId) => {
            setInvoiceId(invoiceId);

            let totalNetCost = 0;
            calls.forEach((call) => {
                if (selectedCallIds.includes(call.callId)) {
                    totalNetCost += parseFloat(call.netCost);
                }
            });

            setNetCost(parseFloat(totalNetCost.toFixed(2)));

        });
    };

    const selectedCallIdsMapped = selectedCallIds.map((callId) => ({
        callId: callId,
    }));

    const navigate = useNavigate();

    const handleProceedToPayment = () => {
        navigate(`/payment?userId=${userId}&netCost=${netCost}&invoiceId=${invoiceId}`);
    };

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
                    totalCost: totalCost,
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
                            <button type="submit" className="btn btn-success">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <CallsTable userId={userId} status="Pending Invoice" />

            <div>Total Bill Amount: £{totalBill}</div>
            <button className="btn btn-success" onClick={calculateBill}>
                Calculate Bill
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
