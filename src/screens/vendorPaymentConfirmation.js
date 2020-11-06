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
import {connect} from 'react-redux';
import {Navigation} from 'react-native-navigation';
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
} from '../components/BackButton/androidBackButton';
import {BLACK, GRAY_300, PRIMARY_DARK, WHITE, PRIMARY} from '../utils/colors';
import {addNewVendor} from '../actions';
import {goTo} from './navigation';
const {width} = Dimensions.get('window');
const data1 = ['1', '2', '1', '2'];
import CButton from '../components/UI/CButton';

class VendorPaymentConfirm extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // no need to unregister navigation event on screen destroy. It will automatically unregistered at the runtime
    this.navigationEventListener = Navigation.events().bindComponent(this);
    handleAndroidBackButton(() => {
      goTo('vendorpayment');
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
      goTo('vendorpayment');
    }
  }

  render() {
    //const { fullName, mobileNumber, vendorCategory } = this.props.service.selectedVendor;

    return (
      <View style={styles.safeAreaView}>
        <Text style={styles.congrates}>{`Congratulations`}</Text>
        <Image
          style={styles.success}
          source={require('../assets/images/selected.png')}
        />
        <Text style={styles.title}>{`You Paid ${
          this.props.service.selectedVendor.monthAmount
        }`}</Text>
        {this.props.service.selectedVendor != undefined ||
        this.props.service.selectedVendor != null ? (
          <View style={{alignSelf: 'center'}}>
            <Text style={styles.subText}>
              {this.props.service.selectedVendor.fullName}
            </Text>
            <Text style={styles.subText}>
              {this.props.service.selectedVendor.mobileNumber}
            </Text>
            <Text style={styles.subText}>
              {this.props.service.selectedVendor.vendorCategory}
            </Text>
          </View>
        ) : null}
        <View style={{width: '100%', bottom: 20, position: 'absolute'}}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: WHITE,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  congrates: {
    color: '#00d79a',
    fontSize: 20,
    marginVertical: 18,
  },
  success: {
    width: 80,
    height: 80,
  },

  title: {
    color: BLACK,
    fontSize: 18,
    marginVertical: 30,
  },
  subText: {
    color: BLACK,
    fontSize: 18,
    marginTop: 12,
    textAlign: 'center',
  },
});

const mapStateToProps = ({userInfo, service}) => ({
  userInfo,
  service,
});

export default connect(
  mapStateToProps,
  {addNewVendor},
)(VendorPaymentConfirm);
