import React from 'react';
import Button from "@material-ui/core/Button";
import {Meteor} from "meteor/meteor";
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid";

const styles = {
  button: {
    height: '180px',
    fontSize: '50px'
  }
};

class Buzzer extends React.Component {
  hitBuzzer = (side) => {
    Meteor.call('buzzer', this.game_id, side)
  };

  get game_id() {
    return this.props.match.params.game_id;
  }

  render() {
    return (
      <Grid container spacing={3}>
        <Grid item xs>
          <Button
            style={styles.button}
            fullWidth
            variant={'contained'}
            color={'secondary'}
            onClick={this.hitBuzzer.bind(this, 'red')}>Red</Button>
        </Grid>
        <Grid item xs>
          <Button
            style={styles.button}
            fullWidth
            variant={'contained'}
            color={'primary'}
            onClick={this.hitBuzzer.bind(this, 'blue')}>Blue</Button>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(Buzzer);