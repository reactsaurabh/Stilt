/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {getCashFreeToken, getUserInformation} from '../actions';
import Spinner from '../components/UI/Spinner';
import {PRIMARY, WHITE} from '../utils/colors';
import {DEVICE_WIDTH} from '../utils/helper';
import {goTo} from './navigation';
const CONTENT = [
  {
    id: '0',
    image: require('../assets/images/quick-actions/stilt-real-estate-proptech-new-asset.png'),
    text: 'Add Property',
    path: 'addProperty',
  },
  {
    id: '1',
    image: require('../assets/images/quick-actions/stilt-real-estate-proptech-new-transaction.png'),
    text: 'New Agreement',
  },
  {
    id: '2',
    image: require('../assets/images/quick-actions/stilt-real-estate-proptech-new-agreement.png'),
    text: 'Add Vendors',
    path: 'createvendor',
  },
];

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
    };
  }
  async componentDidMount() {
    // no need to unregister navigation event on screen destroy. It will automatically unregistered at the runtime
    this.navigationEventListener = Navigation.events().bindComponent(this);
    const notificationToken = await AsyncStorage.getItem('fcmToken');

    if (!this.props.userInfo.isSuccess) {
      this.props.getUserInformation(this.props.componentId, notificationToken);
    }

    if (!this.props.cashFreeToken.isSuccess) {
      this.props.getCashFreeToken();
    }
  }

  navigationButtonPressed({buttonId}) {
    // handling toggleMenu click
    if (buttonId === 'ham_btn' && this.props.userInfo.isSuccess) {
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

  renderHeader = text => {
    //View to set in Header
    return (
      <View
        style={{
          margin: 16,
        }}>
        <Text style={{color: PRIMARY, fontSize: 18, fontWeight: 'bold'}}>
          {text}
        </Text>
      </View>
    );
  };

  handleBannerClick = () => {
    goTo('bharatBillPay');
  };

  render() {
    const {isLoading} = this.props.userInfo;
    return (
      <>
        <View style={{flex: 1, backgroundColor: WHITE}}>
          {this.renderHeader('My Tasks')}
          <View style={styles.dashboardView}>
            {CONTENT.map(item => (
              <TouchableOpacity
                style={styles.dashboardItem}
                key={item.text}
                onPress={() => {
                  if (item.path) {
                    goTo(`${item.path}`);
                  }
                }}>
                <Image
                  resizeMode={'contain'}
                  style={styles.property_image}
                  source={item.image}
                />
                <View style={{marginTop: 8}}>
                  <Text style={{fontSize: 10, fontWeight: '200'}}>
                    {item.text}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {this.renderHeader('Utility & Bill Payments')}
          <TouchableOpacity
            style={styles.bannerView}
            onPress={this.handleBannerClick}>
            <Image
              style={styles.banner}
              resizeMode="stretch"
              source={require('../assets/images/stilt-mobile-proptech-real-estate=bbps-banner.jpg')}
            />
          </TouchableOpacity>
        </View>
        {isLoading && <Spinner color={PRIMARY} size="large" />}
      </>
    );
  }
}

const mapStateToProps = ({userInfo, cashFreeToken}) => ({
  userInfo,
  cashFreeToken,
});

export default connect(
  mapStateToProps,
  {
    getUserInformation,
    getCashFreeToken,
  },
)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dashboardView: {flexDirection: 'row', justifyContent: 'space-evenly'},
  dashboardItem: {
    flexDirection: 'column',
    width: widthPercentageToDP('30%'),
    alignItems: 'center',
  },
  property_image: {
    width: '100%',
    height: 90,
  },

  banner: {
    width: DEVICE_WIDTH - 32,
    height: 100,
    marginLeft: 16,
  },
});
