import { View, Text } from 'react-native';
import React from 'react';
import { styles } from './styles';

export const MetricsDisplay = ({ header, body }: { header: string; body: string }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{header}</Text>
      <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.body}>
        {body}
      </Text>
    </View>
  );
};
