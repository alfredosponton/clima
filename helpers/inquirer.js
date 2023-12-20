const inquirer = require('inquirer');
require('colors');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1. '.green}Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2. '.green}Historial tareas`
            },
            {
                value: 0,
                name: `${'0. '.green}Salir`
            },
        ]
    }
];

const inquirerMenu = async() => {
    console.clear();

    console.log('========================='.green);
    console.log('  Seleccione una opción'.white);
    console.log('=========================\n'.green);

    // Usar `inquirer.prompt` de forma asincrónica y esperar la respuesta
    const {opcion} = await inquirer.prompt(preguntas)

    return opcion;
};

const pausa = async () => {

    const preguntaPausa  = [
        {
            type: 'input',
            name: 'pausa',
            message: `Presiona ${'ENTER'.green} para continuar`
}]
      
        const pausa = await inquirer.prompt(preguntaPausa )
        
        return(pausa);
}

const leerInput = async (menssage) => {
    const question = [
        {
            type: 'imput',
            name: 'desc',
            menssage,
            validate(value){
                if (value.length === 0) {
                    return 'Por favor ingrese un valor'
                } else {
                    return true
                }
            }
        }
    ];

    const {desc} = await inquirer.prompt(question)
    return desc
}

const listarLugares = async (lugares = []) => {

    const choices = lugares.map( (lugar, i) => {
        const idx = `${i + 1}.`.green;
        
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`

        }
    })

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    })

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar',
            choices
        }
    ]
    
    const {id} = await inquirer.prompt(preguntas)
    return id;

}

const confirmar = async (message) => {

    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ]

    const {ok} = await inquirer.prompt(question)
    return ok;

}

const mostrarListadoChecklist = async (tareas = []) => {

    const choices = tareas.map( (tarea, i) => {
        const idx = `${i + 1}.`.green;

        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn) ?true : false
        }
    })


    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices
        }
    ]
    
    const {ids} = await inquirer.prompt(pregunta)
    return ids;

}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist
}
