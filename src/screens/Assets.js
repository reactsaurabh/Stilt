import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {PRIMARY, WHITE, BLACK, GRAY_400} from '../utils/colors';
import {Navigation} from 'react-native-navigation';
import {goTo} from './navigation';
import ArrowIcon from '../components/UI/ArrowIcon';
import {getPropertyList} from '../actions';
import {connect} from 'react-redux';
import Spinner from '../components/UI/Spinner';

class Assets extends Component {
  componentDidMount() {
    // no need to unregister navigation event on screen destroy. It will automatically unregistered at the runtime
    this.navigationEventListener = Navigation.events().bindComponent(this);
    if (!this.props.propertyList.isSuccess) {
      const {mobile, currentAccountType} = this.props.userInfo.data;
      this.props.getPropertyList(mobile, currentAccountType);
    }
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
    const {isLoading, isSuccess, data} = this.props.propertyList;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.innerContainer}>
            <View style={styles.listView}>
              <Image
                source={require('../assets/images/quick-actions/stilt-real-estate-proptech-new-asset.png')}
                style={styles.image}
              />
              <View style={styles.listInfo}>
                <Text style={styles.infoText}>Add New Property</Text>
                <Text style={styles.infoSubText}>Residential, Commercial</Text>
              </View>
              <TouchableOpacity
                style={styles.arrowIcon}
                onPress={() => {
                  goTo('addProperty');
                }}>
                <ArrowIcon type="forward" color={BLACK} arrowSize={30} />
              </TouchableOpacity>
            </View>
            {isSuccess && data.length > 0 && (
              <View style={styles.propertyView}>
                <Text style={styles.heading}>Your Property</Text>
                <>
                  {data.map(property => (
                    <View style={styles.listView} key={property.id}>
                      <Image
                        source={require('../assets/images/quick-actions/stilt-real-estate-proptech-new-asset.png')}
                        style={styles.image}
                      />
                      <View style={styles.listInfo}>
                        <Text style={styles.infoText}>
                          {property.data().property.name}
                        </Text>
                        <Text style={styles.infoSubText}>
                          {property.data().assetType} -{' '}
                          {property.data().assetStatus}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.arrowIcon}
                        onPress={() => {
                          goTo('viewProperty', {
                            assetID: property.data().assetID,
                          });
                        }}>
                        <ArrowIcon
                          type="forward"
                          color={BLACK}
                          arrowSize={30}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </>
              </View>
            )}
          </View>
        </ScrollView>
        {isLoading && <Spinner color={PRIMARY} size="large" />}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = ({propertyList, userInfo}) => ({
  propertyList,
  userInfo,
});
export default connect(
  mapStateToProps,
  {getPropertyList},
)(Assets);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: WHITE},
  innerContainer: {marginHorizontal: 16, marginVertical: 32},
  listView: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
    marginVertical: 8,
  },
  profile: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  listInfo: {
    marginLeft: 20,
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-around',
  },
  infoText: {
    fontSize: 16,
  },
  infoSubText: {
    color: GRAY_400,
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
  propertyView: {
    marginTop: 24,
  },
  heading: {
    fontSize: 18,
    color: PRIMARY,
    marginTop: 16,
    marginBottom: 24,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    borderWidth: 1,
  },
});
