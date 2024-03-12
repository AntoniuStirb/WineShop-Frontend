// pages/add-wine.tsx

import React, { useState } from 'react';
import Link from 'next/link';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import { WineService } from '@/app/services/WineService';
import { Wine } from '@/app/interfaces/wine';
import WineForm from '@/components/WineForm';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const AddWinePage: React.FC = () => {
  const [wineData, setWineData] = useState<Wine>({
    id: BigInt(0),
    name: '',
    type: '',
    price: 0,
    description: '',
    imageFile: null,
    imageData: null,
    fileBytes: null,
    imageUrl: null,
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddWine = async () => {
    try {
      const response = await WineService.addWine(wineData);
      setWineData({
        id: BigInt(0),
        name: '',
        type: '',
        price: 0,
        description: '',
        imageFile: null,
        imageData: null,
        fileBytes: null,
        imageUrl: null,
      });
      setSuccessMessage('Wine added successfully!');
    } catch (error) {
      console.error('Error adding wine:', error);
    }
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage(null);
  };

  return (
    <div
      style={{
        margin: '0px',
        backgroundImage: 'url("../../images/pourWine.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        overflowY: 'hidden',
      }}>

      <Box
        mt={0}
        display="flex"
        flexDirection="column"
        alignItems="center"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
      

        <Paper elevation={24} style={{ borderRadius: '35px', padding: '20px', maxWidth: '600px', margin: 'auto' }}>
        <Typography variant="h3" align="center" gutterBottom>
          Add Wine
        </Typography>
          <WineForm wineData={wineData} onChange={setWineData} onSubmit={handleAddWine} />
          <Link href="/" passHref style={{ marginTop: '20px', display: 'block' }}>
            <IconButton>
              <ArrowBackIcon />
              Back to home page
            </IconButton>
          </Link>
        </Paper>
      </Box>
    </div>
  );
};

export default AddWinePage;
