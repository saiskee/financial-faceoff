import React from 'react';
import './BuzzerPopup.css';

const buzzerPopup = (props) => (
  props.can_buzz ? null
    :
    <div className={'buzzer'} style={{
      color: props.buzzer_side === 'red' ? 'white' : 'black',
      background: props.buzzer_side === 'red' ? 'lightcoral' : 'palegreen'}}>
      <h1>TEAM {props.buzzer_side === 'red' ? 'RED' : 'GREEN'}</h1>
    </div>
);

export default buzzerPopup;