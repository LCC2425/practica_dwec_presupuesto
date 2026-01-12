// TODO: Crear las funciones, objetos y variables indicadas en el enunciado

// TODO: Variable global
let presupuesto = 0;
let gastos = [];
let idGasto = 0;

function actualizarPresupuesto(valorActualizado) {
    // TODO
    if(valorActualizado >= 0){
        presupuesto = valorActualizado;
        return presupuesto;
    }
    else{
        console.log("El presupuesto no puede ser negativo");
        return -1;
    }
}

function mostrarPresupuesto() {
    // TODO
    return "Tu presupuesto actual es de " + presupuesto + " €";
}

function listarGastos() {
    return gastos;
}

function anyadirGasto(gasto) {
    gasto.id = idGasto;
    idGasto++;
    gastos.push(gasto);
    
}

function borrarGasto(id) {
    for(let i = 0; i < gastos.length; i++){
        if(gastos[i].id === id){
            gastos.splice(i, 1);
        }
    }
}

function calcularTotalGastos(){
    let totalGastos = 0;
    for(let i = 0; i < gastos.length; i++){
        totalGastos += gastos[i].valor;
    }
    return totalGastos;
}

function calcularBalance() {
    let total= calcularTotalGastos();
    let Balance = presupuesto - total;
    return Balance;
}


function filtrarGastos(filtrado) {
   
    return gastos.filter(function(gastoIndividual){

        let coincide = true;

        if (filtrado.fechaDesde != null) {
            let fechaDesde = new Date(filtrado.fechaDesde).getTime();
            if (gastoIndividual.fecha < fechaDesde) {
                coincide = false;}
            }
        if (filtrado.fechaHasta != null) {
            let fechaHasta = new Date(filtrado.fechaHasta).getTime();
            if (gastoIndividual.fecha > fechaHasta) {
                coincide = false;}
            }
        if (filtrado.valorMinimo != null) {
            if (gastoIndividual.valor < filtrado.valorMinimo) {
                coincide = false;}
        }
        if (filtrado.valorMaximo != null) {
            if (gastoIndividual.valor > filtrado.valorMaximo) {
                coincide = false;}
        }
        if (filtrado.descripcionContiene != null) {
            let descripcionFiltrado = filtrado.descripcionContiene.toLowerCase();

            let descripcionGasto = gastoIndividual.descripcion.toLowerCase();

            let encontrado = descripcionGasto.indexOf(descripcionFiltrado);
            if (encontrado === -1){
                coincide = false;
            }
        }
        if (filtrado.etiquetasTiene != null && filtrado.etiquetasTiene.length > 0) {
            let encontrado = filtrado.etiquetasTiene.find(function(etiquetaFiltrado) {
                return (gastoIndividual.etiquetas || []).find(function(etiquetaGasto) {
                    return etiquetaGasto.toLowerCase() === etiquetaFiltrado.toLowerCase();
                });
            });

            if (!encontrado) {
                coincide = false;
                console.log("Excluido por etiquetas:", gastoIndividual.etiquetas);
            }
        }

        console.log("Coincide:", coincide);
        
        return coincide;
    });

}


function agruparGastos(periodo = "mes", etiquetas, fechaDesde, fechaHasta) {

        let gastosFiltrados = filtrarGastos({fechaDesde: fechaDesde, fechaHasta: fechaHasta, etiquetasTiene: etiquetas});
        
        let acumulacionTotal= gastosFiltrados.reduce(function(acumulador, gastoActual) {

            let agrupacion = gastoActual.obtenerPeriodoAgrupacion(periodo);

            if (!acumulador[agrupacion]) {
                acumulador[agrupacion] = 0;
            }
            acumulador[agrupacion] += gastoActual.valor;

            return acumulador;
        }
        , {} );
        return acumulacionTotal;
}

function transformarListadoEtiquetas(texto){
    let resultado = texto.split(/[ ,.;:]+/).filter(texto => texto.length > 0);
    return resultado;
}

function CrearGasto(descripcion, valor, fecha, ...etiquetas) {
    this.descripcion = descripcion;

    if(valor >= 0){
        this.valor = valor;
    }
    else{
        this.valor = 0;
    };

    if(fecha == null || isNaN(Date.parse(fecha))){
        this.fecha = new Date().getTime();
    }else{
        this.fecha = new Date(fecha).getTime();
    }

    if (etiquetas == null) {
    this.etiquetas = [];
    } else if (etiquetas.length === 1 && Array.isArray(etiquetas[0])){
         this.etiquetas = etiquetas[0];
    }else {
        this.etiquetas = etiquetas;
    }

    this.mostrarGasto = function() {
        return("Gasto correspondiente a " + this.descripcion + " con valor " + this.valor + " €");
    };


    this.actualizarDescripcion = function(descripcionActualizada) {
        this.descripcion = descripcionActualizada;
    };
    
    this.actualizarValor = function(valorActualizado) {
        if(valorActualizado >= 0){
            this.valor = valorActualizado;
        }else{
            this.valor = this.valor;
        }
    };

    this.mostrarGastoCompleto = function() {
        let texto = "";
        for(let i = 0; i < this.etiquetas.length; i++){
            texto += "- " + this.etiquetas[i]+ "\n";
        }

        return("Gasto correspondiente a " + this.descripcion + " con valor " + this.valor + " €." + "\n" +
        "Fecha: " + new Date(this.fecha).toLocaleString() + "\n" +
        "Etiquetas:\n" + texto);  
    };

    this.actualizarFecha = function(fechaActualizada) {
        if(fechaActualizada != null && !isNaN(Date.parse(fechaActualizada))){
         this.fecha = new Date(fechaActualizada).getTime();
        }
    }

    this.anyadirEtiquetas = function(...Nuevaetiqueta) {
        
        for(let i=0; i < Nuevaetiqueta.length; i++){
            let etiqueta = Nuevaetiqueta[i];
            let existe = false;

            for(let j=0; j < this.etiquetas.length; j++){
                if(this.etiquetas[j] === etiqueta){
                    existe = true;
                }
            }
            if(!existe){
                this.etiquetas.push(etiqueta);
            }
        }
    }

    this.borrarEtiquetas = function(...Nuevaetiqueta) {
        
        for(let i=0; i < Nuevaetiqueta.length; i++){
            let etiqueta = Nuevaetiqueta[i];

            for(let j=this.etiquetas.length-1; j >=0;  j--){
                if(this.etiquetas[j] === etiqueta){
                    this.etiquetas.splice(j, 1);
                }
            }
        }
    }
    
    this.obtenerPeriodoAgrupacion = function(periodo) {

        let fechaGasto = new Date(this.fecha).toISOString();

        if(periodo === "anyo"){
            periodo = fechaGasto.slice(0,4);
            return periodo;
        }else if(periodo === "mes"){
            periodo = fechaGasto.slice(0,7);        
            return periodo;
        }else if(periodo === "dia"){
            periodo = fechaGasto.slice(0,10);        
            return periodo;
        }
    }
}

// NO MODIFICAR A PARTIR DE AQUÍ: exportación de funciones y objetos creados para poder ejecutar los tests.
// Las funciones y objetos deben tener los nombres que se indican en el enunciado
// Si al obtener el código de una práctica se genera un conflicto, por favor incluye todo el código que aparece aquí debajo
export   {
    mostrarPresupuesto,
    actualizarPresupuesto,
    CrearGasto,
    listarGastos, 
    anyadirGasto, 
    borrarGasto, 
    calcularTotalGastos,
    calcularBalance,
    filtrarGastos,
    agruparGastos,
    transformarListadoEtiquetas
};
