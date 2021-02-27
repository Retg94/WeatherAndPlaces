const getWeatherKey = "7ce12bf5d6ccd49ddae5307dd68fbb4f";
const AttractionID = "3NNXITF340NHOCWXYL3F5PX20FU5QBDYCZOUMP4W153NFLTB";
const AttractionSecret = "XGAP1LEIZJZLOMM5OXIPBV3AABCXHXRF3MP2F5FVGXVPSQH5";
const fourSquareVersion = "20210226";
const foursquareUrl = "https://api.foursquare.com/v2/venues/explore?"
//const getWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=${getWeatherKey}`
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
    //console.log(form.elements["search"])
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
    console.log(response);
    let attractionList = [];
    response.response.groups[0].items.forEach(item => {
        //console.log(item)
        //console.log(item.venue.name + " " + item.venue.location.address)
        attractionList.push(new AttractionInfo(item.venue.name, item.venue.location.address, `${item.venue.categories[0].icon.prefix}64${item.venue.categories[0].icon.suffix}` ))
    })
    //attractionList.forEach(item => console.log(item.Name))
    //console.log(filterAlpha);
    if(filterAlpha === true){
        //console.log("TRYING TO SORT LIST")
        attractionList = attractionList.sort( (a, b) => {
            attractionList.forEach(element => {
                console.log(element.Name)
            });
            console.log("---------------------")  
            var nameA=a.Name.toLowerCase(), nameB=b.Name.toLowerCase();
            if (nameA < nameB) //sort string ascending
                return -1;
            if (nameA > nameB)
                return 1;
            return 0; //default return value (no sorting)
        });
        //venuesArray = _.sortBy( venuesArray, 'name' );
        //<script src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js%22%3E </script>
        //https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
        //console.log("IT SHOULD BE SORTED NOW")
    }
    attractionList.forEach(attraction => {
        //console.log(attraction._name + " " + attraction._address)
        createAttractionElement(attraction.Name, attraction.Address, attraction.IconUrl)
    })
}

function createAttractionElement(name, address, iconUrl){
    //console.log(name + " " + address);
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
    //console.log(attractionName.innerHTML + " " + attractionAddress.innerHTML);
}

async function getWeather(search){
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=${getWeatherKey}`);
    response = await response.json();
    console.log(response);
    const weatherInfo = new WeatherInfo(response.name, response.main["temp"], response.weather[0].description, `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
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
    //console.log(weatherTemp.innerHTML + " " + weatherCond.innerHTML)
}