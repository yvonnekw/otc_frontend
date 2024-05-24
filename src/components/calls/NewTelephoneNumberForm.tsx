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
