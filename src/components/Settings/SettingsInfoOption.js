import React from 'react';
import {View, Text} from 'react-native';
import SettingsBoxView from './SettingsBoxView';
import Feather from 'react-native-vector-icons/Feather';
import {GRAY_300} from '../../utils/colors';
import {useDispatch} from 'react-redux';
import {logout} from '../../actions';
import {goToAuth} from '../../screens/navigation';
import firebase from 'react-native-firebase';
import {showSnackbar} from '../../utils/helper';

const SettingsInfoOption = () => {
  const dispatch = useDispatch();
  const signOut = () =>
    firebase
      .auth()
      .signOut()
      .then(() => {
        goToAuth();
        dispatch(logout());
      })
      .catch(error => showSnackbar('Something Went Wrong'));
  const OPTION = [
    {
      iconComponent: Feather,
      iconName: 'help-circle',
      text: 'Help',
      onPress: () => {},
    },
    {
      iconComponent: Feather,
      iconName: 'info',
      text: 'About',
      onPress: () => {},
    },
    {
      iconComponent: Feather,
      iconName: 'power',
      text: 'Logout',
      onPress: signOut,
    },
  ];
  return <SettingsBoxView iconColor={GRAY_300} option={OPTION} />;
};

export default SettingsInfoOption;
