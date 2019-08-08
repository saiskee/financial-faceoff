import React from 'react';
import {withTracker} from "meteor/react-meteor-data";
import {Games} from '../../api/links';
import Grid from "@material-ui/core/Grid/index";
import Button from "@material-ui/core/Button/index";
import {withRouter} from "react-router";
import withAudio from "../hoc/withAudio";
import Paper from "@material-ui/core/Paper";

const styles = {
  home: {
    background: 'transparent'
  },
  paper: {
    padding: '30px',
    flexGrow: '1'
  }
};

class Home extends React.Component {
  componentDidMount() {
    this.props.playFullTheme();
  }

  renderGames = () => {
    return this.props.games.map((game, i) => {
      return (
        <Grid item sm={6} key={i}>
          <Paper style={styles.paper}>
            <Button onClick={() => {
              localStorage.removeItem(game._id);
              this.props.history.push(`/games/${game._id}/regular/0`)}}>{game.title}</Button>
          </Paper>
        </Grid>
      )
    })
  };

  render() {
    const games = this.renderGames();
    return (
      <div style={styles.home}>
        <Paper style={styles.paper}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <h1 style={styles.h1}>Family Fued Home</h1>
              <h2>My Games</h2>
            </Grid>
            {games.length > 0 ? games: <h3>You havent created any games. Create one now!</h3>}
          </Grid>
        </Paper>
      </div>
    )
  }
}

export default withRouter(withTracker(() => {
  return {
    games: Games.find({user_id: Meteor.userId()}).fetch()
  }
})(withAudio(Home)));