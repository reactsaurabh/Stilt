import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {GRAY_400, PRIMARY} from '../../utils/colors';

const DeviceDetails = ({userInfo}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Device Profile</Text>
      <View style={styles.deviceDetails}>
        <View style={styles.detailsBlock}>
          <Text style={styles.subText}>MOBILE</Text>
          <Text>
            {userInfo && userInfo.mobile ? userInfo.mobile : 'No Information'}
          </Text>
        </View>
        <View style={styles.detailsBlock}>
          <Text style={styles.subText}>GEOCODE</Text>
          <Text>
            {userInfo && userInfo.geocode ? userInfo.geocode : 'No Information'}
          </Text>
        </View>
        <View style={styles.detailsBlock}>
          <Text style={styles.subText}>ID</Text>
          <Text>
            {userInfo && userInfo.imei
              ? Array.isArray(userInfo.imei)
                ? userInfo.imei.join(', ')
                : userInfo.imei
              : 'No Information'}
          </Text>
        </View>
        <View style={styles.detailsBlock}>
          <Text style={styles.subText}>OS</Text>
          <Text>
            {userInfo && userInfo.os ? userInfo.os : 'No Information'}
          </Text>
        </View>
        <View style={styles.detailsBlock}>
          <Text style={styles.subText}>APP</Text>
          <Text>
            {userInfo && userInfo.app ? userInfo.app : 'No Information'}
          </Text>
        </View>
        <View style={styles.detailsBlock}>
          <Text style={styles.subText}>TYPE</Text>
          <Text>MOB</Text>
        </View>
        <View style={styles.detailsBlock}>
          <Text style={styles.subText}>CAPABILITY</Text>
          <Text>01101</Text>
        </View>
        <View style={styles.detailsBlock}>
          <Text style={styles.subText}>OPERATOR</Text>
          <Text>
            {userInfo && userInfo.carrier ? userInfo.carrier : 'No Information'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  heading: {
    color: PRIMARY,
    fontSize: 18,
    fontWeight: '300',
  },
  deviceDetails: {
    marginVertical: 16,
  },
  detailsBlock: {
    height: 60,
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  subText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GRAY_400,
  },
});

export default DeviceDetails;
