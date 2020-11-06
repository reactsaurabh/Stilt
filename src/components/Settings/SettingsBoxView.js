import React from 'react';
import {StyleSheet, View} from 'react-native';
import SettingsBox from './SettingsBox';

const SettingsBoxView = ({option, iconColor}) => {
  return (
    <View style={styles.container}>
      {option.map(({iconComponent, iconName, text, onPress}, index) => (
        <SettingsBox
          key={iconName}
          iconComponent={iconComponent}
          iconName={iconName}
          text={text}
          color={iconColor}
          noMargin={index !== 0 && index % 3 === 0}
          onPress={onPress}
        />
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
export default SettingsBoxView;
