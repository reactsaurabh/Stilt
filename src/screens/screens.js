/* eslint-disable prettier/prettier */
import {Navigation} from 'react-native-navigation';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import TitleBar from '../components/UI/CustomTitle';
import TitleProfileImage from '../components/UI/TitleProfileImage';
import BharatBillPay from '../components/URLView/BharatBillPay';
import rootReducers from '../reducers';
import AddNewProperty from './AddNewProperty';
import Assets from './Assets';
import CreateVendor from './CreateVendor';
import Home from './home';
import Initializing from './Initializing';
import IntroScreen from './IntroScreen';
import MyServices from './MyServices';
import NewTransactions from './NewTransactions';
import Notifications from './Notifications';
import NotificationWrapper from './NotificationWrapper';
import PaymentTransation from './PaymentTransation';
import Profile from './Profile';
import PropertyViewDetails from './PropertyViewDetails';
import Referrals from './Referrals';
import RegisterUserInfo from './RegisterUserInfo';
import Settings from './Settings';
import SideMenu from './SideMenu';
import SignIn from './SignIn';
import TransactionDetails from './TransactionDetails';
import VendorConfirm from './VendorConfirm';
import VendorLocalServices from './VendorLocalServices';
import VendorPayment from './VendorPayment';
import vendorPaymentConfirmation from './vendorPaymentConfirmation';
import CustomHeader from '../components/UI/CustomHeader';
import CustomHeaderWrapper from '../components/UI/CustomHeaderWrapper';
import Account from './Account';

const store = createStore(rootReducers, applyMiddleware(thunk, logger));

export function registerScreens() {
  Navigation.registerComponentWithRedux(
    'stilt.home',
    () => NotificationWrapper(CustomHeaderWrapper(Home)),
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'stilt.vendorlocalservices',
    () => NotificationWrapper(CustomHeaderWrapper(VendorLocalServices)),
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'stilt.createvendor',
    () => NotificationWrapper(CustomHeaderWrapper(CreateVendor)),
    Provider,
    store,
  );

  Navigation.registerComponentWithRedux(
    'stilt.vendorpaymentconfirmation',
    () => NotificationWrapper(CustomHeaderWrapper(vendorPaymentConfirmation)),
    Provider,
    store,
  );

  Navigation.registerComponentWithRedux(
    'stilt.vendorconfirm',
    () => NotificationWrapper(CustomHeaderWrapper(VendorConfirm)),
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'stilt.vendorpayment',
    () => NotificationWrapper(CustomHeaderWrapper(VendorPayment)),
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'stilt.paymenttransation',
    () => NotificationWrapper(CustomHeaderWrapper(PaymentTransation)),
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'stilt.myservices',
    () => NotificationWrapper(CustomHeaderWrapper(MyServices)),
    Provider,
    store,
  );

  Navigation.registerComponent('stilt.initializing', () =>
    NotificationWrapper(Initializing),
  );
  Navigation.registerComponent('stilt.signIn', () =>
    NotificationWrapper(SignIn),
  );
  Navigation.registerComponent('stilt.introScreen', () =>
    NotificationWrapper(IntroScreen),
  );
  Navigation.registerComponentWithRedux(
    'stilt.sidemenu',
    () => SideMenu,
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'stilt.settings',
    () => NotificationWrapper(CustomHeaderWrapper(Settings)),
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'stilt.addProperty',
    () => NotificationWrapper(CustomHeaderWrapper(AddNewProperty)),
    Provider,
    store,
  );
  Navigation.registerComponent('stilt.registerUserInfo', () =>
    NotificationWrapper(RegisterUserInfo),
  );
  Navigation.registerComponentWithRedux(
    'stilt.referrals',
    () => NotificationWrapper(CustomHeaderWrapper(Referrals)),
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'stilt.transactions',
    () => NotificationWrapper(NewTransactions),
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'stilt.notifications',
    () => NotificationWrapper(CustomHeaderWrapper(Notifications)),
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'stilt.assets',
    () => NotificationWrapper(CustomHeaderWrapper(Assets)),
    Provider,
    store,
  );

  Navigation.registerComponentWithRedux(
    'stilt.profile',
    () => NotificationWrapper(CustomHeaderWrapper(Profile)),
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'stilt.accounts',
    () => NotificationWrapper(CustomHeaderWrapper(Account)),
    Provider,
    store,
  );
  Navigation.registerComponent('stilt.titleBar', () => TitleBar);
  Navigation.registerComponentWithRedux(
    'stilt.titleProfileImage',
    () => TitleProfileImage,
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'stilt.bharatBillPay',
    () => NotificationWrapper(CustomHeaderWrapper(BharatBillPay)),
    Provider,
    store,
  );

  Navigation.registerComponentWithRedux(
    'stilt.viewProperty',
    () => NotificationWrapper(CustomHeaderWrapper(PropertyViewDetails)),
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'stilt.transactionDetails',
    () => NotificationWrapper(CustomHeaderWrapper(TransactionDetails)),
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'stilt.customHeader',
    () => CustomHeader,
    Provider,
    store,
  );
}
