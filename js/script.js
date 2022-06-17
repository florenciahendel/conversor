const APIKEY = '78ebf190f1e57d5cf73fea9e';

const desplegable = document.querySelectorAll('form select'),
    monedaInicial = document.querySelector('#inicial select'),
    monedaFinal = document.querySelector('#monedaFinal'),
    btnConvertir = document.querySelector('#btnConversion'),
    monto = document.querySelector('#monto'),
    conversionTxt = document.querySelector('#conversionTxt'),
    btnInvertirMoneda = document.querySelector('#icono');

for (let i = 0; i < desplegable.length; i++) {
    for (let codMoneda in paises) {
        let seleccionado = i == 0 ? (codMoneda == 'ARS' ? 'selected' : '') : (codMoneda == 'USD' ? 'selected' : '');
        let opcion = `<option value='${codMoneda}' ${seleccionado}>${codMoneda}</option>`;
        desplegable[i].insertAdjacentHTML('beforeend', opcion);
    }
    desplegable[i].addEventListener('change', e => {
        mostrarBandera(e.target);
    });

}

function mostrarBandera(element) {
    for (let codPais in paises) {
        if (codPais == element.value) {
            let imagen = element.parentElement.querySelector('img');
            imagen.src = `https://www.countryflagsapi.com/png/${paises[codPais]}`;
        }
    }
}

async function cambiar() {
    let montoVal = monto.value;
    if (montoVal == '' || montoVal == '0') {
        monto.value = '1';
        montoVal = 1;
    }
    conversionTxt.innerText = 'Obteniendo información...';
    const URL = `https://v6.exchangerate-api.com/v6/${APIKEY}/latest/${monedaInicial.value}`;
    try {
        const respuesta = await fetch(URL);
        const data = await respuesta.json();
        let tasaConversion = data.conversion_rates[monedaFinal.value];
        let resultado = (montoVal * tasaConversion).toFixed(2);
        conversionTxt.innerText = `${montoVal} ${monedaInicial.value} = ${resultado} ${monedaFinal.value}`;
    }
    catch (e) {
        conversionTxt.innerText = 'Algo salió mal';
        console.log(e);
    }
}

btnConvertir.addEventListener('click',(e)=>{
    e.preventDefault();
    cambiar();
});

window.addEventListener('load', () => {
    cambiar();
});

btnInvertirMoneda.addEventListener('click',()=>{
    let temp = monedaInicial.value;
    monedaInicial.value = monedaFinal.value;
    monedaFinal.value = temp;
    mostrarBandera(monedaInicial);
    mostrarBandera(monedaFinal);
    cambiar();
});


//Esta es la función equivalente a cambiar(); usando sólo fetch, sin async await.
//Si quieren probarla, reemplacen cambiar() por obtenerTasaCambio() en las llamadas correspondientes.

function obtenerTasaCambio() {
    let montoVal = monto.value;
    if (montoVal == '' || montoVal == '0') {
        monto.value = '1';
        montoVal = 1;
    }
    conversionTxt.innerText = 'Obteniendo información...';

    const URL = `https://v6.exchangerate-api.com/v6/${APIKEY}/latest/${monedaInicial.value}`;


    fetch(URL)
        .then(response => response.json())
        .then(result => {
            let tasaConversion = result.conversion_rates[monedaFinal.value];
            let resultado = (montoVal * tasaConversion).toFixed(2);
            conversionTxt.innerText = `${montoVal} ${monedaInicial.value} = ${resultado} ${monedaFinal.value}`;
        }).catch(() => {
            conversionTxt.innerText = 'Algo salió mal';
        });
}