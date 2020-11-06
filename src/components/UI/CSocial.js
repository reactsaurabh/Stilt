/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, Image, View} from 'react-native';
import {PRIMARY_DARK} from '../../utils/colors';

class CSocial extends Component {
  render() {
    return (
      <TouchableOpacity onPress={() => this.props.onPress()}>
        <View
          style={[
            styles.container,
            this.props.style,
            {
              borderColor: this.props.borderColor,
              borderWidth: 1,
              backgroundColor: this.props.backgroundColor,
            },
          ]}>
          <Image
            style={{width: 28, height: 28}}
            source={require('../../assets/images/google.png')}
          />
          <Text
            style={[
              styles.txt_login,
              {
                color: this.props.color,
              },
            ]}>
            {this.props.text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  txt_login: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 50,
    width: '80%',
    height: 50,
  },
  btn_login: {
    bottom: 0,
    position: 'absolute',
    justifyContent: 'flex-end',
    marginHorizontal: '4%',
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CSocial;
