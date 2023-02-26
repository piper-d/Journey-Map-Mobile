import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ArchiveView } from '../views/Archive';
import { CreateView } from '../views/Create';
import { SettingsView } from '../views/Settings';
import { SignIn } from '../views/Auth/SignIn';
import { SignUp } from '../views/Auth/SignUp';

export type RootTabParamList = {
  Create: undefined;
  Archive: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type TabProps = NativeStackScreenProps<RootTabParamList>;
export type StackProps = NativeStackScreenProps<RootStackParamList>;

const Tab = createBottomTabNavigator<RootTabParamList>();

const CreateIcon = <MaterialCommunityIcons name='plus' size={24} />;
const ArchiveIcon = <MaterialCommunityIcons name='archive' size={24} />;
const SettingsIcon = <MaterialCommunityIcons name='account-settings' size={24} />;

const Stack = createNativeStackNavigator();

export type IUser = {
  authorizedUser: boolean;
  setAuthorizedUser: (x: boolean) => void;
};

export function Routes() {
  const [authorizedUser, setAuthorizedUser] = useState<any>(
    false || AsyncStorage.getItem('accessToken')
  );

  return (
    <>
      {!authorizedUser && (
        <Stack.Navigator initialRouteName='SignIn'>
          <Stack.Screen
            name='SignIn'
            children={(props) => <SignIn {...props} setAuthorizedUser={setAuthorizedUser} />}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='SignUp'
            children={(props) => <SignUp {...props} setAuthorizedUser={setAuthorizedUser} />}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
      {authorizedUser && (
        <Tab.Navigator initialRouteName='Create'>
          <Tab.Screen
            name='Create'
            component={CreateView}
            options={{ tabBarIcon: () => CreateIcon }}
          />
          <Tab.Screen
            name='Archive'
            component={ArchiveView}
            options={{ tabBarIcon: () => ArchiveIcon }}
          />
          <Tab.Screen
            name='Settings'
            options={{ tabBarIcon: () => SettingsIcon }}
            children={() => <SettingsView setAuthorizedUser={setAuthorizedUser} />}
          />
        </Tab.Navigator>
      )}
    </>
  );
}
