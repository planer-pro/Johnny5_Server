require('dotenv').config()

var PASSWORD = process.env.PASSWORD;
var SECURE = process.env.SECURE == "0" ? false : true;

console.log("Secure enabled: " + SECURE);
if (SECURE)
    console.log("Password: " + PASSWORD);


//server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser')
var crc = require("crc");
var hash = crc.crc32(PASSWORD).toString(16);


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



app.set('view engine', 'jade');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(express.static('public'));

app.get('/', function (req, res) {
    if (SECURE && req.cookies.userHash != hash) {
        res.redirect('/login');
    } else {
        res.render('index', {
            title: 'Hey',
            message: 'Hello there!',
            readyState: led ? led.isOn : null,
            returnText: lcdText,
            singoutButton: SECURE
        });
    }
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
        returnText: lcdText,
        singoutButton: SECURE
    });
});


io.on('connection', function (socket) {
    console.log("new connection");

    socket.on('slider_value', function (msg) {
        console.log(msg);

        // // sending to sender-client only
        // socket.emit('message', "this is a test");

        // // sending to all clients, include sender
        // io.emit('message', "this is a test");

        // sending to all clients except sender
        socket.broadcast.emit('slider_value', msg);
    });
});










app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', function (req, res) {
    if (req.body.password == PASSWORD) {
        res.cookie('userHash', hash, { maxAge: 3600000, httpOnly: true })
        res.redirect('/');
    } else {
        res.render('login');
    }
});

app.get('/logout', function (req, res) {
    res.clearCookie('userHash');
    res.render('login');
});



http.listen(3000, function () {
    console.log('Example app listening on port http://localhost:3000');
});
