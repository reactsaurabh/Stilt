import React, {Component} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  PixelRatio,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
} from '../components/BackButton/androidBackButton';
import {BLACK, GRAY_300, PRIMARY_DARK, WHITE, PRIMARY} from '../utils/colors';
import {goTo} from './navigation';
import CButton from '../components/UI/CButton';
const {width} = Dimensions.get('window');
const data1 = ['1', '2', '1', '2'];
class PaymentTransation extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // no need to unregister navigation event on screen destroy. It will automatically unregistered at the runtime
    this.navigationEventListener = Navigation.events().bindComponent(this);
    handleAndroidBackButton(() => {
      goTo('myservices');
    });
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
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
    } else {
      goTo('myservices');
    }
  }

  render() {
    return (
      <View style={styles.safeAreaView}>
        <Text
          style={{
            color: PRIMARY,
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 6,
          }}>
          {`Salary`}
        </Text>
        <Text
          style={{
            color: PRIMARY_DARK,
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 6,
          }}>
          {`₹ 24,000.00`}
        </Text>
        <Text style={[styles.subText, {marginTop: 12}]}>24 FEB 2020,9 AM</Text>
        <View style={{flexDirection: 'row', marginTop: 12}}>
          <View>
            <Text style={styles.subText}>Payment Status</Text>
            <Text style={styles.title}>Completed</Text>
          </View>
          <Image
            style={styles.success}
            source={require('../assets/images/selected.png')}
          />
        </View>

        <Text style={[styles.subText, {marginTop: 12}]}>To</Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{marginTop: 12}}>
            <Text style={styles.title}>Ramesh</Text>
            <Text style={styles.subText}>9898989898</Text>
          </View>
          <Image
            style={styles.sericeMenImage}
            source={require('../assets/images/roles/stilt-tenant.png')}
          />
        </View>
        <Text style={styles.subText}>From</Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{marginTop: 12}}>
            <Text style={styles.title}>Sourav Raj</Text>
            <Text style={styles.subText}>9898989898</Text>
          </View>
          <Image
            style={styles.sericeMenImage}
            source={require('../assets/images/roles/stilt-tenant.png')}
          />
        </View>
        <View style={{marginTop: 18}}>
          <Text style={styles.subText}>Comments</Text>
          <Text style={styles.title}>Salary Feb 2020</Text>
        </View>
        <View style={{marginTop: 18}}>
          <Text style={styles.subText}>UPI ID</Text>
          <Text style={styles.title}>9239239239293</Text>
        </View>
        <CButton
          onPress={() => {
            goTo('vendorpayment');
          }}
          text={'Repeat Transaction'}
          borderColor={GRAY_300}
          color={GRAY_300}
          backgroundColor={WHITE}
          width={'100%'}
          style={{marginTop: 12, botttom: 12}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: WHITE,
    padding: 18,
  },

  title: {
    color: BLACK,
    fontSize: 16,
  },
  subText: {
    color: GRAY_300,
    fontSize: 12,
  },
  sericeMenImage: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    overflow: 'hidden',
    marginVertical: 14,
    marginLeft: 'auto',
  },
  success: {
    width: 40,
    height: 40,
    marginLeft: 'auto',
  },
});

export default PaymentTransation;
