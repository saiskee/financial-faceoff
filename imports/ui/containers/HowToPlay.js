import React from 'react';
import Paper from "@material-ui/core/Paper";
import './HowToPlay.css'

const styles = {
  paper: {
    padding: '10px 50px 50px 50px',
    margin: '30px'
  }
};

const howToPlay = () => (
  <Paper style={styles.paper}>
    <h1>How to Play Family Fued</h1>
    <h3>Thanks for playing the family fued web app! You can create your own survey questions, own games, and own fun. Here is how to get started.</h3>
    <ol>
      <li>Start by creating a new game and adding some questions to your questions bank.</li>
      <li>Create questions by clicking <strong>"New Question"</strong> at the top right</li>
      <li>Select 10 for the regular family fued round and 5 for the fast money round</li>
      <li>Select a title and create game!</li>
    </ol>
    <h3>Once you've create a game or two, it's time to play. Be sure to display the answers for each question on a separate window. Here are some tips on how to play.</h3>
    <ol>
      <li>Have 2 players scan the QR code to do the face off at the start of each round</li>
      <li>Instruct the players that they can only buzz in once the question has been read</li>
      <li>At the end of the round, be sure to finalize the points by adding them to the team that won</li>
      <li>Team Point totals will be kept throughout the game</li>
      <li>Click the <strong>X</strong> when someone answers incorrectly</li>
      <li>Click <strong>Clear</strong> to reset the <strong>X's</strong></li>
    </ol>
    <h3>Fantastic job finishing the regular round! Now it's time for fast money.</h3>
    <ol>
      <li>For this round, move the main window from sight while the participant is answering questions</li>
      <li>After recording the answers, select the closest answer from the selections or <strong>Incorrect Answer</strong></li>
      <li>Present the results of that round by clicking <strong>Show Results</strong> at the bottom of the page</li>
      <li>Rinse and repeat for round 2</li>
    </ol>
    <h1>Enjoy playing!</h1>
  </Paper>
);

export default howToPlay;