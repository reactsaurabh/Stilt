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
const {width} = Dimensions.get('window');
const data1 = ['1', '2', '1', '2'];
import {connect} from 'react-redux';
import CButton from '../components/UI/CButton';
import {TouchableOpacity} from 'react-native';
import {addToMyService} from '../actions';
import {DEVICE_WIDTH} from '../utils/helper';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class VendorLocalServices extends Component {
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

  onClickAddToService = () => {
    const vendorInfo = {
      addedByUser: true,
    };
    this.props.addToMyService(this.props.categoryVendor[0].docId, vendorInfo);
  };

  render() {
    return (
      <View style={styles.safeAreaView}>
        <Text style={styles.heading}>
          {this.props.categoryVendor && this.props.categoryVendor.length > 0
            ? capitalizeFirstLetter(
                this.props.categoryVendor[0].data.vendorCategory,
              )
            : ''}
        </Text>

        <FlatList
          contentContainerStyle={
            {
              //marginHorizontal: 12,
              //alignSelf: 'center',
            }
          }
          keyExtractor={(item, index) => index}
          //style={{ flexGrow: 0 }}
          showsVerticalScrollIndicator={false}
          data={this.props.categoryVendor}
          renderItem={({item, index}) => (
            <View
              style={{
                flexDirection: 'row',
                height: 50,
                //margin: 6,
                margin: 10,
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={styles.sericeMenImage}
                source={
                  item.data.avatarImage == ''
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
                <Text style={styles.serviceMen}>{item.data.fullName}</Text>
                <Text style={styles.serviceType}>
                  {item.data.vendorCategory}
                </Text>
              </View>

              <View
                style={{
                  position: 'absolute',
                  right: 10,
                  backgroundColor: 'red',
                  width: '14%',
                  borderRadius: 5,
                  backgroundColor: !item.data.addedByUser ? PRIMARY : WHITE,
                  alignContent: 'center',
                  alignItems: 'center',
                  borderColor: !item.data.addedByUser ? PRIMARY : GRAY_300,
                  borderWidth: 0.5,
                }}>
                <TouchableOpacity
                  onPress={() =>
                    item.data.addedByUser ? null : this.onClickAddToService()
                  }>
                  <Text
                    style={{
                      margin: 5,
                      color: item.data.addedByUser ? GRAY_300 : WHITE,
                      fontSize: DEVICE_WIDTH * 0.03,
                    }}>
                    {item.data.addedByUser ? 'Added' : 'Add'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaView: {flex: 1, backgroundColor: WHITE},
  serviceMen: {
    fontSize: 14 * PixelRatio.getFontScale(),
    color: BLACK,
  },
  heading: {
    color: PRIMARY,
    fontSize: 15 * PixelRatio.getFontScale(),
    margin: 16,
  },
  serviceType: {
    fontSize: 12 * PixelRatio.getFontScale(),
    color: GRAY_300,
  },
  addButton: {
    fontSize: 12 * PixelRatio.getFontScale(),
    fontWeight: '900',
    alignSelf: 'center',
    marginTop: 12,
  },
  sericeMenImage: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    overflow: 'hidden',
    //marginVertical: 14,
  },
});

function mapStateToProps(state) {
  return {
    categoryVendor: state.service.categoryVendor,
  };
}

export default connect(
  mapStateToProps,
  {addToMyService},
)(VendorLocalServices);

//export default VendorLocalServices;
