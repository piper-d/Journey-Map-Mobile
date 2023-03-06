import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { useTrips } from '../../api/Trips';
import { getTrackingFunction } from '../../hooks/useTrackingFunctions';
import { styles } from './styles';
import { MetricsDisplay } from '../Custom/MetricsDisplay';

export type ITrackingObj = {
  currLocation: LocationObject;
  locationArray: LocationObject[];
};

export function Tracking({
  initialLocation,
  setIsTracking,
}: {
  initialLocation: LocationObject;
  setIsTracking: () => void;
}) {
  const [location, setLocation] = useState<ITrackingObj>({
    currLocation: initialLocation,
    locationArray: [initialLocation],
  });
  const [watcher, setWatcher] = useState<Location.LocationSubscription>();
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);

  const { getAllTrips, getTrip, createTrip } = useTrips();

  const { options, getCurentSpeed, getAverageSpeed, getSimplifiedCoords, formatData } =
    getTrackingFunction(location, distance, duration, setDistance);

  useEffect(() => {
    Location.watchPositionAsync(options, (currentLocation) => {
      // console.log({ currentLocation });
      setLocation((prevLocation) => ({
        currLocation: currentLocation,
        locationArray: [...(prevLocation?.locationArray ?? []), currentLocation],
      }));
    })
      .then((locationWatcher) => {
        setWatcher(locationWatcher);
      })
      .catch((err) => {
        console.log(err);
      });

    const durationTimer = setInterval(() => setDuration((prevDuration) => prevDuration + 1), 1000);

    return () => {
      clearTimeout(durationTimer);
    };
  }, []);
  const stopTracking = useCallback(() => {
    watcher?.remove();

    createTrip(formatData()).then(() => setIsTracking());
  }, [watcher, setIsTracking]);

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation
        showsMyLocationButton
        mapType='hybrid'
        provider={PROVIDER_GOOGLE}
        userLocationUpdateInterval={5000}
        // scrollEnabled={false}
        region={{
          latitude: location?.currLocation?.coords?.latitude!,
          longitude: location?.currLocation?.coords?.longitude!,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Polyline coordinates={getSimplifiedCoords()} strokeWidth={5} strokeColor='white' />
      </MapView>

      <View style={styles.metrics}>
        <MetricsDisplay header={'Distance:'} body={`${distance} Mi`} />
        <MetricsDisplay
          header={'Duration:'}
          body={`${moment.utc(duration * 1000).format('HH:mm:ss')}`}
        />
        <MetricsDisplay header={'Current Speed:'} body={`${getCurentSpeed()} MPH`} />
        <MetricsDisplay header={'Average Speed:'} body={`${getAverageSpeed()} MPH`} />

        <TouchableOpacity
          style={styles.cameraButton}
          children={<Text>camera</Text>}
          onPress={() => {}}
        />
        <TouchableOpacity
          style={styles.stopButton}
          children={<Text>End Trip</Text>}
          onPress={() => stopTracking()}
        />
      </View>
      <Button title='GET MEEE' onPress={() => getAllTrips()} />
    </SafeAreaView>
  );
}
