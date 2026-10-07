const form = document.getElementById('formMineria');
const resultado = document.getElementById('resultado');
const step1 = document.getElementById('step1-result');
const step2 = document.getElementById('step2-result');
const step3 = document.getElementById('step3-result');

const camposTMH = document.querySelectorAll('.campo-tmh');
const radiosTipoReserva = document.querySelectorAll('input[name="tipo-reserva"]');
const checkboxEsteril = document.getElementById('activar-esteril');
const inputEsteril = document.getElementById('esteril');
const checkboxDilucion = document.getElementById('activar-dilucion');
const inputDilucion = document.getElementById('dilucion');

function validarNumeroMayorOIgualCero(valor) {
    return /^\d*\.?\d+$/.test(valor.trim()) && Number(valor) >= 0;
}

function toggleCampoEsteril() {
    const habilitado = checkboxEsteril.checked;
    inputEsteril.disabled = !habilitado;

    if (!habilitado) {
        inputEsteril.value = '';
        inputEsteril.classList.remove('invalid');
        const error = inputEsteril.parentElement.querySelector('.error-message');
        if (error) error.classList.remove('visible');
    }
}

function toggleCampoDilucion() {
    const habilitado = checkboxDilucion.checked;
    inputDilucion.disabled = !habilitado;

    if (!habilitado) {
        inputDilucion.value = '';
        inputDilucion.classList.remove('invalid');
        const error = inputDilucion.parentElement.querySelector('.error-message');
        if (error) error.classList.remove('visible');
    }
}

function toggleCamposTMH() {
    const seleccion = document.querySelector('input[name="tipo-reserva"]:checked');
    const esTMH = seleccion && seleccion.value === 'TMH';

    camposTMH.forEach((campo) => {
        const input = campo.querySelector('input');
        const error = campo.querySelector('.error-message');

        campo.style.display = esTMH ? 'flex' : 'none';
        input.disabled = !esTMH;

        if (!esTMH) {
            input.value = '';
            input.classList.remove('invalid');
            if (error) error.classList.remove('visible');
        }
    });
}

function obtenerValoresNumericos() {
    const campos = Array.from(form.querySelectorAll('input[type="text"]:not(:disabled)'));
    const valores = [];
    let formularioValido = true;

    campos.forEach((input) => {
        const valor = input.value.trim();
        const error = input.parentElement.querySelector('.error-message');

        if (!validarNumeroMayorOIgualCero(valor)) {
            formularioValido = false;
            input.classList.add('invalid');
            if (error) error.classList.add('visible');
            return;
        }

        input.classList.remove('invalid');
        if (error) error.classList.remove('visible');
        valores.push(Number(valor));
    });

    return { valores, formularioValido };
}

function multiplicarTodosLosCampos() {
    const { valores, formularioValido } = obtenerValoresNumericos();

    if (!formularioValido || valores.length === 0) {
        resultado.textContent = 'Todos los campos deben ser números mayores o iguales a cero.';
        resultado.classList.add('visible');
        return;
    }

    const reserva = Number(document.getElementById('reserva').value);
    const leyMedia = Number(document.getElementById('ley-media').value);
    const leyCorte = Number(document.getElementById('ley-corte').value);
    const recuperacion = Number(document.getElementById('recuperacion').value);
    const humedad = Number(document.getElementById('humedad').value);
    const produccionFinoXyear = Number(document.getElementById('produccion-fino').value);
    const solubilidadInput = document.getElementById('solubilidad');

    let solubilidad = 1;
    if (solubilidadInput && solubilidadInput.value.trim() !== '') {
        solubilidad = Number(solubilidadInput.value);
    }

    const total = reserva * (leyMedia / 100) * (recuperacion / 100) * (1 - humedad / 100) * solubilidad;

    step1.textContent = `Resultado: ${total} TMF`;
    step2.textContent = `Resultado: ${total / produccionFinoXyear} años`;
    step3.textContent = checkoutEsteril.checked ? `Resultado: ${total / ((leyMedia / 100) * (recuperacion / 100) * (1 - humedad / 100))} TMF` : '';
    resultado.classList.add('visible');
}

radiosTipoReserva.forEach((radio) => {
    radio.addEventListener('change', toggleCamposTMH);
});

checkboxEsteril.addEventListener('change', toggleCampoEsteril);
checkboxDilucion.addEventListener('change', toggleCampoDilucion);

toggleCamposTMH();
toggleCampoEsteril();
toggleCampoDilucion();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    multiplicarTodosLosCampos();
});
