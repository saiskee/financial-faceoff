import React from "react";
import { Meteor } from "meteor/meteor";
import "./RegularPlay.css"
import { withRouter } from "react-router";
import Grid from "@material-ui/core/Grid";
import * as _ from "lodash";
import withAudio from "../../hoc/withAudio";
import BuzzerLink from "./BuzzerLink/BuzzerLink";
import BuzzerPopup from "./BuzzerPopup/BuzzerPopup";
import { objectEmpty } from "../../components/utils";
import WrongAnswer from "./WrongAnswer/WrongAnswer";

class RegularPlay extends React.Component {
  state = {
    question: {},
    title: "",
    num_questions: 0,
    questions: [],
    sum: 0,
    key: 0,
    buzzer_side: null,
    can_buzz: true,
    show_question: false,
    wrong_answers: 0,
    show_wrong_answer: false,
    include_current_round: false,
    answers: [],
    showQR: false,
    fastMoneyPlaying: false,
    redScore: localStorage.getItem("blueTeamFastMoney") ? localStorage.getItem("blueTeamFastMoney") : 0,
    blueScore: localStorage.getItem("redTeamFastMoney") ? localStorage.getItem("redTeamFastMoney") : 0
  };

  toggleAnswer = i => {
    let new_answers = [...this.state.answers];
    new_answers[i].show = !new_answers[i].show;
    if (new_answers[i].show) {
      new_answers[i].index === 0
        ? this.props.playNumberOne()
        : this.props.playRight();
    }
    this.setState({ answers: new_answers }, () => {
      const filtered = new_answers.filter(value => value.show === true);
      const summed = filtered.reduce((prev, next) => prev + next.responses, 0);
      this.sendSumValue(summed);
    });
  };

  renderPanelColumn = answers =>
    answers.map(answer => {
      return (
        <Grid item key={answer.index}>
          <div
            className="fued-result"
            onClick={this.toggleAnswer.bind(this, answer.index)}
          >
            <div
              className="flip-panel"
              style={{
                transform: answer.show ? "rotateX(180deg)" : "rotateX(0)"
              }}
            >
              <div className="panel-front">
                <h2>{answer.index + 1}</h2>
              </div>
              <div className="panel-back" >
                <div className={"panel-answer"} style={{overflowX: 'hidden', overflowY: 'scroll', scrollBarWidth: '0px',
                width: '90%', height:'100%'}}>
                  {answer.answer}
                </div>
                <span className={"points"}>{answer.responses}</span>
              </div>
            </div>
          </div>
        </Grid>
      );
    });

  sendSumValue = sum => this.setState({ sum });

  get question_num() {
    return parseInt(this.props.match.params.question_num);
  }

  get game_id() {
    return this.props.match.params.game_id;
  }

  buzz = side => {
    this.setState(
      {
        buzzer_side: side,
        can_buzz: false,
        show_question: false
      },
      () => {
        this.props.playBuzzIn();
        setTimeout(() => {
          this.setState({ can_buzz: true });
        }, 1000);
      }
    );
  };

  componentDidMount() {
    this.interval = setInterval(() => {
      Meteor.call("toController", this.game_id, {
        ...this.state,
        question_num: this.question_num
      });
    }, 1000);
    this.getNewQuestion(this.question_num);
    this.props.pause();

    Streamy.on(this.game_id, data => {
      if (this.state.can_buzz) {
        this.buzz(data.side);
      }
    });

    Streamy.on(this.game_id + "toGame", data => {
      console.log(data);
      if (data.command.hasOwnProperty("showAnswer")) {
        this.toggleAnswer(data.command.showAnswer);
      } else if (data.command.hasOwnProperty("advanceQuestion")) {
        data.command.advanceQuestion === "next"
          ? this.nextQuestion()
          : this.previousQuestion();
      } else if (data.command.hasOwnProperty("showQuestion")) {
        this.showQuestion();
      } else if (data.command.hasOwnProperty("hideQuestion")) {
        this.hideQuestion();
      } else if (data.command.hasOwnProperty("wrongAnswer")) {
        this.wrongAnswer();
      } else if (data.command.hasOwnProperty("awardPoints")) {
        this.addPoints(data.command.awardPoints);
      } else if (data.command.hasOwnProperty("clearErrors")) {
        this.clear();
      } else if (data.command.hasOwnProperty("showQR")) {
        this.state.showQR = data.command.showQR;
        this.forceUpdate();
      } else if (data.command.hasOwnProperty("fastMoney")) {
        localStorage.setItem("recentQuestion", this.question_num);
        this.state.fastMoney = data.command.fastMoney;
        this.startFastMoney();
      }else if (data.command.hasOwnProperty("toggleAudio")){
        this.props.toggleAudio();
      }else if (data.command.hasOwnProperty("reset")){
        console.log(data);
        if (data.command.reset === true){
          localStorage.removeItem(this.game_id);
          localStorage.removeItem("redTeamFastMoney");
          localStorage.removeItem("recentQuestion");
          localStorage.removeItem("blueTeamFastMoney");
          this.setState({
            buzzer_side: null,
            can_buzz: true,
            show_question: false,
            wrong_answers: 0,
            show_wrong_answer: false,
            include_current_round: false,
            showQR: false,
            fastMoneyPlaying: false,});
          this.props.history.push(`/games/${this.game_id}/regular/0`);
        }
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    Streamy.off(this.game_id + "toGame");
  }

  sum_points = (team, question_num) => {
    const game = JSON.parse(localStorage.getItem(this.game_id));
    if (!game) return 0;
    console.log(localStorage.getItem(team+"TeamFastMoney"));
    return game
      .filter((o, i) => o.team === team && i <= question_num)
      .reduce((prev, next) => prev + next.points, 0) + parseInt(localStorage.getItem(team+'TeamFastMoney')? localStorage.getItem(team+'TeamFastMoney') : 0);
  };

  get red_points() {
    return this.sum_points(
      "red",
      this.question_num - +!this.state.include_current_round
    );
  }

  get red_points_previous() {
    return this.sum_points("red", this.question_num - 1);
  }

  get blue_points() {
    return this.sum_points(
      "blue",
      this.question_num - (this.state.include_current_round ? 0 : 1)
    );
  }

  get blue_points_previous() {
    return this.sum_points("blue", this.question_num - 1);
  }

  getNewQuestion = question_num => {
    this.props.history.push(`/games/${this.game_id}/regular/${question_num}`); // change address bar route
    Meteor.call("join_questions", this.game_id, (error, result) => {
      if (error) console.log(error);
      else {
        const data = result[0]; // single element array
        let question = { ...data.questions[question_num] };
        question.answers = _.sortBy(question.answers, ["responses"]).reverse();
        this.setState({
          num_questions: data.questions.length,
          question,
          title: data.title,
          questions: data.questions,
          key: this.state.key + 1, // change key of child to remount component
          sum: 0,
          wrong_answers: 0,
          include_current_round: false,
          answers: _.map(question.answers, (element, i) => ({
            ...element,
            show: false,
            index: i
          }))
        });
        Meteor.call("toController", this.game_id, this.state);
        //this.showQuestion();
      }
    });
  };

  nextQuestion = () => {
    this.getNewQuestion(this.question_num + 1);
  };

  previousQuestion = () => {
    if (this.question_num >= 1) {
      this.getNewQuestion(this.question_num - 1);
    }
  };

  startFastMoney = () => {
    this.props.history.push(`/games/${this.game_id}/fast/1`);
    Meteor.call("controller", this.game_id, { fastMoney: true });
  };

  showQuestion = () => {
    this.setState({ show_question: true });
  };

  hideQuestion = () => {
    this.setState({ show_question: false });
  };

  renderSlideQuestions = () => (
    <div className={"button-group"}>
    </div>
  );

  wrongAnswer = () => {
    this.setState(
      prevState => ({
        wrong_answers: prevState.wrong_answers + 1,
        show_wrong_answer: true
      }),
      () => {
        this.props.playWrongShort();
        setTimeout(() => {
          this.setState({ show_wrong_answer: false });
        }, 2000);
      }
    );
  };

  clear = () => {
    this.setState({ wrong_answers: 0 });
  };

  addPoints = team => {
    let game = JSON.parse(localStorage.getItem(this.game_id));
    if (!game) {
      game = new Array(10).fill({});
    }
    game[this.question_num] = {
      team,
      points: this.state.sum
    };
    localStorage.setItem(this.game_id, JSON.stringify([...game]));
    this.setState({ include_current_round: true }, () => {
      this.forceUpdate();
    });
  };

  render() {
    const {
      can_buzz,
      buzzer_side,
      wrong_answers,
      question,
      show_question,
      sum,
      key,
      show_wrong_answer,
      answers
    } = this.state;
    Meteor.call("toController", this.game_id, {
      answers: question.answers,
      question_num: this.question_num
    });
    return (

      <div className={"RegularPlay"}>
        <div className="team-points team-red">
          <br />
          <h1 style={{color:"rgb(255, 153, 153)"}}>{this.red_points}</h1>
          <h4>Previous Round: {this.red_points_previous}</h4>
        </div>
        <div className="team-points team-blue">
          <br />
          <h1 style={{color:"lightGreen"}}>{this.blue_points}</h1>
          <h4>Previous Round: {this.blue_points_previous}</h4>
        </div>

        <BuzzerPopup can_buzz={can_buzz} buzzer_side={buzzer_side} />
        <WrongAnswer
          show_wrong_answer={show_wrong_answer}
          wrong_answers={wrong_answers}
        />

        {this.state.showQR && (
            <React.Fragment>
          <div className="top-left-controls">
            <BuzzerLink game_id={this.game_id} team={"red"} />
          </div>
              <div className={"top-right-controls"}>
                <BuzzerLink game_id={this.game_id} team={"green"} />
              </div>
            </React.Fragment>
        )}
        {this.state.show_question && 
        <div style={{background: "rgba(0,0,0,0.93)", position: 'fixed', zIndex:'99', 
          top: '5px', left: '1vw', width:'96vw', color: 'white', borderRadius : '20px', padding: '10px'}}>
          {console.log(this.question_num+1)}
          <h2>Question {this.question_num + 1}: {question.text}</h2>
        </div>
        }

        <h2 style={{textAlignLast: 'center', marginTop: 0 }}>Question {this.question_num +1}: {question.text}</h2>
        {this.renderSlideQuestions()}
        <span className={"fued-points"}>{sum}</span>
        {!objectEmpty(question) ? (
          <div className={"board"} key={key}>
            <Grid container>
              <Grid item xs={6}>
                {this.renderPanelColumn(answers.slice(0, 4))}
              </Grid>
              <Grid item xs={6}>
                {this.renderPanelColumn(answers.slice(4, 8))}
              </Grid>
            </Grid>
          </div>
        ) : (
          <h4>Loading...</h4>
        )}
      </div>
    );
  }
}

export default withRouter(withAudio(RegularPlay));
