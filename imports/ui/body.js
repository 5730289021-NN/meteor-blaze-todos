import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks';

import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated(){
    this.state = new ReactiveDict();
    Meteor.subscribe('tasks');
});

Template.body.helpers({
    tasks() {
        const instance = Template.instance();
        if(instance.state.get('hideCompleted')){
            //If hide completed is checked, filter tasks
            console.log('return hide completed');
            return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } })
        }
        console.log('return everything');
        return Tasks.find({}, {sort: {createdAt: -1} });
    },
    incompleteCount() {
        return Tasks.find({ checked: { $ne: true }}).count();
    }
});

Template.body.events({
    'submit .new-task'(event) {
        event.preventDefault();
        //Get value from element
        const target = event.target;
        const text = target.text.value;
        //Inset a task into the collection
        Meteor.call('tasks.insert', text);

        //Clear form
        target.text.value = '';
    },
    'change .hide-completed input'(event, instance) {
        console.log('hide: ', event.target.checked);
        instance.state.set('hideCompleted', event.target.checked);
    }
})