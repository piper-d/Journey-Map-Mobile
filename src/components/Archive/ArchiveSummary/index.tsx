import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MapView, { LatLng, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { styles } from './styles';
import { TripData } from '../../../api/useTrips';
import { ArchiveDialog } from '../ArchiveDialog';
import moment from 'moment';

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

export function ArchiveSummary({ id, item, setItems }: TripData & { setItems: () => void }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // console.log(item);

  const { duration, distance, average_speed } = item.details;

  const latLngCoords = getLatLngCoords(item.point_coords);
  const latLngDelta = calculateLatLngDelta(latLngCoords);

  return (
    <>
      {isOpen && (
        <ArchiveDialog
          id={item.id}
          title={item.title}
          isOpen={isOpen}
          setIsOpen={(x) => setIsOpen(x)}
          setItems={() => setItems()}
        />
      )}

      <TouchableOpacity
        style={styles.touchableConatiner}
        activeOpacity={0.7}
        onPress={() => setIsOpen(true)}
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
          <Text
            style={styles.statistics}
            children={`Duration: ${moment.utc(Number(duration) * 1000).format('HH:mm:ss')}`}
          />
          <Text style={styles.statistics} children={`Mileage: ${distance} Mi`} />
          <Text style={styles.statistics} children={`Speed: ${average_speed} MPH`} />
        </>
      </TouchableOpacity>
    </>
  );
}
