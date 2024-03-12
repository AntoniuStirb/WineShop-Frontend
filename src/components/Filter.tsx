// Filter.tsx

import React from 'react';
import { Grid, Paper, TextField, Button, InputAdornment, Box } from '@mui/material';
import { WineService } from '../app/services/WineService';

interface FilterProps {
  setWines: React.Dispatch<React.SetStateAction<any[]>>;
}

const Filter: React.FC<FilterProps> = ({ setWines }) => {
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');

  const handleFilter = async () => {
    try {
      const response = await WineService.filterWinesByPrice(Number(minPrice), Number(maxPrice));

      const imageData = await Promise.all(
        response.map(async (wine: any) => {
          const byteCharacters = atob(wine.fileBytes);
          const byteNumbers = new Array(byteCharacters.length);

          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/jpeg' });
          const imageUrl = URL.createObjectURL(blob);

          return {
            imageUrl,
            price: wine.price,
            name: wine.name,
            type: wine.type,
            description: wine.description,
          };
        })
      );

      setWines(imageData);
    } catch (error) {
      console.error('Error filtering wines:', error);
    }
  };

  const handleClear = () => {
    setMinPrice('');
    setMaxPrice('');
    window.location.reload();
  };

  return (
    <Box mt={1} p={1} component={Paper} elevation={24} sx={{ backgroundColor: '#f0f0f0', borderRadius: '8px', width: '20%' }}>
      <Grid container spacing={1} alignItems="center" sx={{ width: '138%' }}>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Min Price"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            variant="outlined"
            size="small"
            sx={{ margin: 0, padding: 0 }} 
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Max Price"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            variant="outlined"
            size="small"
            sx={{ margin: 0, padding: 0 }} 
          />
        </Grid>

        <Grid item xs={12} sm={4} sx={{ display: 'inline', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleFilter}
            size="small"
            sx={{ backgroundColor: '#6200ea', color: 'white', '&:hover': { backgroundColor: '#45006e' }, marginRight: '5px' }}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            onClick={handleClear}
            size="small"
            sx={{ backgroundColor: '#6200ea', color: 'white', '&:hover': { backgroundColor: '#45006e' }, marginLeft: '5px' }}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
    </Box>

  );
};

export default Filter;
