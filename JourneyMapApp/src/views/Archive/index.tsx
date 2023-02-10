import React from 'react';
import { ImageBackground, SafeAreaView, FlatList, View } from 'react-native';
import { TabProps } from '../../routes';
import { styles } from './styles';
import { ArchiveComponent } from '../../components/Archive';

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
    date: 'a',
    duration: 'b',
    mileage: 'c',
    speed: 'd',
  },
  {
    id: 1,
    date: 'e',
    duration: 'f',
    mileage: 'g',
    speed: 'h',
  },
  {
    id: 2,
    date: 'i',
    duration: 'j',
    mileage: 'k',
    speed: 'l',
  },
];

export function ArchiveView({ route, navigation }: TabProps) {
  const image = require('../../.././assets/topographic.png');

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
