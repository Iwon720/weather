let url = 'https://api.openweathermap.org/data/2.5/forecast?id=524901&appid=13eee15044ec16f1b3ac0fabbd85d4cb';
const temperatureUnit = '˚';
const humidityUnit = ' %';
const pressureUnit = ' мм. рт. ст.';
const windUnit = ' м/с';

let currentData, cityId;

let selectedLanguage = myForm.language;
 
selectedLanguage.addEventListener("change", () => {
    let selectedOption = selectedLanguage.options[selectedLanguage.selectedIndex];
    cityId = selectedOption.value;
    url = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=13eee15044ec16f1b3ac0fabbd85d4cb`;
    start();
});

async function getData(){
    let response = await fetch(url);

    if(response.ok){
        let jsonData = response.json();
        return jsonData;
    }else{
        alert('Error: ' + response.status)
    }
}

function convertPressure(value){
    return (value/1.33).toFixed()
}

Number.prototype.pad = function(size){
    let s = String(this);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
}

function getHoursString(dateTime){
    let date = new Date(dateTime);
    let hours = date.getHours().pad();
    return hours;
}

function getValueWithUnit(value, unit) {
    return `${value}${unit}`;
}

function getTemperature(value) {
    var roundedValue = value.toFixed() - 273;
    return getValueWithUnit(roundedValue, temperatureUnit);
}

function render(data){
    renderCity(data);
    renderCurrentTemperature(data);
    renderCurrentDescription(data);
    renderForecast(data);
    renderDetails(data);
    renderTheme(data);
}

function renderCity(data){
    let cityName = document.querySelector('.current__city');
    cityName.innerHTML = data.city.name;
}

function renderCurrentTemperature(data){
    let tmp = data.list[0].main.temp;
    let curTmp = document.querySelector('.current__temperature');
    curTmp.innerHTML = getTemperature(tmp);
}

function renderCurrentDescription(data){
    let des = data.list[0].weather[0].description;
    let curDes = document.querySelector('.current__description');
    curDes.innerHTML = des;
}

function renderForecast(data){
    let forecastDataContainer = document.querySelector('.forecast');
    let fcs = '';
    for (let i = 0; i < 6; i++) {
        let item = data.list[i];
        let icon = item.weather[0].icon;
        let temp = getTemperature(item.main.temp);
        let hours = (i == 0 ? 'Now' : getHoursString(item.dt * 1000));
        let template = `<div class="forecast__item">
            <div class="forecast__time">
                ${hours}
            </div>

            <div class="forecast__icon icon_${icon}">
            </div>

            <div class="forecast__temperature">
                ${temp}
            </div>
        </div>`

        fcs += template;
    }
    forecastDataContainer.innerHTML = fcs;
}

function renderDetails(data){
    let item = data.list[0];
    let pressureValue = convertPressure(item.main.pressure);
    let pressure = getValueWithUnit(pressureValue, pressureUnit);
    let humidity = getValueWithUnit(item.main.humidity, humidityUnit);
    let fells_like = getTemperature(item.main.feels_like);
    let wind = getValueWithUnit(item.wind.speed, windUnit);

    renderDetailsItem('feelslike', fells_like);
    renderDetailsItem('humidity', humidity);
    renderDetailsItem('pressure', pressure);
    renderDetailsItem('wind', wind);
}

function renderDetailsItem(className, value){
    let container = document.querySelector(`.${className}`).querySelector('.details__value');
    container.innerHTML = value;
}

function isDay(data){
    let sunrise = data.city.sunrise * 1000;
    let sunset = data.city.sunset * 1000;
    let now = Date.now();
    return (now > sunrise && now < sunset);
}

function renderTheme(data){
    let attrName = isDay(data) ? 'day':'night';
    transition();
    document.documentElement.setAttribute('data-theme', attrName);
}

function periodUpdates(){
    setInterval(start, 100000);
    setInterval(() => {
        renderTheme(currentData);
    }, 60000);
}

function start(){
    getData().then(data => {
        currentData = data;
        periodUpdates();
        render(data);
    })
}

function transition(){
    document.documentElement.classList.add('transition');
    setTimeout(function(){
        document.documentElement.classList.remove('transition');
    }, 4000);
}

start();





// var firstLanguage = myForm.language.options[0];
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