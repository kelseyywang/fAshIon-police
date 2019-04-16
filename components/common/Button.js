import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

const Button = (props) => {
  const {textStyle, buttonStyle } = styles;
  if (props.main) {
    return (
      <TouchableOpacity
        onPress={props.onPress}
        style={[buttonStyle,
          {borderColor: colors.mainButtonTextColor,
            backgroundColor: colors.mainButtonColor,
            margin: (props.margin || 5),
          }]}
      >
        <Text style={[textStyle, {color: colors.mainButtonTextColor}]}>{props.title}</Text>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[buttonStyle,
        {borderColor: colors.secondaryButtonTextColor,
          backgroundColor: colors.secondaryButtonColor,
          margin: (props.margin || 5),
        }]}
    >
      <Text style={[textStyle, {color: colors.secondaryButtonTextColor}]}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    fontSize: 15,
    fontWeight: '500',
  },
  buttonStyle: {
    borderWidth: 0,
    borderRadius: 4,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
};
const colors = {
  mainButtonTextColor: 'white',
  mainButtonColor: 'rgba(31, 130, 83, 1)',
  secondaryButtonTextColor: 'black',
  secondaryButtonColor: 'white',
}

export { Button };
