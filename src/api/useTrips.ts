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
  id: string;
};

export type TripData = {
  id: number;
  item: ResponseTripData;
};

const formatResponse = (items: ResponseTripData[]) => {
  return items.map((x, index) => {
    // console.log(x.user);
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

    console.log(token);
    try {
      const response = await axios.get(`/trips`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsLoading(false);
      // console.log('here');
      // console.log(response.data);

      return formatResponse(response.data);
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };

  const getTrip = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`/trips/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: id,
        },
      });
      return response.data;
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };

  const updateTripTitle = async (id: string, data: { title: string }) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.put(
        `/trips/${id}`,

        {
          ...data,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id: id,
          },
        }
      );
      console.log(response.status);
      return response.data;
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };

  const addTripMedia = async (id: string, data: { image: string }) => {
    try {
      const formData = new FormData();
      formData.append('latitude', '69');
      formData.append('longitude', '69');
      formData.append('image', data.image);

      const token = await AsyncStorage.getItem('accessToken');
      console.log(`/trips/${id}/media`);
      const response = await axios.post(
        `/trips/${id}/media`,
        {
          formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          params: {
            id: id,
          },
        }
      );
      console.log(response.status);
      return response.data;
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };

  return { isLoading, getAllTrips, getTrip, createTrip, updateTripTitle, addTripMedia };
};
