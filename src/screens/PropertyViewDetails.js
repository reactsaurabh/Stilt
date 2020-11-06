import React, {Component} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {
  addAgreement,
  getPropertyList,
  updateParty,
  updateProperty,
} from '../actions';
import AddAgreement from '../components/Property/AddAgreement';
import AddParty from '../components/Property/AddParty';
import DepositPayment from '../components/Property/DepositPayment';
import Payment from '../components/Property/Payment';
import PropertyInfo from '../components/Property/PropertyInfo';
import RentPayment from '../components/Property/RentPayment';
import ArrowIcon from '../components/UI/ArrowIcon';
import Spinner from '../components/UI/Spinner';
import {BLACK, GRAY_400, PRIMARY, WHITE} from '../utils/colors';
import {dateFormatter} from '../utils/helper';
import PartyInfo from '../components/Property/PartyInfo';
import AgreementInfo from '../components/Property/AgreementInfo';
import PreviousAgreement from '../components/Property/PreviousAgreement';

class PropertyViewDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPropertyInfo: false,
      showAddParty: false,
      showAddAgreement: false,
      propertyDetails: props.propertyList.data.filter(
        property => property.data().assetID === props.assetID,
      )[0],
      showDeposit: false,
      showRent: false,
      showCompletePayment: false,
      from: '',
      paymentIcon: '',
      showPartyInfo: false,
      showAgreementInfo: false,
      member: null,
      clickedAgreement: null,
      showPreviousAgreement: false,
    };
  }
  componentDidMount() {
    // no need to unregister navigation event on screen destroy. It will automatically unregistered at the runtime
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.generic.isSuccess &&
      prevProps.generic.isSuccess !== this.props.generic.isSuccess
    ) {
      const {mobile, currentAccountType} = this.props.userInfo.data;
      this.props.getPropertyList(mobile, currentAccountType);
    }

    if (
      this.props.propertyList.isSuccess &&
      prevProps.propertyList.isSuccess !== this.props.propertyList.isSuccess
    ) {
      const propertyDetails = this.props.propertyList.data.filter(
        property => property.data().assetID === this.props.assetID,
      )[0];

      this.setState({propertyDetails}, () => {
        this.setState({
          showAddParty: false,
          showAddAgreement: false,
          showPartyInfo: false,
          showAgreementInfo: false,
        });

        if (this.state.showDeposit) {
          const {
            depositStatus,
            depositRefund,
          } = propertyDetails.data().agreement[
            propertyDetails.data().agreement.length - 1
          ];
          //Payment icon on the basis of status of deopsitStatus and depositRefund
          let paymentIcon = depositRefund ? depositRefund : depositStatus;

          this.setState(
            {showDeposit: false, from: 'deposit', paymentIcon},
            () => this.togglePayment(),
          );
        }

        if (this.state.showRent) {
          const userRole =
            this.props.userInfo.data &&
            propertyDetails
              .data()
              .party.filter(
                p => p.mobile === this.props.userInfo.data.mobile,
              )[0].role;
          const paymentIcon = userRole === 'Owner' ? 'Requested' : 'Paid';

          this.setState({showRent: false, from: 'rent', paymentIcon}, () =>
            this.togglePayment(),
          );
        }
      });
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
  togglePropertyInfo = () =>
    this.setState(prevState => ({
      showPropertyInfo: !prevState.showPropertyInfo,
    }));
  toggleAddParty = () =>
    this.setState(prevState => ({showAddParty: !prevState.showAddParty}));
  toggleAddAgreement = () =>
    this.setState(prevState => ({
      showAddAgreement: !prevState.showAddAgreement,
    }));
  toggleDepositPayment = () =>
    this.setState(prevState => ({
      showDeposit: !prevState.showDeposit,
    }));
  toggleRentPayment = () =>
    this.setState(prevState => ({
      showRent: !prevState.showRent,
    }));
  togglePayment = () =>
    this.setState(prevState => ({
      showCompletePayment: !prevState.showCompletePayment,
    }));
  toggleShowPartyInfo = () =>
    this.setState(prevState => ({showPartyInfo: !prevState.showPartyInfo}));
  showPartyInfo = member => {
    this.setState({member}, this.toggleShowPartyInfo);
  };
  toggleAgreementInfo = () =>
    this.setState(prevState => ({
      showAgreementInfo: !prevState.showAgreementInfo,
    }));
  showAgreementInfo = agreement => {
    this.setState({clickedAgreement: agreement}, this.toggleAgreementInfo);
  };
  togglePreviousAgreement = () =>
    this.setState(prevState => ({
      showPreviousAgreement: !prevState.showPreviousAgreement,
    }));
  render() {
    const {
      showPropertyInfo,
      showAddParty,
      propertyDetails,
      showAddAgreement,
      showDeposit,
      showRent,
      showCompletePayment,
      from,
      showPartyInfo,
      showAgreementInfo,
      member,
      clickedAgreement,
      showPreviousAgreement,
    } = this.state;
    const {isLoading} = this.props.generic;
    const {isLoading: loadingProperty} = this.props.propertyList;
    const userRole =
      this.props.userInfo.data &&
      propertyDetails
        .data()
        .party.filter(p => p.mobile === this.props.userInfo.data.mobile)[0]
        .role;
    const canAddAgreement = propertyDetails.data().agreement
      ? !(
          propertyDetails.data().agreement.filter(a => a.currentAgreement)
            .length === 1
        )
      : true;
    const currentAgreement =
      (propertyDetails.data().agreement &&
        propertyDetails.data().agreement.filter(a => a.currentAgreement)) ||
      [];
    const currentAgreementIndex =
      propertyDetails.data().agreement &&
      propertyDetails.data().agreement.findIndex(a => a.currentAgreement);
    const isBothPartyPresent =
      propertyDetails.data().party.filter(p => p.role === 'Owner').length > 0 &&
      propertyDetails.data().party.filter(p => p.role === 'Tenant').length > 0;
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={!showCompletePayment && styles.container}>
            {showPropertyInfo && (
              <PropertyInfo
                property={propertyDetails.data().property}
                assetID={propertyDetails.data().assetID}
                assetStatus={propertyDetails.data().assetStatus}
                assetType={propertyDetails.data().assetType}
                onBack={this.togglePropertyInfo}
              />
            )}
            {showAddParty && (
              <AddParty
                onBack={this.toggleAddParty}
                addParty={this.props.updateParty}
                party={propertyDetails.data().party}
                assetID={propertyDetails.data().assetID}
                partyMobileArray={propertyDetails.data().partyMobileArray}
              />
            )}
            {showAddAgreement && (
              <AddAgreement
                onBack={this.toggleAddAgreement}
                addAgreement={this.props.updateProperty}
                agreement={propertyDetails.data().agreement || []}
                assetID={propertyDetails.data().assetID}
                isBothPartyPresent={isBothPartyPresent}
              />
            )}
            {showDeposit && (
              <DepositPayment
                onBack={this.toggleDepositPayment}
                showMessage={
                  !(
                    Boolean(propertyDetails.data().agreement) &&
                    Boolean(propertyDetails.data().party) &&
                    currentAgreement.length === 1
                  )
                }
                deposit={currentAgreement[0] && currentAgreement[0].deposit}
                onPayment={this.props.updateProperty}
                userRole={userRole}
                depositStatus={
                  currentAgreement[0] && currentAgreement[0].depositStatus
                }
                assetID={propertyDetails.data().assetID}
                depositRefund={
                  currentAgreement[0] && currentAgreement[0].depositRefund
                }
                party={propertyDetails.data().party}
                transactionID={
                  currentAgreement[0] && currentAgreement[0].transactionID
                }
                agreement={propertyDetails.data().agreement}
                currentAgreementIndex={currentAgreementIndex}
                propertyName={propertyDetails.data().property.name}
              />
            )}
            {showRent && (
              <RentPayment
                onBack={this.toggleRentPayment}
                showMessage={
                  !(
                    Boolean(propertyDetails.data().agreement) &&
                    Boolean(propertyDetails.data().party) &&
                    currentAgreement.length === 1
                  )
                }
                rent={currentAgreement[0] && currentAgreement[0].rent}
                openPayment={() => {
                  this.setState({showRent: false, from: 'rent'}, () =>
                    this.togglePayment(),
                  );
                }}
                userRole={userRole}
                rentPayment={
                  currentAgreement[0] && currentAgreement[0].rentPayment
                }
                onRent={this.props.updateProperty}
                assetID={propertyDetails.data().assetID}
                party={propertyDetails.data().party}
                agreement={
                  propertyDetails.data().agreement &&
                  propertyDetails.data().agreement
                }
                currentAgreementIndex={currentAgreementIndex}
                propertyName={propertyDetails.data().property.name}
                rentStartDate={
                  currentAgreement[0] && currentAgreement[0].startDate
                }
              />
            )}
            {showPartyInfo && (
              <PartyInfo
                onBack={this.toggleShowPartyInfo}
                member={member}
                onRemoveMember={this.props.updateParty}
                party={propertyDetails.data().party}
                partyMobileArray={propertyDetails.data().partyMobileArray}
                assetID={propertyDetails.data().assetID}
              />
            )}
            {showAgreementInfo && (
              <AgreementInfo
                clickedAgreement={clickedAgreement}
                onBack={this.toggleAgreementInfo}
                agreement={
                  propertyDetails.data().agreement &&
                  propertyDetails.data().agreement
                }
                cancelAgreement={this.props.updateProperty}
                assetID={propertyDetails.data().assetID}
                currentAgreementIndex={currentAgreementIndex}
                propertyDetails={propertyDetails.data()}
                isBothPartyPresent={isBothPartyPresent}
              />
            )}
            {showPreviousAgreement && (
              <PreviousAgreement
                previousAgreement={
                  propertyDetails.data().agreement &&
                  propertyDetails.data().agreement
                }
                onBack={this.togglePreviousAgreement}
                onShowAgreementInfo={this.showAgreementInfo}
                showAgreementInfo={showAgreementInfo}
              />
            )}
            {!showPropertyInfo &&
              !showAddParty &&
              !showAddAgreement &&
              !showDeposit &&
              !showRent &&
              !showCompletePayment &&
              !showPartyInfo &&
              !showAgreementInfo &&
              !showPreviousAgreement && (
                <>
                  <Text style={[styles.heading, styles.bottom]}>
                    Property View
                  </Text>
                  <View style={styles.listView}>
                    <View style={styles.listInfo}>
                      <Text style={styles.infoText}>
                        {propertyDetails.data().property.name}
                      </Text>
                      <Text style={styles.infoSubText}>
                        {propertyDetails.data().assetType}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={this.togglePropertyInfo}>
                      <ArrowIcon color={BLACK} type="forward" arrowSize={30} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.section}>
                    <Text style={[styles.heading, styles.bottom]}>Parties</Text>
                    <>
                      {propertyDetails
                        .data()
                        .party.map((partyMember, index) => (
                          <TouchableOpacity
                            onPress={() =>
                              this.showPartyInfo({index, ...partyMember})
                            }
                            style={styles.listViewII}
                            key={partyMember.mobile}>
                            <Image
                              source={
                                partyMember.image
                                  ? {uri: partyMember.image}
                                  : require('../assets/images/avatar.png')
                              }
                              style={styles.avatar}
                            />
                            <View style={styles.partylistInfo}>
                              <Text style={styles.infoText}>
                                {partyMember.name}
                              </Text>
                              <Text style={styles.infoSubText}>
                                {partyMember.role}
                              </Text>
                            </View>
                            <View style={styles.contactBtn}>
                              <Icon name="ios-mail" size={20} />
                              <Icon name="ios-call" size={20} />
                            </View>
                          </TouchableOpacity>
                        ))}
                    </>

                    <View style={styles.btnContainer}>
                      <Text style={styles.addPartyText}>Add Parties</Text>
                      <TouchableOpacity onPress={this.toggleAddParty}>
                        <ArrowIcon
                          color={BLACK}
                          type="forward"
                          arrowSize={30}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.section}>
                    <Text style={[styles.heading]}>Agreements</Text>
                    {propertyDetails.data().agreement &&
                      propertyDetails
                        .data()
                        .agreement.filter(agr => agr.currentAgreement)
                        .map(agreement => (
                          <TouchableOpacity
                            onPress={() =>
                              this.showAgreementInfo({...agreement})
                            }
                            key={agreement.depositAgreementNo}>
                            <View style={[styles.listView, styles.top]}>
                              <View style={styles.listInfo}>
                                <Text style={styles.infoText}>
                                  Deposit (Smart Contract)
                                </Text>
                                <Text style={styles.infoSubText}>
                                  No. {agreement.depositAgreementNo} Created:{' '}
                                  {
                                    dateFormatter(
                                      agreement.createdAt.seconds * 1000,
                                    ).fullDate
                                  }
                                </Text>
                              </View>
                              <Text>₹{agreement.deposit}</Text>
                            </View>
                            <View style={{marginVertical: 10}} />
                            <View style={styles.listView}>
                              <View style={styles.listInfo}>
                                <Text style={styles.infoText}>
                                  Rent (Smart Contract)
                                </Text>
                                <Text style={styles.infoSubText}>
                                  No. {agreement.rentAgreementNo} Created:{' '}
                                  {
                                    dateFormatter(
                                      agreement.createdAt.seconds * 1000,
                                    ).fullDate
                                  }
                                </Text>
                              </View>

                              <Text>₹{agreement.rent}</Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                    <View style={{marginVertical: 8}} />
                    {canAddAgreement && (
                      <>
                        <View style={styles.btnContainer}>
                          <Text style={styles.addPartyText}>Add Agreement</Text>
                          <TouchableOpacity onPress={this.toggleAddAgreement}>
                            <ArrowIcon
                              color={BLACK}
                              type="forward"
                              arrowSize={30}
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={{marginVertical: 8}} />
                      </>
                    )}
                    {propertyDetails.data().agreement &&
                      propertyDetails.data().agreement.length > 1 && (
                        <View style={styles.btnContainer}>
                          <Text style={styles.addPartyText}>
                            Previous Agreement
                          </Text>
                          <TouchableOpacity
                            onPress={this.togglePreviousAgreement}>
                            <ArrowIcon
                              color={BLACK}
                              type="forward"
                              arrowSize={30}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                  </View>
                  <View style={styles.section}>
                    <Text style={[styles.heading, styles.bottom]}>
                      Transactions
                    </Text>
                    <View style={[styles.btnContainer, styles.bottom]}>
                      <Text style={styles.infoText}>Deposit Payment</Text>
                      <TouchableOpacity onPress={this.toggleDepositPayment}>
                        <ArrowIcon
                          color={BLACK}
                          type="forward"
                          arrowSize={30}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.btnContainer}>
                      <Text style={styles.infoText}>Rent Payment</Text>
                      <TouchableOpacity onPress={this.toggleRentPayment}>
                        <ArrowIcon
                          color={BLACK}
                          type="forward"
                          arrowSize={30}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
          </View>
          {showCompletePayment && (
            <Payment
              payeeName={propertyDetails.data().party[0].name}
              payeeMobile={propertyDetails.data().party[0].mobile}
              payerName={propertyDetails.data().party[1].name}
              payerMobile={propertyDetails.data().party[1].name}
              amount={currentAgreement[0][from]}
              onBack={this.togglePayment}
              paymentIcon={this.state.paymentIcon}
              service={`${this.state.from} Payment`}
            />
          )}
        </ScrollView>
        {(isLoading || loadingProperty) && (
          <Spinner color={PRIMARY} size="large" />
        )}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = ({propertyList, generic, userInfo}) => ({
  propertyList,
  generic,
  userInfo,
});

export default connect(
  mapStateToProps,
  {
    updateParty,
    getPropertyList,
    addAgreement,
    updateProperty,
  },
)(PropertyViewDetails);

const styles = StyleSheet.create({
  safeAreaView: {flex: 1, backgroundColor: WHITE},
  container: {marginHorizontal: 16, marginVertical: 32},
  heading: {fontSize: 18, color: PRIMARY},
  top: {
    marginTop: 32,
  },
  bottom: {
    marginBottom: 32,
  },
  listView: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listInfo: {
    height: '100%',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: 16,
  },
  infoSubText: {
    fontSize: 14,
    color: GRAY_400,
  },
  section: {
    marginTop: 48,
  },
  avatar: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  listViewII: {
    flexDirection: 'row',
    height: 70,
    marginBottom: 16,
  },
  partylistInfo: {
    height: '100%',
    marginLeft: 20,
    justifyContent: 'space-between',
  },
  contactBtn: {
    alignSelf: 'flex-start',
    marginLeft: 'auto',
    flexDirection: 'row',
    width: 70,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addPartyText: {
    fontSize: 12,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
