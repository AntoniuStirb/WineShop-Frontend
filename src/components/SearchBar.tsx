import React from 'react';
import { Box, TextField, IconButton, InputAdornment, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { WineService } from '@/app/services/WineService';

interface SearchBarProps {
  setWines: React.Dispatch<React.SetStateAction<any[]>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ setWines }) => {
  const [searchKeyword, setSearchKeyword] = React.useState('');

  const handleSearch = async () => {
    try {
      const response = await WineService.searchWines(searchKeyword);

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
            id: wine.id,
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
      console.error('Error searching wines:', error);
    }
  };

  const handleKeyPress = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      await handleSearch();
    }
  };

  return (
    <Box mt={1} display="flex" justifyContent="center" style={{ backgroundColor: '9B7070', padding: '10px' }}>
      <Paper elevation={20} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <TextField
          label="Search"
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={handleKeyPress}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch} size="large">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth  
        />
      </Paper>
    </Box>
  );
};

export default SearchBar;
