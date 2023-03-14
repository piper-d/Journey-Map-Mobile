import React, { useEffect, useState } from 'react';
import { ImageBackground, SafeAreaView, FlatList, View, Text } from 'react-native';
import { TabProps } from '../../routes';
import { styles } from './styles';
import { ArchiveSummary } from '../../components/Archive/ArchiveSummary';
import { TripData, useTrips } from '../../api/useTrips';
import { useIsFocused } from '@react-navigation/native';

export function ArchiveView({ route, navigation }: TabProps) {
  const image = require('../../.././assets/topographic.png');

  const [items, setItems] = useState<TripData[]>();

  const { isLoading, getAllTrips } = useTrips();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && items === undefined) {
      getAllTrips().then((x) => {
        if (x !== undefined) {
          setItems(x);
        }
      });
    }
  }, [isFocused, items]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={styles.image} source={image} resizeMode='cover'>
        <>
          {isLoading && <Text style={styles.text}>LOADING</Text>}

          {!isLoading && items === undefined && (
            <Text style={styles.text}>
              You currently have no trips. Add a trip and return to see a summary!
            </Text>
          )}

          <FlatList
            contentContainerStyle={styles.list}
            data={items}
            renderItem={({ item }) => (
              <ArchiveSummary {...item} setItems={() => setItems(undefined)} />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </>
      </ImageBackground>
    </SafeAreaView>
  );
}
