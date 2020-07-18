import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Icon = (props) => {
  const { name, color } = props;
  return (
    <Ionicons name={`${Platform.OS === 'ios' ? 'ios' : 'md'}-${name}`} size={25} color={color} />
  );
};

export default Icon;
