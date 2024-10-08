import { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { post } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';

const ShareNoteModal = ({
  open,
  onClose,
  note,
  setSnackbarOpen,
  setSnackbarMessage,
}) => {
  const [email, setEmail] = useState('');
  const [userID, setUserID] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const data = await getCurrentUser();
        if (data?.signInDetails?.loginId) {
          setUserID(data.signInDetails.loginId);
        } else if (data.username) {
          setUserID(data.username);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const handleShare = async () => {
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }

    const data = {
      user: userID,
      emailID: email,
      noteData: note,
    };
    const jsonData = JSON.stringify(data);
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://a6uem5twy8.execute-api.us-east-1.amazonaws.com/test/');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function () {
        if (xhr.status === 200) {
          setEmail('');
          setSnackbarMessage('Note successfully shared!');
          setSnackbarOpen(true);
        } else {
          console.error('Request failed. Status:', xhr.status);
        }
      };
      xhr.onerror = function () {
        console.error('Error sending request.');
      };
      xhr.send(jsonData);
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='share-note-modal'
      aria-describedby='share-note-modal-description'
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography
          id='share-note-modal'
          variant='h6'
          component='h2'
          gutterBottom
        >
          Share Note
        </Typography>
        <Typography id='share-note-modal-description' sx={{ mb: 2 }}>
          Enter the email address to share this note with:
        </Typography>
        <TextField
          label='Email'
          required
          error={Boolean(emailError)}
          helperText={emailError}
          variant='outlined'
          fullWidth
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError('');
          }}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={onClose} variant='outlined' color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleShare} variant='contained' color='primary'>
            Share
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ShareNoteModal;
