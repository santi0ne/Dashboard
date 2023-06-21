
/* Funcion flecha plot con el parametro data */

let plot = (data) => {
    const ctx = document.getElementById('myChart'); /* referencia al elemento HTML */

    const dataset = {
        labels: data.hourly.time, /* ETIQUETA DE DATOS */
        datasets: [{
            label: 'Temperatura semanal', /* ETIQUETA DEL GRÁFICO */
            data: data.hourly.temperature_2m, /* ARREGLO DE DATOS */
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    /* conf del grafico */
    const config = {
        type: 'line',
        data: dataset,
    };

    /* instanciacion del grafico */
    const chart = new Chart(ctx, config); /* ctx -> referencia al HTML */

    /* Grafico de Barras */

}

/* cargar datos */

let load = (data) => {
    let latitude = data['latitude'];
    let latitudeHTML = document.getElementById('latitud');
    latitudeHTML.textContent = latitude;

    let longitude = data['longitude'];
    let longitudeHTML = document.getElementById('longitud');
    longitudeHTML.textContent = longitude;

    let temperature = data['timezone_abbreviation'];
    let temperatureHTML = document.getElementById('temperatura');
    temperatureHTML.textContent = temperature;

    let timezone = data['timezone'];
    let timezoneHTML = document.getElementById('time-zone');
    timezoneHTML.textContent = timezone;

     /* llamada a funcion plot */
     plot(data)

}

let loadInocar = () => {

    /* peticion asincronica */
    let URL = 'https://cors-anywhere.herokuapp.com/https://www.inocar.mil.ec/mareas/consultan.php';

    fetch(URL)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "text/html");
            let contenedorHTML = document.getElementById('table-container');
            
            let contenedorMareas = xml.getElementsByClassName('container-fluid')[0];
            contenedorHTML.innerHTML = contenedorMareas.innerHTML;
            /*console.log(xml);*/
        })
        .catch(console.error);
}

/* FUNCION ANONIMA - AUTOEJECUTABLE */
(
    function (){
        let meteo = localStorage.getItem('meteo');

        if(meteo == null){
            let URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.20&longitude=-79.89&hourly=temperature_2m&daily=uv_index_max&timezone=auto';
            fetch(URL)
                .then(response => response.json())
                .then(data => {
                    load(data)

                    /* GUARDAR DATA EN MEMORIA */
                    localStorage.setItem("meteo", JSON.stringify(data))
                })
                .catch(console.error);
        }else{
            /* CARGAR DATA EN MEMORIA */
                load(JSON.parse(meteo))
        }
        
        loadInocar();
    }
)();

