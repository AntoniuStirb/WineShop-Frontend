// components/WineForm.tsx

import * as React from 'react';
import { Wine } from '../app/interfaces/wine';
import { Button, TextField, Grid, Box, Paper, Typography, InputLabel } from '@mui/material';

interface WineFormProps {
  wineData: Wine;
  onChange: (data: Wine) => void;
  onSubmit: () => void;
}

const WineForm: React.FC<WineFormProps> = ({ wineData, onChange, onSubmit }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...wineData,
      [name]: value,
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];
      const imageData = await readFileAsync(file);

      onChange({
        ...wineData,
        [name]: file,
        imageData: imageData,
        fileBytes: null, 
        imageUrl: null, 
      });
    }
  };

  const readFileAsync = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const result = e.target.result as ArrayBuffer;
          resolve(result);
        } else {
          reject(new Error('Failed to read the file.'));
        }
      };

      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <Paper elevation={3} style={{ padding: '16px' }}>
      <Typography variant="h6" align="center" gutterBottom>
        Wine Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            type="text"
            name="name"
            value={wineData.name}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Type"
            type="text"
            name="type"
            value={wineData.type}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Price"
            type="number"
            name="price"
            value={wineData.price}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            multiline
            rows={4}
            variant="outlined"
            label="Description"
            placeholder="Enter your description"
            fullWidth
            name="description"
            value={wineData.description}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12}>
          <InputLabel htmlFor="imageFile">Image</InputLabel>
          <TextField
            fullWidth
            type="file"
            id="imageFile"
            name="imageFile"
            onChange={handleFileChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={onSubmit}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Paper>

  );
};

export default WineForm;