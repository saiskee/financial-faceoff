import { Mongo } from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Questions = new Mongo.Collection('questions');
export const Games = new Mongo.Collection('games');


Questions.before.insert((userId, doc) => {
  if(Meteor.isServer) {
    //Format the document
    doc.createdAt = Date.now();
    doc.updatedAt = Date.now();
  }
});

Questions.before.update((userId, doc) => {
  if(Meteor.isServer) {
    doc.updatedAt = Date.now();
  }
});


Games.before.insert((userId, doc) => {
  if(Meteor.isServer) {
    //Format the document
    doc.createdAt = Date.now();
    doc.updatedAt = Date.now();
  }
});

Games.before.update((userId, doc) => {
  if(Meteor.isServer) {
    doc.updatedAt = Date.now();
  }
});