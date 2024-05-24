import React, { useEffect } from 'react'
import { useState } from 'react'
import { getTelephoneNumbers } from '../../services/CallReceiverService'
import NewTelephoneNumberForm from '../calls/NewTelephoneNumberForm';

interface CallReceiverSelectorProps {
    handleTelephoneNumberInputChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    newCall: {
        telephone: string;
    };
}

const CallReceiverSelector: React.FC<CallReceiverSelectorProps> = ({ handleTelephoneNumberInputChange, newCall }) => {
    const [telephoneNumbers, setTelephoneNumbers] = useState<string[]>([]);
    const [showNewTelephoneNumberForm, setShowNewTelephoneNumberForm] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getTelephoneNumbers('yodalpinky1'); 
                setTelephoneNumbers(response);
            } catch (error) {
                console.error('Error fetching phone numbers:', error);
            }
        };
        fetchData();
    }, [showNewTelephoneNumberForm]);

    const handleAddNewTelephoneNumber = async () => {
        setShowNewTelephoneNumberForm(false); 
    };

    return (
        <div>
            <select
                id='telephone'
                name='telephone'
                value={newCall.telephone}
                onChange={handleTelephoneNumberInputChange}>
                <option value=''>Select a call receiver phone number</option>
                {telephoneNumbers.map((telephone, index) => (
                    <option key={index} value={telephone}>
                        {telephone}
                    </option>
                ))}
            </select>
            {showNewTelephoneNumberForm ? (
                <NewTelephoneNumberForm onSuccess={handleAddNewTelephoneNumber} />
            ) : (
                <button className='btn btn-success' onClick={() => setShowNewTelephoneNumberForm(true)}>Add New Telephone Number</button>
            )}
        </div>
    );
};

export default CallReceiverSelector;
