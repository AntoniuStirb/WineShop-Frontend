import React, { useState, useEffect } from 'react';
import { Pagination, Button, Grid ,Paper ,Typography ,Box } from '@mui/material';
import { Wine } from '../app/interfaces/wine';
import { WineService } from '../app/services/WineService';
import { useRouter } from 'next/router';
import Header from '@/components/Header';

const Home = () => {
  const [wines, setWines] = useState<Wine[]>([]);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const router = useRouter();
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const fetchWines = async () => {
      try {
        const response = await WineService.getAllWines(page, 10);
        setTotalRecords(response.totalRecords);
        console.log(response.length)
        if (response.length<10) {
          setIsLastPage(true)
        }else{
          setIsLastPage(false)
        }
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
        console.error('Error fetching wines:', error);
      }
    };

    fetchWines();
  }, [page]);

  
  const calculateTotalPages = (totalRecords: number): number => {
    console.log(Math.ceil(totalRecords / 10))
    return Math.ceil(totalRecords / 10);
  };
  const totalPages = calculateTotalPages(totalRecords);
  

  const handlePageChange = async (action: 'prev' | 'next' | string) => {
    if (action === 'prev') {
      setPage((prevPage) => Math.max(0, prevPage - 1));
    } else if (action === 'next' && isLastPage==false) {
      setPage((prevPage) => prevPage + 1);
    } else {
      const parsedPage = parseInt(action, 10);
      const newPage = isNaN(parsedPage) || !isFinite(parsedPage) ? 0 : Math.max(0, parsedPage - 1);
      setPage(newPage);
    }
  };

  const handleDetails = (id: bigint) => {
    router.push(`/WineDetails/${id}`);
  };
  


  return (
    <div style={{ 
      backgroundImage: 'url("./images/mainPageBackground.jpg")', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      height: '100vh', 
      position: 'fixed',  
      width: '100%',      
      overflowX: 'hidden',  
    }}>
       
      <Header setWines={setWines} />
      
      <Grid container spacing={15} marginTop={'10px'} marginLeft={'1px'}>
          {wines.map((wine) => (
            <Grid item key={wine.id} xs={12} sm={6} md={4} lg={4}>
            <Button
              onClick={() => handleDetails(wine.id)}
              style={{maxWidth: '100%', padding: 20, textTransform: 'none', textDecoration: 'none', display: 'block', flexDirection: 'column' }}
            >
              <Paper elevation={24} style={{borderRadius: '45px', padding: '20px', minHeight: '300px', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <Typography variant="h6" gutterBottom style={{ marginTop: '20px', fontSize: '24px' }}>
                  {wine.name}
                </Typography>
                <Typography variant="body1" paragraph style={{ fontSize: '14px', marginBottom: '10px' }}>
                  {`Price: $${wine.price.toFixed(2)}`}
                </Typography>
                <img
                  src={wine.imageUrl}
                  alt={`Wine: ${wine.name}`}
                  style={{ maxWidth: '80%', maxHeight: '400px', marginBottom: '40px', marginTop:'20px' }}
                />
              </Paper>
            </Button>
          </Grid>
          ))}
       </Grid>

  

      <Box mt={4} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
          <Box flexGrow={6} /> 
            <Pagination
              page={page + 1}
              hideNextButton={isLastPage}
              count={totalPages}
              onChange={(_: any, value: { toString: () => string; }) => handlePageChange(value.toString())}
              size="large"
              sx={{
                '& .MuiPaginationItem-icon': {
                  fontSize: '6rem', 
                },
              }}     
            />
      </Box>

    </div>
  );
};

export default Home;
