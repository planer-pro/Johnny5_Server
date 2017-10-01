const five = require('johnny-five');
const rotaryEncoder = require('johnny-five-rotary-encoder');

const board = new five.Board();

board.on('ready', () => {
  const upButton = new five.Button(3);
  const downButton = new five.Button(2);
  const pressButton = new five.Button({
    pin: 11,
    isPullup: true,
    invert: true
  });

  rotaryEncoder({
    upButton,
    downButton,
    pressButton,
    onUp: () => {
      console.log('up');
    },
    onDown: () => {
      console.log('down');
    },
    onPress: () => {
      console.log('press');
    },
  });
});