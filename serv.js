//server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//J5
const five = require('johnny-five');
const board = new five.Board({ port: "COM11" });

var led;
var lcd;
var lcdText;
var counter = 0;

board.on('ready', () => {
    console.log("board connected");
    led = new five.Led(13);
    led.on();

    lcd = new five.LCD({
        controller: "PCF8574T",
        rows: 4,
        cols: 20
    });

    //socketIO counter 
    /*setInterval(function(){
        counter++;
        console.log(counter);
    },1000);*/
});

app.set('view engine', 'jade');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!', readyState: led.isOn, returnText: lcdText });
});

app.post('/', function (req, res) {
    lcdText = req.body.val;
    lcd.clear();
    lcd.print(lcdText);

    res.render('index', { title: 'Hey', message: 'Hello there!', readyState: led.isOn, returnText: lcdText });
});

app.listen(3000, function () {
    console.log('Example app listening on port http://localhost:3000');
});