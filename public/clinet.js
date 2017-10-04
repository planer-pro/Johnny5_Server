$(function () {
    var slider = document.getElementById('slider');

    var socket = io();

    //- socket.emit("get data");
    socket.on('update_text', function (data) {
        $("#textArea").val(data);
        console.log(data);
    });

    socket.on('slider_value', function (data) {
        slider.noUiSlider.set(data);
        console.log(data);
    });

    noUiSlider.create(slider, {
        start: [50],
        range: {
            'min': 0,
            'max': 100
        }
    });

    slider.noUiSlider.on('slide', function () {
        var sliderVal = slider.noUiSlider.get();
        console.log(sliderVal)
        socket.emit("slider_value", sliderVal);
    });
});