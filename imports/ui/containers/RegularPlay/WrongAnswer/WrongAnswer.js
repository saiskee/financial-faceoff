import React from 'react';
import Grid from "@material-ui/core/Grid";
import './WrongAnswer.css';

const wrongAnswer = (props) => (
  props.show_wrong_answer ?
    <Grid container justify={'center'} className={'wrong-answer'} spacing={3}>
      {[...Array(props.wrong_answers)].map((_, i) => {
        return (
          <Grid item xs={2} key={i}>
            <img src="/ffx.png" alt="" style={{width: '100%'}}/>
          </Grid>
        )
      })}
    </Grid> : null
);

export default wrongAnswer;