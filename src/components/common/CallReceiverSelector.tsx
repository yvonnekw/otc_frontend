import React, { useEffect, useState } from 'react';
import { getTelephoneNumbers } from '../../services/CallReceiverService';
import NewTelephoneNumberForm from '../calls/NewTelephoneNumberForm';

interface CallReceiverSelectorProps {
    handleTelephoneNumberInputChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    newCall: {
        telephone: string;
    };
    user: string;
}

const CallReceiverSelector: React.FC<CallReceiverSelectorProps> = ({ handleTelephoneNumberInputChange, newCall, user }) => {
    const [telephoneNumbers, setTelephoneNumbers] = useState<string[]>([]);
    const [showNewTelephoneNumberForm, setShowNewTelephoneNumberForm] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getTelephoneNumbers(user); 
                setTelephoneNumbers(response);
            } catch (error) {
                console.error('Error fetching phone numbers:', error);
            }
        };
        fetchData();
    }, [showNewTelephoneNumberForm, user]); 

    const handleAddNewTelephoneNumber = () => {
        setShowNewTelephoneNumberForm(false);
    };

    return (
        <div>
            <select
                id='telephone'
                name='telephone'
                value={newCall.telephone}
                onChange={handleTelephoneNumberInputChange}
            >
                <option value=''>Select a call receiver phone number</option>
                {telephoneNumbers.map((telephone, index) => (
                    <option key={index} value={telephone}>
                        {telephone}
                    </option>
                ))}
            </select>
            {showNewTelephoneNumberForm ? (
                <NewTelephoneNumberForm user={user} onSuccess={handleAddNewTelephoneNumber} /> // Pass user to the form
            ) : (
                <button className='btn btn-success' onClick={() => setShowNewTelephoneNumberForm(true)}>
                    Add New Telephone Number
                </button>
            )}
        </div>
    );
};

export default CallReceiverSelector;
