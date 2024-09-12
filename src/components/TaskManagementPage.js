import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Box, TextField, Grid, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import TaskList from './TaskList';
import AddHoursForm from './AddHoursForm';
import EditTaskForm from './EditTaskForm'; // Ensure this is imported
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'; 
import { db } from '../firebaseConfig'; // Firestore config

const TaskManagementPage = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Média');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(null); // Manage the edit form visibility
  const [showAddHoursForm, setShowAddHoursForm] = useState(null);

  // Fetch tasks from Firestore when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksCollection = collection(db, 'tasks');
        const taskSnapshot = await getDocs(tasksCollection);
        const taskList = taskSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTasks(taskList);
      } catch (error) {
        console.error("Erro ao carregar as tarefas do Firestore:", error);
      }
    };

    fetchTasks();
  }, []);

  // Function to add or edit tasks
  const handleAddTask = async () => {
    if (taskInput.trim() && selectedMember && dueDate) {
      const newTask = {
        text: taskInput,
        dueDate,
        priority,
        assignedMembers: [selectedMember], // Assign the selected member to the task
        hoursUsed: 0,
        completed: false,
      };

      try {
        if (editingTaskId) {
          const taskDocRef = doc(db, 'tasks', editingTaskId);
          await updateDoc(taskDocRef, newTask);
          setTasks(tasks.map(task => task.id === editingTaskId ? { id: editingTaskId, ...newTask } : task));
          setEditingTaskId(null);
          setShowEditForm(null); // Hide the edit form after saving
        } else {
          // Add new task to Firestore
          const docRef = await addDoc(collection(db, 'tasks'), newTask);
          setTasks([...tasks, { id: docRef.id, ...newTask }]);
        }

        // Clear form fields
        setTaskInput('');
        setSelectedMember('');
        setDueDate('');
        setPriority('Média');
      } catch (error) {
        console.error("Erro ao adicionar/editar a tarefa no Firestore:", error);
      }
    } else {
      console.warn("Todos os campos devem ser preenchidos para adicionar uma tarefa.");
    }
  };

  // Function to delete task
  const handleDeleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Erro ao deletar a tarefa no Firestore:", error);
    }
  };

  // Function to toggle task completion
  const handleCompleteTask = async (id) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    try {
      await updateDoc(doc(db, 'tasks', id), {
        completed: !taskToUpdate.completed
      });
      setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    } catch (error) {
      console.error("Erro ao atualizar o status da tarefa no Firestore:", error);
    }
  };

  // Function to add hours to a task
  const handleAddHours = async (taskId, hours) => {
    if (hours > 0) {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      try {
        await updateDoc(doc(db, 'tasks', taskId), {
          hoursUsed: taskToUpdate.hoursUsed + parseFloat(hours)
        });
        setTasks(tasks.map(task => task.id === taskId ? { ...task, hoursUsed: task.hoursUsed + parseFloat(hours) } : task));
        setShowAddHoursForm(null); // Hide the form after adding hours
      } catch (error) {
        console.error("Erro ao adicionar horas à tarefa no Firestore:", error);
      }
    } else {
      console.warn("As horas adicionadas devem ser maiores que 0.");
    }
  };

  // Function to edit task
  const handleSaveTaskEdit = async (updatedTask) => {
    try {
      const taskDocRef = doc(db, 'tasks', updatedTask.id);
      await updateDoc(taskDocRef, updatedTask);
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      setEditingTaskId(null);
      setShowEditForm(null);
    } catch (error) {
      console.error("Erro ao salvar a tarefa editada:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gerenciar Tarefas</Typography>
      
      {/* Form for adding or editing tasks */}
      <Box component="form" noValidate sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              label="Nova Tarefa"
              variant="outlined"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Membro</InputLabel>
              <Select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                label="Membro"
              >
                <MenuItem value="Cheyenne">Cheyenne</MenuItem>
                <MenuItem value="Arthur">Arthur</MenuItem>
                <MenuItem value="Livia">Livia</MenuItem>
                <MenuItem value="Miguel">Miguel</MenuItem>
                <MenuItem value="Raphael">Raphael</MenuItem>
                <MenuItem value="Matheus">Matheus</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Prazo"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Prioridade</InputLabel>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                label="Prioridade"
              >
                <MenuItem value="Baixa">Baixa</MenuItem>
                <MenuItem value="Média">Média</MenuItem>
                <MenuItem value="Alta">Alta</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTask}
              startIcon={<AddIcon />}
            >
              {editingTaskId ? 'Salvar' : 'Adicionar'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Task list component */}
      <TaskList
        tasks={tasks}
        handleCompleteTask={handleCompleteTask}
        handleEditTask={(task) => {
          setTaskInput(task.text);
          setSelectedMember(task.assignedMembers[0]);
          setDueDate(task.dueDate);
          setPriority(task.priority);
          setEditingTaskId(task.id);
          setShowEditForm(task.id);
        }}
        handleDeleteTask={handleDeleteTask}
        handleAddHours={handleAddHours}
      />

      {/* Edit task form */}
      {showEditForm && (
        <EditTaskForm
          task={tasks.find(task => task.id === editingTaskId)}  // Find the task to be edited
          handleSaveTaskEdit={handleSaveTaskEdit} // Pass the edit function
          handleCancel={() => {
            setEditingTaskId(null);
            setShowEditForm(false); // Hide the form on cancel
          }}
/>
      )}
      {/* Add hours form */}
      {showAddHoursForm && (
        <AddHoursForm
          taskId={showAddHoursForm}
          handleAddHours={handleAddHours}
          handleCancelAddHours={() => setShowAddHoursForm(null)}
        />
      )}
    </Container>
  );
};

export default TaskManagementPage;