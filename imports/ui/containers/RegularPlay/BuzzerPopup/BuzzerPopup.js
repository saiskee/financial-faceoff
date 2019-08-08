import React from 'react';
import './BuzzerPopup.css';

const buzzerPopup = (props) => (
  props.can_buzz ? null
    :
    <div className={'buzzer'} style={{background: props.buzzer_side}}>
      <h1>Team {props.buzzer_side}</h1>
    </div>
);

export default buzzerPopup;