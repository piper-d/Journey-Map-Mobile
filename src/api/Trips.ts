import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../config/axios';
import { useState } from 'react';

export type TripDataInput = {
  ['title']: string;
  ['point_coords']: number[][];
  ['details']: {
    ['distance']: number;
    ['duration']: number;
    ['average_speed']: string;
  };
};
type ResponseTripData = TripDataInput & {
  user: {};
};

export type TripData = {
  id: number;
  item: ResponseTripData;
};

const formatResponse = (items: ResponseTripData[]) => {
  return items.map((x, index) => {
    return { id: index + 1, item: x };
  });
};

export const useTrips = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const createTrip = async (data: TripDataInput) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.post(
        `/trips`,
        { ...data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.status);
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

      return formatResponse(response.data);
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