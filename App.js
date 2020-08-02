import React from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Turn from './Turn';
import Sound from 'react-native-sound';

export default class App extends React.Component {
  state = {
    playerOne: new Date(new Date().setMinutes(5, 0, 0)),
    playerTwo: new Date(new Date().setMinutes(5, 0, 0)),
    turn: 'playerOne',
    started: false,
    finnished: false,
    winner: '',
  };
  sound = new Sound('changeTurn.mp3', Sound.MAIN_BUNDLE, (error) => {
    if(error)
    console.log('failed to load the sound', error, Sound.MAIN_BUNDLE);
    return;
  });
  checkIfGameStarted = () => this.state.started === true;
  startGame = () =>
    this.setState(
      {
        started: true,
      },
      this.changeTurn,
    );
  stopGame = () => {
    clearInterval(this.playerOneInt);
    clearInterval(this.playerTwoInt);
    this.setState({
      finnished: true,
    });
    this.checkWinner();
  };
  componentDidMount = () => this.sound.play();
  changeTurn = () =>
    this.setState(
      (prevState) => ({
        turn: prevState.turn === 'playerOne' ? 'playerTwo' : 'playerOne',
      }),
      this.startTimers,
    );
  startTimers = () => {
    const {turn, finnished} = this.state;
    if (this.checkIfGameStarted() && !finnished) {
      if (turn === 'playerOne') {
        clearInterval(this.playerOneInt);
        this.playerTwoInt = setInterval(() => {
          const {playerTwo} = this.state;
          if (!this.checkIfTimerEnded(playerTwo))
            this.setState((prevState) => ({
              playerTwo: new Date(prevState.playerTwo.getTime() - 1000),
            }));
          else this.stopGame();
        }, 1000);
      } else if (turn === 'playerTwo') {
        clearInterval(this.playerTwoInt);
        this.playerOneInt = setInterval(() => {
          const {playerOne} = this.state;
          if (!this.checkIfTimerEnded(playerOne))
            this.setState((prevState) => ({
              playerOne: new Date(prevState.playerOne.getTime() - 1000),
            }));
          else this.stopGame();
        }, 1000);
      }
    }
  };
  checkPlayerOne = () =>
    this.checkIfGameStarted() && this.state.turn === 'playerOne';
  checkPlayerTwo = () =>
    this.checkIfGameStarted() && this.state.turn === 'playerTwo';
  checkIfTimerEnded = (date) =>
    date.getMinutes() === 0 && date.getSeconds() === 0;
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
  checkWinner = () => {
    const {playerOne, playerTwo} = this.state;
    let winner;
    if (this.checkIfTimerEnded(playerOne)) winner = 'Player 2';
    else if (this.checkIfTimerEnded(playerTwo)) winner = 'Player 1';
    this.setState({
      winner,
    });
  };
  playerOneInt = null;
  playerTwoInt = null;
  render() {
    const {turn, started, finnished, winner} = this.state,
      {width} = Dimensions.get('screen');
    return (
      <>
        <StatusBar hidden />
        <View style={styles.container}>
          <View style={styles.buttonWithTimer}>
            <TouchableOpacity
              disabled={this.checkPlayerOne()}
              onPress={this.changeTurn}>
              <View style={[styles.buttons, styles.up, {width}]}>
                <Text style={[styles.buttonsText, styles.rotatedText]}>
                  Player 1
                </Text>
              </View>
            </TouchableOpacity>
            <Text style={[styles.timers, styles.rotatedText]}>
              {this.getPlayerOneTime()}
            </Text>
          </View>
          {!finnished && started && <Turn player={turn} />}
          {!started && (
            <TouchableOpacity onPress={this.startGame}>
              <View style={styles.startButton}>
                <Text style={styles.buttonsText}>Start</Text>
              </View>
            </TouchableOpacity>
          )}
          {finnished && <Text style={styles.winnerText}>Winner: {winner}</Text>}
          <View style={styles.buttonWithTimer}>
            <Text style={styles.timers}>{this.getPlayerTwoTime()}</Text>
            <TouchableOpacity
              disabled={this.checkPlayerTwo()}
              onPress={this.changeTurn}>
              <View style={[styles.buttons, styles.down, {width}]}>
                <Text style={styles.buttonsText}>Player 2</Text>
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
    alignItems: 'center',
  },
  up: {
    backgroundColor: 'red',
  },
  down: {
    backgroundColor: 'blue',
  },
  startButton: {
    backgroundColor: '#00DC7D',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 30,
  },
  buttonsText: {
    fontSize: 23,
    color: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonWithTimer: {
    alignItems: 'center',
  },
  timers: {
    fontSize: 30,
  },
  winnerText: {
    fontSize: 35,
    color: '#70E852',
  },
  rotatedText: {
    transform: [{rotate: '180deg'}],
  },
});
