import React from 'react';
import {withTracker} from "meteor/react-meteor-data";
import {Games} from '../../api/links';
import Grid from "@material-ui/core/Grid/index";
import Button from "@material-ui/core/Button/index";
import {withRouter} from "react-router";
import withAudio from "../hoc/withAudio";
import Paper from "@material-ui/core/Paper";
import "./Home.css"
import {isMobile} from 'react-device-detect';

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
          <div className="fued-result">
          <div
              className="flip-panel"
              style={{transform: 'rotateX(180deg)'}}
            >
              <style>
                {`
                .panel-answer:hover{
                  
                  color: darkgreen;
                }
                .points:hover{
                  color:purple
                }
                `}

              </style>
              <div className="panel-back">
              <span className={"panel-answer"}
              onClick={() => {
                localStorage.removeItem(game._id);
                this.props.history.push(`/games/${game._id}/regular/0`)}}>Play {game.title}</span>
                <span className={"points"}
                onClick={()=> {this.props.history.push(
                  `/games/${game._id}/controller`)}
                }>Controller</span>
              </div>
              </div>
          </div>
          {/* <Paper style={styles.paper}>
            {!isMobile && 
            <Button color="primary" onClick={() => {
              localStorage.removeItem(game._id);
              this.props.history.push(`/games/${game._id}/regular/0`)}}>Play {game.title}
            </Button>}
            <Button variant="contained" style={{float:'left'}} onClick={()=> {this.props.history.push(
          `/games/${game._id}/controller`)}
        }>Controller</Button>
          </Paper> */}
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
              <h1 style={styles.h1}>Welcome to <span style={{color:'#013220'}}>Financial Faceoff!</span></h1>
              <h2>My Games</h2>
            </Grid>
            {games.length > 0 ? games: <h3 style={{color:'darkred', paddingLeft:'10px'}}>You havent created any games. Create one now!</h3>}
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