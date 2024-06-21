import React, { useState } from 'react';
import { addReceiver } from '../../services/CallReceiverService';
import { TextField, Button, Box } from '@mui/material';

interface NewTelephoneNumberFormProps {
  onSuccess: () => void;
  user: string;
}

const NewTelephoneNumberForm: React.FC<NewTelephoneNumberFormProps> = ({ onSuccess, user }) => {
  const [newTelephoneNumber, setNewTelephoneNumber] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [relationship, setRelationship] = useState<string>('');

  const handleAddNewTelephoneNumber = async () => {
    try {
      await addReceiver(newTelephoneNumber, user, fullName, relationship);
      onSuccess();
      setNewTelephoneNumber('');
      setFullName('');
      setRelationship('');
    } catch (error) {
      console.error('Error adding new telephone number:', error);
    }
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        fullWidth
        label="Enter new call receiver phone number"
        value={newTelephoneNumber}
        onChange={(e) => setNewTelephoneNumber(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Enter new call receiver full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Enter your relationship to this new call receiver"
        value={relationship}
        onChange={(e) => setRelationship(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleAddNewTelephoneNumber} sx={{ mt: 2 }}>
        Add
      </Button>
    </Box>
  );
};

export default NewTelephoneNumberForm;


/*

import React, { useState } from 'react';
import { addReceiver } from '../../services/CallReceiverService';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

interface NewTelephoneNumberFormProps {
  onSuccess: () => void;
  user: string;
}

const NewTelephoneNumberForm: React.FC<NewTelephoneNumberFormProps> = ({ onSuccess, user }) => {
  const [newTelephoneNumber, setNewTelephoneNumber] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [relationship, setRelationship] = useState<string>('');

  const handleNewTelephoneNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTelephoneNumber(e.target.value);
  };

  const handleFullNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleRelationshipInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRelationship(e.target.value);
  };

  const handleAddNewTelephoneNumber = async () => {
    try {
      await addReceiver(newTelephoneNumber, user, fullName, relationship);
      onSuccess();
      setNewTelephoneNumber('');
    } catch (error) {
      console.error('Error adding new telephone number:', error);
    }
  };

  return (
    <div className='input-group'>
      <input
        className='form-control'
        type='text'
        placeholder='Enter new call receiver phone number'
        value={newTelephoneNumber}
        onChange={handleNewTelephoneNumberInputChange}
      />
      <div className='input-group'>
      <input
        className='form-control'
        type='text'
        placeholder='Enter new call receiver full name'
        value={fullName}
        onChange={handleFullNameInputChange}
        />
        <div className='input-group'>
      <input
        className='form-control'
        type='text'
        placeholder='Enter your relationship to this new call receiver'
        value={relationship}
        onChange={handleRelationshipInputChange}
      />
          <button className='btn-otc btn-otc:hover' type='button' onClick={handleAddNewTelephoneNumber}>
        Add
      </button>
        </div>
      </div>
    </div>
  );
};

export default NewTelephoneNumberForm;

*/
/*
import React, { useState } from 'react';
import { addReceiver } from '../../services/CallReceiverService';

interface NewTelephoneNumberFormProps {
  onSuccess: () => void;
  user: string; 
}

const NewTelephoneNumberForm: React.FC<NewTelephoneNumberFormProps> = ({ onSuccess, user }) => {
  const [newTelephoneNumber, setNewTelephoneNumber] = useState<string>('');

  const handleNewTelephoneNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTelephoneNumber(e.target.value);
  };

  const handleAddNewTelephoneNumber = async () => {
    try {
      await addReceiver(newTelephoneNumber, user); 
      onSuccess();
      setNewTelephoneNumber('');
    } catch (error) {
      console.error('Error adding new telephone number:', error);
    }
  };

  return (
    <div className='input-group'>
      <input
        className='form-control'
        type='text'
        placeholder='Enter new call receiver phone number'
        value={newTelephoneNumber}
        onChange={handleNewTelephoneNumberInputChange}
      />
      <button className='btn btn-success' type='button' onClick={handleAddNewTelephoneNumber}>
        Add
      </button>
    </div>
  );
};

export default NewTelephoneNumberForm;
*/