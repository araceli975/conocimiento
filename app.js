const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result');

let preguntasAleatorias = [];
let preguntaActual = 0;
let puntaje = 0;
const preguntasPorRonda = 5;
let ronda = 1;

function cargarPreguntasAleatorias() {
  preguntasAleatorias = [];
  const copia = [...preguntas];
  while (copia.length > 0) {
    const index = Math.floor(Math.random() * copia.length);
    preguntasAleatorias.push(copia.splice(index, 1)[0]);
  }
}

function mostrarPregunta() {
  // Calculamos los índices para la ronda actual
  const inicioRonda = (ronda - 1) * preguntasPorRonda;
  const finRonda = ronda * preguntasPorRonda;

  // Si ya pasamos la ronda actual o nos pasamos del total, mostramos resultados
  if (preguntaActual >= finRonda || preguntaActual >= preguntasAleatorias.length) {
    Swal.fire({
      icon: 'info',
      title: `Ronda ${ronda} finalizada`,
      html: `Puntaje: <b>${puntaje}</b> de <b>${preguntasPorRonda * 9}</b> puntos.`,
      confirmButtonText: 'Iniciar siguiente estudiante'
    }).then(() => {
      // Reiniciamos para otro estudiante
      ronda = 1;
      puntaje = 0;
      preguntaActual = 0;
      cargarPreguntasAleatorias();
      mostrarPregunta();
    });
    return;
  }

  const pregunta = preguntasAleatorias[preguntaActual];
  quizContainer.innerHTML = '';

  const card = document.createElement('div');
  card.classList.add('card');

  const header = document.createElement('h3');
  header.textContent = `Pregunta ${ (preguntaActual % preguntasPorRonda) + 1 } de ${preguntasPorRonda} (ID: ${pregunta.id})`;
  card.appendChild(header);

  const p = document.createElement('p');
  p.textContent = pregunta.pregunta;
  card.appendChild(p);

  if (pregunta.tipo === 'autocompletar') {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Escribe tu respuesta...';
    card.appendChild(input);

    const btn = document.createElement('button');
    btn.textContent = 'Enviar';
    card.appendChild(btn);

    btn.onclick = () => verificarRespuesta(input.value.trim());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        verificarRespuesta(input.value.trim());
      }
    });

  } else if (pregunta.tipo === 'opcion_multiple') {
    pregunta.opciones.forEach(opcion => {
      const btn = document.createElement('button');
      btn.textContent = opcion;
      btn.onclick = () => verificarRespuesta(opcion);
      card.appendChild(btn);
    });
  }

  quizContainer.appendChild(card);
}

function verificarRespuesta(respuestaUsuario) {
  const pregunta = preguntasAleatorias[preguntaActual];
  const esCorrecta = respuestaUsuario.toLowerCase() === pregunta.respuesta.toLowerCase();

  if (esCorrecta) {
    puntaje += 9;
    Swal.fire({
      icon: 'success',
      title: '¡EXCELENTE!',
      text: 'Sigue asi.',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      preguntaActual++;
      mostrarPregunta();
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'fallaste',
      html: `La respuesta correcta era: <b>${pregunta.respuesta}</b>`,
      confirmButtonText: 'Continuar'
    }).then(() => {
      preguntaActual++;
      mostrarPregunta();
    });
  }
}

// Inicialización
cargarPreguntasAleatorias();
mostrarPregunta();
