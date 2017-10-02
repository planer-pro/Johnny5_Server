//server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);

//J5
const five = require('johnny-five');

var led;
var lcd;
var lcdText;
var counter = 0;

// var board = new five.Board({ port: "COM11" });
// board.on('ready', () => {
//     console.log("board connected");
//     led = new five.Led(13);
//     led.on();

//     lcd = new five.LCD({
//         controller: "PCF8574T",
//         rows: 4,
//         cols: 20
//     });
// });


// board.on("fail", function (event) {
//     console.log("%s sent a 'fail' message: %s", event.class, event.message);
// });


//socketIO counter 
// setInterval(function () {
//     counter++;
//     console.log(counter);
//     io.emit('update_counter', counter);
// }, 1000);


app.set('view engine', 'jade');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Hey',
        message: 'Hello there!',
        readyState: led ? led.isOn : null,
        returnText: lcdText
    });
});

app.post('/', function (req, res) {
    lcdText = req.body.textArea;

    io.emit('update_text', lcdText);

    if (lcd) {
        lcd.clear();
        lcd.print(lcdText);
    }

    res.render('index', {
        title: 'Hey',
        message: 'Hello there!',
        readyState: led ? led.isOn : null,
        returnText: lcdText
    });
});


// io.on('connection', function (socket) {
//     console.log("new connection");

//     // socket.on('get data', function (msg) {
//     //     // console.log(receivedData);
//     //     // io.emit('new data', receivedData);
//     // });
// });



http.listen(3000, function () {
    console.log('Example app listening on port http://localhost:3000');
});



