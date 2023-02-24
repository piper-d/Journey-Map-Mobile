import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../config/axios';

// eminmammadzada.b@gmail.com
export const useTrips = () => {
  const createTrip = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.post(`/trips`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      console.log(response.status);
      console.log(Object.entries(response.data).length);
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };

  const getAllTrips = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`/trips`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      console.log(response.status);
      console.log(Object.entries(response.data));
      console.log(Object.entries(response.data).length);
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };

  const getTrip = async () => {
    const id = 'wbZNeoXsyHSIbETgmapy';
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
      console.log(response.data);
      console.log(response.status);
      console.log(response.statusText);
      console.log(Object.entries(response.data));
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };
  return { getAllTrips, getTrip };
};
