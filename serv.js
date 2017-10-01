//server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//J5
const five = require('johnny-five');
const board = new five.Board({ port: "COM11" });
var led;
board.on('ready', () => {
    console.log("board connected");
    led = new five.Led(13);
});

app.set('view engine', 'jade');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!',ledState:led.isOn });
});

app.post('/', function (req, res) {
    if (req.body.val == "1")
        led.on();
    else
        led.off();

        res.render('index', { title: 'Hey', message: 'Hello there!',ledState:led.isOn });
});

app.listen(3000, function () {
    console.log('Example app listening on port http://localhost:3000');
});

