import React from 'react';
import { Text, View, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button } from './common';

export default class ModalWithButton extends React.Component {
  render() {
    return (
      <Modal
        visible
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={commonStyles.modalStyle}>
          <View style={commonStyles.modalSectionStyle}>
              {this.props.children}
            <Button
              onPress={this.props.onButtonPress}
              title={this.props.buttonTitle}
              main
            >
            </Button>
          </View>
        </View>

      </Modal>
    );
  }
}


const commonStyles = {
    modalTextStyle: {
    margin: 15,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 30,
    color: 'black',
  },
  modalSectionStyle: {
    margin: 10,
    borderRadius: 4,
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white',
    justifyContent: 'space-around',
    flexDirection: 'column',
    borderColor: 'rgba(31, 130, 83, 1)',
  },
  modalStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 20,
    paddingTop: 40
  },
};
