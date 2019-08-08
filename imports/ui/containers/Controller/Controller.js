import React from 'react';
import Button from "@material-ui/core/Button";
import {Meteor} from "meteor/meteor";
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid";
import { red } from '@material-ui/core/colors';
import { borderRadius } from '@material-ui/system';
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField/index";
import * as _ from 'lodash';
import FormControl from "@material-ui/core/FormControl/index";
import Radio from "@material-ui/core/Radio/index";
import FormControlLabel from "@material-ui/core/FormControlLabel/index";
import FormLabel from "@material-ui/core/FormLabel/index";
import RadioGroup from "@material-ui/core/RadioGroup/index";
import FastResults from "../../components/FastResults/FastResults";

const styles = {
	button: {
		height: '140px',
	  fontSize: '30px',
	},
	buttonRed: {
	  height: '140px',
	  fontSize: '30px',
	  color: 'red'
	},
	buttonBlue: {
		height:'140px',
		fontSize: '30px',
		color: 'blue'
	}, 
	paper: {
		padding : '50px',
		margin : '30px'
	}
};


const deepCopy = (data) => (
	JSON.parse(JSON.stringify(data))
);


class Controller extends React.Component{
	state = {
		question : '',
		answers : [],
		question_num : 0,
		questionShowing: false,
		fastMoney: false,
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
		show_results: false
	}
	action = (command) => {
		Meteor.call('toGame', this.game_id, command);
	};

	showAnswer = (answerIdx) => {
		Meteor.call('toGame', this.game_id, {showAnswer: answerIdx});
	}

	showQuestion = (show) => {
		if (show){
			Meteor.call('toGame', this.game_id, {showQuestion: true});
		}else {
			Meteor.call('toGame', this.game_id, {hideQuestion: true});
		}
	}

	wrongAnswer = () => {
		Meteor.call('toGame', this.game_id, {wrongAnswer : true});
	}

	awardPoints = (team) => {
		Meteor.call('toGame', this.game_id, {awardPoints: team});
	}

	clearErrors = () => {
		Meteor.call('toGame', this.game_id, {clearErrors : true});
	}

	showQRCode = (show) => {
		
		Meteor.call('toGame', this.game_id, {showQR: show});
	}

	advanceQuestion = (direction) => {
		Meteor.call('toGame', this.game_id, {advanceQuestion: direction});
	}

	componentDidMount(){
		Streamy.on(this.game_id +"toControl", (data) =>{
			console.log(data);
			this.state.question  = data.command.question ? data.command.question.text : this.state.question;
			this.state.answers = data.command.answers ? data.command.question.answers : this.state.answers;
			this.state.question_num = data.command.question_num ? data.command.question_num : this.state.question_num;
			if (data.command.fastMoneyPlaying && !this.state.fastMoney){
				this.state.fastMoney = data.command.fastMoneyPlaying;
				this.getFastQuestion();
				this.props.pause();
			}else if (data.command.fastMoneyPlaying === false){
				this.state.fastMoney = false;
			}
			this.state.round_num = data.command.round_num;
			this.forceUpdate();
		});
		
	}

	fastMoney(fast) {
		Meteor.call('toGame', this.game_id, {fastMoney : true})
		this.forceUpdate();
		
	}

	resetGame(){
		console.log("RESETTING GAME");
		Meteor.call('toGame', this.game_id, {reset: true})
	}

	get game_id() {
		return this.props.match.params.game_id;
	}

	/** FAST MONEY **************** */


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
			  2: deepCopy(data)  // round 1 and round 2 in state
			});
		  }
		});
	  };

	handleFormChange = (i, round) => event => {
		const round_data = {...this.state[round]};
		round_data.fast_money[i].closest_answer = event.target.value;
		this.setState({[round]: round_data});
	};

	renderQuestionInput = (q, index, round) => {
		return (
		  <div key={index + q.text + round}>
			<h3>{q.text}</h3>
			<Grid container spacing={4}>
			  <Grid item xs>
				<TextField
				  label="Your Answer"
				  value={q.input}
				  onChange={this.handleInputChange(index, round)}
				  margin="normal"
				  autoFocus={index === 0}
				  fullWidth
				/>
	
			  </Grid>
	
			  <Grid item xs>
	
				<FormControl component="fieldset">
				  <FormLabel component="legend">Answers</FormLabel>
				  <RadioGroup
					aria-label="Gender"
					name="gender1"
					value={q.closest_answer}
					onChange={this.handleFormChange(index, round)}
				  >
					{q.answers.map((answer, i) => {
						i = i.toString();
						const is_duplicate_answer =
						  round === 2 &&
						  i === this.state[1].fast_money[index].closest_answer;
						return <FormControlLabel
						  key={`${i}${round}`}
						  value={i}
						  control={<Radio/>}
						  disabled={is_duplicate_answer}
						  label={`${answer.answer} | ${answer.responses}`}/>
					  }
					)}
					<FormControlLabel
					  value={"-1"}
					  control={<Radio/>}
					  label="Incorrect Answer"
					/>
				  </RadioGroup>
				</FormControl>
			  </Grid>
			</Grid>
		  </div>
		)
	  };

	  handleInputChange = (i, round) => event => {
		const round_data = {...this.state[round]};
		round_data.fast_money[i].input = event.target.value;
		this.setState({[round]: round_data});
	  };
	
	  get round_num(){
		  return this.state.round_num;
	  }

	  handleOpen = () => {
		  Meteor.call('toGame', this.game_id, {round1: this.state[1], round2: this.state[2]})
	  }

	  switchRound = (roundNum) => {
		Meteor.call('toGame', this.game_id, {roundToSwitchTo: roundNum});
	  }

	  timer = (what) => {
		Meteor.call('toTimer',this.game_id, {timerAct: what});
	  }
	  
	  backToGame = () => {
		let round1Scores = 0;
		let round1 = this.state[1];
		for (let i = 0; i < round1.fast_money.length; i++){
			let closestAns = round1.fast_money[i].closest_answer;
			if (closestAns != -1){
				round1Scores += round1.fast_money[i].answers[closestAns].responses;
			}
		}
		let round2Scores = 0;
		let round2 = this.state[2];
		for (let i = 0; i < round2.fast_money.length; i++){
			let closestAns = round2.fast_money[i].closest_answer;
			if (closestAns != -1){
				round2Scores += round2.fast_money[i].answers[closestAns].responses;
			}
		}
		Meteor.call('toGame', this.game_id, {backToGame: true, round1Scores: round1Scores, round2Scores: round2Scores});
	  }
	  showFinalScores = () => {
		Meteor.call('toGame', this.game_id, {showFinalScores: true})
	  }
	/** FAST MONEY END */
	render(){
		const {answers, question, question_num} = this.state;
		if (!this.state.fastMoney){
		return(
			<Grid container direction="column">
				<div style={{background: "rgba(0,0,0,0.93)", color: 'white', borderRadius : '20px', padding: '10px'}}>

				<h2>Question {question_num + 1}: {question}</h2>
				</div>
			<Grid container spacing={2}>
			{answers.map((ans, index) =>{
				return (
					<Grid item xs key={index}>
					<div className="fued-result" onClick={this.showAnswer.bind(this, index)}>
						<div className="flip-panel" style={{transform: "rotateX(180deg)"}}>
						<div className="panel-front">
							<h2>{index + 1}</h2>
						</div>
						<div className="panel-back">
							<span className={'panel-answer'}>{ans.answer}</span><span
							className={'points'}>{ans.responses}</span>
						</div>
						</div>
					</div>
					</Grid>
				);
			})}
			</Grid>
			<Grid container spacing={2}>
				<Grid item xs>
					<Button
					style = {styles.button}
					fullWidth
					variant={'contained'}
					onClick={this.advanceQuestion.bind(this, 'previous')}
						>
					Previous Question
					</Button>
				</Grid>
				<Grid item xs>
					<Button
					style = {styles.button}
					fullWidth
					variant={'contained'}
					onClick={this.advanceQuestion.bind(this, 'next')}
						>
					Next Question
					</Button>
				</Grid>
			</Grid>
			<Grid container spacing={3}>
				<Grid item xs>
					<Button
					style = {styles.button}
					fullWidth
					variant={'contained'}
					onClick={this.showQuestion.bind(this, true)}
						>
					Show Question
					</Button>
				</Grid>
				<Grid item xs>
					<Button
					style = {styles.button}
					fullWidth
					variant={'contained'}
					onClick={this.showQuestion.bind(this, false)}
						>
					Hide Question
					</Button>
				</Grid>
			</Grid>
			<Grid container spacing={2}>
			<Grid item xs>
					<Button
					style = {styles.button}
					fullWidth
					variant={'contained'}
					onClick={this.wrongAnswer.bind(this)}
						>
					[X]
					</Button>
				</Grid>
				<Grid item xs>
					<Button
					style = {styles.buttonRed}
					fullWidth
					variant={'contained'}
					
					onClick={this.awardPoints.bind(this, 'red')}
						>
					Award Red 
					</Button>
				</Grid>
				<Grid item xs>
					<Button
					style = {styles.buttonBlue}
					fullWidth
					variant={'contained'}
					onClick={this.awardPoints.bind(this, 'blue')}
						>
					Award Blue 
					</Button>
				</Grid>
			</Grid>
			<Grid container spacing={3}>
				<Grid item xs>
					<Button
					style = {styles.button}
					fullWidth
					variant={'contained'}
					onClick={this.clearErrors.bind(this)}
						>
					Clear X's
					</Button>
				</Grid>
				<Grid item xs>
					<Button
					style = {styles.button}
					fullWidth
					variant={'contained'}
					onClick={this.showQRCode.bind(this, true)}
						>
					Show QR
					</Button>
				</Grid>
				<Grid item xs>
					<Button
					style = {styles.button}
					fullWidth
					variant={'contained'}
					onClick={this.showQRCode.bind(this, false)}
						>
					Hide QR
					</Button>
				</Grid>
			</Grid>
		{question_num +1 >= 10 && 
			<Grid container spacing={3}>
			
			<Grid item xs>
					<Button
					style = {styles.button}
					fullWidth
					variant={'contained'}
					onClick={this.fastMoney.bind(this, true)}
						>
					$$ FAST MONEY $$
					</Button>
				</Grid>
			</Grid>
		}
			<Grid container spacing={3}>
			
			<Grid item xs>
					<Button
					style = {styles.button}
					fullWidth
					variant={'contained'}
					onClick={this.resetGame.bind(this)}
						>
					Reset Game
					</Button>
				</Grid>
			</Grid>
		
			</Grid>
		);
	}

	/** FAST MONEY ROUND  */
	const round_one = this.state[1].fast_money.map((q, i) => this.renderQuestionInput(q, i, 1));
    const round_two = this.round_num === 2
      ? this.state[2].fast_money.map((q, i) => this.renderQuestionInput(q, i, 2))
      : null;
    return (
      <Paper className={'FastMoney'} style={styles.paper}>
		  <div>
		  
		  <Button
            variant="contained"
			style={{float: 'right'}}
			color="secondary"
            onClick={this.timer.bind(this, 'stop')}>
            Reset Timer
          </Button>
		  <Button
            variant="contained"
            style={{float: 'right'}}
            onClick={this.timer.bind(this, 'pause')}>
            Pause Timer
          </Button>
		  <Button
			variant="contained"
			color="primary"
            style={{float: 'right'}}
            onClick={this.timer.bind(this, 'start')}>
            Start Timer
          </Button>
        
		  </div>
        <h1>Fast Money: {this.round_num === 1 ? "Red Team" : "Blue Team"}</h1>
		<p>{this.round_num === 1 ? "Type the answers mentioned below, and choose the closest answer" : "Type the answers mentioned in the second column, and choose the closest answer"}</p>
        <br/>
        <br/>

        <Grid container>
          <Grid item xs={6}>
            {round_one}
          </Grid>
          <Grid item xs={6}>
            {round_two}
          </Grid>
        </Grid>
        <Button
          variant={'contained'}
          color={'primary'}
          fullWidth
          onClick={this.handleOpen}>Show Round {this.round_num} Results</Button>
		{this.round_num === 1
          ? <Button
            variant="contained"
            style={{float: 'left'}}
            onClick={this.switchRound.bind(this, 2)}>
            Next Round
          </Button>
          : (<React.Fragment><Button
            variant="contained"
            style={{float: 'left'}}
            onClick={this.switchRound.bind(this, 1)}>
            Previous Round
		  </Button>
			<Button
				variant="contained"
				style={{float: 'left'}}
				onClick={this.backToGame}>
				Back To Game
			</Button>
			{/* <Button
				variant="contained"
				style={{float: 'left'}}
				onClick={this.showFinalScores}>
				Final Scores
			</Button> */}
			</React.Fragment>
		  )}
	  </Paper>
    )
	}
}

export default withRouter(Controller);