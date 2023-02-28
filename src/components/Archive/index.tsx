import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MapView, { LatLng, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { styles } from './styles';
import { TripData } from '../../api/Trips';

const getLatLngCoords = (coords: number[][]) => {
  return coords.map((x) => {
    return { longitude: x[1], latitude: x[0] };
  }) as LatLng[];
};

export function ArchiveComponent({ id, item }: TripData) {
  const { duration, distance, average_speed } = item.details;

  console.log(item.point_coords[0][0]);
  return (
    <TouchableOpacity
      style={styles.touchableConatiner}
      activeOpacity={0.7}
      onPress={() => console.log('PRESS')}
    >
      <>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.mapBorder}>
          <MapView
            style={styles.map}
            mapType='hybrid'
            provider={PROVIDER_GOOGLE}
            scrollEnabled={false}
            region={{
              latitude: item.point_coords[0][1],
              longitude: item.point_coords[0][1],
              latitudeDelta: 0.003,
              longitudeDelta: 0.003,
            }}
          >
            <Polyline
              coordinates={getLatLngCoords(item.point_coords)}
              strokeWidth={5}
              strokeColor='white'
            />
          </MapView>
        </View>
        <Text style={styles.statistics} children={`Duration: ${duration}`} />
        <Text style={styles.statistics} children={`Mileage: ${distance}`} />
        <Text style={styles.statistics} children={`Speed: ${average_speed}`} />
      </>
    </TouchableOpacity>
  );
}
