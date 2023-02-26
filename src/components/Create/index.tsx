import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, SafeAreaView, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { styles } from './styles';
import { getTrackingFunction } from '../../hooks/useTrackingFunctions';
import { useTrips } from '../../api/Trips';

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

    setIsTracking();

    createTrip(formatData());
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

      <Text>{`Distance: ${distance} Miles`}</Text>
      <Text>{`Current Speed: ${getCurentSpeed()} MPH`}</Text>
      <Text>{`Average Speed: ${getAverageSpeed()} MPH`}</Text>

      <Text>{`Duration: ${moment.utc(duration * 1000).format('HH:mm:ss')}`}</Text>
      <Button title='STOP' onPress={() => stopTracking()} />
      <Button title='GET MEEE' onPress={() => getAllTrips()} />
      <Button title='GET 1' onPress={() => getTrip()} />
    </SafeAreaView>
  );
}
