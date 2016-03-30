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
	if ("geolocation" in navigator) {
	  /* geolocation is available */
	  navigator.geolocation.getCurrentPosition(function(position) {
	  	currentPosition.latitude = position.coords.latitude;
	  	currentPosition.longitude = position.coords.longitude;
	  	// save('currentPosition.latitude', currentPosition.latitude);
	  	// save('currentPosition.longitude', currentPosition.longitude);
      getWeather();
		});
    // save('currentPosition.latitude', 37.33233141);
    // save('currentPosition.longitude', -122.0312186);
    // currentPosition.latitude = 37.33233141;
    // currentPosition.longitude = -122.0312186;
	}
	else
	  showError('Geolocation is not available');
});

function getWeather() {
  // var defer = $.Deferred();
  getToday().done(function(result) {
    console.log('in getToday.done');
    currentTemp = result.currently.apparentTemperature;
    currentIcon = result.currently.icon;
    getTomorrow().done(function(result) {
      console.log('in getTomorrow.done');
      previousTemp = result.currently.apparentTemperature;
      console.log('setting the text');
      if(currentTemp >= previousTemp)
        setText('Today', 'hotter', 'yesterday');
      else
        setText('Today', 'colder', 'yesterday');
      setIcon(currentIcon);
      $('body').removeClass('loading');
    });
  });
  // return defer.promise();
}

function getToday() {
  console.log('in getToday');
  return $.ajax({
    dataType: "jsonp",
    url: 'https://api.forecast.io/forecast/ac85f65c639c545e0acc46a5f678d9fd/'+currentPosition.latitude+','+currentPosition.longitude,
    data: {}
  });
}

function getTomorrow() {
  console.log('in getTomorrow');
  return $.ajax({
    dataType: "jsonp",
    url: 'https://api.forecast.io/forecast/ac85f65c639c545e0acc46a5f678d9fd/'+currentPosition.latitude+','+currentPosition.longitude+',-2400',
    data: {}
  });
}

function setText(a, b, c) {
  $('.when').eq(0).html(a);
  $('#what').html(b);
  $('.when').eq(1).html(c);
}

function setIcon(icon) {
  // Values: clear-day, clear-night, rain, snow, sleet, wind, fog, cloudy, partly-cloudy-day, or partly-cloudy-night
  console.log(icon);
  switch (icon) {
    case 'clear-day':
      $('#icon img').attr('src', 'icons/vintage/sun.svg');
      break;
    case 'clear-night':
      $('#icon img').attr('src', 'icons/vintage/moon.svg');
      break;
    case 'partly-cloudy-day':
      $('#icon img').attr('src', 'icons/vintage/partly-day.svg');
      break;
    case 'partly-cloudy-night':
      $('#icon img').attr('src', 'icons/vintage/partly-night.svg');
      break;
    case 'rain':
      $('#icon img').attr('src', 'icons/vintage/umbrella.svg');
      break;
    case 'cloudy':
      $('#icon img').attr('src', 'icons/vintage/clouds.svg');
      break;
    default:
      $('#icon img').attr('src', '');
  }
}
