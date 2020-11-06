import React, {Component} from 'react';
import {Navigation} from 'react-native-navigation';
import {Text, View} from 'react-native';
import {WebView} from 'react-native-webview';
import Spinner from '../UI/Spinner';
import {PRIMARY, GRAY_400} from '../../utils/colors';
class BharatBillPay extends Component {
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
  renderLoader = () => <Spinner color={PRIMARY} size="large" />;
  renderError = () => (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 18, color: GRAY_400}}>
        Something Went Wrong. Please try again
      </Text>
    </View>
  );
  render() {
    return (
      <WebView
        source={{uri: 'https://www.bharatbillpay.com/Billpay.php'}}
        startInLoadingState
        renderLoading={this.renderLoader}
        renderError={this.renderError}
      />
    );
  }
}

export default BharatBillPay;
