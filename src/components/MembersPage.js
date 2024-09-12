// src/components/MembersPage.js
import React, { useState, useEffect } from 'react';
import { Grid, List, ListItem, ListItemText, Typography, Box, Chip, Card, CardContent } from '@mui/material';
import { styled } from '@mui/system';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import Firestore

// Estilo customizado para os cartões
const TaskCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#1e1e1e',
  color: 'white',
  marginBottom: '16px',
  borderRadius: '10px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
}));

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null); // Selected member
  const [tasks, setTasks] = useState([]); // State to store tasks for selected member

  // Fetch members and tasks from Firestore
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
        setSelectedMember(membersList[0]); // Select the first member by default
      } catch (error) {
        console.error("Erro ao carregar membros:", error);
      }
    };

    fetchMembers();
  }, []);

  // Fetch tasks for selected member
  useEffect(() => {
    const fetchTasks = async () => {
      if (selectedMember) {
        try {
          const tasksCollection = collection(db, 'tasks');
          const tasksQuery = query(tasksCollection, where('assignedMembers', 'array-contains', selectedMember.name));
          const tasksSnapshot = await getDocs(tasksQuery);
          const tasksList = tasksSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(tasksList); // Set tasks for the selected member
        } catch (error) {
          console.error("Erro ao carregar tarefas:", error);
        }
      }
    };

    fetchTasks();
  }, [selectedMember]);

  // Função para calcular o total de horas do membro
  const calculateTotalHours = (tasks) => {
    return tasks.reduce((total, task) => total + task.hoursUsed, 0);
  };

  if (!selectedMember) return <div>Loading...</div>; // Handle loading state

  return (
    <Grid container spacing={2} sx={{ height: '100vh', backgroundColor: '#f5f5f5' }}> {/* Fundo claro para o restante do site */}
      {/* Sidebar com a lista de membros */}
      <Grid item xs={3} sx={{ backgroundColor: '#000000', padding: 2, borderRadius: '0 10px 10px 0' }}> {/* Fundo preto para a sidebar */}
        <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>Lista de Membros</Typography>
        <List>
          {members.map((member) => (
            <ListItem 
              button 
              key={member.id} 
              onClick={() => setSelectedMember(member)} 
              selected={selectedMember && selectedMember.id === member.id}
              sx={{
                color: selectedMember && selectedMember.id === member.id ? 'cyan' : 'white', // Cor de destaque para o membro selecionado
                backgroundColor: selectedMember && selectedMember.id === member.id ? '#333333' : 'transparent',
                borderRadius: '5px',
                padding: '12px 16px',
                marginBottom: '8px',
                '&:hover': {
                  backgroundColor: '#444444',
                }
              }}
            >
              <ListItemText primary={member.name} />
            </ListItem>
          ))}
        </List>
      </Grid>

      {/* Área de informações detalhadas do membro */}
      <Grid item xs={9} sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>{selectedMember.name}</Typography>
        <Typography variant="h6" sx={{ marginBottom: 2, color: '#666' }}>Tarefas atribuídas</Typography>
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <TaskCard key={index}>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>{task.text}</Typography>
                <Chip
                  label={`Horas usadas: ${task.hoursUsed}`}
                  color="primary"
                  sx={{ marginRight: 2 }}
                />
                <Chip 
                  label={task.completed ? 'Concluída' : 'Pendente'} 
                  color={task.completed ? 'success' : 'warning'} 
                />
              </CardContent>
            </TaskCard>
          ))
        ) : (
          <Typography variant="body1">Nenhuma tarefa atribuída.</Typography>
        )}
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
            Total de horas usadas: {calculateTotalHours(tasks)}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MembersPage;