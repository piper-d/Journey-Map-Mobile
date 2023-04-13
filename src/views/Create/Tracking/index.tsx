import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ImageBackground, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { useTrips } from '../../../api/useTrips';
import { getTrackingFunction } from '../../../hooks/useTrackingFunctions';
import { styles } from './styles';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CameraDialog } from '../../../components/Create/CameraDialog';
import { Loader } from '../../../components/custom/Loader';
import { MetricsDisplay } from '../../../components/custom/MetricsDisplay';
import { useMedia } from '../../../hooks/useMedia';

export type ITrackingObj = {
  currLocation: LocationObject;
  locationArray: LocationObject[];
};

export function TrackingView({
  initialLocation,
  setIsTracking,
  refreshArchive,
}: {
  initialLocation: LocationObject;
  setIsTracking: () => void;
  refreshArchive: () => void;
}) {
  const image = require('../../../.././assets/topographic.png');

  const [location, setLocation] = useState<ITrackingObj>({
    currLocation: initialLocation,
    locationArray: [initialLocation],
  });

  const [watcher, setWatcher] = useState<Location.LocationSubscription>();
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [durationTimerId, setDurationTimerId] = useState<NodeJS.Timer>();

  const { createTrip, addTripMedia } = useTrips();

  const { media, addMedia, removeMedia } = useMedia();

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

    const durationTimer = setInterval(() => {
      if (!isLoading) setDuration((prevDuration) => prevDuration + 1);
    }, 1000);
    setDurationTimerId(durationTimer);

    return () => {
      clearTimeout(durationTimer);
    };
  }, []);

  const stopTracking = () => {
    watcher?.remove();
    clearTimeout(durationTimerId);
    setIsLoading(true);

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
    }).then(async (response) => {
      if (media !== undefined && response !== undefined) {
        for (var i = 0; i < media?.length; i++) {
          await addTripMedia(response, media[i]);
        }
      }
      refreshArchive();
      setIsLoading(false);
      setIsTracking();
    });
  };

  const durationDisplay =
    duration > 3000
      ? `${moment.utc(duration * 1000).format('HH:mm:ss')}`
      : `${moment.utc(duration * 1000).format('mm:ss')}`;

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={styles.image} source={image} resizeMode='cover'>
        {isCameraOpen && (
          <CameraDialog
            media={media}
            addMedia={addMedia}
            removeMedia={removeMedia}
            isOpen={isCameraOpen}
            setIsOpen={(x: boolean) => setIsCameraOpen(x)}
            currLocation={location.currLocation}
          />
        )}
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
          <MetricsDisplay header={'Distance:'} body={`${Math.round(distance * 100) / 100} Mi`} />
          <MetricsDisplay isDuration={true} header={'Duration:'} body={durationDisplay} />
          <MetricsDisplay header={'Current Pace:'} body={`${getCurentSpeed()}`} />
          <MetricsDisplay header={'Average Pace:'} body={`${getAverageSpeed()}`} />
        </View>
        <View style={styles.buttonsContainer}>
          {!isLoading && (
            <>
              <TouchableOpacity style={styles.cameraButton} onPress={() => setIsCameraOpen(true)}>
                <MaterialCommunityIcons name='camera' color='white' size={50} />
                <View style={styles.imageLength}>
                  <Text style={{ color: 'grey' }}>{media === undefined ? 0 : media.length}</Text>
                </View>
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
