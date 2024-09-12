import React, { useState } from 'react';
import { List, ListItem, ListItemText, IconButton, Typography, Chip, Box, Grid } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Check as CheckIcon, AccessTime as AccessTimeIcon } from '@mui/icons-material';
import EditTaskForm from './EditTaskForm';
import AddHoursForm from './AddHoursForm';

const TaskList = ({ tasks, handleCompleteTask, handleDeleteTask, handleSaveTaskEdit, handleAddHours }) => {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [addingHoursTaskId, setAddingHoursTaskId] = useState(null);

  // Calculate the remaining days
  const calculateDaysRemaining = (dueDate) => {
    if (!dueDate) return 0;
    const now = new Date();
    const endDate = new Date(dueDate);
    const timeDifference = endDate - now;
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  };

  const toggleEditTaskForm = (taskId) => {
    setEditingTaskId(editingTaskId === taskId ? null : taskId);
    setAddingHoursTaskId(null); // Close the hours form when editing
  };

  const toggleAddHoursForm = (taskId) => {
    setAddingHoursTaskId(addingHoursTaskId === taskId ? null : taskId);
    setEditingTaskId(null); // Close the edit form when adding hours
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  const handleCancelAddHours = () => {
    setAddingHoursTaskId(null);
  };

  return (
    <List>
      {tasks.map((task) => (
        <React.Fragment key={task.id}>
          <ListItem
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px',
              borderBottom: '1px solid #ccc',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <ListItemText
                primary={
                  <Typography variant="body1">
                    {task.text}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2">
                    {`Responsável: ${task.assignedMembers ? task.assignedMembers.join(', ') : 'N/A'} - Prazo: ${task.dueDate} - Prioridade: ${task.priority}`}
                  </Typography>
                }
              />
            </Box>
            
            {/* Align status and hours to the right */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {task.completed ? (
                <Chip label="Concluída" color="success" sx={{ mr: 2 }} />
              ) : (
                <Chip label={`Restam ${calculateDaysRemaining(task.dueDate)} dias`} color="warning" sx={{ mr: 2 }} />
              )}
              <Chip label={`Horas: ${task.hoursUsed}`} color="info" sx={{ mr: 2 }} />

              {/* Action buttons */}
              <IconButton onClick={() => toggleEditTaskForm(task.id)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteTask(task.id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={() => handleCompleteTask(task.id)}>
                <CheckIcon />
              </IconButton>
              <IconButton onClick={() => toggleAddHoursForm(task.id)}>
                <AccessTimeIcon />
              </IconButton>
            </Box>
          </ListItem>

          {editingTaskId === task.id && (
            <ListItem sx={{ paddingLeft: 4 }}>
              <EditTaskForm
                task={task}
                handleSaveTaskEdit={handleSaveTaskEdit}
                handleCancel={handleCancelEdit}  // Pass cancel handler
              />
            </ListItem>
          )}

          {addingHoursTaskId === task.id && (
            <ListItem sx={{ paddingLeft: 4 }}>
              <AddHoursForm
                taskId={task.id}
                handleAddHours={handleAddHours}
                handleCancel={handleCancelAddHours}  // Pass cancel handler
              />
            </ListItem>
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

export default TaskList;