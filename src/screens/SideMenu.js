/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {WHITE, GRAY_300} from '../utils/colors';
import firebase from 'react-native-firebase';
import {goToAuth, goTo} from './navigation';
import {DEVICE_WIDTH, showSnackbar} from '../utils/helper';
import {logout} from '../actions';
import {connect} from 'react-redux';

const dashboardItems = [
  {
    name: 'Dashboard',
    source: require('../assets/images/dashboard.png'),
    path: 'home',
    showForVendor: true,
    'showForOwner-Tenant': true,
    'showForReal Estate Agent': true,
    'showForProperty Manager': true,
  },
  {
    name: 'Assets',
    source: require('../assets/images/assets.png'),
    path: 'assets',
    showForVendor: false,
    'showForOwner-Tenant': true,
    'showForReal Estate Agent': true,
    'showForProperty Manager': true,
  },
  {
    name: 'Services',
    source: require('../assets/images/services.png'),
    path: 'myservices',
    showForVendor: false,
    'showForOwner-Tenant': true,
    'showForReal Estate Agent': true,
    'showForProperty Manager': true,
  },
  {
    name: 'Transactions',
    source: require('../assets/images/transactions.png'),
    path: 'transactionDetails',
    showForVendor: true,
    'showForOwner-Tenant': true,
    'showForReal Estate Agent': true,
    'showForProperty Manager': true,
  },
  {
    name: 'Notifications',
    source: require('../assets/images/notifications.png'),
    path: 'notifications',
    showForVendor: false,
    'showForOwner-Tenant': true,
    'showForReal Estate Agent': true,
    'showForProperty Manager': true,
  },
  {
    name: 'Referrals',
    source: require('../assets/images/referrals.png'),
    path: 'referrals',
    showForVendor: false,
    'showForOwner-Tenant': true,
    'showForReal Estate Agent': true,
    'showForProperty Manager': true,
  },
  {
    name: 'Settings',
    source: require('../assets/images/settings.png'),
    path: 'settings',
    showForVendor: true,
    'showForOwner-Tenant': true,
    'showForReal Estate Agent': true,
    'showForProperty Manager': true,
  },
  {name: 'Separation'},
  {
    name: 'Help',
    source: require('../assets/images/help.png'),
    showForVendor: true,
    'showForOwner-Tenant': true,
    'showForReal Estate Agent': true,
    'showForProperty Manager': true,
  },
  {
    name: 'Logout',
    source: require('../assets/images/logout.png'),
    showForVendor: true,
    'showForOwner-Tenant': true,
    'showForReal Estate Agent': true,
    'showForProperty Manager': true,
  },
];
class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;

    Navigation.events().registerComponentDidAppearListener(({componentId}) => {
      // only spy on tabs we don't need other screens
      if (componentId !== 'sidemenu') {
        this.setState({
          activeComponentId: componentId,
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        goToAuth();
        this.props.logout();
      })
      .catch(error => showSnackbar('Something Went Wrong'));
  };

  handleClick = (screenName, title) => {
    Navigation.mergeOptions('sidemenu', {
      sideMenu: {
        left: {
          visible: false,
        },
      },
    });
    // open menu item
    Navigation.push(this.state.activeComponentId, {
      component: {
        name: screenName, // name of the registered screen component
        options: {
          topBar: {
            title: {
              text: title,
            },
          },
        },
      },
    });
  };
  render() {
    const drawerWidth = DEVICE_WIDTH * 0.7; // occupying 70% of device width
    return (
      /*Using multiple styles at a time using array*/
      <View style={[styles.container, {width: drawerWidth}]}>
        <ScrollView>
          <Image
            resizeMode={'contain'}
            style={styles.headericon}
            source={require('../assets/images/intro_logo.png')}
          />

          {dashboardItems.map(items => (
            <React.Fragment key={items.name}>
              {items.name === 'Separation' ? (
                <View style={styles.separator} />
              ) : (
                <>
                  {this.props.userInfo.data &&
                    items[
                      `showFor${this.props.userInfo.data.currentAccountType}`
                    ] && (
                      <TouchableOpacity
                        style={styles.drawerItem}
                        onPress={() => {
                          if (items.name === 'Logout') {
                            this.signOut();
                          } else if (items.path) {
                            goTo(items.path);
                          }
                        }}>
                        <Image
                          resizeMode={'contain'}
                          source={items.source}
                          style={styles.logo}
                        />
                        <Text style={styles.drawerText}>{items.name}</Text>
                      </TouchableOpacity>
                    )}
                </>
              )}
            </React.Fragment>
          ))}
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = ({userInfo}) => ({userInfo});
export default connect(
  mapStateToProps,
  {logout},
)(SideMenu);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  headericon: {
    height: 80,
    width: 100,
    marginLeft: 30,
    marginBottom: 50,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30,
    marginBottom: 20,
  },
  logo: {
    height: 20,
    width: 20,
  },

  drawerText: {
    fontSize: 20,
    fontWeight: '100',
    marginLeft: 12,
    letterSpacing: 1,
  },
  separator: {
    borderTopColor: GRAY_300,
    borderTopWidth: 2,
    marginBottom: 20,
    marginLeft: 30,
    marginRight: 30,
  },
});
