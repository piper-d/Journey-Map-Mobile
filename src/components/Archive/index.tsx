import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MapView, { LatLng, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { styles } from './styles';
import { TripData } from '../../api/Trips';

function calculateLatLngDelta(latLngs: LatLng[]) {
  if (latLngs.length === 1) {
    return { latitudeDelta: 0.003, longitudeDelta: 0.003 };
  }

  const lats = latLngs.map((latLng) => latLng.latitude);
  const lngs = latLngs.map((latLng) => latLng.longitude);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latitudeDelta = maxLat - minLat;
  const longitudeDelta = maxLng - minLng;

  return { latitudeDelta, longitudeDelta };
}

const getLatLngCoords = (coords: any[][]) => {
  return coords.map((x) => {
    const formattedCoords = Object.values(x);
    return { latitude: formattedCoords[0], longitude: formattedCoords[1] };
  }) as LatLng[];
};

export function ArchiveComponent({ id, item }: TripData) {
  const { duration, distance, average_speed } = item.details;

  const latLngCoords = getLatLngCoords(item.point_coords);
  const latLngDelta = calculateLatLngDelta(latLngCoords);
  console.log(calculateLatLngDelta(latLngCoords));
  console.log(latLngCoords);

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
              ...latLngCoords[0],
              ...latLngDelta,
            }}
          >
            <Polyline coordinates={latLngCoords} strokeWidth={5} strokeColor='white' />
          </MapView>
        </View>
        <Text style={styles.statistics} children={`Duration: ${duration}`} />
        <Text style={styles.statistics} children={`Mileage: ${distance}`} />
        <Text style={styles.statistics} children={`Speed: ${average_speed}`} />
      </>
    </TouchableOpacity>
  );
}
