import React from 'react';
import Modal from "@material-ui/core/Modal";
import Fab from "@material-ui/core/Fab";
import CloseIcon from "@material-ui/icons/Close";
import './Question.css';

const question = (props) => (
  <Modal
  hideBackdrop = {true}
    open={props.show_question}
    onClose={props.hideQuestion}
  >
    <div className={'question'} style={{width:'90vw'}}>
      <Fab color="primary" aria-label="Add" onClick={props.hideQuestion} style={{float: 'right'}}>
        <CloseIcon/>
      </Fab>

      <h2>Question: {props.question.text}</h2>
    </div>

  </Modal>
);

export default question;