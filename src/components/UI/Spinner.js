/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

class Spinner extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator {...this.props} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Spinner;
