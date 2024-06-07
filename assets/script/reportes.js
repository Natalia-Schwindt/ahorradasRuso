const botonNavHamburguesa = document.getElementById('boton-nav-hamburguesa');
const ulNavHeader = document.getElementById('ul-nav-header');

botonNavHamburguesa.addEventListener('click', () => {
    ulNavHeader.classList.toggle('hidden');
});

const ocultarImgTexto = document.getElementsByClassName('ocultar-img-texto');
const reportesSection = document.getElementById('reportes');
const imagenReportes = document.getElementById('imagen-reportes');
const totalesCategoria = document.getElementById('totales-categoria');
const totalesMes = document.getElementById('totales-mes');

function ocultarImgYTexto() {
    for (let i = 0; i < ocultarImgTexto.length; i++) {
        ocultarImgTexto[i].classList.add('hidden');
    }
    imagenReportes.classList.add('hidden');
    reportesSection.classList.remove('hidden');
}

function mostrarReportes(operaciones) {
    if (operaciones.length === 0) {
        reportesSection.classList.add('hidden');
        totalesCategoria.classList.add('hidden');
        totalesMes.classList.add('hidden');
        return;
    }

    const reportes = calcularReportes(operaciones);

    // Mostrar la sección de resumen
    reportesSection.classList.remove('hidden');

    // Actualizar tabla de resumen
    const tablaResumen = document.getElementById('tabla-resumen');
    tablaResumen.innerHTML = '';

    const resumenDatos = [
        { descripcion: 'Categoría con mayor ganancia', nombre: reportes.categoriaMayorGanancia.nombre, valor: `+$${reportes.categoriaMayorGanancia.monto.toFixed(2)}` },
        { descripcion: 'Categoría con mayor gasto', nombre: reportes.categoriaMayorGasto.nombre, valor: `-$${reportes.categoriaMayorGasto.monto.toFixed(2)}` },
        { descripcion: 'Categoría con mayor balance', nombre: reportes.categoriaMayorBalance.nombre, valor: `+$${reportes.categoriaMayorBalance.monto.toFixed(2)}` },
        { descripcion: 'Mes con mayor ganancia', nombre: reportes.mesMayorGanancia.nombre, valor: `+$${reportes.mesMayorGanancia.monto.toFixed(2)}` },
        { descripcion: 'Mes con mayor gasto', nombre: reportes.mesMayorGasto.nombre, valor: `-$${reportes.mesMayorGasto.monto.toFixed(2)}` },
    ];

    resumenDatos.forEach(item => {
        let fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="border px-4 py-2 border-none">${item.descripcion}</td>
            <td class="border px-4 py-2 border-none">${item.nombre}</td>
            <td class="border px-4 py-2 border-none">${item.valor}</td>
        `;
        tablaResumen.appendChild(fila);
    });

    // Mostrar las secciones de totales
    totalesCategoria.classList.remove('hidden');
    totalesMes.classList.remove('hidden');

    // Actualizar tabla de categorías
    const tablaCategorias = document.getElementById('tabla-categorias');
    tablaCategorias.innerHTML = '';

    for (let [categoria, { ganancia, gasto }] of Object.entries(reportes.categorias)) {
        let balance = ganancia - gasto;
        let fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="border px-4 py-2 border-none text-center">${categoria}</td>
            <td class="border px-4 py-2 border-none text-center">+$${ganancia.toFixed(2)}</td>
            <td class="border px-4 py-2 border-none text-center">-$${gasto.toFixed(2)}</td>
            <td class="border px-4 py-2 border-none text-center">${balance >= 0 ? '+' : ''}$${balance.toFixed(2)}</td>
        `;
        tablaCategorias.appendChild(fila);
    }

    // Actualizar tabla de meses
    const tablaMeses = document.getElementById('tabla-meses');
    tablaMeses.innerHTML = '';

    for (let [mes, { ganancia, gasto }] of Object.entries(reportes.meses)) {
        let balance = ganancia - gasto;
        let fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="border px-4 py-2 border-none text-center">${mes}</td>
            <td class="border px-4 py-2 border-none text-center">+$${ganancia.toFixed(2)}</td>
            <td class="border px-4 py-2 border-none text-center">-$${gasto.toFixed(2)}</td>
            <td class="border px-4 py-2 border-none text-center">${balance >= 0 ? '+' : ''}$${balance.toFixed(2)}</td>
        `;
        tablaMeses.appendChild(fila);
    }
}

function calcularReportes(operaciones) {
    let categorias = {};
    let meses = {};

    operaciones.forEach(op => {
        let { categoria, monto, tipo, fecha } = op;
        monto = parseFloat(monto);
        let mes = fecha.slice(0, 7); // Obtener año y mes en formato YYYY-MM

        if (!categorias[categoria]) {
            categorias[categoria] = { ganancia: 0, gasto: 0 };
        }
        if (!meses[mes]) {
            meses[mes] = { ganancia: 0, gasto: 0 };
        }

        if (tipo === 'ganancia') {
            categorias[categoria].ganancia += monto;
            meses[mes].ganancia += monto;
        } else if (tipo === 'gasto') {
            categorias[categoria].gasto += monto;
            meses[mes].gasto += monto;
        }
    });

    let categoriaMayorGanancia = { nombre: '', monto: 0 };
    let categoriaMayorGasto = { nombre: '', monto: 0 };
    let categoriaMayorBalance = { nombre: '', monto: 0 };
    let mesMayorGanancia = { nombre: '', monto: 0 };
    let mesMayorGasto = { nombre: '', monto: 0 };

    for (let [nombre, { ganancia, gasto }] of Object.entries(categorias)) {
        let balance = ganancia - gasto;
        if (ganancia > categoriaMayorGanancia.monto) {
            categoriaMayorGanancia = { nombre, monto: ganancia };
        }
        if (gasto > categoriaMayorGasto.monto) {
            categoriaMayorGasto = { nombre, monto: gasto };
        }
        if (balance > categoriaMayorBalance.monto) {
            categoriaMayorBalance = { nombre, monto: balance };
        }
    }

    for (let [nombre, { ganancia, gasto }] of Object.entries(meses)) {
        if (ganancia > mesMayorGanancia.monto) {
            mesMayorGanancia = { nombre, monto: ganancia };
        }
        if (gasto > mesMayorGasto.monto) {
            mesMayorGasto = { nombre, monto: gasto };
        }
    }

    return {
        categorias,
        meses, // Incluir los datos de los meses en el objeto de retorno
        categoriaMayorGanancia,
        categoriaMayorGasto,
        categoriaMayorBalance,
        mesMayorGanancia,
        mesMayorGasto,
    };
}

// Obtener las operaciones del localStorage y mostrar los reportes
function cargarOperacionesYMostrarReportes() {
    const operaciones_json = localStorage.getItem("operaciones");
    const operaciones_array = JSON.parse(operaciones_json) || [];
    if (operaciones_array.length > 0) {
        ocultarImgYTexto();
        mostrarReportes(operaciones_array);
    } else {
        reportesSection.classList.add('hidden');
        totalesCategoria.classList.add('hidden');
        totalesMes.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', cargarOperacionesYMostrarReportes);
