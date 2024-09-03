import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCalls } from '';
import { invoice } from './services/InvoiceService';

const InvoiceComp: React.FC = () => {
    const [selectedCallIds, setSelectedCallIds] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const dispatch = useDispatch();
    const [activeCalls, setActiveCalls] = useState<Call[]>([]); // Assuming you have a Call type

    const createInvoice = async () => {
        const invoiceBody = { callIds: selectedCallIds };
        try {
            const response = await invoice(invoiceBody); // API call
            const invoiceNumber = response.invoiceNumber; // Extract invoice number

            setSuccessMessage(`Invoice ${invoiceNumber} created successfully.`);
            setSelectedCallIds([]);
            dispatch(setCallsAction([]));
            setActiveCalls([]);
        } catch (error) {
            setErrorMessage("Error creating invoice.");
        }
    };

    return (
        <div>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {/* Your component UI here */}
            <button onClick={createInvoice}>Create Invoice</button>
        </div>
    );
};

export default InvoiceComp;
