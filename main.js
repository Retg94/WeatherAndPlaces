const getWeatherKey = "7ce12bf5d6ccd49ddae5307dd68fbb4f";
const AttractionID = "3NNXITF340NHOCWXYL3F5PX20FU5QBDYCZOUMP4W153NFLTB";
const AttractionSecret = "XGAP1LEIZJZLOMM5OXIPBV3AABCXHXRF3MP2F5FVGXVPSQH5";
const fourSquareVersion = "20210226";
const foursquareUrl = "https://api.foursquare.com/v2/venues/explore?";
const openWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?";
const openWeatherIconUrl = "http://openweathermap.org/img/wn/";
const weatherResultContainer = document.querySelector("#weatherResultContainer")
const attractionResultContainer = document.querySelector("#attractionResultContainer")
const form = document.querySelector("form")

class WeatherInfo {
    constructor(name, temperature, condition, iconUrl){
        this.Name = name;
        this.Temperature = temperature;
        this.Condition = condition;
        this.IconUrl = iconUrl;
    }
}
class AttractionInfo {
    constructor(name, address, iconUrl){
        this.Name = name;
        this.Address = address;
        this.IconUrl = iconUrl;
    }
}

document.getElementById("myInput").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.code === "Enter") {
        document.getElementById("myBtn").click();
    }
});

async function executeSearch(){
    console.log("hej")
    weatherResultContainer.innerHTML = "";
    attractionResultContainer.innerHTML = "";
    const search = document.getElementById("myInput").value;
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
    let response = await fetch(`${foursquareUrl}client_id=${AttractionID}&client_secret=${AttractionSecret}&near=${search}&v=${fourSquareVersion}&limit=10`);
    response = await response.json();
    let attractionList = [];
    attractionList = response.response.groups[0].items.map(item => {
        return new AttractionInfo(item.venue.name, item.venue.location.address, `${item.venue.categories[0].icon.prefix}64${item.venue.categories[0].icon.suffix}` )
    })
    console.log(attractionList)
    if(filterAlpha === true){
        attractionList = attractionList.sort( (a, b) => {
            var nameA=a.Name.toLowerCase(), nameB=b.Name.toLowerCase();
            if (nameA < nameB) //sort string ascending
                return -1;
            if (nameA > nameB)
                return 1;
            return 0; //default return value (no sorting)
        });
    }
    attractionList.forEach(attraction => {
        createAttractionElement(attraction.Name, attraction.Address, attraction.IconUrl)
    })
}

function createAttractionElement(name, address, iconUrl){
    let attractionContainer = document.createElement("div");
    let attractionName = document.createElement("h3");
    let attractionAddress = document.createElement("p");
    let icon = document.createElement("img");
    icon.src = iconUrl;
    icon.id = "resultIcons";
    attractionName.innerHTML = name;
    attractionAddress.innerHTML = address;
    attractionContainer.appendChild(attractionName);
    attractionContainer.appendChild(attractionAddress);
    attractionContainer.appendChild(icon);
    attractionResultContainer.appendChild(attractionContainer);
}

async function getWeather(search){
    let response = await fetch(`${openWeatherUrl}q=${search}&units=metric&appid=${getWeatherKey}`);
    response = await response.json();
    const weatherInfo = new WeatherInfo(response.name, response.main["temp"], response.weather[0].description, `${openWeatherIconUrl}${response.weather[0].icon}@2x.png`);
    createWeatherElement(weatherInfo);
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
    icon.src = weatherInfo.IconUrl;
    icon.id = "resultIcons";

    weatherName.innerHTML = weatherInfo.Name;
    weatherTemp.innerHTML = `Temperature: ${weatherInfo.Temperature} Celsius`;
    weatherCond.innerHTML = `Condition: ${weatherInfo.Condition}`;
    weatherContainer.appendChild(weatherName)
    weatherContainer.appendChild(icon)
    weatherContainer.appendChild(weatherTemp)
    weatherContainer.appendChild(weatherCond)
    weatherResultContainer.appendChild(weatherContainer)
}