'use strict';
var Alexa = require('alexa-sdk');

var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'Classical Guitar Facts';
var FACTS = [];
var location = " ";

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

 //var LOCATION = this.event.request.locale;
       // console.log("location: "+LOCATION);

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'GetNewFactIntent': function () {
        /*----CHECK REQUEST LOCATION----*/
        location = this.event.request.locale;
        console.log("location: "+ location);   

        /*----USE LOCALIZED CONTENT----*/
        switch(location) {
            case 'en-US':
            FACTS = require('./content/en-US/us-facts.js');
            console.log("Getting FACTS in US English");
            break;
            case 'en-GB':
                try {
                    FACTS = require('./content/en-GB/gb-facts.js');
                    console.log("Getting FACTS in GB English");
                } catch (err) {
                    FACTS = require('./content/en-US/us-facts.js');
                    console.log("Getting FACTS in US English");
                }
            break;
            case 'de-DE':
                try {
                    FACTS = require('./content/de-DE/de-facts.js');
                    console.log("Getting FACTS auf Deutsch");
                } catch (err) {
                    FACTS = require('./content/en-US/us-facts.js');
                    console.log("Getting FACTS in US English");
                }
            break;
            case 'default':
            FACTS = require('./content/en-US/us-facts.js');
            console.log("Getting FACTS in US English");
            break;
        }
        /*---------------------------------------*/
        this.emit('GetFact' , FACTS);
    },
    'GetFact': function () {
        // Get a random space fact from the space facts list
        var factIndex = Math.floor(Math.random() * FACTS.length);
        var randomFact = FACTS[factIndex];

        // Create speech output
        if (location == 'de-DE') {
            var speechOutput = "Hier ist Dein Fakt: " + randomFact;
        } else {
            var speechOutput = "Here's your fact: " + randomFact;
        }

        this.emit(':tellWithCard', speechOutput, SKILL_NAME, randomFact)
    },
    'AMAZON.HelpIntent': function (location) {
        if (location === 'de-DE') {
            var speechOutput = "Du kannst sagen, sag mir eine Gitarretatsache, oder Du kannst Stop sagen.  Wie kann ich Dir helfen?";
            var reprompt = "Du kannst sagen, sag mir eine Gitarretatsache, oder Du kannst Stop sagen.  Wie kann ich Dir helfen?";
        } else {
            var speechOutput = "You can say tell me a guitar fact, or, you can say stop... How can I help?";
            var reprompt = "You can say tell me a guitar fact, or, you can say stop";
        }
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function (location) {
        if (location === 'de-DE') {
            this.emit(':tell', 'Auf Wiedersehen!');
        } else {
             this.emit(':tell', 'Goodbye!');
        }
    },
    'AMAZON.StopIntent': function (location) {
        if (location === 'de-DE') {
            this.emit(':tell', 'Auf Wiedersehen!');
        } else {
             this.emit(':tell', 'Goodbye!');
        }
    }
};