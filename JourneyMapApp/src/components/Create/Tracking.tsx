import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Text } from 'react-native';

export type ITrackingObj = {
  currLocation?: LocationObject;
  locationArray?: LocationObject[];
};

type ITracker = {
  initialLocation: LocationObject;
  setIsTracking: () => void;
};

export function Tracking({ initialLocation, setIsTracking }: ITracker) {
  const [location, setLocation] = useState<ITrackingObj>({ currLocation: initialLocation });
  const [watcher, setWatcher] = useState<Location.LocationSubscription>();

  useEffect(() => {
    const options = { enableHighAccuracy: true, timeInterval: 1000, distanceInterval: 1 };
    Location.watchPositionAsync(options, (currentLocation) => {
      console.log({ currentLocation });
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
  }, []);

  console.log(location.locationArray?.length ?? 0);

  const stopTracking = useCallback(() => {
    watcher?.remove();

    setIsTracking();
  }, [watcher, setIsTracking]);

  return (
    <>
      <Text>
        {location.currLocation?.coords.latitude ?? 'None'},{' '}
        {location.currLocation?.coords.longitude ?? 'None'}{' '}
      </Text>

      <Text>{location.locationArray?.length ?? 0}</Text>
      <Button title='STOP' onPress={() => stopTracking()} />
    </>
  );
}
