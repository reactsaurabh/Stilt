import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import SettingsBoxView from './SettingsBoxView';
import {PURPLE} from '../../utils/colors';
import {goTo} from '../../screens/navigation';
const OPTION = [
  {
    iconComponent: Feather,
    iconName: 'user',
    text: 'Profile',
    onPress: () => goTo('profile'),
  },
  {
    iconComponent: FontAwesome,
    iconName: 'credit-card',
    text: 'Accounts',
    onPress: () => goTo('accounts'),
  },
  {
    iconComponent: Feather,
    iconName: 'user-check',
    text: 'KYC',
    onPress: () => {},
  },
  {
    iconComponent: Feather,
    iconName: 'shield',
    text: 'Security',
    onPress: () => {},
  },
  {
    iconComponent: SimpleLineIcons,
    iconName: 'bag',
    text: 'Subscription',
    onPress: () => {},
  },
  {
    iconComponent: AntDesign,
    iconName: 'gift',
    text: 'Offers',
    onPress: () => {},
  },
];
const SettingsUserRelatedOptions = () => (
  <SettingsBoxView option={OPTION} iconColor={PURPLE} />
);

export default SettingsUserRelatedOptions;
