import React from 'react';
import Button from "@material-ui/core/Button";
import {Meteor} from "meteor/meteor";
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid";

const styles = {
  button: {
    height: '100vh',
    width: '100vw',
    fontSize: '50px',
    position: 'fixed',
    borderRadius: '10px'

  }
};

class Buzzer extends React.Component {
  hitBuzzer = (side) => {
    Meteor.call('buzzer', this.game_id, side)
  };

  get game_id() {
    return this.props.match.params.game_id;
  }

  get team_name(){
    return this.props.match.params.team_name;
  }

  render() {
    if (this.team_name === 'red'){
      return (
        <Button
          style={styles.button}
          fullWidth
          variant={'contained'}
          color={'secondary'}
          onClick={this.hitBuzzer.bind(this, 'red')}>Red</Button>
      )
    }else if (this.team_name === 'green'){
      return(
          <Button
              style={{...styles.button, backgroundColor: 'lightGreen', }}
              fullWidth
              variant={'contained'}
              onClick={this.hitBuzzer.bind(this, 'blue')}>Green</Button>
      )
    }
  }
}

export default withRouter(Buzzer);
