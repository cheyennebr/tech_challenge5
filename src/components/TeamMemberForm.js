import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const TeamMemberForm = ({ onAddMember }) => {
  const [formData, setFormData] = useState({ nome: '', email: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.nome && formData.email) {
      onAddMember(formData);
      setFormData({ nome: '', email: '' });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: '20px' }}
    >
      <TextField
        label="Nome"
        variant="outlined"
        name="nome"
        value={formData.nome}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        label="Email"
        variant="outlined"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Adicionar Stormtrooper
      </Button>
    </Box>
  );
};

export default TeamMemberForm;