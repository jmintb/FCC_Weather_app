
$(document).ready(function(){
  var tempUnit = "C";
  var location;
  var temp_celcius = 0;
  var temp_fahrenheit = 0;

  $("#unit-btn").on("click", function(){
    if (tempUnit == "C") {
      tempUnit = "F";
      $("#temp").html(temp_fahrenheit+" °"+tempUnit);
    } else {
      tempUnit = "C";
      $("#temp").html(temp_celcius+" °"+tempUnit);
    }

    $("#unit-btn").blur();

  });

  IpAPI().getCity(requestWeather);

  function requestWeather(data){
    WeatherAPI(data).getWeather(applyWeatherData);
  }

  function applyWeatherData(data){
    $("#weather-description").html(data.description);
    $("#weather-img").addClass("wi-yahoo-"+data.code);
    $("#temp").html(data.temp+" °"+tempUnit);
    $("#location").html(data.location);
    console.log(data.code);
    temp_celcius = data.temp;
    temp_fahrenheit = temp_celcius * 1.8 + 32;
    $("#loading-animation").remove();
    $("#weather-container").removeClass("hide");
    $("#location").removeClass("hide");
  }


  function IpAPI() {

    var ipApi = {};
    var api_url = "http://ip-api.com/json";

    ipApi.getCity = function(callBack){
      $.get(api_url, function(data, status){
        location = data.city+' , '+data.countryCode;
        callBack(data.city+' , '+data.countryCode);
        console.log(data.city+' , '+data.countryCode);
      })
    };
    return ipApi;
    }

    var WeatherAPI = function(location) {

      var weatherAPI = {};
      var now = new Date();
      var API_URL = 'https://query.yahooapis.com/v1/public/yql?format=json&rnd=' + now.getFullYear() + now.getMonth() + now.getDay() + now.getHours() + '&diagnostics=true&callback=?&q=';
      API_URL += 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + location + '") and u="c"';;

      weatherAPI.getWeather = function(callBack){
        $.get(encodeURI(API_URL), function(data, status){

          var channel = data.query.results.channel;

          var result = {
            "description": channel.item.condition.text,
            "img_url": 'https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + channel.item.condition.code + 'd.png',
            "temp": channel.item.condition.temp,
            "location": location,
            "code": channel.item.condition.code
          };
          callBack(result);
        }, "jsonp")
      };

      return weatherAPI;

    };


});
