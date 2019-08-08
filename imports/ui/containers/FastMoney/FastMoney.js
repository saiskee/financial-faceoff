import React from "react";
import { withRouter } from "react-router";
import { Meteor } from "meteor/meteor";
import TextField from "@material-ui/core/TextField/index";
import * as _ from "lodash";
import FormControl from "@material-ui/core/FormControl/index";
import Radio from "@material-ui/core/Radio/index";
import FormControlLabel from "@material-ui/core/FormControlLabel/index";
import FormLabel from "@material-ui/core/FormLabel/index";
import RadioGroup from "@material-ui/core/RadioGroup/index";
import { Button } from "@material-ui/core/index";
import Grid from "@material-ui/core/Grid/index";
import Timer from "../../components/Timer";
import FastResults from "../../components/FastResults/FastResults";
import "./FastMoney.css";
import withAudio from "../../hoc/withAudio";
import Paper from "@material-ui/core/Paper";

const deepCopy = data => JSON.parse(JSON.stringify(data));

const styles = {
  paper: {
    padding: "50px",
    margin: "30px"
  }
};

class FastMoney extends React.Component {
  state = {
    1: {
      fast_money: [],
      _id: "",
      questions: [],
      title: ""
    },
    2: {
      fast_money: [],
      _id: "",
      questions: [],
      title: ""
    },
    show_results: true,
    fastMoneyPlaying: true,
    round_num: this.round_num
  };

  get game_id() {
    return this.props.match.params.game_id;
  }

  get round_num() {
    return parseInt(this.props.match.params.round_num);
  }

  // getFastQuestion = () => {
  //   Meteor.call('join_questions', this.game_id, (error, result) => {
  //     if (error) console.log(error);
  //     else {
  //       let data = result[0]; // single element array
  //       data.fast_money = _.map(data.fast_money, q => (
  //         {...q, input: "", closest_answer: "-1"}
  //       )); // -1 is no close answer
  //       this.setState({
  //         1: deepCopy(data),
  //         2: deepCopy(data)  // round 1 and round 2 in state
  //       });
  //     }
  //   });
  // };

  componentDidMount() {
    this.interval = setInterval(() => {
      Meteor.call("toController", this.game_id, { ...this.state });
    }, 3000);

    Streamy.on(this.game_id + "toGame", data => {
      if (data.command.hasOwnProperty("round1")) {
        this.setState({ 1: deepCopy(data.command.round1) });
      }
      if (data.command.hasOwnProperty("round2")) {
        this.setState({ 2: deepCopy(data.command.round2) });
      }
      if (data.command.hasOwnProperty("roundToSwitchTo")) {
        this.props.history.push(
          `/games/${this.game_id}/fast/${data.command.roundToSwitchTo}`
        );
        this.state.round_num = this.round_num;
      }
      if (data.command.hasOwnProperty("backToGame")) {
        localStorage.setItem("redTeamFastMoney", data.command.round1Scores);
        localStorage.setItem("blueTeamFastMoney", data.command.round2Scores)
        this.props.history.push(`/games/${this.game_id}/regular/${localStorage.getItem("recentQuestion") ? localStorage.getItem("recentQuestion") : 0}`);
      }
      if (data.commmand.hasOwnProperty("showFinalScores")) {
        this.props.history.push(`/games/${this.game_id}/finalScores`);
      }
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    Streamy.off(this.game_id + "toGame");
  }
  handleFormChange = (i, round) => event => {
    const round_data = { ...this.state[round] };
    round_data.fast_money[i].closest_answer = event.target.value;
    this.setState({ [round]: round_data, round_num: round });
  };

  handleInputChange = (i, round) => event => {
    const round_data = { ...this.state[round] };
    round_data.fast_money[i].input = event.target.value;
    this.setState({ [round]: round_data });
  };

  handleOpen = () => {
    this.setState({ show_results: true });
  };

  handleClose = () => {
    this.setState({ show_results: false });
  };

  render() {
    return (
      <Paper className={"FastMoney"} style={styles.paper}>
        <FastResults
          handleClose={this.handleClose}
          show_results={this.state.show_results}
          round_two={this.round_num === 2 ? this.state[2].fast_money : []}
          round_one={this.state[1].fast_money}
          {...this.props}
        />
      </Paper>
    );
  }
}

export default withRouter(withAudio(FastMoney));
