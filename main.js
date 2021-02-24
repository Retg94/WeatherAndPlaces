const getWeatherKey = "7ce12bf5d6ccd49ddae5307dd68fbb4f";
const AttractionID = "3NNXITF340NHOCWXYL3F5PX20FU5QBDYCZOUMP4W153NFLTB";
const AttractionSecret = "XGAP1LEIZJZLOMM5OXIPBV3AABCXHXRF3MP2F5FVGXVPSQH5";
const fourSquareVersion = "20210224"
//const getWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=${getWeatherKey}`
const weatherResultContainer = document.querySelector("#weatherResultContainer")
const attractionResultContainer = document.querySelector("#attractionResultContainer")
const form = document.querySelector("form")

class WeatherInfo {
    constructor(name, temperature, condition, iconUrl){
        this._name = name;
        this._temperature = temperature;
        this._condition = condition;
        this._iconUrl = iconUrl;
    }
}
class AttractionInfo {
    constructor(name, address, iconUrl){
        this._name = name;
        this._address = address;
        this._iconUrl = iconUrl;
    }
}

async function executeSearch(){
    console.log("hej")
    console.log(form.elements["search"])
    weatherResultContainer.innerHTML = "";
    attractionResultContainer.innerHTML = "";
    const search = form.elements["search"].value;
    console.log(search)
    const onlyWeather = document.querySelector("#onlyWeather").checked;
    const onlyAttractions = document.querySelector("#onlyAttractions").checked;
    const filterAlpha = document.querySelector("#filter").checked;
    if ((onlyWeather === false & onlyAttractions === false)||(onlyWeather === true & onlyAttractions === true)){
        try{
            await getWeather(search);
            await getAttractions(search, filterAlpha);
        } catch (error) {
            weatherResultContainer.innerHTML = "";
            attractionResultContainer.innerHTML = "";
            console.log(error);
            createErrorElement();
        }
    }
    else if(onlyWeather===true & onlyAttractions===false){
        try {
            await getWeather(search);
        } catch(error) {
            weatherResultContainer.innerHTML = "";
            attractionResultContainer.innerHTML = "";
            console.log(error);
            createErrorElement();
        }
    }
    else if(onlyAttractions===true & onlyWeather===false)
    {
        try {
            await getAttractions(search, filterAlpha);
        } catch(error) {
            weatherResultContainer.innerHTML = "";
            attractionResultContainer.innerHTML = "";
            console.log(error);
            createErrorElement();
        }
    }

}

async function getAttractions(search, filterAlpha){
    let response = await fetch(`https://api.foursquare.com/v2/venues/explore?client_id=${AttractionID}&client_secret=${AttractionSecret}&near=${search}&v=${fourSquareVersion}&limit=10`);
    response = await response.json();
    console.log(response);
    let attractionList = [];
    response.response.groups[0].items.forEach(item => {
        console.log(item)
        //console.log(item.venue.name + " " + item.venue.location.address)
        attractionList.push(new AttractionInfo(item.venue.name, item.venue.location.address, `${item.venue.categories[0].icon.prefix}64${item.venue.categories[0].icon.suffix}` ))
    })
    //console.log(filterAlpha);
    if(filterAlpha === true){
        console.log("TRYING TO SORT LIST")
        attractionList = attractionList.sort(function(a, b){
            var nameA=a._name.toLowerCase(), nameB=b._name.toLowerCase();
            if (nameA < nameB) //sort string ascending
             return -1;
            if (nameA > nameB)
             return 1;
            return 0; //default return value (no sorting)
        });
        console.log("IT SHOULD BE SORTED NOW")
    }
    attractionList.forEach(attraction => {
        //console.log(attraction._name + " " + attraction._address)
        createAttractionElement(attraction._name, attraction._address, attraction._iconUrl)
    })
}

function createAttractionElement(name, address, iconUrl){
    //console.log(name + " " + address);
    let attractionContainer = document.createElement("div");
    let attractionName = document.createElement("h3");
    let attractionAddress = document.createElement("p");
    let icon = document.createElement("img");
    icon.src = iconUrl;
    attractionName.innerHTML = name;
    attractionAddress.innerHTML = address;
    attractionContainer.appendChild(attractionName);
    attractionContainer.appendChild(attractionAddress);
    attractionContainer.appendChild(icon);
    attractionResultContainer.appendChild(attractionContainer);
    //console.log(attractionName.innerHTML + " " + attractionAddress.innerHTML);
}

async function getWeather(search){
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=${getWeatherKey}`);
    response = await response.json();
    console.log(response);
    const weatherInfo = new WeatherInfo(response.name, response.main["temp"], response.weather[0].description, `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
    createWeatherElement(weatherInfo);
  
    /*
    if(weatherInfo._isOkay === true){
        createWeatherElement(weatherInfo);
    } else {
        createErrorElement();
    }*/
}

function createErrorElement(){
    let weatherContainer = document.createElement("div");
    let error = document.createElement("h3");
    error.innerHTML = "Something went wrong.. Try again later";
    weatherContainer.appendChild(error);
    weatherResultContainer.appendChild(weatherContainer);
}

function createWeatherElement(weatherInfo){
    let weatherContainer = document.createElement("div");
    let weatherName = document.createElement("h3");
    let weatherTemp = document.createElement("p");
    let weatherCond = document.createElement("p");
    let icon = document.createElement("img");
    icon.src = weatherInfo._iconUrl;

    weatherName.innerHTML = weatherInfo._name;
    weatherTemp.innerHTML = `Temperature: ${weatherInfo._temperature} Celsius`;
    weatherCond.innerHTML = `Condition: ${weatherInfo._condition}`;
    weatherContainer.appendChild(weatherName)
    weatherContainer.appendChild(icon)
    weatherContainer.appendChild(weatherTemp)
    weatherContainer.appendChild(weatherCond)
    weatherResultContainer.appendChild(weatherContainer)
    //console.log(weatherTemp.innerHTML + " " + weatherCond.innerHTML)
}