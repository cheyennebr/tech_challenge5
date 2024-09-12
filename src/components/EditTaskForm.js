import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Firestore config

const EditTaskForm = ({ task, handleSaveTaskEdit, handleCancel }) => {
  const [taskInput, setTaskInput] = useState(task?.text || '');
  const [selectedMember, setSelectedMember] = useState(task?.member || '');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [priority, setPriority] = useState(task?.priority || 'Média');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [members, setMembers] = useState([]); // State to store members from Firestore

  // Fetch members from Firestore
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersCollection = collection(db, 'members');
        const membersSnapshot = await getDocs(membersCollection);
        const membersList = membersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMembers(membersList);
      } catch (err) {
        console.error('Erro ao carregar membros do Firestore:', err);
      }
    };

    fetchMembers();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      await handleSaveTaskEdit({
        ...task,
        text: taskInput,
        member: selectedMember,
        dueDate,
        priority,
      });
      handleCancel();
    } catch (err) {
      setError('Erro ao salvar a tarefa.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={3}>
        <TextField
          label="Texto da Tarefa"
          variant="outlined"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          fullWidth
          disabled={loading}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Membro</InputLabel>
          <Select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            label="Membro"
            disabled={loading}
          >
            {members.map((member) => (
              <MenuItem key={member.id} value={member.name}>
                {member.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          label="Prazo"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          fullWidth
          disabled={loading}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Prioridade</InputLabel>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            label="Prioridade"
            disabled={loading}
          >
            <MenuItem value="Baixa">Baixa</MenuItem>
            <MenuItem value="Média">Média</MenuItem>
            <MenuItem value="Alta">Alta</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={loading}
          style={{ marginRight: 8 }}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default EditTaskForm;