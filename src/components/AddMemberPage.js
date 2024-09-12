// src/components/AddMemberPage.js
import React, { useState } from 'react';
import { Container, Typography, Alert } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore'; 
import { db } from '../firebaseConfig'; 
import TeamMemberForm from './TeamMemberForm';
import '../styles/darkTheme.css';

const AddMemberPage = () => {
  const [message, setMessage] = useState({ type: '', content: '' });

  const addMember = async (member) => {
    try {
      // Add member to Firestore
      await addDoc(collection(db, 'members'), {
        name: member.nome,
        email: member.email,
      });

      // Show success message if Firestore operation succeeds
      setMessage({ type: 'success', content: 'Membro adicionado com sucesso!' });

      // Hide the message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', content: '' });
      }, 3000);
    } catch (error) {
      // Show error message if Firestore operation fails
      setMessage({ type: 'error', content: 'Erro ao adicionar o membro. Tente novamente.' });

      // Hide the message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', content: '' });
      }, 3000);
    }
  };

  return (
    <Container maxWidth="sm" className="app-container">
      <Typography variant="h4" align="center" gutterBottom className="app-title">
        Amplie Seu Time
      </Typography>
      <Typography variant="subtitle1" align="center" className="legend-text" gutterBottom>
        Convide seus amigos para se juntar à Força Negra
      </Typography>

      {/* Show success or error message */}
      {message.content && (
        <Alert severity={message.type} sx={{ marginBottom: 2 }}>
          {message.content}
        </Alert>
      )}

      <TeamMemberForm onAddMember={addMember} />
    </Container>
  );
};

export default AddMemberPage;