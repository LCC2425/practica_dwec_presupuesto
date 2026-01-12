import * as gestionPresupuesto from "./gestionPresupuesto.js";

export function mostrarDatoEnId(idElemento, valor) {
    let elementoSeleccionado = document.getElementById(idElemento);

    if (!elementoSeleccionado) {
        console.log("Elemento con id " + idElemento + " no existe.");
    }else {
        elementoSeleccionado.textContent = valor;
    }
}
export function mostrarGastoWeb(idElemento, gasto) {
    let elementoSeleccionado = document.getElementById(idElemento);
    if (!elementoSeleccionado) {
        console.log("Elemento con id " + idElemento + " no existe.");
    } else {
        let divPrincipal = document.createElement("div");
        divPrincipal.className = "gasto";

        let divDescripcion = document.createElement("div");
        divDescripcion.className = "gasto-descripcion";
        divDescripcion.textContent = gasto.descripcion;
        divPrincipal.append(divDescripcion);

        let divFecha = document.createElement("div");
        divFecha.className = "gasto-fecha";
        divFecha.textContent = gasto.fecha;
        divPrincipal.append(divFecha);

        let divValor = document.createElement("div");
        divValor.className = "gasto-valor";
        divValor.textContent = gasto.valor;
        divPrincipal.append(divValor);

        let divEtiquetas = document.createElement("div");
        divEtiquetas.className = "gasto-etiquetas";
    
        for (let etiqueta of gasto.etiquetas){
            let spanEtiqueta = document.createElement ("span");
            spanEtiqueta.className = "gasto-etiquetas-etiqueta";
            spanEtiqueta.textContent = etiqueta;

            let borrarEtiqueta = borrarEtiquetasHandle(gasto, etiqueta);
            spanEtiqueta.addEventListener("click", borrarEtiqueta);

            divEtiquetas.append(spanEtiqueta);
        }
        divPrincipal.append(divEtiquetas);

        let botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.className = "gasto-editar";

        let editarGasto = editarHandle(gasto);

        botonEditar.addEventListener("click", editarGasto);
        divPrincipal.append(botonEditar);

        let botonBorrar = document.createElement("button");
        botonBorrar.textContent = "Borrar";
        botonBorrar.className = "gasto-borrar";

        let borrarGasto = borrarHandle(gasto);
        
        botonBorrar.addEventListener("click", borrarGasto);
        divPrincipal.append(botonBorrar);

        let botonEditarFormulario = document.createElement("button");
        botonEditarFormulario.textContent = "Editar (formulario)";
        botonEditarFormulario.className = "gasto-editar-formulario";
        
        botonEditarFormulario.addEventListener("click", function(){
            editarHandleFormulario(gasto, botonEditarFormulario, divPrincipal);
        });

        divPrincipal.append(botonEditarFormulario);

        elementoSeleccionado.append(divPrincipal);
    }
}
export function mostrarGastosAgrupadosWeb(idElemento, agrup, periodo){
    let elementoSeleccionado = document.getElementById(idElemento);

    let divPrincipal = document.createElement("div");
    divPrincipal.className = "agrupacion";

    let h1 = document.createElement("h1");
    if(periodo === "anyo"){
        periodo = "año";
    }else{
        if(periodo === "mes"){
            periodo = "mes";
        }else{
            if(periodo === "dia"){
                periodo = "día";
            }
        }
    }
    h1.textContent = "Gastos agrupados por " + periodo;
    divPrincipal.append(h1);

    for (let [gastoActual, valor] of Object.entries(agrup)){
        let divGrupo = document.createElement("div")
        divGrupo.className = "agrupacion-dato";

        let spanGastoActual = document.createElement("span");
        spanGastoActual.className = "agrupacion-dato-clave";
        spanGastoActual.textContent = gastoActual;

        let spanValor = document.createElement("span");
        spanValor.className = "agrupacion-dato-valor";
        spanValor.textContent = valor;

        divGrupo.append(spanGastoActual,spanValor);
        divPrincipal.append(divGrupo);
    }

    elementoSeleccionado.append(divPrincipal);
}

function repintar(){
    mostrarDatoEnId("presupuesto",gestionPresupuesto.mostrarPresupuesto());
    
    mostrarDatoEnId("gastos-totales",gestionPresupuesto.calcularTotalGastos());

    mostrarDatoEnId("balance-total",gestionPresupuesto.calcularBalance());

    document.getElementById("listado-gastos-completo").innerHTML="";
    for(let gasto of gestionPresupuesto.listarGastos()){
        mostrarGastoWeb("listado-gastos-completo",gasto);
    }

}

function actualizarPresupuestoWeb(){
    let promptUsuario = prompt("Introduzca un valor para el presupuesto");
    let numeroUsuario = Number(promptUsuario);

    gestionPresupuesto.actualizarPresupuesto(numeroUsuario);

    repintar();
}

function nuevoGastoWeb(){
    let promptDescripcion = prompt("Introduzca una Descripción para el gasto");
    let promptValor = prompt("Introduzca un Valor para el gasto");
    let promptFecha = prompt("Introduzca una Fecha para el gasto en formato internacional (yyyy-mm-dd)");
    let promptEtiquetas = prompt("Introduzca la o las Etiquetas para el gasto separadas por comas. Por ejemplo: Etiqueta1,Etiquetados,etc...");

    let numeroValor = Number(promptValor);
    let arrayEtiquetas = promptEtiquetas.split(",");

    let gastoNuevo = new gestionPresupuesto.CrearGasto(promptDescripcion, numeroValor, promptFecha, arrayEtiquetas);

    gestionPresupuesto.anyadirGasto(gastoNuevo);

    repintar();

}

function editarHandle(gasto){

    let editarGasto = {gastoActual:gasto, handleEvent:function(){
    let nuevaDescripcion = prompt("Edita la Descripción actual:", this.gastoActual.descripcion);
    if (nuevaDescripcion === null){
        nuevaDescripcion = this.gastoActual.descripcion;
    }
    this.gastoActual.actualizarDescripcion(nuevaDescripcion);

    let nuevoValor = prompt("Edita el Valor actual:", this.gastoActual.valor);
    if(nuevoValor === null){
        nuevoValor = this.gastoActual.valor;
    }
    let nuevoValorNum = Number(nuevoValor);
    this.gastoActual.actualizarValor(nuevoValorNum);

    let nuevaFecha = prompt("Edita la Fecha actual en formato internacional (yyyy-mm-dd):", this.gastoActual.fecha);
    if(nuevaFecha === null){
        nuevaFecha = this.gastoActual.fecha;
    }
    this.gastoActual.actualizarFecha(nuevaFecha);

    let nuevasEtiquetas = prompt("Edita las Etiquetas actuales para el gasto separadas por comas. Por ejemplo: Etiqueta1,Etiquetados,etc...",this.gastoActual.etiquetas);
    if(nuevasEtiquetas === null){
        nuevasEtiquetas = this.gastoActual.etiquetas;
    }
    let nuevasEtiquetasArray = nuevasEtiquetas.split(",");
    this.gastoActual.anyadirEtiquetas(nuevasEtiquetasArray);

    repintar();
    }
    }
    return editarGasto;
}

function borrarHandle(gasto) {
    let borrarGasto = {gastoActual: gasto, handleEvent: function() {
        gestionPresupuesto.borrarGasto(this.gastoActual.id);
        repintar();
    }
    };
    return borrarGasto;
}

function borrarEtiquetasHandle(gasto,etiqueta){
    let borrarEtiquetas = {gastoActual:gasto, etiquetaActual:etiqueta, handleEvent: function(){
        this.gastoActual.borrarEtiquetas(this.etiquetaActual);
        repintar();
    }}
    return borrarEtiquetas;
}

function nuevoGastoWebFormulario(){
    let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);
    var formulario = plantillaFormulario.querySelector("form");
    let botonAnyadir = document.getElementById("anyadirgasto-formulario");
    if (botonAnyadir) {
        botonAnyadir.setAttribute("disabled", "");
    }
    
    formulario.addEventListener("submit",function(event){
        event.preventDefault()
        let formularioActual = event.currentTarget;

        let nuevoGasto = new gestionPresupuesto.CrearGasto(
            formularioActual.querySelector("input[name=descripcion]").value,
            Number(formularioActual.querySelector("input[name=valor]").value),
            formularioActual.querySelector("input[name=fecha]").value,
            formularioActual.querySelector("input[name=etiquetas]").value
        )
    gestionPresupuesto.anyadirGasto(nuevoGasto);
    formulario.remove();
    repintar();
    if (botonAnyadir) {
        botonAnyadir.removeAttribute("disabled");
    }
    
    })

    let borrarFormulario = {handleEvent: function(){
        formulario.remove();
        if (botonAnyadir) {
        botonAnyadir.removeAttribute("disabled");
        }
    }}

    formulario.querySelector("button.cancelar").addEventListener("click", borrarFormulario);
    
    let controles = document.getElementById("controlesprincipales");
    controles.appendChild(formulario);
}

function editarHandleFormulario(gasto, botonEditarElFormulario, divPrincipal) { 
    let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true); 
    let formulario = plantillaFormulario.querySelector("form"); 
   
    let editarformulario = {
        handleEvent: function() { 
            let descripcionAEditar = formulario.querySelector("input[name=descripcion]"); 
            let valorAEditar = formulario.querySelector("input[name=valor]"); 
            let fechaAEditar = formulario.querySelector("input[name=fecha]"); 
            let etiquetasAEditar = formulario.querySelector("input[name=etiquetas]"); 

            descripcionAEditar.value = gasto.descripcion; 
            valorAEditar.value = gasto.valor; 
            fechaAEditar.value = gasto.fecha; 
            etiquetasAEditar.value = gasto.etiquetas.join(","); 
        }
    };

    if (botonEditarElFormulario) {
    botonEditarElFormulario.setAttribute("disabled", "");
    }

    let editarGasto = {
        gastoActual: gasto,
        handleEvent: function(evt) { 
            evt.preventDefault(); 

            let nuevaDescripcion = formulario.querySelector("input[name=descripcion]").value; 
            if (nuevaDescripcion === "") {
                nuevaDescripcion = this.gastoActual.descripcion;
            } 
            this.gastoActual.actualizarDescripcion(nuevaDescripcion); 

            let nuevoValor = formulario.querySelector("input[name=valor]").value;
            if(nuevoValor === ""){
                 nuevoValor = this.gastoActual.valor;
            } 
            this.gastoActual.actualizarValor(Number(nuevoValor)); 

            let nuevaFecha = formulario.querySelector("input[name=fecha]").value; 
            if(nuevaFecha === "") {
                nuevaFecha = this.gastoActual.fecha; 
            }
            this.gastoActual.actualizarFecha(nuevaFecha); 

            let nuevasEtiquetas = formulario.querySelector("input[name=etiquetas]").value;
            if(nuevasEtiquetas === ""){
                nuevasEtiquetas = this.gastoActual.etiquetas; 
            } 
            else{
            this.gastoActual.etiquetas = nuevasEtiquetas.split(",");
            }
            formulario.remove();

            if (botonEditarElFormulario) { 
                botonEditarElFormulario.removeAttribute("disabled"); 
            } 

            repintar();
        }
    };

    let borrarFormulario = {
        handleEvent: function() {
            formulario.remove();
            if (botonEditarElFormulario) { 
                botonEditarElFormulario.removeAttribute("disabled"); 
            }
        }
    };

    formulario.addEventListener("submit", editarGasto);
    formulario.querySelector("button.cancelar").addEventListener("click", borrarFormulario); 

    let formularioExistente = divPrincipal.querySelector("form");
    if (formularioExistente){
        formularioExistente.remove();
    }

    divPrincipal.appendChild(formulario); 

    editarformulario.handleEvent(); 

    return editarformulario; 
} 

export function filtrarGastosWeb(event) {
    event.preventDefault();

    let formulario = event.currentTarget;

    let valorMinimo = formulario["formulario-filtrado-valor-minimo"].value;
    if(valorMinimo === ""){
        valorMinimo = null;
    }else{
        valorMinimo = Number(valorMinimo);
    }
    let valorMaximo = formulario["formulario-filtrado-valor-maximo"].value;
    if(valorMaximo === ""){
        valorMaximo = null;
    }else{
        valorMaximo = Number(valorMaximo);
    }
    let descripcionContiene = formulario["formulario-filtrado-descripcion"].value;
    if (descripcionContiene === "") {
        descripcionContiene = null;
    }
    let fechaDesde = formulario["formulario-filtrado-fecha-desde"].value;
    if (fechaDesde === "") {
        fechaDesde = null;
    }
    let fechaHasta = formulario["formulario-filtrado-fecha-hasta"].value;
    if (fechaHasta === "") {
        fechaHasta = null;
    }

    let textoEtiquetas = formulario["formulario-filtrado-etiquetas-tiene"].value;
    let etiquetasTiene;
    if (textoEtiquetas !== "") {
        etiquetasTiene = gestionPresupuesto.transformarListadoEtiquetas(textoEtiquetas);
    }

    let formularioFiltrado = {
        valorMinimo,
        valorMaximo,
        descripcionContiene,
        fechaDesde,
        fechaHasta,
        etiquetasTiene
    };

    let gastosFiltrados = gestionPresupuesto.filtrarGastos(formularioFiltrado);

    document.getElementById("listado-gastos-completo").innerHTML = "";
    for (let gasto of gastosFiltrados) {
        mostrarGastoWeb("listado-gastos-completo", gasto);
    }
}

export function guardarGastosWeb() {

    let gastos = gestionPresupuesto.listarGastos();

    let gastosJson = JSON.stringify(gastos);

    localStorage.setItem("GestorGastosDWEC", gastosJson);
}

export function cargarGastosWeb() {

    let gastos = localStorage.getItem("GestorGastosDWEC");

    if (gastos !== null) {

        let gastosJson = JSON.parse(gastos);

        gestionPresupuesto.cargarGastos(gastosJson);

    } else {

        gestionPresupuesto.cargarGastos([]);
    }

    repintar();
}
 

let botonPresupuesto = document.getElementById("actualizarpresupuesto");
botonPresupuesto.addEventListener("click", actualizarPresupuestoWeb);

let botonGasto = document.getElementById("anyadirgasto");
botonGasto.addEventListener("click", nuevoGastoWeb);

let botonGastoForm = document.getElementById("anyadirgasto-formulario");
botonGastoForm.addEventListener("click", nuevoGastoWebFormulario);

let botonSubmit = document.getElementById("formulario-filtrado");
botonSubmit.addEventListener("submit", filtrarGastosWeb);

let botonGuardar = document.getElementById("guardar-gastos");
botonGuardar.addEventListener("click", guardarGastosWeb);

let botonCargar = document.getElementById("cargar-gastos");
botonCargar.addEventListener("click", cargarGastosWeb);