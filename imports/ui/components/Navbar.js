import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AccountsUIWrapper from "./AccountsUIWrapper/AccountsUIWrapper";
import {Link} from "react-router-dom";
import {Button} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  link: {
    color: 'white'
  }
});

export default () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Grid
            justify="space-between" // Add it here :)
            container>
            <Grid item>
              <Link to={'/'} className={classes.link}>
                <Button color={'inherit'}>
                  Home
                </Button>
              </Link>
              <Link to={'/games/new'} className={classes.link}>
                <Button color={'inherit'}>
                  New Game
                </Button>
              </Link>
              <Link to={'/how-to-play'} className={classes.link}>
                <Button color={'inherit'}>
                  How To Play
                </Button>
              </Link>
            </Grid>

            <Grid item>
              <AccountsUIWrapper/>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}