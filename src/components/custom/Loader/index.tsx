import React from 'react';
import { View, ActivityIndicator, ColorValue, StyleProp, ViewStyle } from 'react-native';

type SizeOptions = 'small' | 'large';

export const Loader = ({
  style,
  size,
  color,
}: {
  style?: StyleProp<ViewStyle>;
  size?: SizeOptions;
  color?: ColorValue;
}) => {
  const loaderStyle = style ?? {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  };

  const loaderSize = size ?? 'large';
  const loaderColor = color ?? 'white';

  return (
    <View style={loaderStyle}>
      <ActivityIndicator size={'large'} color={loaderColor} />
    </View>
  );
};
