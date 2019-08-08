import React from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from "meteor/react-meteor-data";
import {Route, Switch} from "react-router";
import NewGameComponent from "../NewGame";
import GamesComponent from '../Home';
import RegularPlay from "../RegularPlay/RegularPlay";
import FastMoney from "../FastMoney/FastMoney";
import {isMobile} from 'react-device-detect';
import './App.css';
import Navbar from "../../components/Navbar";
import Buzzer from "../Buzzer/Buzzer";
import Controller from "../Controller/Controller";
import Paper from "@material-ui/core/Paper";
import HowToPlay from "../HowToPlay";

const styles = {
  paper: {
    minHeight: '400px',
    padding: '100px',
    marginTop: '50px'
  },
  mobile: {
    padding: '20px'
  }
};

const EverythingButBuzzer = (props) => (
  !isMobile ?
    props.currentUser ?
      <Switch>
        <Route path="/" exact component={GamesComponent}/>
        <Route path="/games/new" component={NewGameComponent}/>
        <Route path="/games/:game_id/regular/:question_num" component={RegularPlay}/>
        <Route path="/games/:game_id/fast/:round_num" component={FastMoney}/>
      </Switch> :

      <Paper style={styles.paper}>
        <h1>Welcome to the Family Fued Web App!</h1>
        <h2>Login or Register to Play!</h2>
      </Paper>
    :
    <Paper style={styles.mobile}>
      <h2>This page is not available on a mobile device. Use a desktop to continue!</h2>
      <h5>Only the buzzer is available on mobile devices.</h5>
    </Paper>
);


class App extends React.Component {
  render() {
    return (
      <div className={'App'}>
        <Navbar/>
        <div className="content">
          <Switch>
            <Route path="/how-to-play" component={HowToPlay}/>
            {/*Buzzer doesnt require user to be logged in*/}
            <Route path="/games/:game_id/controller" component={Controller}/>
            <Route path="/games/:game_id/buzzer" component={Buzzer}/>
            <Route path="/" component={() => <EverythingButBuzzer {...this.props}/>}/>
          </Switch>
        </div>
      </div>
    )
  }
}

export default withTracker(() => {
  return {
    currentUser: Meteor.user()
  };
})(App);
