import React from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from "meteor/react-meteor-data";
import {Route, Switch} from "react-router";
import NewGameComponent from "../NewGame";
import GamesComponent from '../Home';
import RegularPlay from "../RegularPlay/RegularPlay";
import FastMoney from "../FastMoney/FastMoney";
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

    props.currentUser ?
        <Switch>
            <Route path="/" exact>
                <Navbar/>
                <div className={"content"}>
                    <GamesComponent/>
                </div>
            </Route>
            <Route path="/games/new">
                <Navbar/>
                <div className={"content"}>
                    <NewGameComponent/>
                </div>
            </Route>
            <Route path="/games/:game_id/regular/:question_num" component={RegularPlay}/>
            <Route path="/games/:game_id/fast/:round_num" component={FastMoney}/>
        </Switch> :
        <React.Fragment>
            <Navbar/>
            <div className={"content"}>
        <Paper style={styles.paper}>
            <h1>Welcome to Financial Feud!</h1>
            <h2>Login or Register to Play!</h2>
        </Paper>
            </div>
        </React.Fragment>

);


class App extends React.Component {
  render() {
    return (
      <div className={'App'}>
          <Switch>
              <Route path="/how-to-play">
                  <Navbar/>
                  <div className={"content"}>
                <HowToPlay/>
                  </div>
              </Route>
            {/*Buzzer doesnt require user to be logged in*/}
            <Route path="/games/:game_id/controller" component={Controller}/>
            <Route path="/games/:game_id/buzzer" component={Buzzer}/>
            <Route path="/" component={() => <EverythingButBuzzer {...this.props}/>}/>
          </Switch>
      </div>

    )
  }
}

export default withTracker(() => {
  return {
    currentUser: Meteor.user()
  };
})(App);
