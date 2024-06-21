import React, { useEffect, useState } from 'react';
import { getCallReceiverDetails, CallReceiver } from '../../services/CallReceiverService';
import { Autocomplete, TextField, Button, Box } from '@mui/material';
import NewTelephoneNumberForm from '../calls/NewTelephoneNumberForm';

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

/*
import React, { useEffect, useState } from 'react';
import { getCallReceiverDetails, CallReceiver } from '../../services/CallReceiverService';
import SelectSearch from 'react-select-search';
import NewTelephoneNumberForm from '../calls/NewTelephoneNumberForm';

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
                // Assuming response is an array of objects with properties: telephone, fullName, relationship
                const callReceiverObjects: CallReceiver[] = response.map((receiver: any, index: number) => ({
                    callReceiverId: receiver.callReceiverId,
                    telephone: receiver.telephone,
                    fullName: receiver.fullName,
                    relationship: receiver.relationship
                }));
                console.log("Call receiver details " , callReceiverObjects);

                setCallReceivers(callReceiverObjects);
            } catch (error) {
                console.error('Error fetching call receiver details:', error);
            }
        };
        fetchData();
    }, [user]);

    const handleAddNewTelephoneNumber = () => {
        setShowNewTelephoneNumberForm(true);
    };

    return (
        <div>
            <SelectSearch
                options={callReceivers.map(receiver => ({
                    name: `${receiver.fullName} - ${receiver.telephone}`,
                    value: receiver.telephone
                }))}
                value={newCall.telephone}
                onChange={(value: string) => handleTelephoneNumberInputChange({ target: { name: 'telephone', value } } as React.ChangeEvent<HTMLSelectElement>)}
                placeholder="Select a call receiver"
                search={true}
            />
            {showNewTelephoneNumberForm && <NewTelephoneNumberForm onSuccess={() => setShowNewTelephoneNumberForm(false)} user={user} />}
        </div>
    );
};

export default CallReceiverSelector;
*/

/*

import React, { useEffect, useState } from 'react';
import { getCallReceiverDetails, CallReceiver } from '../../services/CallReceiverService';
import SelectSearch from 'react-select-search';
import NewTelephoneNumberForm from '../calls/NewTelephoneNumberForm';

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
                setCallReceivers(response);
            } catch (error) {
                console.error('Error fetching call receiver details:', error);
            }
        };
        fetchData();
    }, [ user]);

    const handleAddNewTelephoneNumber = () => {
        setShowNewTelephoneNumberForm(true);
    };

    return (
        <div>
            <SelectSearch
                options={callReceivers.map(receiver => ({
                    name: `${receiver.fullName} - ${receiver.telephone}`,
                    value: receiver.telephone
                }))}
                value={newCall.telephone}
                onChange={(value: string) => handleTelephoneNumberInputChange({ target: { name: 'telephone', value } } as React.ChangeEvent<HTMLSelectElement>)}
                placeholder="Select a call receiver"
                search={true}
            />
            {showNewTelephoneNumberForm && <NewTelephoneNumberForm onSuccess={function (): void {
                throw new Error('Function not implemented.');
            } } user={''} />}
        </div>
    );
};

export default CallReceiverSelector;

*/

/*
import React, { useEffect, useState } from 'react';
import { getTelephoneNumbers } from '../../services/CallReceiverService';
import NewTelephoneNumberForm from '../calls/NewTelephoneNumberForm';
import SelectSearch from 'react-select-search';

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
        setShowNewTelephoneNumberForm(true);
    };

    return (
        <div>
            <SelectSearch
                options={telephoneNumbers.map(value => ({ name: value, value }))}
                value={newCall.telephone}
                onChange={(value: string) => handleTelephoneNumberInputChange({ target: { name: 'telephone', value } } as React.ChangeEvent<HTMLSelectElement>)}
                placeholder="Select a call receiver phone number"
                search={true} 
            />
           
        </div>
    );
};

export default CallReceiverSelector;

/*
import React, { useEffect, useState } from 'react';
import { getTelephoneNumbers } from '../../services/CallReceiverService';
import NewTelephoneNumberForm from '../calls/NewTelephoneNumberForm';
import Dropdown, { Option } from 'react-dropdown'; // Import Dropdown and Option from 'react-dropdown'

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

    const handleDropdownChange = (selectedOption: Option | null) => {
        if (selectedOption) {
            // Create a synthetic event object
            const syntheticEvent: React.ChangeEvent<HTMLSelectElement> = {
                target: {
                    name: 'telephone',
                    value: selectedOption.value as string, // Assuming value is a string
                    ownerDocument: document,
                    addEventListener: () => { }, // Mock implementation for event listener methods
                    removeEventListener: () => { }, // Mock implementation for event listener methods
                    dispatchEvent: () => true, // Mock implementation for dispatchEvent method
                    getAttribute: () => '', // Mock implementation for getAttribute method
                    setAttribute: () => { }, // Mock implementation for setAttribute method
                    removeAttribute: () => { }, // Mock implementation for removeAttribute method
                    getBoundingClientRect: () => ({ width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 }), // Mock implementation for getBoundingClientRect method
                    querySelector: () => null, // Mock implementation for querySelector method
                    querySelectorAll: () => [], // Mock implementation for querySelectorAll method
                    // Add other necessary properties here
                },
                currentTarget: null as unknown as HTMLSelectElement, // Assigning null to currentTarget
                bubbles: false,
                cancelable: false,
                defaultPrevented: false,
                eventPhase: 0,
                isTrusted: false,
                nativeEvent: null as unknown as Event, // Assigning null to nativeEvent
                preventDefault: () => { },
                stopPropagation: () => { },
                timeStamp: 0,
                type: 'change'
            };

            // Call the parent component's event handler with the synthetic event object
            handleTelephoneNumberInputChange(syntheticEvent);
        }
    };


    const handleAddNewTelephoneNumber = () => {
        setShowNewTelephoneNumberForm(true);
    };

    return (
        <div>
            <Dropdown options={telephoneNumbers.map(value => ({ value, label: value }))} onChange={handleDropdownChange} value={newCall.telephone} placeholder="Select a call receiver phone number" />
            <button className='btn btn-link' onClick={handleAddNewTelephoneNumber}>
                Add New Telephone Number
            </button>
            {showNewTelephoneNumberForm && (
                <NewTelephoneNumberForm onSuccess={() => setShowNewTelephoneNumberForm(false)} user={user} />
            )}
        </div>
    );
};

export default CallReceiverSelector;



/*
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
           
        </div>
    );
};

export default CallReceiverSelector;
*/

