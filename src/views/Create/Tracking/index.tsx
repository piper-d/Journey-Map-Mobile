import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Alert, ImageBackground, SafeAreaView, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { useTrips } from '../../../api/useTrips';
import { getTrackingFunction } from '../../../hooks/useTrackingFunctions';
import { styles } from './styles';

import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Loader } from '../../../components/custom/Loader';
import { MetricsDisplay } from '../../../components/custom/MetricsDisplay';

export type ITrackingObj = {
  currLocation: LocationObject;
  locationArray: LocationObject[];
};

export function Tracking({
  initialLocation,
  setIsTracking,
  refreshArchive,
}: {
  initialLocation: LocationObject;
  setIsTracking: () => void;
  refreshArchive: () => void;
}) {
  const image = require('../../.././assets/topographic.png');

  const [location, setLocation] = useState<ITrackingObj>({
    currLocation: initialLocation,
    locationArray: [initialLocation],
  });

  const [watcher, setWatcher] = useState<Location.LocationSubscription>();
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { createTrip } = useTrips();

  const {
    options,
    getCurentSpeed,
    getAverageSpeed,
    getSimplifiedCoords,
    formatData,
    getTitle,
    getExportableCoords,
  } = getTrackingFunction(location, distance, duration, setDistance);

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
  const stopTracking = () => {
    setIsLoading(true);
    watcher?.remove();

    createTrip({
      title: getTitle(location.locationArray[0].timestamp),
      point_coords: getExportableCoords(),
      details: {
        distance: (Math.round(distance * 1000) / 1000).toString(),
        duration: duration.toString(),
        average_speed: getAverageSpeed(),
        start_time: location.locationArray[0].timestamp,
        end_time: location.locationArray[location.locationArray.length - 1].timestamp,
      },
    }).then(() => {
      refreshArchive();
      setIsLoading(false);
      setIsTracking();
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={styles.image} source={image} resizeMode='cover'>
        <View style={styles.mapContainer}>
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
        </View>

        <View style={styles.metricsContainer}>
          <MetricsDisplay header={'Distance:'} body={`${Math.round(distance * 1000) / 1000} Mi`} />
          <MetricsDisplay
            header={'Duration:'}
            body={`${moment.utc(duration * 1000).format('HH:mm:ss')}`}
          />
          <MetricsDisplay header={'Current Speed:'} body={`${getCurentSpeed()} MPH`} />
          <MetricsDisplay header={'Average Speed:'} body={`${getAverageSpeed()} MPH`} />
        </View>
        <View style={styles.buttonsContainer}>
          {!isLoading && (
            <>
              <TouchableOpacity style={styles.cameraButton} onPress={() => pickFromCamera()}>
                <MaterialCommunityIcons name='camera' color='white' size={50} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.stopButton} onPress={() => stopTracking()}>
                <MaterialCommunityIcons name='stop' color='white' size={42} />
              </TouchableOpacity>
            </>
          )}
          {isLoading && (
            <Loader
              color={'white'}
              style={{ justifyContent: 'center', alignSelf: 'center', height: '100%' }}
            />
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const pickFromCamera = async () => {
  const result = await ImagePicker.requestCameraPermissionsAsync();
  if (result.granted) {
    let data = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!data.canceled) {
      console.log(data.assets);
    }
  } else {
    Alert.alert('The app needs permission to access the camera. Please change this in settings.');
  }
};
