import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AccountsUIWrapper from "./AccountsUIWrapper/AccountsUIWrapper";
import {Link} from "react-router-dom";
import {Button} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles({
  root: {
    
    flexGrow: 1,
  },
  link: {
    color: 'gold'
  }
});

export default () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar style={{backgroundColor: 'green'}}>
        </Toolbar>
      </AppBar>
    </div>
  );
}