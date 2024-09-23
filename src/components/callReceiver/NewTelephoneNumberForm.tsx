import React, { useState } from 'react';
import { addReceiver } from '../../services/CallReceiverService';
import { TextField, Button, Box, Alert } from '@mui/material';

interface NewTelephoneNumberFormProps {
  onSuccess: () => void;
  username: string; // Changed from user to username
}

const NewTelephoneNumberForm: React.FC<NewTelephoneNumberFormProps> = ({ onSuccess, username }) => {
  const [newTelephoneNumber, setNewTelephoneNumber] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [relationship, setRelationship] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddNewTelephoneNumber = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Sending data:', {
        telephone: newTelephoneNumber,
        username,
        fullName,
        relationship,
      });

      await addReceiver(newTelephoneNumber, username, fullName, relationship);
      onSuccess();
      setNewTelephoneNumber('');
      setFullName('');
      setRelationship('');
    } catch (error) {
      setError('Error adding new telephone number');
      console.error('Error adding new telephone number:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        fullWidth
        label="Enter new call receiver phone number"
        value={newTelephoneNumber}
        onChange={(e) => setNewTelephoneNumber(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Enter new call receiver full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Enter your relationship to this new call receiver"
        value={relationship}
        onChange={(e) => setRelationship(e.target.value)}
        margin="normal"
        required
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddNewTelephoneNumber}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Adding...' : 'Add'}
      </Button>
    </Box>
  );
};

export default NewTelephoneNumberForm;
