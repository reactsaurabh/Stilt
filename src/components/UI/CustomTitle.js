import React from 'react';
import {Image} from 'react-native';

const CustomTitle = () => {
  return (
    <Image
      source={require('../../assets/images/intro_logo.png')}
      resizeMode="contain"
      style={{width: 50, height: 50}}
    />
  );
};

export default CustomTitle;
