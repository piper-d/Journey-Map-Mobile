import * as React from 'react'
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArchiveView } from './src/views/Archive';
import { CreateView } from './src/views/Create';
import { SettingsView } from './src/views/Settings';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export type RootStackParamList = {
  Create: undefined;
  Archive: undefined;
  Settings: undefined;
  }
  
export type Props = NativeStackScreenProps<RootStackParamList>;

const Tab = createBottomTabNavigator<RootStackParamList>();

const CreateIcon = <MaterialCommunityIcons name="plus" size={24} /> ;
const ArchiveIcon = <MaterialCommunityIcons name="archive" size={24} /> ;
const SettingsIcon = <MaterialCommunityIcons name="account-settings" size={24} /> ;


export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>     
        <Tab.Navigator initialRouteName="Create">
          <Tab.Screen name="Create" component={CreateView} options={{tabBarIcon: () => CreateIcon}}  />
          <Tab.Screen name="Archive" component={ArchiveView} options={{tabBarIcon: () => ArchiveIcon}}/>
          <Tab.Screen name="Settings" component={SettingsView} options={{tabBarIcon: () => SettingsIcon}} />
        </Tab.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
