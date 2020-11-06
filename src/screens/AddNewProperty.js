/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Picker,
  TextInput,
  Image,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {
  PRIMARY,
  WHITE,
  PRIMARY_DARK,
  GRAY_300,
  GRAY_100,
  BLACK,
} from '../utils/colors';
import {DEVICE_WIDTH, showSnackbar, randomGenerator} from '../utils/helper';
import ArrowIcon from '../components/UI/ArrowIcon';
import {updateProperty} from '../actions';
import {connect} from 'react-redux';
import Spinner from '../components/UI/Spinner';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {OWNER_TENANT, AGENT, PROPERTY_MANAGER} from '../utils/constants';
const userType = {
  [OWNER_TENANT]: [
    {
      label: 'Owner',
      value: 'Owner',
      source: require('../assets/images/roles/stilt-owner.png'),
    },
    {
      label: 'Tenant',
      value: 'Tenant',
      source: require('../assets/images/roles/stilt-tenant.png'),
    },
  ],
  [AGENT]: [
    {
      label: 'Agent',
      value: 'Agent',
      source: require('../assets/images/roles/stilt-agent.png'),
    },
  ],
  [PROPERTY_MANAGER]: [
    {
      label: 'Property Mgr',
      value: 'Property Mgr',
      source: require('../assets/images/roles/stlt-prop-manager.png'),
    },
  ],
};
class AddNewProperty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      role: '',
      assetType: '',
      assetStatus: '',
      property: {
        name: '',
        addLine1: '',
        addLine2: '',
        addLine3: '',
        city: '',
        state: '',
        country: 'India',
        pin: '',
      },
    };
    this.assetID = '';
  }
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
  componentDidUpdate(prevProps) {
    if (
      this.props.generic.isSuccess &&
      prevProps.generic.isSuccess !== this.props.generic.isSuccess
    ) {
      this.setState({step: 3});
    }
  }
  renderSubHeading = () => {
    const {step} = this.state;
    let text;
    switch (step) {
      case 1:
        text = 'Select Your Role';
        break;
      case 2:
        text = 'Property Details';
        break;
    }
    return (
      <Text style={styles.subHeading}>
        Step {step}/2 - {text}
      </Text>
    );
  };
  handleRoles = role => this.setState({role}, () => this.setState({step: 2}));
  submitPropDetails = () => {
    const errors = validateForm({
      assetType: this.state.assetType,
      ...this.state.property,
    });
    if (!errors) {
      const {step, role, ...data} = this.state;
      const {
        data: {
          firstName,
          lastName,
          mobile,
          email,
          image,
          beneId,
          currentAccountType,
        },
      } = this.props.userInfo;
      const party = [
        {
          role: this.state.role,
          name: `${firstName} ${lastName}`,
          mobile,
          email,
          image,
          beneId,
        },
      ];
      const partyMobileArray = [mobile];
      this.assetID = randomGenerator(12);
      this.props.updateProperty({
        ...data,
        assetID: this.assetID,
        party,
        partyMobileArray,
        userMobile: mobile,
        getProperty: true,
        [mobile]: currentAccountType,
      });
    }
  };
  onChangeText = (name, val) => {
    const property = {...this.state.property};
    property[name] = val;
    this.setState({property});
  };
  goBack = () => this.setState({step: 1});
  render() {
    const {step, assetType, assetStatus} = this.state;
    const {isLoading} = this.props.generic;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {!this.props.userInfo.data.beneId ? (
            <Text style={styles.info}>
              You need to add your bank details in settings before adding
              properties
            </Text>
          ) : (
            <>
              {step === 3 ? (
                <View style={styles.congratsBlock}>
                  <Image
                    resizeMode={'cover'}
                    style={styles.background_img}
                    source={require('../assets/images/stilt-mobile-header-settings.png')}
                  />
                  <View style={styles.message}>
                    <Text style={[styles.congrats, styles.bottom]}>
                      CONGRATULATIONS
                    </Text>
                    <Text style={styles.bottom}>
                      The property asset has been added to your profile
                    </Text>
                    <Text style={styles.bottom}>Asset ID : {this.assetID}</Text>
                    <TouchableOpacity style={styles.bottom}>
                      <ArrowIcon
                        backgroundColor={PRIMARY_DARK}
                        color={WHITE}
                        type="forward"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.addPropertyBlock}>
                  <View style={styles.headerView}>
                    {step === 2 && (
                      <TouchableOpacity
                        onPress={this.goBack}
                        style={styles.back}>
                        <ArrowIcon color={BLACK} arrowSize={30} type="back" />
                      </TouchableOpacity>
                    )}
                    <Text style={styles.heading}>Add New Property</Text>
                  </View>
                  <View style={styles.stepsBlock}>
                    {this.renderSubHeading()}
                    {step === 1 && (
                      <View style={styles.rolesBlock}>
                        {userType[
                          this.props.userInfo.data.currentAccountType
                        ].map(user => (
                          <TouchableOpacity
                            key={user.label}
                            onPress={() => this.handleRoles(user.value)}
                            style={styles.rolesView}>
                            <Image source={user.source} style={styles.roles} />
                            <Text>{user.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                    {step === 2 && (
                      <>
                        <View style={styles.pickerBlock}>
                          <View style={styles.pickerView}>
                            <Picker
                              selectedValue={assetType}
                              style={styles.picker}
                              onValueChange={(itemValue, itemIndex) =>
                                this.setState({assetType: itemValue})
                              }>
                              <Picker.Item label="Select Asset Type" value="" />
                              <Picker.Item
                                label="Residential"
                                value="Residential"
                              />
                              <Picker.Item
                                label="Commercial"
                                value="Commercial"
                              />
                              <Picker.Item label="Other" value="other" />
                            </Picker>
                          </View>
                          <View style={styles.pickerView}>
                            <Picker
                              selectedValue={assetStatus}
                              style={styles.picker}
                              onValueChange={(itemValue, itemIndex) =>
                                this.setState({assetStatus: itemValue})
                              }>
                              <Picker.Item
                                label="Select Asset Status"
                                value=""
                              />
                              <Picker.Item label="Self Use" value="Self Use" />
                              <Picker.Item label="On Rent" value="On Rent" />
                              <Picker.Item label="Vacant" value="Vacant" />
                            </Picker>
                          </View>
                        </View>
                        <Text style={[styles.subHeading, styles.bottom]}>
                          Property Name
                        </Text>
                        <TextInput
                          style={[styles.input, styles.bottom]}
                          placeholder="Enter Property Name"
                          autoCorrect={false}
                          keyboardType={'default'}
                          onChangeText={val => this.onChangeText('name', val)}
                          value={this.state.property.name}
                        />
                        <Text style={[styles.subHeading, styles.bottom]}>
                          Property Location
                        </Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Address Line 1"
                          autoCorrect={false}
                          keyboardType={'default'}
                          onChangeText={val =>
                            this.onChangeText('addLine1', val)
                          }
                          value={this.state.property.addLine1}
                        />
                        <TextInput
                          style={styles.input}
                          placeholder="Address Line 2"
                          autoCorrect={false}
                          keyboardType={'default'}
                          onChangeText={val =>
                            this.onChangeText('addLine2', val)
                          }
                          value={this.state.property.addLine2}
                        />
                        <TextInput
                          style={styles.input}
                          placeholder="Address Line 3 (landmark)"
                          autoCorrect={false}
                          keyboardType={'default'}
                          onChangeText={val =>
                            this.onChangeText('addLine3', val)
                          }
                          value={this.state.property.addLine3}
                        />
                        <TextInput
                          style={styles.input}
                          placeholder="Enter City"
                          autoCorrect={false}
                          keyboardType={'default'}
                          onChangeText={val => this.onChangeText('city', val)}
                          value={this.state.property.city}
                        />
                        <TextInput
                          style={styles.input}
                          placeholder="Enter State"
                          autoCorrect={false}
                          keyboardType={'default'}
                          onChangeText={val => this.onChangeText('state', val)}
                          value={this.state.property.state}
                        />
                        <TextInput
                          style={styles.input}
                          placeholder="Enter Country"
                          autoCorrect={false}
                          keyboardType={'default'}
                          onChangeText={val =>
                            this.onChangeText('country', val)
                          }
                          value={this.state.property.country}
                          editable={false}
                        />
                        <TextInput
                          style={styles.input}
                          placeholder="PIN Code"
                          autoCorrect={false}
                          keyboardType={'numeric'}
                          onChangeText={val => this.onChangeText('pin', val)}
                          value={this.state.property.pin}
                        />
                        <TouchableOpacity
                          style={styles.arrowBlock}
                          onPress={this.submitPropDetails}>
                          <ArrowIcon
                            backgroundColor={PRIMARY_DARK}
                            color={WHITE}
                            type="forward"
                          />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              )}
            </>
          )}
          {isLoading && <Spinner color={PRIMARY} size="large" />}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = ({generic, userInfo}) => ({generic, userInfo});
export default connect(
  mapStateToProps,
  {updateProperty},
)(AddNewProperty);
const validateForm = data => {
  let error = '';
  if (!data.assetType) {
    error = 'Select an asset type';
  } else if (!data.name) {
    error = 'Property Name is required';
  } else if (!data.addLine1 || !data.addLine2) {
    error = 'Address is required';
  } else if (!data.city) {
    error = 'City is required';
  } else if (!data.state) {
    error = 'State is reuired';
  } else if (!data.pin) {
    error = 'Pin is required';
  }

  if (error) {
    showSnackbar(error);
  }
  return error;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  info: {
    fontSize: hp('2.8%'),
    color: PRIMARY_DARK,
    textAlign: 'center',
    marginTop: hp('3%'),
    marginHorizontal: wp('5%'),
  },
  addPropertyBlock: {margin: 16},
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  back: {
    marginRight: 15,
  },
  heading: {
    fontSize: 18,
    color: PRIMARY,
  },
  stepsBlock: {
    marginTop: 32,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rolesBlock: {
    marginTop: 32,
    flexDirection: 'row',
    // justifyConten,
    alignItems: 'center',
  },
  rolesView: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 0.2 * DEVICE_WIDTH + 30,
    marginRight: 15,
  },
  roles: {
    width: 0.2 * DEVICE_WIDTH,
    height: 0.2 * DEVICE_WIDTH,
    borderRadius: 0.1 * DEVICE_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerBlock: {
    marginVertical: 12,
  },
  pickerView: {
    borderRadius: 50,
    overflow: 'hidden',
    width: '100%',
    height: 50,
    marginVertical: 12,
    maxWidth: 500,
  },
  picker: {
    backgroundColor: GRAY_100,
    color: GRAY_300,
    height: 50,
    width: '100%',
  },

  input: {
    backgroundColor: GRAY_100,
    height: 50,
    paddingLeft: 20,
    borderRadius: 50,
    maxWidth: 500,
    width: '100%',
    marginBottom: 10,
  },
  bottom: {
    marginBottom: 24,
  },
  arrowBlock: {marginTop: 24, flexDirection: 'row', justifyContent: 'flex-end'},

  background_img: {
    width: '100%',
    height: 200,
  },
  message: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },
  congrats: {
    color: PRIMARY,
    fontSize: 26,
  },
});
