import axios from 'axios';
import { Wine } from '../interfaces/wine';


const API_URL = 'http://localhost:8080/api';

export const WineService = {
  getAllWines: async (page: number, size: number) => {
    const response = await axios.get(`${API_URL}/wines?page=${page}&size=${size}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  addWine: async (wineData: Partial<Wine>) => {
    try {
      const formData = new FormData();
      formData.append('wineDTO', new Blob([JSON.stringify({ //append wineDTO as a JSON string
        name: wineData.name || '',
        type: wineData.type || '',
        price: wineData.price !== undefined ? wineData.price.toString() : '0',
        description: wineData.description || '',
      })], { type: 'application/json' }));
  
      if (wineData.imageFile) {
        formData.append('image', wineData.imageFile);
      }
  
      const response = await axios.post(`${API_URL}/wines`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      return response.data;
    } catch (error: any) {
      console.error('Error adding wine:', error);
      throw new Error(`Error adding wine: ${error.message}`);
    }
  },


  searchWines: async (keyword: string) => {
    try {
      const response = await axios.get(`${API_URL}/wines/search?keyword=${keyword}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn('No wines found for the given search term.');
        return []; 
      } else {
        console.error('Error searching wines:', error);
        throw new Error(`Error searching wines: ${error.message}`);
      }
    }
  },

  filterWinesByPrice: async (minPrice: number, maxPrice: number): Promise<any> => {
    try {
      const response = await axios.get(`${API_URL}/wines/filter`, {
        params: {
          minPrice,
          maxPrice,
        },
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn('No wines found for the given filter details.');
        return []; 
      } else {
        console.error('Error filtering wines:', error);
        throw new Error(`Error filtering wines: ${error.message}`);
      }
    }
  },

  deleteWine: async (id: bigint): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/wines/${id}`);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        console.warn(`Invalid request to delete wine with id ${id}`);
      } else {
        console.error('Error deleting wine:', error);
        throw new Error(`Error deleting wine: ${error.message}`);
      }
    }
  },

  updateWine: async (id: string, wineData: Wine): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('wineDTO', new Blob([JSON.stringify({
        name: wineData.name || '',
        type: wineData.type || '',
        price: wineData.price !== undefined ? wineData.price.toString() : '0',
        description: wineData.description || '',
      })], { type: 'application/json' }));
  
      if (wineData.imageFile) {
        formData.append('image', wineData.imageFile);
      }
  
      const response = await axios.put(`${API_URL}/wines/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        console.warn(`Invalid request to update wine with id ${id}`);
      } else {
        console.error('Error updating wine:', error);
        throw new Error(`Error updating wine: ${error.message}`);
      }
    }
  },

  getWineById: async (id: bigint): Promise<any> => {
    try {
      const response = await axios.get(`${API_URL}/wines/${id}`);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        console.warn(`Invalid request to get wine with id ${id}`);
      } else {
        console.error('Error getting wine:', error);
        throw new Error(`Error getting wine: ${error.message}`);
      }
    }
  },
}
