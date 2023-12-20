require('dotenv').config()

const {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
  confirmar,
  mostrarListadoChecklist,
} = require("./helpers/inquirer");

const Busquedas = require('./models/busquedas')

const main = async () => {
    
    const busquedas = new Busquedas();
    let opt;
    
    
  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        //mostrar mensaje
        const termino = await leerInput('Ciudad: ');
        
        //buscar los lugares
        const lugares = await busquedas.ciudad(termino);
        
        
        //seleccionar el lugar
        const id = await listarLugares(lugares);
        if (id === '0') continue
        
        const lugarSel = lugares.find( l => l.id === id);
        
        //guardar en db
        busquedas.agregarHistorial(lugarSel.nombre);
        
        //obtener los datos del clima
        const clima = await busquedas.climaLugar( lugarSel.lat, lugarSel.lng )
        
        //mostrar resultados
        console.clear()
        console.log('\nInformación de la ciudad\n'.green)
        console.log('Cuidad: ', lugarSel.nombre)
        console.log('Lat: ', lugarSel.lat)
        console.log('Lng: ', lugarSel.lng)
        console.log('Temperatura: ', clima.temp, '°C')
        console.log('Mínima: ', clima.min, '°C')
        console.log('Máxima: ', clima.max, '°C')
        console.log('¿cómo está el clima: ', clima.desc)
        break;
      case 2:
                 
        busquedas.historialCapitalizado.forEach((lugar, i)=>{
            
            const idx = `${i + 1 }`.green
            console.log(`${idx} ${lugar}`)

        })
        break;
      case 3:
        console.log(opt);
        break;
    }

    console.log("\n");
    if (opt !== 0) await pausa();

  } while (opt !== 0);
};

main();
//console.log(process.env.mapbox_key)
