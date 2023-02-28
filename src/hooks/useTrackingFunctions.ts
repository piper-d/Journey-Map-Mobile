import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import moment from 'moment';
import { useCallback, useEffect } from 'react';
import { LatLng } from 'react-native-maps';
import { ITrackingObj } from '../components/Create';
import { TripDataInput } from '../api/Trips';

// Converts current speed from meters per second to MPH
const convertToMinutesPerMile = (metersPerSecond: number | null): string => {
  if (metersPerSecond === null) return 'Not found';

  const metersPerMile = 1609.34;
  const minutesPerMile = metersPerMile / (metersPerSecond * 60);
  return moment.utc(minutesPerMile * 1000 * 60).format('mm:ss');
};

const getTitle = (start_time: number) => {
  const date = moment(start_time).format('MM/DD/YYYY');
  const time = moment(start_time).format('hh:mm');

  return `Trip on ${date} at ${time}`;
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
  }, [location.currLocation?.coords.speed]);

  const getAverageSpeed = useCallback(() => {
    const sumSpeed = location.locationArray.reduce(
      (sum, location) => sum + (location.coords.speed ?? 0),
      0
    );
    const coordsLen = location.locationArray.length;
    return convertToMinutesPerMile(sumSpeed / coordsLen);
  }, [location.locationArray]);

  // Converts coordinates in order to draw polylines
  const getSimplifiedCoords = useCallback((): LatLng[] => {
    return (location!.locationArray ?? []).map((x) => ({
      latitude: x.coords.latitude,
      longitude: x.coords.longitude,
    }));
  }, [location!.locationArray]);

  // Converts coordinates in order to draw polylines
  const getExportableCoords = useCallback(() => {
    return (location!.locationArray ?? []).map((x) => [x.coords.latitude, x.coords.longitude]);
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

  const formatData = useCallback((): TripDataInput => {
    const data = {
      title: getTitle(location.locationArray[0].timestamp),
      point_coords: getExportableCoords(),
      details: {
        distance: distance,
        duration: duration,
        average_speed: getAverageSpeed(),
        start_time: location.locationArray[0].timestamp,
        end_time: location.locationArray[location.locationArray.length - 1].timestamp,
      },
    };
    return data;
  }, [location.locationArray, distance, duration, getAverageSpeed]);

  return { options, getCurentSpeed, getAverageSpeed, getSimplifiedCoords, formatData };
};
