const form = document.getElementById('imc-form');
const resultado = document.getElementById('resultado');
const canvas = document.getElementById('grafico');
const ctx = canvas.getContext('2d');

const categorias = [
  { nombre: 'Bajo peso', color: '#87CEEB', rango: [0, 18.4] },
  { nombre: 'Normal', color: '#90EE90', rango: [18.5, 24.9] },
  { nombre: 'Sobrepeso', color: '#FFD700', rango: [25, 29.9] },
  { nombre: 'Obesidad', color: '#FF6347', rango: [30, 40] }
];

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const peso = parseFloat(document.getElementById('peso').value);
  const alturaCm = parseFloat(document.getElementById('altura').value);
  const alturaM = alturaCm / 100;

  const imc = peso / (alturaM * alturaM);
  const imcRedondeado = imc.toFixed(1);
  const categoria = categorias.find(cat => imc >= cat.rango[0] && imc <= cat.rango[1]) || { nombre: "Fuera de rango", color: "#ccc" };

  resultado.textContent = `Tu IMC es ${imcRedondeado} (${categoria.nombre})`;

  dibujarGrafico(imc, categoria.color);
});

function dibujarGrafico(imc, colorPunto) {

  const dpr = window.devicePixelRatio || 1;
  const displayWidth = canvas.clientWidth;
  const displayHeight = 150;

  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  const width = displayWidth;
  const height = displayHeight;
  const margin = 0;

  ctx.clearRect(0, 0, width, height);

  const totalRango = 40;
  const escalaX = width / totalRango;


  categorias.forEach(cat => {
    const inicioX = cat.rango[0] * escalaX;
    const finX = cat.rango[1] * escalaX;
    const ancho = finX - inicioX;
    const radius = Math.min(6, ancho / 4);
    const centroX = (inicioX + finX) / 2;


    ctx.fillStyle = cat.color;
    ctx.beginPath();
    ctx.moveTo(inicioX + radius, 0);
    ctx.lineTo(finX - radius, 0);
    ctx.quadraticCurveTo(finX, 0, finX, radius);
    ctx.lineTo(finX, height - radius);
    ctx.quadraticCurveTo(finX, height, finX - radius, height);
    ctx.lineTo(inicioX + radius, height);
    ctx.quadraticCurveTo(inicioX, height, inicioX, height - radius);
    ctx.lineTo(inicioX, radius);
    ctx.quadraticCurveTo(inicioX, 0, inicioX + radius, 0);
    ctx.closePath();
    ctx.fill();


    ctx.fillStyle = "#000";
    ctx.font = "600 12px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(cat.nombre, centroX, 22);


    ctx.font = "11px 'Inter', sans-serif";
    ctx.fillText(`(${cat.rango[0]} - ${cat.rango[1]})`, centroX, 40);
  });


  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();


  const x = imc * escalaX;
  const y = height / 2;

  ctx.beginPath();
  ctx.arc(x, y, 6, 0, 2 * Math.PI);
  ctx.fillStyle = colorPunto;
  ctx.fill();
  ctx.stroke();
}
