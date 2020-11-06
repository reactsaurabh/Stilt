import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import {getNotifications} from '../actions';
import Spinner from '../components/UI/Spinner';
import {PRIMARY, WHITE} from '../utils/colors';
import {dateFormatter} from '../utils/helper';
class Notifications extends Component {
  componentDidMount() {
    // no need to unregister navigation event on screen destroy. It will automatically unregistered at the runtime
    this.navigationEventListener = Navigation.events().bindComponent(this);
    const {mobile} = this.props.userInfo.data;
    this.props.getNotifications(mobile);
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
    const {isLoading, isSuccess, data} = this.props.notifications;
    return (
      <View style={styles.safeAreaView}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Text style={styles.heading}>Notifications</Text>
            {isSuccess &&
              (data.length > 0 ? (
                data.map(notification => (
                  <React.Fragment key={notification.id}>
                    <View style={styles.notificationView}>
                      <Text>
                        {
                          dateFormatter(
                            notification.data().createdAt.seconds * 1000,
                          ).fullDate
                        }
                      </Text>
                      <View style={styles.bodyView}>
                        <Text>{notification.data().notification.body}</Text>
                      </View>
                    </View>
                  </React.Fragment>
                ))
              ) : (
                <Text>No Notifications yet</Text>
              ))}
          </View>
        </ScrollView>
        {isLoading && <Spinner color={PRIMARY} size="large" />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaView: {flex: 1, backgroundColor: WHITE},
  container: {margin: 16},
  heading: {color: PRIMARY, fontSize: 16, marginBottom: 16},
  notificationView: {flexDirection: 'row', marginBottom: 16},
  bodyView: {marginLeft: 16, flexDirection: 'row', flexWrap: 'wrap', flex: 1},
});

const mapStateToProps = ({notifications, userInfo}) => ({
  notifications,
  userInfo,
});

export default connect(mapStateToProps, {getNotifications})(Notifications);
