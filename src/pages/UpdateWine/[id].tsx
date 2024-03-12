import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { WineService } from '../../app/services/WineService';
import WineForm from '../../components/WineForm';
import { Wine } from '@/app/interfaces/wine';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import Link from 'next/link';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

export default function UpdateWinePage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const fetchWineDetails = async () => {
      try {
        if (id) {
          setLoading(true);
          const response = await WineService.getWineById(BigInt(id as string));
          const wine = response; 
          const byteCharacters = atob(wine.fileBytes);
          const byteNumbers = new Array(byteCharacters.length);

          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/jpeg' });
          const imageUrl = URL.createObjectURL(blob);

          setWineData({
            id: BigInt(wine.id),
            name: wine.name,
            type: wine.type,
            price: wine.price,
            description: wine.description,
            imageFile: null,
            imageData: null,
            fileBytes: wine.fileBytes,
            imageUrl: imageUrl,
          });
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching wine details:', error);
      }
    };

    if (id) {
      fetchWineDetails();
    }
  }, [id]);

  const handleUpdateWine = async () => {
    try {
      if (id) {
        const updatedWineData = {
          ...wineData,
          id: String(wineData.id), 
        };

        await WineService.updateWine((id as string), wineData as Wine);
        router.push('/');
      }
    } catch (error) {
      console.error('Error updating wine:', error);
    }
  };

  return (
    <Box
      mt={0}
      display="flex"
      flexDirection="column"
      alignItems="center"
      style={{
        backgroundImage: 'url("../../images/addWine.jpeg")', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh', 
        overflowX: 'hidden',
      }}
>
    
      <Paper elevation={24} style={{ borderRadius: '35px', padding: '20px', maxWidth: '600px', margin: 'auto' }}>
        <Typography variant="h3" align="center" gutterBottom>
          Update Wine
        </Typography>
          <WineForm wineData={wineData} onChange={setWineData} onSubmit={handleUpdateWine} />

            <Link href="/" passHref style={{ marginTop: '20px', display: 'block' }}>
              <IconButton>
                <ArrowBackIcon />
                Back to the main page
              </IconButton>
            </Link>
      </Paper>
    </Box>
  );
}
