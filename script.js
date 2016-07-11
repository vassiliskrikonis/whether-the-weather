var currentPosition = {};
var currentTemp;
var currentIcon;
var previousTemp;

window.addEventListener("orientationchange", function() {
    setTimeout(function()
    {
    	$('html, body, window').scrollTop(0);
    }, 500);
});


$(document).ready(function() {
  $('.when').html('').eq(0).html('loading...');
  $('body').addClass('loading');
  runPhysics();
	if ("geolocation" in navigator) {
	  /* geolocation is available */
	  navigator.geolocation.getCurrentPosition(function(position) {
	  	currentPosition.latitude = position.coords.latitude;
	  	currentPosition.longitude = position.coords.longitude;
      getWeather();
		});
	}
	else
	  showError('Geolocation is not available');

});

function getWeather() {
  var today = getToday();
  var yesterday = getYesterday();
  $.when(today, yesterday)
  .done(function() {
    loadIcon(currentIcon).done(function($img) {
      // Temperatures have been loaded, icon has been loaded
      // so start fadeOut animation
      var fadeOut = anime({
        targets: ['#icon img', '#icon canvas'],
        opacity: 0,
        easing: 'easeInExpo',
        duration: 1000,
        complete: function() {
          // once the animation is complete, setText,
          // change icon src and start icon translateY animation
          if(currentTemp >= previousTemp)
            setText('Today', 'hotter', 'yesterday');
          else
            setText('Today', 'colder', 'yesterday');
          $('body').removeClass('loading');
          $('#icon img').css({
            width: $img.css('width'),
            height: $img.css('height')
          }).attr('src', $img.attr('src'));
          var iconDown = anime({
            targets: '#icon img',
            translateY: ['-200%', 0],
            opacity: 1
          });
        }
      });
    });
  })
  .fail(function(err) {
    console.log(err);
  });
}

var getToday = function() {
  var d = $.Deferred();

  $.ajax({
    dataType: "jsonp",
    url: 'https://api.forecast.io/forecast/ac85f65c639c545e0acc46a5f678d9fd/'+currentPosition.latitude+','+currentPosition.longitude,
    data: {}
  }).done(function(result) {
    currentTemp = result.currently.apparentTemperature;
    currentIcon = result.currently.icon;
    d.resolve();
  }).fail(d.reject);

  return d.promise();
}

var getYesterday = function() {
  var d = $.Deferred();

  $.ajax({
    dataType: "jsonp",
    url: 'https://api.forecast.io/forecast/ac85f65c639c545e0acc46a5f678d9fd/'+currentPosition.latitude+','+currentPosition.longitude+',-2400',
    data: {}
  }).done(function(result) {
    previousTemp = result.currently.apparentTemperature;
    d.resolve();
  }).fail(d.reject);

  return d.promise();
}

function setText(a, b, c) {
  $('.when').eq(0).html(a);
  $('#what').html(b);
  $('.when').eq(1).html(c);
}

function loadIcon(icon) {
  // Values:
  //    clear-day,
  //    clear-night,
  //    rain,
  //    snow,
  //    sleet,
  //    wind,
  //    fog,
  //    cloudy,
  //    partly-cloudy-day,
  //    partly-cloudy-night

  var d = $.Deferred();

  var tempImg = $('<img>');
  tempImg.load(function() {
    d.resolve($(this));
  });

  switch (icon) {
    case 'clear-day':
      tempImg.attr('src', 'icons/vintage/sun.svg').css({width: '100%', height: '30vh'});
      break;
    case 'clear-night':
      tempImg.attr('src', 'icons/vintage/moon.svg').css({width: '100%', height: '30vh'});
      break;
    case 'partly-cloudy-day':
      tempImg.attr('src', 'icons/vintage/partly-day.svg').css({width: '100%', height: '30vh'});
      break;
    case 'partly-cloudy-night':
      tempImg.attr('src', 'icons/vintage/partly-night.svg').css({width: '100%', height: '30vh'});
      break;
    case 'rain':
      tempImg.attr('src', 'icons/vintage/umbrella.svg').css({width: '100%', height: '30vh'});
      break;
    case 'cloudy':
      tempImg.attr('src', 'icons/vintage/clouds.svg').css({width: '100%', height: '30vh'});
      break;
    case 'fog':
      tempImg.attr('src', 'icons/vintage/fog-lighthouse1.svg').css({width: '100%', height: '35vh'});
      break;
    default:
      // tempImg.attr('src', '');
      d.reject();
  }

  return d.promise();
}

function runPhysics() {
  // module aliases
  var Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Composites = Matter.Composites,
      Query = Matter.Query,
      Svg = Matter.Svg;

  // create an engine
  var engine = Engine.create();

  // create a renderer
  var render = Render.create({
      element: document.getElementById('icon'),
      engine: engine,
      options: {
        height: 140,
        width: 140,
        background: '#ffffff',
        wireframes: false
      }
  });

  var boundary;
  $.get('icons/vintage/bounding.svg').done(function(data) {
    var vertices = [];
    $(data).find('path').each(function(i, path) {
      vertices.push(Svg.pathToVertices(path, 15));
    });

    boundary = Bodies.fromVertices(60, 69, vertices, {
      isStatic: true,
      render: {
        fillStyle: '#ffffff',
        strokeStyle: '#ffffff'
      }
    });
    Matter.Body.scale(boundary, 0.25, 0.22);

    World.add(engine.world, boundary);

    var bodyOptions = {
        frictionAir: 0,
        friction: 0.0001,
        restitution: 0.6,
        render: {
          fillStyle: "#000",
          lineWidth: 0,
          strokeStyle: '#000'
        }
    };

    World.add(engine.world, Composites.stack(52, 30, 8, 20, 1, 1, function(x, y) {
        if (Query.point([boundary], { x: x, y: y }).length === 0) {
            return Bodies.polygon(x, y, 5, 2, bodyOptions);
        }
    }));

    Engine.run(engine);
    engine.timing.timeScale = 0.2;
    // Matter.Engine.update();
    Render.run(render);
  });
}
