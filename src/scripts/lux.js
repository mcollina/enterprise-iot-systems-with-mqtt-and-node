
var mg = require('metrics-graphics')

function lux(client) {

  var data = [{
    date: new Date(),
    value: 0
  }];

  var interval;

  client.on('connect', function() {
    client.subscribe('edison/lux/#')
  });

  client.on('message', function(topic, payload) {
    if (topic.indexOf('lux') < 0) {
      return;
    }

    data.push({
      date: new Date(),
      value: parseInt(payload.toString())
    });

    if (data.length > 60 * 5) {
      data.shift();
    }
  });

  function render() {
    MG.data_graphic({
      title: "Light in this room",
      data: data,
      width: 600,
      height: 250,
      target: '#lux',
      x_accessor: 'date',
      y_accessor: 'value',
      interpolate: 'basis'
    })
  }

  return function(deck) {

    deck.on('activate', function() {
      var el = document.querySelector(".bespoke-active #lux");
      if (el) {
        interval = setInterval(render, 1000);
      }
      return true;
    });

    deck.on('deactivate', function() {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      return true;
    });
  }
}

module.exports = lux
