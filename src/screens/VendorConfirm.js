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

class VendorConfirm extends Component {
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
        <Text style={styles.congrates}>{`Congratulations`}</Text>
        <Image
          style={styles.success}
          source={require('../assets/images/selected.png')}
        />
        <Text style={styles.title}>{`You added new Vendor`}</Text>
        {this.props.service.data != undefined ? (
          <View>
            <Text style={styles.subText}>
              {this.props.service.data.fullName}
            </Text>
            <Text style={styles.subText}>
              {this.props.service.data.mobileNumber}
            </Text>
            <Text style={styles.subText}>
              {this.props.service.data.vendorCategory}
            </Text>
          </View>
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            bottom: 20,
            position: 'absolute',
          }}>
          <CButton
            onPress={() => {
              goTo('myservices');
            }}
            text={'Back to Services'}
            borderColor={GRAY_300}
            color={PRIMARY_DARK}
            backgroundColor={WHITE}
            style={{width: '48%', marginRight: 12}}
          />
          <CButton
            onPress={() => {
              goTo('createvendor');
            }}
            text={'Add Another'}
            borderColor={PRIMARY_DARK}
            color={'white'}
            backgroundColor={PRIMARY_DARK}
            style={{width: '48%'}}
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
)(VendorConfirm);
