import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import moment from 'moment';
import { useCallback, useEffect } from 'react';
import { LatLng } from 'react-native-maps';
import { ITrackingObj } from '../components/Create';
import { TripDataInput } from '../api/useTrips';

const fakeCoords: Location.LocationObject[] = [
  {
    coords: {
      longitude: 0,
      latitude: 0,
      altitude: 0,
      accuracy: 0,
      altitudeAccuracy: 0,
      heading: 0,
      speed: 0,
    },
    timestamp: 0,
  },
];

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
  location: ITrackingObj | undefined,
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
    if (location === undefined) return '0';
    return convertToMinutesPerMile(location.currLocation?.coords.speed);
  }, [location]);

  const getAverageSpeed = useCallback(() => {
    if (location === undefined) return '0';

    const sumSpeed = location.locationArray.reduce(
      (sum, location) => sum + (location.coords.speed ?? 0),
      0
    );
    const coordsLen = location.locationArray.length;
    return convertToMinutesPerMile(sumSpeed / coordsLen);
  }, [location?.locationArray]);

  // Converts coordinates in order to draw polylines
  const getSimplifiedCoords = useCallback((): LatLng[] => {
    const coords = location === undefined ? fakeCoords : location!.locationArray;

    return coords.map((x) => ({
      latitude: x.coords.latitude,
      longitude: x.coords.longitude,
    }));
  }, [location?.locationArray]);

  // Converts coordinates to push to backend
  const getExportableCoords = useCallback((location: ITrackingObj | undefined) => {
    const coords = location === undefined ? fakeCoords : location!.locationArray;

    return coords.map((x) => [x.coords.latitude, x.coords.longitude]);
  }, []);

  // Updates distance
  useEffect(() => {
    if (location !== undefined) {
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
        // console.log(currDistance);
        const currRoundedDistance = Math.round(currDistance * 10000) / 10000;
        // console.log(currRoundedDistance);
        setDistance(currRoundedDistance);
      }
    }
  }, [location?.locationArray]);

  const formatData = (
    location: ITrackingObj | undefined,
    distance: number,
    duration: number
  ): TripDataInput => {
    console.log('Here');
    console.log(location);

    const titleDate = location === undefined ? 0 : location!.locationArray[0].timestamp;
    const startTime = location === undefined ? 0 : location.locationArray[0].timestamp;
    const endTime =
      location === undefined
        ? 0
        : location.locationArray[location!.locationArray.length - 1].timestamp;
    const data = {
      title: getTitle(titleDate),
      point_coords: getExportableCoords(location),
      details: {
        distance: distance.toString(),
        duration: duration.toString(),
        average_speed: getAverageSpeed(),
        start_time: startTime,
        end_time: endTime,
      },
    };
    return data;
  };

  return { options, getCurentSpeed, getAverageSpeed, getSimplifiedCoords, formatData };
};
