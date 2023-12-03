const criptomonedasSelect= document.querySelector('#criptomonedas');
const monedasSelect= document.querySelector('#moneda');
const formulario= document.querySelector('#formulario');
const resultado= document.querySelector('#resultado');
//objeto de busqueda
const objBusqueda={
    moneda:'',
    criptomoneda:'',

}
document.addEventListener('DOMContentLoaded',()=>{

    consultaLasCriptoMonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedasSelect.addEventListener('change', leerValor);
});

//crear un promise
const obtenerCriptomonedas=criptomonedas=> new Promise(resolve=>{
    resolve(criptomonedas);
});

function consultaLasCriptoMonedas(){
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;
    
    fetch(url)
    .then(respuesta=>respuesta.json())
    .then(resultado=>obtenerCriptomonedas(resultado.Data))
    .then(criptomonedas=> selectCriptomonedas(criptomonedas))
    

    
};

function selectCriptomonedas(cripto){
 cripto.forEach(cripto => {
   const {FullName, Name}=cripto.CoinInfo;
    //crear las opciones 

    const option = document.createElement('OPTION');
    option.value=Name;
    option.textContent= FullName;
    criptomonedasSelect.appendChild(option);



 });

}
function submitFormulario(e){

    e.preventDefault();
    
    //validar formulario

    const {moneda, criptomoneda}= objBusqueda;
    if (moneda==='' || criptomoneda==='') {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }
    //imprimir resultado cotizando la api
    consultarAPI();


}

function leerValor(e){

objBusqueda[e.target.name]= e.target.value;

}
function mostrarAlerta(mensaje){
    const existeAlerta= document.querySelector('.error');
    if (!existeAlerta) {
        const alerta= document.createElement('DIV');
    alerta.classList.add('error');
    alerta.textContent=mensaje;
    formulario.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 3000);
    return;
    }
    
}

function consultarAPI(){
    const {moneda, criptomoneda}= objBusqueda;

    const url=`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
    mostrarspinner();
    fetch(url)
    .then(respuesta=>respuesta.json())
    .then(cotizacion=>{
        mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda]);
    })


}
function mostrarCotizacion(cotizacion){
    limpiarHtml();
    const {PRICE, HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE}=cotizacion;

 const precio = document.createElement('p');
 precio.classList.add('precio');
 precio.innerHTML=`
 EL precio es: <span>${PRICE}</span>`;

 const preciomax = document.createElement('p');
 preciomax.innerHTML=`
 Precio mas alto del dia: <span>${HIGHDAY}</span>`;

 const preciomin = document.createElement('p');
 preciomin.innerHTML=`
 Precio mas bajo del dia: <span>${LOWDAY}</span>`;

 const cambioDiario = document.createElement('p');
 cambioDiario.innerHTML=`
 Variacion las ultimas 24h: <span>${CHANGEPCT24HOUR}%</span>`;

 const ultimaActualizacion = document.createElement('p');
 ultimaActualizacion.innerHTML=`
 Ultima actualizacion: <span>${LASTUPDATE}</span>`;


 resultado.appendChild(precio);
 resultado.appendChild(preciomax);
 resultado.appendChild(preciomin);
 resultado.appendChild(cambioDiario);
 resultado.appendChild(ultimaActualizacion);
 



}
function limpiarHtml(){
while(resultado.firstChild){
    resultado.removeChild(resultado.firstChild);
}

}
function mostrarspinner(){
    limpiarHtml();

    const spinner = document.createElement('DIV');
    spinner.classList.add('spinner');
    spinner.innerHTML=`
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(spinner);
}