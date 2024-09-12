// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme'; // Importe o tema
import Header from './components/Header';
import AddMemberPage from './components/AddMemberPage';
import TaskManagementPage from './components/TaskManagementPage';
import MembersPage from './components/MembersPage';
import MemberProfilePage from './components/MemberProfilePage';

// Import Firestore
import { db } from './firebaseConfig'; // Import Firestore connection

const App = () => {
  // You can use `db` in this component or pass it to others if needed

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Routes>
          <Route path="/adicionar-membro" element={<AddMemberPage />} />
          <Route path="/gerenciar-tarefas" element={<TaskManagementPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/member/:memberName" element={<MemberProfilePage />} />  {/* Profile Route */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;