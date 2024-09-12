// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#000000' }}> {/* Fundo preto */}
      <Toolbar>
        <Typography variant="h6">
          <Link to="/adicionar-membro" style={{ color: 'white', textDecoration: 'none' }}>Adicionar Membro</Link>
        </Typography>
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          <Link to="/gerenciar-tarefas" style={{ color: 'white', textDecoration: 'none' }}>Gerenciar Tarefas</Link>
        </Typography>
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          <Link to="/members" style={{ color: 'white', textDecoration: 'none' }}>Membros</Link> {/* Updated Link */}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;