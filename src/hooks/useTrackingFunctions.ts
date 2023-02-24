import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import moment from 'moment';
import { useCallback, useEffect } from 'react';
import { LatLng } from 'react-native-maps';
import { ITrackingObj } from '../components/Create/Tracking';

export const getTrackingFunction = (
  location: ITrackingObj,
  distance: number,
  setDistance: (x: number) => void
) => {
  const options = {
    accuracy: Location.Accuracy.BestForNavigation,
    timeInterval: 1000,
    distanceInterval: 3,
  };

  const convertToMinutesPerMile = useCallback((): string => {
    const metersPerMile = 1609.34; // Number of meters in a mile
    const secondsPerMinute = 60; // Number of seconds in a minute
    const milesPerSecond = (location.currLocation?.coords.speed ?? 0) / metersPerMile; // Convert meters per second to miles per second
    const secondsPerMile = 1 / milesPerSecond; // Number of seconds it takes to run a mile
    const minutesPerMile = secondsPerMile / secondsPerMinute; // Convert seconds per mile to minutes per mile
    return moment.utc(minutesPerMile * 1000 * 60).format('mm:ss');
  }, [location.currLocation?.coords.speed]);

  // Converts coordinates in order to draw polylines
  const getPolylineCoords = useCallback((): LatLng[] => {
    return (location!.locationArray ?? []).map((x) => ({
      latitude: x.coords.latitude,
      longitude: x.coords.longitude,
    }));
  }, [location!.locationArray]);

  // Updates distance
  useEffect(() => {
    const coordsLength = location.locationArray.length;
    if (coordsLength > 2) {
      setDistance(
        distance +
          0.000621 *
            getDistance(
              {
                longitude: location.locationArray[coordsLength - 2].coords.longitude,
                latitude: location.locationArray[coordsLength - 2].coords.latitude,
              },
              {
                longitude: location.locationArray[coordsLength - 1].coords.longitude,
                latitude: location.locationArray[coordsLength - 1].coords.latitude,
              },
              1
            )
      );
    }
  }, [location]);

  return { options, convertToMinutesPerMile, getPolylineCoords };
};
