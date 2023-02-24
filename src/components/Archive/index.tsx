import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { TripData } from '../../views/Archive';
import { styles } from './styles';

export function ArchiveComponent({ date, duration, mileage, speed }: TripData) {
  return (
    <TouchableOpacity
      style={styles.touchableConatiner}
      activeOpacity={0.7}
      onPress={() => console.log('PRESS')}
    >
      <>
        <Text style={styles.title}>Run on 10/19/2022 at 2:36 PM</Text>
        <View style={styles.mapBorder}>
          <MapView
            style={styles.map}
            mapType='hybrid'
            provider={PROVIDER_GOOGLE}
            scrollEnabled={false}

            // region={{
            //   latitude: initialLocation?.coords?.latitude!,
            //   longitude: initialLocation?.coords?.longitude!,
            //   latitudeDelta: 0.003,
            //   longitudeDelta: 0.003,
            // }}
          />
        </View>
        <Text style={styles.statistics} children={`Duration: ${duration}`} />
        <Text style={styles.statistics} children={`Mileage: ${mileage}`} />
        <Text style={styles.statistics} children={`Speed: ${speed}`} />
      </>
    </TouchableOpacity>
  );
}
