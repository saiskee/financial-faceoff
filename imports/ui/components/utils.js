import * as _ from "lodash";

export const objectEmpty = (data) => (
  Object.keys(data).length === 0
);

export const not = (a, b, key = '_id') => {
  //Compare mongo _id or other key of objects
  b = _.map(b, key);
  return a.filter(value => b.indexOf(value[key]) === -1);
};

export const intersection = (a, b, key = '_id') => {
  //Compare mongo _id or other key of objects
  b = _.map(b, key);
  return a.filter(value => b.indexOf(value[key]) !== -1);
};