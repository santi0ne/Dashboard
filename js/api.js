/* Funcion flecha plot con el parametro data */

let plot = (data) => {
    const ctx = document.getElementById('myChart'); /* referencia al elemento HTML */
    const barCtx = document.getElementById('myBarChart');

    /* FUNCION QUE GENERA CODIGO DE COLORES HEX ALEATORIAMENTE */
    const generateRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };
      
      const colors = Array.from({ length: data.hourly.time.length }, () =>
        generateRandomColor()
      );

    const dataset = {
        labels: data.hourly.time, /* ETIQUETA DE DATOS */
        datasets: [
            {
                label: 'Temperatura semanal', /* ETIQUETA DEL GRÁFICO */
                data: data.hourly.temperature_2m, /* ARREGLO DE DATOS */
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                backgroundColor: colors, // Cambia los colores aquí del grafico de barras
                pointBackgroundColor: 'rgba(75, 192, 192, 1)' // colores estaticos en los puntos del grafico de linea
            }
        ]
    };

    /* conf del grafico de linea */
    const config = {
        type: 'line',
        data: dataset,
    };

    /* conf del grafico de barras */
    const barConfig = {
        type: 'bar',
        data: dataset,
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            },
        }
    };

    /* instanciacion del grafico de linea */
    const chart = new Chart(ctx, config); /* ctx -> referencia al HTML */

    /* instanciacion del grafico de linea */
    const barChart = new Chart(barCtx, barConfig);
}

/* cargar datos */

let load = (data) => {
    
    let latitude = data['latitude'];
    let latitudeHTML = document.getElementById('latitud');
    latitudeHTML.textContent = latitude;

    let longitude = data['longitude'];
    let longitudeHTML = document.getElementById('longitud');
    longitudeHTML.textContent = longitude;

    let temperature = data['timezone'];
    let temperatureHTML = document.getElementById('ubication');
    temperatureHTML.textContent = temperature;

    let timezone = data['timezone_abbreviation'];
    let timezoneHTML = document.getElementById('time-zone');
    timezoneHTML.textContent = 'GTM'+timezone;

    const tiempoTranscurrido = Date.now()
    const hoy = new Date(tiempoTranscurrido)
    let date=hoy.toISOString().substring(0,10)
    let dateHTML=document.getElementById('nowFecha')
    dateHTML.textContent=date

    /* llamada a funcion plot */
    plot(data)

}


let loadCurrent = (data) => {

    const tiempoTranscurrido = Date.now()
    const hoy = new Date(tiempoTranscurrido)
    let date=hoy.toISOString().substring(0,10)

    let fechas=data.daily.time;
    
    function comparar(fecha){
        if(fecha==date) fechaActual=fechas.indexOf(fecha)
    }

    fechas.forEach(element => comparar(element))

    let maxTemp=data.daily.temperature_2m_max[fechaActual];
    let maxTempHTML=document.getElementById('atemperatura');
    maxTempHTML.textContent=maxTemp;
    

    let minTemp=data.daily.temperature_2m_min[fechaActual]
    let minTempHTML=document.getElementById('btemperatura');
    minTempHTML.textContent=minTemp+' °C'

    let sunset=data.daily.sunset[fechaActual]
    let sunsetHTML=document.getElementById('sunset');
    sunsetHTML.textContent=sunset.substring(11)+ 'PM'
  
    let windspeed=data.daily.windspeed_10m_max[fechaActual]
    let windspeedHTML=document.getElementById('windspeed');
    windspeedHTML.textContent=windspeed+' km/h'

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
            let contenedorMareas = xml.getElementsByTagName('div')[0];
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
            let URL ='https://api.open-meteo.com/v1/forecast?latitude=-2.20&longitude=-79.89&hourly=temperature_2m,relativehumidity_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,windspeed_10m_max,winddirection_10m_dominant&timezone=auto';
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
        loadCurrent(data);
    }
)();

