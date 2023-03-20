import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { TripData, useTrips } from '../../api/useTrips';
import { ArchiveSummary } from '../../components/Archive/ArchiveSummary';
import { styles } from './styles';
import { Loader } from '../../components/custom/Loader';

export function ArchiveView({
  items,
  setItems,
}: {
  items: TripData[] | undefined;
  setItems: (x: TripData[] | undefined) => void;
}) {
  const image = require('../../.././assets/topographic.png');

  const { isLoading, setIsLoading, getAllTrips } = useTrips();

  const isFocused = useIsFocused();
  // console.log(items !== undefined ? items : 'NOT LOADED');

  useEffect(() => {
    if (isFocused && items === undefined) {
      setIsLoading(true);
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
          {isLoading && <Loader />}

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
