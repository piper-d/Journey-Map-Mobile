import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import axios from '../../config/axios';
import { MediaObject } from '../types/MediaTypes';
import { ResponseTripData, TripData, TripDataInput } from '../types/TripTypes';

const formatResponse = (items: ResponseTripData[]): TripData[] => {
  return items.map((x, index) => {
    // console.log(x);
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
      console.log('Create Trip: ' + response.status);
      // console.log(response.data.tripId);
      return response.data.tripId;
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };

  const getAllTrips = async (): Promise<TripData[] | undefined> => {
    const token = await AsyncStorage.getItem('accessToken');

    return await axios
      .get(`/trips`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setIsLoading(false);

        return formatResponse(response.data);
      })
      .catch((error) => {
        console.log('error');
        console.log(error);
        return undefined;
      });
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

  const deleteTrip = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.delete(`/trips/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: id,
        },
      });
      console.log('Delete Trip: ' + response.status);
      return response.data;
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };

  const addTripMedia = async (id: string, data: MediaObject) => {
    try {
      const extension = data.url.split('.')[1];

      const imageFile = {
        uri: data.url,
        name: 'image',
        type: `image/${extension}`,
      };

      const formData = new FormData();
      formData.append('latitude', data.latitude);
      formData.append('longitude', data.longitude);
      formData.append('image', imageFile as unknown as File);
      formData.append('extension', extension);

      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.post(`/trips/${id}/media`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Media Upload: ' + response.status);
      return response.data;
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };

  const deleteTripMedia = async (id: string, data: MediaObject) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.put(
        `/trips/${id}/media/delete`,
        { ...data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id: id,
          },
        }
      );
      console.log('Delete Trip Media: ' + response.status);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };

  const exportTrip = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`/trips/${id}/export`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: id,
        },
      });
      console.log('Export Trip: ' + response.status);
      console.log(response.data);
      return response.data.downloadLink;
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };

  return {
    isLoading,
    setIsLoading: (x: boolean) => setIsLoading(x),
    getAllTrips,
    getTrip,
    createTrip,
    updateTripTitle,
    deleteTrip,
    addTripMedia,
    deleteTripMedia,
    exportTrip,
  };
};
