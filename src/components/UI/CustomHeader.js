import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import CustomTitle from './CustomTitle';
import TitleProfileImage from './TitleProfileImage';
import Icon from 'react-native-vector-icons/Ionicons';
import {GRAY_200} from '../../utils/colors';
import {Navigation} from 'react-native-navigation';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const CustomHeader = () => {
  const openSidebar = () => {
    Navigation.mergeOptions('sidemenu', {
      sideMenu: {
        left: {
          visible: true,
        },
      },
    });
  };
  return (
    <View
      style={[
        styles.header,
        Platform.OS === 'android' &&
          StatusBar.currentHeight > 30 && {
            height: 85,
          },
      ]}>
      <TouchableWithoutFeedback onPress={openSidebar}>
        <Icon name="ios-menu" size={25} />
      </TouchableWithoutFeedback>
      <CustomTitle />
      <TitleProfileImage />
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('100%'),
    height: 60,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    elevation: 5,
  },
});

export default CustomHeader;
