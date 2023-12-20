const fs = require('fs')

const axios = require("axios");


class Busquedas {
  historial = [];
  dbPath = './db/database.json';

  constructor() {
    this.leerBD();
}

get historialCapitalizado () {

    return this.historial.map( lugar => {
        let palabras = lugar.split(' ')
        palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1))
        return palabras.join(' ')
    })

    // const historialCapitalizado = this.historial.map(oracion => {
    //     const palabras = oracion.split(' ');
  
    //     const palabrasCapitalizadas = palabras.map(palabra => {
    //       return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    //     });
  
    //     return palabrasCapitalizadas.join(' ');
    //   });
  
    //   return historialCapitalizado;
    
}

  get paramsMapBox() {
    return {
      language: "es",
      access_token: process.env.mapbox_key,
      limit: 5,
    };
  }

  async ciudad(lugar = "") {
    //const resp = await axios.get("https://api.mapbox.com/geocoding/v5/mapbox.places/santa%20fe%20.json?proximity=ip&language=es&access_token=pk.eyJ1IjoiYXNwb250b24iLCJhIjoiY2xxODcwamxmMWJ4MzJrdDYweWt6a3k5aiJ9.NrsV_00kFKfexyuevBjQwQ&limit=5");

    //console.log(lugar);

    try {
      //peticion http
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapBox,
      });

      const resp = await instance.get();

      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      return []; // retorna los lugares que coincidan con el parametro
    }
  }

  get paramOpenWeather() {
    return {

      lang: "sp",
      appid: process.env.OPENWEATHER_KEY,
      units: 'metric',
    };
  }

  async climaLugar(lat, lon) {
    try {
      //instances axios.create()
      //peticion http
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params:{ ...this.paramOpenWeather, lat, lon},
      });

      const resp = await instance.get();
      const {weather, main} = resp.data
      //console.log (resp)

      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp
      }


    //   .map((lugar) => ({
    //    desc: lugar.data.temp
    //   }));
      
    } catch (error) {
      console.log(error);
    }
  }

  agregarHistorial (lugar = '') {

    if(this.historial.includes(lugar.toLocaleLowerCase())) {
        return;
    }

    //para que solo muestre 5 registrs
    this.historial = this.historial.splice(0,4)
  
    //prevenir duplicados
    this.historial.unshift(lugar.toLocaleLowerCase());

    //grabar en bd
    this.guardarDB();

    this.leerBD();
  }

  guardarDB() {
    const payload = {
        historial: this.historial
    }

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerBD () {
    
    if (! fs.readFileSync(this.dbPath)) return 
    
    const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'})   
    const data = JSON.parse(info)
    //console.log(data)
    this.historial = data.historial;
    
    return;
  }
}

module.exports = Busquedas;
