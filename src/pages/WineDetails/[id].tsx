// pages/WineDetails.tsx
import { Wine } from '@/app/interfaces/wine';
import { WineService } from '@/app/services/WineService';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Typography, Paper, Button,Dialog,DialogActions,DialogContent,DialogContentText, DialogTitle, IconButton } from '@mui/material';
import Link from 'next/link';
import { ArrowBack as ArrowBackIcon, Delete as DeleteIcon, Update as UpdateIcon } from '@mui/icons-material';


export default function WineDetails()  {
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
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean;
    itemId: bigint | null;
  }>({
    open: false,
    itemId: null,
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
  const handleUpdate = () => {
    router.push(`/UpdateWine/${wineData.id}`);
  };

  const handleDelete = async (id: bigint) => {
    setDeleteConfirmation({
      open: true,
      itemId: id,
    });
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation({
      open: false,
      itemId: null,
    });
  };

  const handleDeleteConfirmed = async () => {
    try {
      console.log('Deleting wine with ID:', deleteConfirmation.itemId);
      await WineService.deleteWine(deleteConfirmation.itemId!); 
      console.log(deleteConfirmation.itemId);
      router.push('/');
    } catch (error) {
      console.error('Error deleting wine:', error);
    } finally {
      handleCloseConfirmation();

    }
  };

  return (
    <div style={{
      textAlign: 'center',
      margin: 'px',
      backgroundImage: 'url("../../images/wineDetails.jpeg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      overflowY: 'hidden',
    }}>
      


        <Paper elevation={24} style={{borderRadius: '45px', padding: '20px', maxWidth: '600px', margin: 'auto', marginTop:'100px' }}>
          <Paper elevation={4} style={{borderRadius: '60px', marginBottom: '30px'}}>
            <Typography variant="h4" gutterBottom>
                     Wine Details
            </Typography>
            </Paper>
          <Typography variant="h4" gutterBottom>
            {wineData.name}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Type:</strong> {wineData.type}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Price:</strong> ${wineData.price.toFixed(2)}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Description:</strong> {wineData.description}
          </Typography>
          <img
            src={wineData.imageUrl}
            alt={`Wine: ${wineData.name}`}
            style={{ width: '90%', height: 'auto', marginBottom: '20px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete(wineData.id)}
              style={{ marginRight: '10px' }}
            >
              Delete
            </Button>
            <Button variant="contained" onClick={handleUpdate} startIcon={<UpdateIcon />}>
              Update
            </Button>
          </div>
          <Link href="/" passHref style={{ marginTop: '20px', display: 'block' }}>
              <IconButton>
                <ArrowBackIcon />
                Back to main page
              </IconButton>
            </Link>
        </Paper>

      <Dialog open={deleteConfirmation.open} onClose={handleCloseConfirmation}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmed} startIcon={<DeleteIcon />} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}



