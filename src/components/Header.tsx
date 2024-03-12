import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Button } from '@mui/material';
import WineBarIcon from '@mui/icons-material/WineBar';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from '@/components/SearchBar';
import Filter from '@/components/Filter';
import Link from 'next/link';
import { Margin } from '@mui/icons-material';

interface HeaderProps {
  setWines: (value: React.SetStateAction<any[]>) => void;
}

const Header: React.FC<HeaderProps> = ({ setWines }: HeaderProps) => {

  return (
    <AppBar position="fixed" elevation={24} style={{
      backgroundColor: '#3E2723',  // Dark brown color
      boxShadow: '0px 5px 15px rgba(0, 0, 0, 1)',
    }}>
      <Toolbar>
        {/* WineBarIcon */}
        <IconButton edge="start" color="inherit" aria-label="menu" style={{ color: 'white' }}>
          <WineBarIcon sx={{ fontSize: 65 }} />
        </IconButton>

        {/* WineShop*/}
        <Typography variant="h3" component="div" style={{
          flexGrow: 1,
          textAlign: 'left',
          color: 'white',
          fontFamily: 'arial',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          fontWeight: 'bold',
          letterSpacing: '1px',
        }}>
          Wine Shop
        </Typography>

        {/* Filter */}
        

        {/* SearchBar */}
        <Box display="flex" alignItems="center">
          <Link href="/AddWine/addWine">
            <Button variant="contained" color="primary" startIcon={<AddIcon />}> Add New Wine</Button>
          </Link>
          <SearchBar setWines={setWines} />
        </Box>
        <Filter setWines={setWines} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
