import React from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default class App extends React.Component {
  state = {
    playerOne: new Date(new Date().setMinutes(5, 0, 0)),
    playerTwo: new Date(new Date().setMinutes(5, 0, 0)),
    turn: 'playerOne',
    started: false, // a button that actually starts the game and then starts the timers, players should press the button only when they finnished their move
  };
  changeTurn = () => {
    this.setState((prevState) => ({
      turn: prevState.turn === 'playerOne' ? 'playerTwo' : 'playerOne',
      started: true,
    }));
    this.startTimers();
  };
  startTimers = () => {
    const {started, turn} = this.state;
    if (started) {
      if (turn === 'playerOne') {
        this.playerOneInt = setInterval(
          () =>
            this.setState((prevState) => ({
              playerOne: new Date(prevState.playerOne.getTime() - 1000),
            })),
          1000,
        );
        if (typeof this.playerTwoInt !== null) clearInterval(this.playerTwoInt);
      } else if (turn === 'playerTwo') {
        this.playerTwoInt = setInterval(
          () =>
            this.setState((prevState) => ({
              playerTwo: new Date(prevState.playerTwo.getTime() - 1000),
            })),
          1000,
        );
        if (typeof this.playerOneInt !== null) clearInterval(this.playerOneInt);
      }
    }
  };
  checkPlayerOne = () => this.state.turn === 'playerOne';
  checkPlayerTwo = () => this.state.turn === 'playerTwo';
  getPlayerOneTime = () => {
    const {playerOne} = this.state;
    return (
      '0' +
      playerOne.getMinutes() +
      ':' +
      this.getSeconds(playerOne.getSeconds())
    );
  };
  getPlayerTwoTime = () => {
    const {playerTwo} = this.state;
    return (
      '0' +
      playerTwo.getMinutes() +
      ':' +
      this.getSeconds(playerTwo.getSeconds())
    );
  };
  getSeconds = (time) => (time < 10 ? '0' + time : time);
  playerOneInt = null;
  playerTwoInt = null;
  render() {
    const {playerOne, playerTwo, turn} = this.state;
    return (
      <>
        <StatusBar hidden />
        <View style={styles.container}>
          <View>
            <TouchableOpacity
              disabled={!this.checkPlayerOne()}
              onPress={this.changeTurn}>
              <View style={[styles.buttons, styles.up]}>
                <Text>Player 1</Text>
              </View>
            </TouchableOpacity>
            <Text>{this.getPlayerOneTime()}</Text>
          </View>

          <View>
            <Text>{this.getPlayerTwoTime()}</Text>
            <TouchableOpacity
              disabled={!this.checkPlayerTwo()}
              onPress={this.changeTurn}>
              <View style={[styles.buttons, styles.down]}>
                <Text>Player 2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  buttons: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  up: {
    backgroundColor: 'red',
  },
  down: {
    backgroundColor: 'blue',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
