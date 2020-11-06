/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import { PRIMARY_DARK } from '../../utils/colors';

class CButton extends Component {
  render() {
    return (
      <TouchableOpacity onPress={() => this.props.onPress()} style={this.props.style}>
        <Text
          style={[
            styles.txt_login,
            {
              borderColor:this.props.borderColor,
              color: this.props.color,
              backgroundColor: this.props.backgroundColor,
            },
          ]}>
          {this.props.text}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  txt_login: {
    backgroundColor: PRIMARY_DARK,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 50,
    width: '100%',
    height: 50,
    borderWidth: 1,
  },
  btn_login: {
    bottom: 0,
    position: 'absolute',
    justifyContent: 'flex-end',
    marginHorizontal: '4%',
    width: '100%',
  },
});

export default CButton;
