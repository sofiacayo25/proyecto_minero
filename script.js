const form = document.getElementById('formMineria');
const resultado = document.getElementById('resultado');
const step1 = document.getElementById('step1-result');
const step2 = document.getElementById('step2-result');
const step3 = document.getElementById('step3-result');

const camposTMH = document.querySelectorAll('.campo-tmh');
const radiosTipoReserva = document.querySelectorAll('input[name="tipo-reserva"]');
const checkboxEsteril = document.getElementById('activar-esteril');
const inputEsteril1 = document.getElementById('esteril1');
const inputEsteril2 = document.getElementById('esteril2');
const checkboxDilucion = document.getElementById('activar-dilucion');
const inputDilucion = document.getElementById('dilucion');

function validarNumeroMayorOIgualCero(valor) {
    return /^\d*\.?\d+$/.test(valor.trim()) && Number(valor) >= 0;
}

function toggleCampoEsteril() {
    const habilitado = checkboxEsteril.checked;
    inputEsteril1.disabled = !habilitado;
    inputEsteril2.disabled = !habilitado;

    if (!habilitado) {
        inputEsteril1.value = '';
        inputEsteril1.classList.remove('invalid');
        const error1 = inputEsteril1.parentElement.querySelector('.error-message');
        if (error1) error1.classList.remove('visible');

        inputEsteril2.value = '';
        inputEsteril2.classList.remove('invalid');
        const error2 = inputEsteril2.parentElement.querySelector('.error-message');
        if (error2) error2.classList.remove('visible');
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
    let vidaUtil = Math.round(total / produccionFinoXyear);
    step2.textContent = `Resultado: ${vidaUtil} años`;

    if(radiosTipoReserva[1].checked) {
        checkboxDilucion.checked ? step3.textContent = `Resultado: ${(reserva * (1 - humedad / 100)) / vidaUtil } TPA (soluble) con dilucion`
        : step3.textContent = `Resultado: ${reserva / vidaUtil } TPA (TMH) sin dilucion`;
    } else {
        step3.textContent = `Resultado: ${reserva / vidaUtil } TPA`;
    }
    // if (checkboxEsteril.checked) {
    //     step3.textContent = `Resultado: ${produccionFinoXyear / ((leyMedia / 100) * (recuperacion / 100) * (1 - humedad / 100))} TME/año`;
    // } 
    // if(radiosTipoReserva[1].checked && checkboxDilucion.checked) {
    //     step3.textContent = `Resultado: es soluble con dilucion`;
    // }
    // if(radiosTipoReserva[1].checked && !checkboxDilucion.checked) {
    //     step3.textContent = `Resultado: es TMH sin dilucion`;
    // }
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
