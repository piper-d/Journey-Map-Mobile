import React, { useEffect, useState } from 'react';
import { ImageBackground, SafeAreaView, FlatList, View, Text } from 'react-native';
import { TabProps } from '../../routes';
import { styles } from './styles';
import { ArchiveComponent } from '../../components/Archive';
import { useTrips } from '../../api/Trips';
import { useIsFocused } from '@react-navigation/native';

export type TripData = {
  id: number;
  date: string;
  duration: string;
  mileage: string;
  speed: string;
};

const fakeData: TripData[] = [
  {
    id: 0,
    date: '',
    duration: '',
    mileage: '',
    speed: '',
  },
  {
    id: 1,
    date: '',
    duration: '',
    mileage: '',
    speed: '',
  },
  {
    id: 2,
    date: '',
    duration: '',
    mileage: '',
    speed: '',
  },
];

export function ArchiveView({ route, navigation }: TabProps) {
  const image = require('../../.././assets/topographic.png');

  const [items, setItems] = useState<any>();
  const { isLoading, getAllTrips } = useTrips();

  const isFocused = useIsFocused();
  console.log(isFocused);

  useEffect(() => {
    if (isFocused) {
      getAllTrips().then((x) => setItems(x));
    }
  }, [isFocused]);
  if (isLoading)
    return (
      <View>
        <Text>LOADING</Text>
      </View>
    );

  // console.log(items);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={styles.image} source={image} resizeMode='cover'>
        <FlatList
          contentContainerStyle={styles.list}
          data={fakeData}
          renderItem={({ item }) => <ArchiveComponent {...item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
