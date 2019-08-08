import { Meteor } from 'meteor/meteor';
import {Games} from '/imports/api/links';

Meteor.startup(() => {
  Meteor.methods({
    buzzer(game_id, side) {
      Streamy.broadcast(game_id, {side: side}, []);
      return null;
    },
    toGame(game_id, command){
      Streamy.broadcast(game_id + "toGame", {command: command}, []);
      return null;
    },
    toController(game_id, command){
      Streamy.broadcast(game_id + "toControl", {command: command}, []);
      return null;
    },
    toTimer(game_id, command){
      Streamy.broadcast(game_id+"toTimer", {command: command}, []);
    },
    async join_questions(game_id) {
      const pipeline = [
        {$match: {_id: game_id}},
        {$unwind: "$regular_questions"},
        {
          $lookup: {
            from: 'questions',
            localField: 'regular_questions',
            foreignField: '_id',
            as: 'question'
          }
        },
        {
          $addFields: {
            question: {$arrayElemAt: ["$question", 0]},
          }
        },
        {
          $group: {
            _id: {_id: "$_id", title: "$title", fast_money: "$fast_money_questions"},
            questions: {$push: "$question"}
          }
        },
        {$unwind: "$_id.fast_money"},
        {
          $lookup: {
            from: 'questions',
            localField: '_id.fast_money',
            foreignField: '_id',
            as: 'fast_money'
          }
        },
        {
          $addFields: {
            fast_money: {$arrayElemAt: ["$fast_money", 0]},
          }
        },
        {
          $group: {
            _id: {_id: "$_id._id", questions: "$questions", title: "$_id.title"},
            fast_money: {$push: "$fast_money"}
          }
        },
        {
          $project: {
            _id: "$_id._id",
            title: "$_id.title",
            fast_money: 1,
            questions: "$_id.questions"
          }
        }
      ];
      return await Games.rawCollection().aggregate(
        pipeline
      ).toArray(); // get first element
    }
  });
});


// {$sort: {_id: -1}}
