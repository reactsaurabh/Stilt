import React, {Component} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {getTransactions} from '../actions';
import Payment from '../components/Property/Payment';
import Spinner from '../components/UI/Spinner';
import {
  GRAY_200,
  GRAY_300,
  GRAY_400,
  PRIMARY,
  PRIMARY_DARK,
  WHITE,
} from '../utils/colors';
import {dateFormatter, DEVICE_WIDTH} from '../utils/helper';
import {goTo} from './navigation';

class TransactionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      show: '',
      transactionData: '',
    };
  }
  componentDidMount() {
    // no need to unregister navigation event on screen destroy. It will automatically unregistered at the runtime
    this.navigationEventListener = Navigation.events().bindComponent(this);
    const userMobile = this.props.userInfo.data.mobile;
    this.props.getTransactions(userMobile);
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
  renderTransactionDetail = data => {
    const {paymentDate, service, payment, paymentStatus} = data;
    let name, sign, image;
    if (data.payee.mobile === this.props.userInfo.data.mobile) {
      name = data.payer.name;
      image = data.payer.image;
      sign = '+';
    } else if ((data.payer.mobile = this.props.userInfo.data.mobile)) {
      name = data.payee.name;
      image = data.payee.image;
      sign = '-';
    }
    return (
      <TouchableOpacity
        style={styles.listView}
        onPress={() => this.showDetails(data)}>
        {image ? (
          <Image source={{uri: image}} style={styles.profileImage} />
        ) : (
          <View style={[styles.profileImage, styles.avatar]} />
        )}
        <View style={[styles.infoLeftView, {width: DEVICE_WIDTH * 0.5}]}>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={[styles.infoSubText, {flexWrap: 'wrap'}]}>
            {service} - {dateFormatter(paymentDate.seconds * 1000).fullDate}
          </Text>
        </View>
        <View style={styles.infoRightView}>
          <Text style={styles.paymentText}>
            {sign} ₹{payment}
          </Text>
          <Text style={styles.infoSubText}>{paymentStatus}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  showDetails = data => {
    this.setState({transactionData: data}, () => this.setState({show: true}));
  };
  //TODO - Better implementation for filtering results
  filterResult = data => {
    if (data.payee.mobile === this.props.userInfo.data.mobile) {
      return data.payer.name.includes(this.state.search.toLowerCase());
    } else if ((data.payer.mobile = this.props.userInfo.data.mobile)) {
      return data.payee.name.includes(this.state.search.toLowerCase());
    }
  };
  onNewTransaction = () => {
    goTo('transactions');
  };
  onBack = () => this.setState({show: false});
  render() {
    const {isLoading, isSuccess, data} = this.props.transactions;
    const {show, transactionData} = this.state;
    return (
      <>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          {show ? (
            <Payment
              service={transactionData.service}
              payerMobile={transactionData.payer.mobile}
              payerName={transactionData.payer.name}
              payeeName={transactionData.payee.name}
              payeeMobile={transactionData.payee.mobile}
              onBack={this.onBack}
              amount={transactionData.payment}
              paymentIcon={transactionData.paymentStatus}
            />
          ) : (
            <View style={styles.container}>
              <View style={[styles.spaceBlock, styles.allBlock]}>
                <Text style={styles.newText}>All</Text>
                <TouchableOpacity style={styles.pill}>
                  <Text style={styles.pillText}>MMM-YY</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.searchBlock}>
                <TextInput
                  style={styles.searchInput}
                  value={this.state.search}
                  onChangeText={val => this.setState({search: val})}
                  placeholder="Search Transaction"
                  underlineColorAndroid="transparent"
                />
                <Icon name="ios-search" size={15} color={GRAY_300} />
              </View>
              {isSuccess &&
                data.length > 0 &&
                data
                  .filter(el => this.filterResult(el.data()))
                  .map(transaction => (
                    <React.Fragment key={transaction.id}>
                      {this.renderTransactionDetail(transaction.data())}
                    </React.Fragment>
                  ))}
            </View>
          )}
        </ScrollView>
        <TouchableOpacity
          style={styles.floaterBtn}
          activeOpacity={0.8}
          onPress={this.onNewTransaction}>
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
        {isLoading && <Spinner color={PRIMARY} size="large" />}
      </>
    );
  }
}
const mapStateToProps = ({userInfo, transactions}) => ({
  userInfo,
  transactions,
});

export default connect(
  mapStateToProps,
  {getTransactions},
)(TransactionDetails);

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: WHITE,
  },
  container: {
    margin: 16,
  },
  heading: {
    color: PRIMARY,
    fontSize: 18,
  },
  spaceBlock: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  allBlock: {
    marginVertical: 16,
  },
  newText: {
    fontSize: 16,
    color: PRIMARY_DARK,
  },
  pill: {
    backgroundColor: GRAY_300,
    height: 30,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillText: {
    fontSize: 10,
    color: WHITE,
  },
  searchBlock: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 50,
    borderColor: GRAY_300,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
  },
  listView: {
    height: 65,
    flexDirection: 'row',
    marginVertical: 10,
  },

  infoLeftView: {
    height: '100%',
    marginLeft: 20,
    justifyContent: 'space-between',
  },
  infoRightView: {
    height: '100%',
    marginLeft: 'auto',
    justifyContent: 'space-between',
  },
  infoSubText: {
    fontSize: 13,
    color: GRAY_400,
  },
  profileImage: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  avatar: {
    backgroundColor: GRAY_200,
  },
  nameText: {
    fontSize: 16,
  },
  paymentText: {
    alignSelf: 'flex-end',
    fontSize: 16,
  },
  floaterBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: PRIMARY_DARK,
    position: 'absolute',
    bottom: 20,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  plus: {
    fontSize: 24,
    color: WHITE,
  },
});
