'use strict';

const
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json()); // creates express http server
const path = require('path');

const {handleMessage, callSendAPI} = require('./app/api/facebookHandler');
const {VERIFY_TOKEN,} = require('./app/config/custom');
// const myRouter = require('./routes');
const cookieParser = require('cookie-parser');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/', myRouter);


app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.post('/webhook', (req, res) => {
    let body = req.body;

    // console.log(JSON.stringify(body));

    if (body.object === 'page') {

        body.entry.forEach(function (entry) {
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            }
        });

        res.status(200).send('EVENT_RECEIVED');

    } else {
        // console.log("NOT PAGE");
        res.sendStatus(404);
    }
});

app.get('/webhook', (req, res) => {

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {

        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            res.sendStatus(403);
        }
    }
});