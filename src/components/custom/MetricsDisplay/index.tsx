import { View, Text } from 'react-native';
import React from 'react';
import { styles } from './styles';

export const MetricsDisplay = ({
  header,
  body,
  isDuration,
}: {
  header: string;
  body: string;
  isDuration?: boolean;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{header}</Text>
      <Text
        adjustsFontSizeToFit={isDuration}
        numberOfLines={1}
        style={isDuration ? styles.durationBody : styles.body}
      >
        {body}
      </Text>
    </View>
  );
};
