import React, { useEffect, useState } from 'react';
import { ImageBackground, SafeAreaView, FlatList, View, Text } from 'react-native';
import { TabProps } from '../../routes';
import { styles } from './styles';
import { ArchiveComponent } from '../../components/Archive';
import { TripData, useTrips } from '../../api/Trips';
import { useIsFocused } from '@react-navigation/native';

export function ArchiveView({ route, navigation }: TabProps) {
  const image = require('../../.././assets/topographic.png');

  const [items, setItems] = useState<TripData[]>();
  const { isLoading, getAllTrips } = useTrips();

  const isFocused = useIsFocused();
  console.log(isFocused);

  useEffect(() => {
    if (isFocused) {
      getAllTrips().then((x) => setItems(x));
    }
  }, [isFocused]);
  if (isLoading || items === undefined)
    return (
      <View>
        <Text>LOADING</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={styles.image} source={image} resizeMode='cover'>
        <FlatList
          contentContainerStyle={styles.list}
          data={items}
          renderItem={({ item }) => <ArchiveComponent {...item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
