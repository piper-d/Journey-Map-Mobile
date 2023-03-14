import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../config/axios';

type userData = {
  username: string;
  email: string;
  trips: {};
};

export const useUser = () => {
  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      console.log(token);
      const response = await axios.get(`/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.status);
      return response.data;
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  };

  const changeUsername = async (data: { username: string }) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.put(
        `/user`,
        {
          ...data,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

  const deleteUser = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.delete(`/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      return response;
    } catch (error) {
      console.log('Error: User was not deleted');
      console.log(error);
    }
  };

  return { getUser, changeUsername, deleteUser };
};
