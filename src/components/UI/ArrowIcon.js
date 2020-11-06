import React from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
const ArrowIcon = ({arrowSize, color, type, backgroundColor}) => {
  return (
    <View
      style={[
        styles.arrowContainer,
        backgroundColor && {
          backgroundColor,
          width: 70,
          height: 70,
          borderRadius: 35,
        },
      ]}>
      <Icon name={`md-arrow-${type}`} size={arrowSize} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
ArrowIcon.propTypes = {
  type: PropTypes.oneOf(['forward', 'back', 'up', 'down']).isRequired,
  arrowSize: PropTypes.number,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
};
ArrowIcon.defaultProps = {
  arrowSize: 40,
  color: 'white',
  backgroundColor: '',
};

export default ArrowIcon;
