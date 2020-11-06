import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {GRAY_400} from '../../utils/colors';

const SettingsBox = ({
  iconComponent: IconComponent,
  iconName,
  text,
  color,
  onPress,
  noMargin,
}) => {
  return (
    <TouchableOpacity
      style={[styles.box, noMargin && {marginRight: 0}]}
      onPress={onPress}>
      <IconComponent name={iconName} size={20} color={color} />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  box: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: 10,
    backgroundColor: '#F5F8FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('4%'),
    marginRight: wp('10%') / 3,
  },
  text: {
    marginTop: hp('1%'),
    fontSize: hp('1.5%'),
    color: GRAY_400,
  },
});

export default SettingsBox;
