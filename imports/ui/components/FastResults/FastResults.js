import React from 'react';
import Grid from "@material-ui/core/Grid/index";
import './FastResults.css';
import {Button} from "@material-ui/core";
import Modal from '@material-ui/core/Modal/index';
import Fab from "@material-ui/core/Fab";
import CloseIcon from '@material-ui/icons/Close';
import {withRouter} from "react-router";
import Timer from "../../components/Timer";

const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;

const styles = {
  totalPoints: {
    float: 'right',
    display: 'inline-block',
  }
};

class FastResults extends React.Component {
  state = {
    round_one: [],
    round_two: [],
    show_index: -1
  };

  renderRound = (round, is_round_two = false) => (
    round.map((response, i) => {
      const selected = parseInt(response.closest_answer);
      let points = selected === -1 ? 0 : response.answers[selected].responses;
      const input_index = (i * 2) + (is_round_two ? 10 : 0);
      const points_index = input_index + 1;

      const show_input = input_index <= this.show_index;
      const show_points = points_index <= this.show_index;

      const classes = ["black-bar"];
      if (show_points) {
        classes.push("hide")
      }

      return (
        <div className='fast-row' key={response._id + i}>
          <div className='fast-response input-area' style={{color: show_input ? 'white' : 'black'}}>
            <span>{response.input}</span>
          </div>
          <div className='fast-points input-area' style={{color: show_points ? 'white' : 'black'}}>
            <span>{points}</span>
          </div>
          {show_input ?
            <div className="black-container">
              <div className={classes.join(" ")}/>
            </div> : null}
        </div>
      )
    })
  );

  get show_index() {
    return this.state.show_index;
  }

  get total_points() {
    const all_rounds = [...this.state.round_one, ...this.state.round_two];
    return all_rounds.reduce((prev, next, i) => {
      const selected = parseInt(next.closest_answer);
      // Display only visible points
      let points = (selected === -1 || (i * 2) >= this.state.show_index) ? 0 : next.answers[selected].responses;
      return prev + points;
    }, 0);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress)
   
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  playSoundEffect = () => {
    if (this.state.show_index % 2 === 0) {
      this.props.playFastMoneyReveal();
    } else {
      const arr = this.state.round_one.concat(this.state.round_two);
      if (arr[Math.floor(this.state.show_index / 2)].closest_answer === '-1') {
        this.props.playWrongShort();
      } else {
        this.props.playRight();
      }
    }
  };

  handleKeyPress = event => {
    if (!this.props.show_results) return;
    if (event.keyCode === LEFT_ARROW) {
      if (this.state.show_index > -1) {
        this.setState(state => ({show_index: state.show_index - 1}))
      }
    } else if (event.keyCode === RIGHT_ARROW) {
      if (this.state.show_index < (this.state.round_one.length + this.state.round_two.length)*2 - 1) {
        this.setState(state => ({show_index: state.show_index + 1}), this.playSoundEffect)
      }
    }
  };

  componentWillReceiveProps(nextProps, nextContext) {
    const data = {
      round_one: nextProps.round_one || [],
      round_two: nextProps.round_two || []
    };
    const next_round_num = parseInt(nextProps.match.params.round_num);
    if (this.round_num !== next_round_num) {
      data.show_index = next_round_num === 1 ? -1 : 9;
    }
    this.setState(data);
  }

  get game_id() {
    return this.props.match.params.game_id;
  }

  get round_num() {
    return parseInt(this.props.match.params.round_num);
  }

  render() {
    return (
      <Modal
       
        open={this.props.show_results}
        onClose={this.props.handleClose}>
        <div className={'FastResults'} style = {{height: "100vh"}}>
          <div>
          <Timer
          {...this.props}
          game_id = {this.game_id}
          style = {{float: "right"}}
          round_num={this.round_num}
          count={this.round_num === 1 ? 200 : 250}/>
            {/* <Fab color="primary" aria-label="Add" onClick={this.props.handleClose} style={{float: 'right'}}>
              <CloseIcon/>
            </Fab> */}

            <h1>Fast Money</h1>
            <h3>Round #{this.round_num}</h3>
          </div>
          <Grid container>
            <Grid item xs={6}>
              {this.renderRound(this.state.round_one)}
            </Grid>
            <Grid item xs={6}>
              {this.renderRound(this.state.round_two, true)}
            </Grid>
          </Grid>
          <br/>
          <Grid container>
            <Grid item xs={this.round_num === 1 ? 3 : 9}/>
            <Grid item xs={3}>
              <div className="fast-row">
                <div className="input-area fast-response">
                  <span>TOTAL</span>
                  <span style={styles.totalPoints}>{this.total_points}</span>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </Modal>
    );
  }
}

export default withRouter(FastResults);