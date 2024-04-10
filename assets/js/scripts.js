const monedaSection = document.querySelector("#resultado");
const montoInput = document.querySelector("#montoMoneda");
const monedaSelect = document.querySelector("#moneda");
const botonBuscar = document.querySelector(".boton");
const apiURL = "https://mindicador.cl/api/";


async function getTipoCambio(moneda) {
    try {
        const res = await fetch(apiURL + moneda.toLowerCase());
        if (!res.ok) {
            throw new Error('No se pudo obtener el tipo de cambio');
        }
        const data = await res.json();
        return data.serie[0].valor;
    } catch (error) {
        throw new Error('Error al obtener el tipo de cambio: ' + error.message);
    }
}


function calcularCambio(monto, tipoCambio) {
    return monto * tipoCambio;
}


function renderizarResultado(resultado) {
    monedaSection.textContent = resultado.toFixed(2);
}


async function convertirMoneda() {
    try {
        const monto = parseFloat(montoInput.value);
        if (isNaN(monto)) {
            throw new Error('Por favor, ingrese un monto válido');
        }
        const monedaSeleccionada = monedaSelect.value;
        const tipoCambio = await getTipoCambio(monedaSeleccionada);
        const resultado = calcularCambio(monto, tipoCambio);
        renderizarResultado(resultado);
    } catch (error) {
        monedaSection.textContent = 'Error: ' + error.message;
    }
}


botonBuscar.addEventListener('click', convertirMoneda);

//Grafica

async function getAndCreateDataToChart(monedaSeleccionada) {
    
    const apiURL = `https://mindicador.cl/api/${monedaSeleccionada.toLowerCase()}`;

   
    const res = await fetch(apiURL);
    const data = await res.json();

   
    const ultimos10Dias = data.serie.slice(0, 10);

    
    const labels = ultimos10Dias.map((dia) => dia.fecha);
    const valores = ultimos10Dias.map((dia) => dia.valor);

    
    const datasets = [{
        label: "Valor de la moneda",
        borderColor: "rgb(255, 99, 132)",
        data: valores
    }];

    return { labels, datasets };
}

async function renderGrafica(monedaSeleccionada) {
    
    const data = await getAndCreateDataToChart(monedaSeleccionada);

   
    const config = {
        type: "line",
        data
    };

   
    const myChart = document.getElementById("myChart");
    myChart.style.backgroundColor = "white";

  
    new Chart(myChart, config);
}




renderGrafica("dolar"); // Puedes cambiar "dolar" por la moneda seleccionada
