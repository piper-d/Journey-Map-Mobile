import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../config/axios';
import { TripData } from '../hooks/useTrackingFunctions';
import { useState } from 'react';

export const useTrips = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const createTrip = async (data: TripData) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      console.log(token);
      const response = await axios.post(
        `/trips`,
        { data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      console.log(response.statusText);
      console.log(response.status);
      console.log(Object.entries(response.data).length);
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };

  const getAllTrips = async () => {
    const token = await AsyncStorage.getItem('accessToken');

    try {
      const response = await axios.get(`/trips`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsLoading(false);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };

  const getTrip = async (id: string) => {
    const tempId = 'wbZNeoXsyHSIbETgmapy';
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`/trips/${tempId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: tempId,
        },
      });
      return response.data;
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };

  return { isLoading, getAllTrips, getTrip, createTrip };
};
