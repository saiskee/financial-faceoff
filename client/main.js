import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from '/imports/ui/containers/App/App';
import '../imports/startup/accounts-config.js';
import * as _ from 'lodash';

import {BrowserRouter as Router} from "react-router-dom";

Meteor._debug = (function (super_meteor_debug) {
  return function (error, info) {
    if (info && _.has(info, 'msg')) {
      // super_meteor_debug("Streamy message is allowed!", info)
    } else {
      // super_meteor_debug(error, info);
    }
  }
})(Meteor._debug);

const app = (
  <Router>
    <App/>
  </Router>
);

Meteor.startup(() => {
  render(app, document.getElementById('react-target'));
});
