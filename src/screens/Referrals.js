import React, {Component} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {PRIMARY, WHITE} from '../utils/colors';
import {DEVICE_WIDTH} from '../utils/helper';
import {Navigation} from 'react-native-navigation';
import {goTo} from './navigation';
class Referrals extends Component {
  componentDidMount() {
    // no need to unregister navigation event on screen destroy. It will automatically unregistered at the runtime
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }

  navigationButtonPressed({buttonId}) {
    // handling toggleMenu click
    if (buttonId === 'ham_btn') {
      this.isSideDrawerVisible
        ? (this.isSideDrawerVisible = false)
        : (this.isSideDrawerVisible = true);
      Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
          left: {
            visible: true,
          },
        },
      });
    } 
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Referrals</Text>
        <Image
          source={require('../assets/images/stilt-mobile-coming-soon.png')}
          resizeMode="contain"
          style={styles.comingSoon}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: WHITE},
  heading: {color: PRIMARY, marginLeft: 10, marginTop: 10},
  comingSoon: {width: DEVICE_WIDTH},
});

export default Referrals;
