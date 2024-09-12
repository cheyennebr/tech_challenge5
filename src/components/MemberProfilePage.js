import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const tasks = [
  { member: 'Cheyenne', text: 'Reunião de alinhamento', hoursUsed: 2 },
  { member: 'Arthur', text: 'Apresentação cliente X', hoursUsed: 1.5 },
  // Add more task data here
];

const MemberProfilePage = () => {
  const { memberName } = useParams();
  const memberTasks = tasks.filter((task) => task.member === memberName);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Perfil de {memberName}</Typography>
      <Typography variant="h6" gutterBottom>Tarefas atribuídas:</Typography>
      <List>
        {memberTasks.map((task, index) => (
          <ListItem key={index}>
            <ListItemText primary={task.text} secondary={`Horas usadas: ${task.hoursUsed}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default MemberProfilePage;