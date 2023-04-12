import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import moment from 'moment';
import { useCallback, useEffect } from 'react';
import { LatLng } from 'react-native-maps';
import { ITrackingObj } from '../views/Create/Tracking';
import { TripDataInput } from '../types/TripTypes';

// Converts current speed from meters per second to MPH
const convertToMinutesPerMile = (metersPerSecond: number | null): string => {
  if (metersPerSecond === null) return 'Not found';
  if (metersPerSecond === 0) {
    return '00:00';
  }

  const metersPerMile = 1609.34;
  const minutesPerMile = metersPerMile / (metersPerSecond * 60);
  return moment.utc(minutesPerMile * 1000 * 60).format('mm:ss');
};

export const getTrackingFunction = (
  location: ITrackingObj,
  distance: number,
  duration: number,
  setDistance: (x: number) => void
) => {
  const options = {
    accuracy: Location.Accuracy.BestForNavigation,
    timeInterval: 1000,
    distanceInterval: 3,
  };

  const getCurentSpeed = useCallback(() => {
    return convertToMinutesPerMile(location.currLocation?.coords.speed);
  }, [location.locationArray]);

  const getAverageSpeed = useCallback(() => {
    const sumSpeed = location.locationArray.reduce(
      (sum, location) => sum + (location.coords.speed ?? 0),
      0
    );
    const coordsLen = location.locationArray.length;
    return convertToMinutesPerMile(sumSpeed / coordsLen);
  }, [location?.locationArray]);

  // Converts coordinates in order to draw polylines
  const getSimplifiedCoords = useCallback((): LatLng[] => {
    return location?.locationArray.map((x) => ({
      latitude: x.coords.latitude,
      longitude: x.coords.longitude,
    }));
  }, [location?.locationArray]);

  // Converts coordinates to push to backend
  const getExportableCoords = useCallback(() => {
    return location.locationArray.map((x) => [x.coords.latitude, x.coords.longitude]);
  }, [location.locationArray]);

  // Updates distance
  useEffect(() => {
    const coordsLength = location.locationArray.length;
    if (coordsLength > 2) {
      const currDistance =
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
          );
      const currRoundedDistance = Math.round(currDistance * 100000) / 100000;
      setDistance(currRoundedDistance);
    }
  }, [location?.locationArray]);

  const getTitle = (start_time: number) => {
    const date = moment(start_time).format('MM/DD/YYYY');
    const time = moment(start_time).format('hh:mm');

    return `Trip on ${date} at ${time}`;
  };

  const formatData = useCallback((): TripDataInput => {
    const data = {
      title: getTitle(location.locationArray[0].timestamp),
      point_coords: getExportableCoords(),
      details: {
        distance: (Math.round(distance * 1000) / 1000).toString(),
        duration: duration.toString(),
        average_speed: getAverageSpeed(),
        start_time: location.locationArray[0].timestamp,
        end_time: location.locationArray[location.locationArray.length - 1].timestamp,
      },
    };
    return data;
  }, [location.locationArray, distance, duration, getAverageSpeed]);

  return {
    options,
    getCurentSpeed,
    getAverageSpeed,
    getSimplifiedCoords,
    formatData,
    getTitle,
    getExportableCoords,
  };
};
