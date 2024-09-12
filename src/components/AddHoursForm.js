import React, { useState } from 'react';
import { Button, TextField, Grid } from '@mui/material';

const AddHoursForm = ({ taskId, handleAddHours, handleCancel }) => {
  const [hours, setHours] = useState(0);

  const handleAdd = () => {
    if (hours > 0) {
      handleAddHours(taskId, hours); // Ensure you're passing the correct taskId and hours.
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={6}>
        <TextField
          label="Horas"
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          sx={{ marginRight: 2 }}
        >
          Adicionar Horas
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCancel}
        >
          Cancelar
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddHoursForm;