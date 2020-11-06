import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  PixelRatio,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import {getNotifications, addNewEvent, deleteVendor} from '../actions';
import Spinner from '../components/UI/Spinner';
import Swipeout from 'react-native-swipeout';

import {
  PRIMARY,
  WHITE,
  BLACK,
  GRAY_300,
  GRAY_200,
  PRIMARY_DARK,
} from '../utils/colors';

import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
} from '../components/BackButton/androidBackButton';
import {goTo} from './navigation';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const {width} = Dimensions.get('window');

import {
  getVendors,
  getVendorsByCategory,
  setNavigationTitle,
  getVendorsById,
} from '../actions';
import {DEVICE_WIDTH} from '../utils/helper';

const data = [
  {
    title: 'Milk',
    avtar: require('../assets/category/milk.jpg'),
  },
  {
    title: 'Grocery',
    avtar: require('../assets/category/grocery.jpg'),
  },
  {
    title: 'Bakery',
    avtar: require('../assets/category/bakery.jpg'),
  },
  {
    title: 'Flowers',
    avtar: require('../assets/category/flowers.jpg'),
  },
  {
    title: 'NewsPaper',
    avtar: require('../assets/category/newspaper.jpg'),
  },
  {
    title: 'Carpenter',
    avtar: require('../assets/category/carpenter.jpg'),
  },
  {
    title: 'Maid',
    avtar: require('../assets/category/housemaid.jpg'),
  },
  {
    title: 'Driver',
    avtar: require('../assets/category/driver.jpg'),
  },
  {
    title: 'Plumber',
    avtar: require('../assets/category/plumber.jpg'),
  },
  {
    title: 'Mechanic',
    avtar: require('../assets/category/mechanic.jpg'),
  },
];

const data1 = ['1', '2', '1', '2'];

function lowerFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

class MyServices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vendorList: [],
    };
  }

  componentDidMount() {
    this.navigationEventListener = Navigation.events().bindComponent(this);
    handleAndroidBackButton(() => {
      goTo('home');
    });

    this.props.getVendors(this.props.userInfo.data.mobile);
  }

  componentDidUpdate = prevProps => {
    const {data} = this.props.service;
    if (data && data != prevProps.service.data) {
      this.setState({vendorList: data});
    }
  };

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
    }
  }

  deleteVendor = item => {
    Alert.alert(
      'Delete Vendor',
      'Are you sure to delete this vendor? The deleted vendor can not be undo.',
      [
        {
          text: 'yes',
          onPress: () => {
            //alert(item.docId)
            this.props.deleteVendor(item.docId);
          },
        },
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  _renderItem = ({item, index}) => {
    let swipeBtns = [
      {
        text: 'Delete',
        backgroundColor: '#DD0000',
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => {
          this.deleteVendor(item);
        },
      },
    ];
    return (
      <Swipeout
        right={swipeBtns}
        autoClose={true}
        backgroundColor="transparent">
        <View
          style={{
            flexDirection: 'row',
            height: 50,
            //margin: 6,
            // margin: 10,
            marginTop: 10,
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={styles.sericeMenImage}
            source={
              !item.data.avatarImage
                ? require('../assets/images/roles/stilt-tenant.png')
                : {uri: item.data.avatarImage}
            }
          />
          <View
            style={{
              marginLeft: 24,
              //marginTop: 24,
              flexDirection: 'column',
              justifyContent: 'center',
              //width: '70%',
            }}>
            <Text style={styles.serviceMen}>
              {item.data().firstName} {item.data().lastName}
            </Text>
            <Text style={styles.serviceType}>{item.data().vendorCategory}</Text>
          </View>

          <View
            style={{
              position: 'absolute',
              right: 10,
              backgroundColor: 'red',
              width: '14%',
              borderRadius: 5,
              backgroundColor: PRIMARY,
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                // this.props.getVendorsById(item.id);
                this.props.setNavigationTitle('Vendor Payment');
                goTo('vendorpayment', {
                  selectedVendor: {id: item.id, ...item.data()},
                });
                //alert(item.docId)
              }}>
              <Text
                style={{
                  margin: 5,
                  color: WHITE,
                  fontSize: DEVICE_WIDTH * 0.03,
                }}>
                {'Pay'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Swipeout>
    );
  };

  render() {
    const {vendorList} = this.state;
    const {isLoading} = this.props.service;
    return (
      <View style={styles.safeAreaView}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>{`My Sevices`}</Text>
          {vendorList.length == 0 ? (
            <Text style={styles.subtitle}>
              {`Add your Vendors and Local Services`}
            </Text>
          ) : (
            <FlatList
              contentContainerStyle={{
                marginHorizontal: 12,
                //alignSelf: 'center',
              }}
              keyExtractor={(item, index) => `${index}`}
              //style={{ flexGrow: 0 }}
              showsVerticalScrollIndicator={false}
              data={this.props.service.data}
              renderItem={this._renderItem}
            />
          )}

          <Text style={styles.heading}>{`Vendors & Local Services`}</Text>

          <FlatList
            numColumns={4}
            keyExtractor={(item, index) => index}
            style={{marginRight: 24}}
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={({item, index}) => (
              <View
                style={{
                  alignItems: 'space-between',
                  flex: 1 / 4,
                  alignContents: 'center',
                }}>
                {/* {{ alignContent: 'center', alignItems:'center', flexDirection:'column', width: '20%', margin: 5 }}> */}
                <TouchableOpacity
                  onPress={() => {
                    let category = lowerFirstLetter(item.title);
                    this.props.getVendorsByCategory(category);
                    this.props.setNavigationTitle('Vendor & Local Services');
                    goTo('vendorlocalservices');
                  }}
                  style={{
                    alignContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}>
                  <Image style={styles.serviceImage} source={item.avtar} />
                  <Text style={styles.serviceText}>{item.title}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </ScrollView>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => {
            this.props.setNavigationTitle('Add Vendor');
            goTo('createvendor');
          }}>
          <Image
            source={require('../assets/images/plus.png')}
            style={{width: 50, height: 50}}
          />
        </TouchableOpacity>
        {isLoading && <Spinner color={PRIMARY} size="large" />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaView: {flex: 1, backgroundColor: WHITE},
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 15,
    marginRight: 15,
  },
  heading: {
    color: PRIMARY,
    fontSize: 16 * PixelRatio.getFontScale(),
    margin: 16,
  },
  subtitle: {
    fontSize: 13 * PixelRatio.getFontScale(),
    color: GRAY_300,
    margin: 16,
  },
  serviceMen: {
    fontSize: 13 * PixelRatio.getFontScale(),
    color: BLACK,
  },
  serviceType: {
    fontSize: 12 * PixelRatio.getFontScale(),
    color: GRAY_300,
  },
  serviceText: {
    fontSize: DEVICE_WIDTH * 0.03,
    color: BLACK,
    alignSelf: 'center',
  },
  payButton: {
    fontSize: 12 * PixelRatio.getFontScale(),
    color: PRIMARY_DARK,
    fontWeight: '900',
    alignSelf: 'center',
    marginTop: 6,
    padding: 6,
  },
  serviceImage: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    marginVertical: 14,
  },
  sericeMenImage: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    overflow: 'hidden',
    marginVertical: 14,
  },
  fabButton: {
    width: 50,
    height: 50,
    right: 32,
    bottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.55,
    shadowRadius: 14.78,
    elevation: 8,
    position: 'absolute',
    zIndex: 5,
  },
});

const mapStateToProps = ({userInfo, service}) => ({
  userInfo,
  service,
});

export default connect(
  mapStateToProps,
  {
    getVendors,
    getVendorsByCategory,
    setNavigationTitle,
    getVendorsById,
    deleteVendor,
  },
)(MyServices);
