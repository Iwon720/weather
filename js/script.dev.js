"use strict";

var url = 'https://api.openweathermap.org/data/2.5/forecast?id=524901&appid=13eee15044ec16f1b3ac0fabbd85d4cb';
var temperatureUnit = '˚';
var humidityUnit = ' %';
var pressureUnit = ' мм. рт. ст.';
var windUnit = ' м/с';
var currentData, cityId;
var selectedLanguage = myForm.language;
selectedLanguage.addEventListener("change", function () {
  var selectedOption = selectedLanguage.options[selectedLanguage.selectedIndex];
  cityId = selectedOption.value;
  url = "https://api.openweathermap.org/data/2.5/forecast?id=".concat(cityId, "&appid=13eee15044ec16f1b3ac0fabbd85d4cb");
  start();
});

function getData() {
  var response, jsonData;
  return regeneratorRuntime.async(function getData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch(url));

        case 2:
          response = _context.sent;

          if (!response.ok) {
            _context.next = 8;
            break;
          }

          jsonData = response.json();
          return _context.abrupt("return", jsonData);

        case 8:
          alert('Error: ' + response.status);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}

function convertPressure(value) {
  return (value / 1.33).toFixed();
}

Number.prototype.pad = function (size) {
  var s = String(this);

  while (s.length < (size || 2)) {
    s = "0" + s;
  }

  return s;
};

function getHoursString(dateTime) {
  var date = new Date(dateTime);
  var hours = date.getHours().pad();
  return hours;
}

function getValueWithUnit(value, unit) {
  return "".concat(value).concat(unit);
}

function getTemperature(value) {
  var roundedValue = value.toFixed() - 273;
  return getValueWithUnit(roundedValue, temperatureUnit);
}

function render(data) {
  renderCity(data);
  renderCurrentTemperature(data);
  renderCurrentDescription(data);
  renderForecast(data);
  renderDetails(data);
  renderTheme(data);
}

function renderCity(data) {
  var cityName = document.querySelector('.current__city');
  cityName.innerHTML = data.city.name;
}

function renderCurrentTemperature(data) {
  var tmp = data.list[0].main.temp;
  var curTmp = document.querySelector('.current__temperature');
  curTmp.innerHTML = getTemperature(tmp);
}

function renderCurrentDescription(data) {
  var des = data.list[0].weather[0].description;
  var curDes = document.querySelector('.current__description');
  curDes.innerHTML = des;
}

function renderForecast(data) {
  var forecastDataContainer = document.querySelector('.forecast');
  var fcs = '';

  for (var i = 0; i < 6; i++) {
    var item = data.list[i];
    var icon = item.weather[0].icon;
    var temp = getTemperature(item.main.temp);
    var hours = i == 0 ? 'Now' : getHoursString(item.dt * 1000);
    var template = "<div class=\"forecast__item\">\n            <div class=\"forecast__time\">\n                ".concat(hours, "\n            </div>\n\n            <div class=\"forecast__icon icon_").concat(icon, "\">\n            </div>\n\n            <div class=\"forecast__temperature\">\n                ").concat(temp, "\n            </div>\n        </div>");
    fcs += template;
  }

  forecastDataContainer.innerHTML = fcs;
}

function renderDetails(data) {
  var item = data.list[0];
  var pressureValue = convertPressure(item.main.pressure);
  var pressure = getValueWithUnit(pressureValue, pressureUnit);
  var humidity = getValueWithUnit(item.main.humidity, humidityUnit);
  var fells_like = getTemperature(item.main.feels_like);
  var wind = getValueWithUnit(item.wind.speed, windUnit);
  renderDetailsItem('feelslike', fells_like);
  renderDetailsItem('humidity', humidity);
  renderDetailsItem('pressure', pressure);
  renderDetailsItem('wind', wind);
}

function renderDetailsItem(className, value) {
  var container = document.querySelector(".".concat(className)).querySelector('.details__value');
  container.innerHTML = value;
}

function isDay(data) {
  var sunrise = data.city.sunrise * 1000;
  var sunset = data.city.sunset * 1000;
  var now = Date.now();
  return now > sunrise && now < sunset;
}

function renderTheme(data) {
  var attrName = isDay(data) ? 'day' : 'night';
  transition();
  document.documentElement.setAttribute('data-theme', attrName);
}

function periodUpdates() {
  setInterval(start, 100000);
  setInterval(function () {
    renderTheme(currentData);
  }, 60000);
}

function start() {
  getData().then(function (data) {
    currentData = data;
    periodUpdates();
    render(data);
  });
}

function transition() {
  document.documentElement.classList.add('transition');
  setTimeout(function () {
    document.documentElement.classList.remove('transition');
  }, 4000);
}

start(); // var firstLanguage = myForm.language.options[0];
// console.log("Index: " + firstLanguage.index);
// console.log("Text: " + firstLanguage.text);
// console.log("Value: " + firstLanguage.value);

/*  
    {
        "id": 524901,
        "name": "Moscow",
        "state": "",
        "country": "RU",
        "coord": {
            "lon": 37.615555,
            "lat": 55.75222
        }
    },
    {
        "id": 7873648,
        "name": "Erl",
        "state": "",
        "country": "AT",
        "coord": {
            "lon": 12.21398,
            "lat": 47.698971
        }
    },
    {
        "id": 629634,
        "name": "Brest",
        "state": "",
        "country": "BY",
        "coord": {
            "lon": 23.700001,
            "lat": 52.099998
        }
    },
    {
        "id": 625144,
        "name": "Minsk",
        "state": "",
        "country": "BY",
        "coord": {
            "lon": 27.566668,
            "lat": 53.900002
        }
    },
*/