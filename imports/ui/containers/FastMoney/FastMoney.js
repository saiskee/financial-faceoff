import React from "react";
import { withRouter } from "react-router";
import { Meteor } from "meteor/meteor";
import FastResults from "../../components/FastResults/FastResults";
import "./FastMoney.css";
import withAudio from "../../hoc/withAudio";
import Paper from "@material-ui/core/Paper";
import * as _ from "lodash";

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
    round_num: this.round_num,
    question_num: 0,
    current_question: ""
  };

  get game_id() {
    return this.props.match.params.game_id;
  }

  get round_num() {
    return parseInt(this.props.match.params.round_num);
  }

  getFastQuestion = () => {
    Meteor.call('join_questions', this.game_id, (error, result) => {
      if (error) console.log(error);
      else {
        let data = result[0]; // single element array
        data.fast_money = _.map(data.fast_money, q => (
            {...q, input: "", closest_answer: "-1"}
        )); // -1 is no close answer
        this.setState({
          1: deepCopy(data),
          2: deepCopy(data),  // round 1 and round 2 in state

        });
        this.setState({current_question: this.state[this.round_num].fast_money[this.state.question_num].text})
      }
    });
  };

  get question_num() {
    return this.state.question_num;
  }
  componentDidMount() {
    this.getFastQuestion();

    this.props.pause();
    this.interval = setInterval(() => {
      Meteor.call("toController", this.game_id, { ...this.state });
    }, 500);

    Streamy.on(this.game_id + "toGame", data => {
      if (data.command.hasOwnProperty("round1")) {
        this.setState({ 1: deepCopy(data.command.round1) });
      }
      if (data.command.hasOwnProperty("round2")) {
        console.log(data.command.round2);
        this.setState({ 2: deepCopy(data.command.round2) });
      }
      else if (data.command.hasOwnProperty("roundToSwitchTo")) {
        this.props.history.push(
          `/games/${this.game_id}/fast/${data.command.roundToSwitchTo}`
        );
        this.setState({question_num: 0});
        this.state.round_num = this.round_num;
      }
      else if (data.command.hasOwnProperty("backToGame")) {
        localStorage.setItem("redTeamFastMoney", data.command.round1Scores);
        localStorage.setItem("blueTeamFastMoney", data.command.round2Scores)
        this.props.history.push(`/games/${this.game_id}/regular/${localStorage.getItem("recentQuestion") ? localStorage.getItem("recentQuestion") : 0}`);
      }
      else if (data.command.hasOwnProperty("showFinalScores")) {
        this.props.history.push(`/games/${this.game_id}/finalScores`);
      }
      else if (data.command.hasOwnProperty("revealAnswer")) {
        console.log(this.child);
        data.command.revealAnswer === "next"
            ? this.child.revealNextAnswer()
            : this.child.revealPreviousAnswer()
      }
      else if (data.command.hasOwnProperty("advanceQuestion")){
        if (data.command.advanceQuestion == 'next') {
          this.setState({question_num: this.state.question_num + 1})
        }else{
          this.setState({question_num : this.state.question_num - 1 >= 0 ? this.state.question_num -1 : 0})
        }
        try{
          this.setState({current_question: this.state[this.round_num].fast_money[this.state.question_num].text});
        } catch(error){

        }
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
            onRef={ref => {this.child = ref}}
          handleClose={this.handleClose}
          show_results={this.state.show_results}
          round_two={this.round_num === 2 ? this.state[2].fast_money : []}
          round_one={this.state[1].fast_money}
            question_num={this.state.question_num}
            current_question={this.state.current_question}
          {...this.props}
        />
      </Paper>
    );
  }
}

export default withRouter(withAudio(FastMoney));
