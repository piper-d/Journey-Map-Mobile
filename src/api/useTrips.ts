import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EncodingType, readAsStringAsync } from 'expo-file-system';
import { useState } from 'react';
import axios from '../../config/axios';

export type DeleteTripData = {
  latitude: string;
  longitude: string;
  url: string;
};

export type TripDataInput = {
  ['title']: string;
  ['point_coords']: number[][];
  ['details']: {
    ['distance']: string;
    ['duration']: string;
    ['average_speed']: string;
    ['start_time']: number;
    ['end_time']: number;
  };
};
type ResponseTripData = TripDataInput & {
  user: {};
  id: string;
  media: { [coords: string]: string[] } | undefined;
};

export type TripData = {
  id: number;
  item: ResponseTripData;
};

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
      console.log(response.status);
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
        const trips = response.data['trips'];

        if (trips === 'you currently have no trips') throw 'No Trips';

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
      console.log(response.status);
      return response.data;
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };

  const addTripMedia = async (id: string, data: { media: string }) => {
    try {
      console.log(id);
      console.log(data.media);
      const extension = data.media.split('.')[1];
      console.log(extension);

      const imageFile = {
        uri: data.media,
        name: 'image',
        type: `image/${extension}`,
      };

      const formData = new FormData();
      formData.append('latitude', '69');
      formData.append('longitude', '69');
      formData.append('image', imageFile as unknown as File);
      formData.append('extension', extension);

      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.post(`/trips/${id}/media`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.status);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };

  const deleteTripMedia = async (id: string, data: DeleteTripData) => {
    try {
      console.log(id);
      console.log(data);

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
      console.log(response.status);
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
      console.log(response.status);
      console.log(response.data);
      return response.data;
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
