import React, {Fragment} from 'react';
import Modal from '@material-ui/core/Modal/index';
import Button from "@material-ui/core/Button/index";
import './NewQuestion.css';
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from "@material-ui/core/TextField";
import {Questions} from "../../../api/links";
import Grid from "@material-ui/core/Grid";


class NewQuestion extends React.Component {
  state = {
    singleOpen: false,
    question: "",
    responses: [],
    jsonInputOpen: false,
    json: "",
  };

  handleSingleOpen = () => {
    this.setState({singleOpen: true})
  };

  handleSingleClose = () => {
    this.setState({singleOpen: false})
  };

  handleJSONOpen = () => {
    this.setState({jsonInputOpen: true})
  }

  handleJSONClose = () => {
    this.setState({jsonInputOpen: false})
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.responses.length === 0) {
      // Add validator message here
      return null;
    }
    if (this.state.responses.length > 8) {
      // Add validator message here
      return null;
    }
    Questions.insert({
      user_id: Meteor.userId(),
      text: this.state.question,
      answers: [...this.state.responses] }, () => {
      this.handleSingleClose();
    });
  };

  handleJSONSubmit = (e) => {
    e.preventDefault();
    console.log(JSON.parse(this.state.json));
    let q = JSON.parse(this.state.json).Questions;
    this.setState({json: q});
    for (let i = 0; i < q.length; i++){
      let question = q[i];
      console.log("Question: " + question + "Answers:");
      console.log( question.answers);
      Questions.insert({
        user_id: Meteor.userId(),
        text: question.question,
        answers: [...question.answers]
      }, (error, response) => {
        console.log(error);
        console.log(response);
        this.handleJSONClose();
      })
    }
  }

  addResponse = () => {
    // this.setState({responses: [this.state.responses]})
    this.setState({responses: [...this.state.responses, {answer: "", responses: 0}]})
  };

  removeResponse = (i) => {
    let responses = [...this.state.responses];
    this.setState({responses: responses.slice(0, i).concat(responses.slice(i + 1, responses.length))});
  };

  handleAnswerChange = (i, event) => {
    const responses = [...this.state.responses];
    responses[i].answer = event.target.value;
    this.setState({responses});
  };

  handleResponsesChange = (i, event) => {
    const responses = [...this.state.responses];
    responses[i].responses = parseInt(event.target.value);
    this.setState({responses});
  };

  handleQuestionChange = event => {
    this.setState({question: event.target.value})
  };

  handleJSONChange = e => {
    this.setState({json: e.target.value});
  }

  render() {
    const {singleOpen, jsonInputOpen} = this.state;

    return (
      <Fragment>
        <Button onClick={this.handleJSONOpen} variant="contained" color="secondary">Import Questions JSON</Button>
        <Button onClick={this.handleSingleOpen} variant="contained" color="primary" className={'new-question'}>New Question</Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={singleOpen}
          onClose={this.handleSingleClose}
        >
          <div id={"modal"}>
            <h1>New Question</h1>
            <ValidatorForm
              ref="form2"
              onSubmit={this.handleSubmit}
              onError={errors => console.log(errors)}
            >
              <TextValidator
                autoFocus
                label="Question"
                onChange={this.handleQuestionChange}
                name="question"
                value={this.state.question}
                validators={['required']}
                errorMessages={['this field is required']}
                fullWidth
              />
              <br/>
              <h3>Responses</h3>

              {this.state.responses.map((response, i) => (
                  <div className={'input-row'} key={i}>
                    <Grid container spacing={8}>
                      <Grid item xs>
                        <TextField
                          required
                          id="answer"
                          label="Required"
                          margin="normal"
                          value={response.answer}
                          fullWidth
                          onChange={this.handleAnswerChange.bind(this, i)}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          required
                          type="number"
                          id="num-responses"
                          label="Required"
                          margin="normal"
                          value={response.responses}
                          inputProps={{min: "1", max: "99", step: "1"}}
                          onChange={this.handleResponsesChange.bind(this, i)}
                        />
                      </Grid>
                      <Grid item>
                        <Fab className={'remove-icon'} color="secondary" aria-label="Delete"
                             onClick={this.removeResponse.bind(this, i)}>
                          <DeleteIcon/>
                        </Fab>
                      </Grid>
                    </Grid>
                  </div>
                )
              )}
              <Fab color="primary" aria-label="Add" onClick={this.addResponse}>
                <AddIcon />
              </Fab>
              <br/>
              <br/>
              <Button type={"submit"}>Create Question</Button>
            </ValidatorForm>
          </div>
        </Modal>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={jsonInputOpen}
          onClose={this.handleJSONClose}
        >
          <div id={"modal"} style={{whiteSpace:'pre-wrap'}}>
            <h1>Import Questions JSON</h1>
            Please format the JSON as follows: <br/>
            <code style={{
              padding: '20px',
              display: 'block',
              border: '1px solid #999',
              backgroundColor: "lightgray",
              overflow: "auto",
              height: "100px"
            }}>{`{ 
              "Questions": [
                {
                  "question": "This is a sample question?",
                  "answers": [
                    {
                      "answer": "This is a sample answer",
                      "responses" : 70 
                    }, {
                      "answer": "This is another sample answer",
                      "responses" : 42
                    }
                  ]
                }
                ]
              }`}
            </code>
            <ValidatorForm
              ref="form2"
              onSubmit={this.handleJSONSubmit}
              onError={errors => console.log(errors)}
            >
              <TextValidator
                autoFocus
                label="JSON"
                onChange={this.handleJSONChange}
                name="JSON input"
                value={this.state.JSONString}
                fullWidth
              />
              <br/>
              

              <Button type={"submit"}>Import JSON</Button>
            </ValidatorForm>
          </div>
        </Modal>
      </Fragment>

    )
  }
}
export default NewQuestion;
