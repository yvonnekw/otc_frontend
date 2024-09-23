import React, { useEffect, useState } from 'react';
import { getCallReceiverDetails, CallReceiver } from '../../services/CallReceiverService';
import { Autocomplete, TextField, Button, Box } from '@mui/material';
import NewTelephoneNumberForm from './NewTelephoneNumberForm';

interface CallReceiverSelectorProps {
    handleTelephoneNumberInputChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    newCall: {
        telephone: string;
    };
    user: string;
}

const CallReceiverSelector: React.FC<CallReceiverSelectorProps> = ({ handleTelephoneNumberInputChange, newCall, user }) => {
    const [callReceivers, setCallReceivers] = useState<CallReceiver[]>([]);
    const [showNewTelephoneNumberForm, setShowNewTelephoneNumberForm] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCallReceiverDetails(user);
                const callReceiverObjects: CallReceiver[] = response.map((receiver: any) => ({
                    callReceiverId: receiver.callReceiverId,
                    telephone: receiver.telephone,
                    fullName: receiver.fullName,
                    relationship: receiver.relationship
                }));
                setCallReceivers(callReceiverObjects);
            } catch (error) {
                console.error('Error fetching call receiver details:', error);
            }
        };
        fetchData();
    }, [user]);

    return (
        <Box>
            <Autocomplete
                options={callReceivers}
                getOptionLabel={(option) => `${option.fullName} - ${option.telephone}`}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select a call receiver"
                        variant="outlined"
                        margin="normal"
                    />
                )}
                onChange={(event, value) => handleTelephoneNumberInputChange({ target: { name: 'telephone', value: value?.telephone || '' } } as React.ChangeEvent<HTMLSelectElement>)}
            />
           
        </Box>
    );
};

export default CallReceiverSelector;