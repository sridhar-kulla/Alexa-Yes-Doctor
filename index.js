'use strict';


//Created by Sridhar Kulla


const Alexa = require('alexa-sdk');
const APP_ID = 'amzn1.ask.skill.dab236b8-0dbc-45af-98f9-e17c313c2cbf';

const mariaDB = require('mariadb');

const pool = mariaDB.createPool({host: 'solismedinstance.cll1lpd4jp6h.us-east-1.rds.amazonaws.com', 
                                 user:'root',
                                 password : 'Maria1237$',
                                 database : 'solismeddb',
                                 connectTimeout: 50000});     



const SKILL_NAME = 'Yes Doctor';
const data = 'Welcome to yes doctor.';


const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', data);
    },

    'patientInfo': function () {
        var patientName = this.event.request.intent.slots.patient_name.value;
           result(this,patientName);
           
       },
 
//Intent for appointments
    'appointments': function(){

    var date = this.event.request.intent.slots.date.value;           
    var speechOutput;
    pool
    .query("select count(*) as list from schedule_calendars where start_date like '"+date+"%'")
    .then(rows => {
     console.log(rows[0]);
     speechOutput="there are total "+rows[0].list+" appointments on " +date;
     speechOutput+=' Would you like to hear the appointment details';
     this.emit(':ask',speechOutput);
    })
    .catch(err => {
     console.log("not connected due to error: " + err);
    });

     } 

    
};  

function result(inst,patientName){
   
  var speechOutput;

  pool
   .query("select last_name from demographics where first_name='"+patientName+"'")
   .then(rows => {
    console.log(rows[0]);
    speechOutput="Last name is "+rows[0].last_name;
    inst.emit(':ask',speechOutput);
   })
   .catch(err => {
    console.log("not connected due to error: " + err);
   });
            
 }

    exports.handler = function (event, context, callback) {
    context.callbackWaitsForEmptyEventLoop=false;
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
   // alexa.database=mariadb;
    alexa.registerHandlers(handlers);
    alexa.execute();
};