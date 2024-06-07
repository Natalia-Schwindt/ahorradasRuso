let categorias_array = [];

const botonNavHamburguesa = document.getElementById('boton-nav-hamburguesa');
const ulNavHeader = document.getElementById('ul-nav-header');

botonNavHamburguesa.addEventListener('click', () => {
    ulNavHeader.classList.toggle('hidden');
});

const botonesEditar = document.querySelectorAll('.botonEditar');
const categorias = document.getElementById('categorias');

// -------------------------------------------------------------------------------------------------
const nombreNuevaCategoria = document.getElementById('nombre-nueva-categoria');
const botonAgregarNuevaCategoria = document.getElementById('boton-agregar-nueva-categoria');
let listaNuevaCategoria = document.getElementById('lista-nueva-categoria');

function crearFila(categoria, indice){
    let categoriaElemLi = document.createElement('li');
    categoriaElemLi.style.display = 'flex';
    categoriaElemLi.style.justifyContent = 'space-between';

    let categoriaElemP = document.createElement('p');
    categoriaElemP.textContent = categoria;
    categoriaElemP.style.width = '70%';
    categoriaElemP.style.textAlign = 'start';
    categoriaElemP.style.color = 'white';

    let botonEditarCategoria = document.createElement('button');
    botonEditarCategoria.textContent = 'Editar';
    botonEditarCategoria.style.color = '#86ec10';
    botonEditarCategoria.style.paddingRight = '10px';
    botonEditarCategoria.dataset.indice = indice;
    botonEditarCategoria.onclick = editar_operacion;

    let botonEliminarCategoria = document.createElement('button');
    botonEliminarCategoria.textContent = 'Eliminar';
    botonEliminarCategoria.style.color = 'red';
    botonEliminarCategoria.dataset.indice = indice;
    botonEliminarCategoria.onclick = eliminar_operacion;
    categoriaElemLi.appendChild(categoriaElemP);
    categoriaElemLi.appendChild(botonEditarCategoria);
    categoriaElemLi.appendChild(botonEliminarCategoria);

    listaNuevaCategoria.appendChild(categoriaElemLi);

};

function crearTabla(categorias){
    listaNuevaCategoria.innerHTML = '';
    categorias.forEach((categoria, indice) => {
        crearFila(categoria, indice);
    });
};

function cargarDatos(){
    // carga categorias
    categorias_storage = localStorage.getItem("categorias");
    if (!categorias_storage) {
        categorias_array = ["Comida", "Servicios", "Salidas", "Educacion", "Transporte", "Trabajo"];
        localStorage.setItem("categorias", categorias_array);
    } else {
        categorias_array = categorias_storage.split(',');
    }

    crearTabla(categorias_array);
};

// Crea cada operacion del form de 'nueva operacion' de balance
function crearOperacion() {
    // Objeto con los valores de cada opcion del form de nuevaOperacion
    let nuevaCategoria = nombreNuevaCategoria.value.trim();
    if (nuevaCategoria) {
        nuevaCategoria = nuevaCategoria.charAt(0).toUpperCase() + nuevaCategoria.slice(1).toLowerCase();
        nombreNuevaCategoria.value = '';
        categorias_array.push(nuevaCategoria);
        localStorage.setItem("categorias", categorias_array);
        crearTabla(categorias_array);
    }
};

const formularioEditarCategoria = document.getElementById('formulario-editar-categoria');
const editarNombreNuevaCategoria = document.getElementById('editar-nombre-nueva-categoria');
const editarCategoria = document.getElementById('editar-categoria');
let indiceInputCategoria = document.getElementById("indice-input-categoria");

function editar_operacion(){
    categorias.style.display = 'none';
    editarCategoria.style.display = 'block';
    indice = this.dataset.indice;

    indiceInputCategoria.value = indice;
    categoria = categorias_array[indice];
    editarNombreNuevaCategoria.value = categoria; //.descripcion 
};

formularioEditarCategoria.addEventListener("submit", function (event) {
    console.log(event);
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();

    indice = indiceInputCategoria.value;
    categorias_array[indice] = editarNombreNuevaCategoria.value;

    localStorage.setItem("categorias", categorias_array);
    categorias.style.display = 'block';
    editarCategoria.style.display = 'none';
    crearTabla(categorias_array);
});

// Eliminar categoria
function eliminar_operacion(){
    indice = this.dataset.indice;
    categoria = categorias_array[indice]
    categorias_array.splice(indice, 1);
    localStorage.setItem("categorias", categorias_array);

    operaciones_json = localStorage.getItem("operaciones");
    operaciones_array = JSON.parse(operaciones_json);
    if (operaciones_array===null){
        operaciones_array=[];
    }

    operacionesFiltradas = operaciones_array.filter(op => op.categoria !== categoria);
    localStorage.setItem("operaciones", JSON.stringify(operacionesFiltradas));

    crearTabla(categorias_array);
};

document.querySelector('#formulario-categoria').addEventListener("submit", function (event) {
    console.log(event);
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
    crearOperacion();
});

const cancelarOperacion = document.getElementById('cancelar-operacion');
cancelarOperacion.addEventListener('click', ()=>{
    categorias.style.display = 'block';
    editarCategoria.style.display = 'none';
});

// inicio app
cargarDatos();