import React from 'react';
import Button from "@material-ui/core/Button";

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.count,
      counting: false
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.round_num !== nextProps.round_num) {
      this.setState({
        count: nextProps.count,
        counting: false
      })
    }
  }

  startTimer = () => {
    this.setState({counting: true})
  };

  resetTimer = () => {
    this.pauseTimer();
    clearInterval(this.interval);
    this.interval = this.setupInterval();
    this.setState({count: this.props.count})
  };

  pauseTimer = () => {
    this.setState({counting: false})
  };

  setupInterval = () => (
    setInterval(() => {
      this.setState(prevState => {
        if (prevState.count === 0) {
          clearInterval(this.interval);
          this.props.playTimesUp();
        } else if (this.state.counting) {
          return {
            count: prevState.count - 1
          }
        }
      })
    }, 100)
  );

  componentDidMount() {
    this.interval = this.setupInterval();
    Streamy.on(this.props.game_id + "toTimer", (data) => {
      console.log(data);
      if (data.command.hasOwnProperty('timerAct')){
        if (data.command.timerAct === 'start'){
          this.startTimer();
        }else if (data.command.timerAct === 'stop'){
          this.resetTimer();
        }else if (data.command.timerAct === 'pause'){
          this.pauseTimer();
        }
      }
      
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <h3>Count: {(this.state.count / 10).toFixed(1)}</h3>
        {/* <Button variant="outlined" disabled={this.state.counting} onClick={this.startTimer}>Start</Button>
        <Button variant="outlined" disabled={!this.state.counting || this.state.count === 0} onClick={this.pauseTimer}>Pause</Button>
        <Button variant="outlined" onClick={this.resetTimer}>Reset</Button> */}
      </div>
    );
  }
}

export default Timer;