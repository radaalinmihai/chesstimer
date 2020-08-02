import React from 'react';
import { View, Text } from 'react-native';

export default class Turn extends React.Component {
  formatPlayer = () => this.props.player === 'playerOne' ? 'Second player' : 'First player';
  render() {
    return (
      <View>
        <Text style={{fontSize: 25}}>Current turn: {this.formatPlayer()}</Text>
      </View>
    );
  }
}