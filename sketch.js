let database;
let nomiCircuiti = [];
let vittorieCircuiti = [];



let nomiScuderie = [ 
  "McLaren", "Red Bull", "Ferrari", "Mercedes", "Lotus", "Williams", "Renault", "Benetton", "Brabham", "Tyrrell", "BRM", "Cooper", "Alfa Romeo"
];

let colonneScuderie = [];
let coloriScuderie = [
  [255, 125, 35], [35, 55, 125], [220, 35, 45], [115, 170, 175], [190, 155, 65], [40, 100, 190], [245, 205, 40], [35, 155, 110], [35, 75, 115], [50, 125, 190], [30, 115, 75], [65, 145, 85], [150, 30, 45]
];

let numeroColonne = 8;
let margine = 30;

let altezzaIntestazione = 145;
let diametroCircuito;
let altezzaCella;
let circuitoSottoMouse = null;

async function setup() {

  // CARICAMENTO DATABASE
  database = await loadTable(
    "assets/database.csv",
    ",",
    "header"
  );

  // LETTURA COLONNE SCUDERIE
  for (let s = 0; s < nomiScuderie.length; s++) {
    colonneScuderie.push(s + 1);
  }

  // LETTURA CIRCUITI
  for (let r = 0; r < database.getRowCount(); r++) {

    let nomeCircuito = database.getString(r, 0);

    if (
      nomeCircuito !== "" &&
      nomeCircuito !== "totale vittorie"
    ) {

      nomiCircuiti.push(nomeCircuito);

      let vittorie = [];

    for (let s = 0; s < nomiScuderie.length; s++) {

  let colonna = colonneScuderie[s];
  let numero = database.getNum(r, colonna);

  vittorie.push(numero);
}

      vittorieCircuiti.push(vittorie);
    }
  }

  // DIMENSIONI PAGINA
  createCanvas(windowWidth, windowHeight);

  let numeroRighe = ceil(nomiCircuiti.length / numeroColonne);

  altezzaCella = (height - altezzaIntestazione - 20) / numeroRighe;

  let larghezzaCella = (width - margine * 2) / numeroColonne;

  diametroCircuito = min(
    70,
    altezzaCella * 0.52,
    larghezzaCella * 0.38
  );

 
}


  

// DISEGNO GENERALE
function draw() {
    circuitoSottoMouse = null;

  background(230, 230, 230);

  disegnaTitolo();
  disegnaLegenda();
  disegnaGriglia();
}


// TITOLO E DESCRIZIONE
function disegnaTitolo() {

  noStroke();
  textAlign(LEFT, TOP);

  fill(20);
  textSize(27);
  textStyle(BOLD);

  text("CIRCUITI DI FORMULA 1", margine, 35);

  textSize(19);
  textStyle(NORMAL);

  text("E le scuderie migliori", margine, 70);

  textSize(11);
  fill(90);

  text(
    "77 circuiti e le scuderie con almeno 10 vittorie in carriera",
    margine,
    105
  );
}


// LEGENDA SCUDERIE
function disegnaLegenda() {

  let larghezzaRiquadro = min(490, width * 0.48);
  let altezzaRiquadro = 112;

  let xRiquadro = width - margine - larghezzaRiquadro;
  let yRiquadro = 20;

  // Riquadro esterno
  noFill();
  stroke(40);
  strokeWeight(1);

  rect(
    xRiquadro,
    yRiquadro,
    larghezzaRiquadro,
    altezzaRiquadro
  );

  // Titolo della legenda
  noStroke();
  fill(30);
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);

  text("SCUDERIE", xRiquadro + 14, yRiquadro + 10);

  // Voci della legenda
  textStyle(NORMAL);
  textSize(10);

  for (let i = 0; i < nomiScuderie.length; i++) {

    let colonna = floor(i / 7);
    let riga = i % 7;

    let x = xRiquadro + 14 + colonna * 145;
    let y = yRiquadro + 34 + riga * 11;
   

    let colore = coloriScuderie[i];

    noStroke();
    fill(colore[0], colore[1], colore[2]);

    circle(x + 4, y + 4, 7);

    fill(35);
    textAlign(LEFT, CENTER);

    text(nomiScuderie[i], x + 13, y + 4);
  }
}


// GRIGLIA DEI CIRCUITI
function disegnaGriglia() {

  let larghezzaCella = (width - margine * 2) / numeroColonne;

  for (let i = 0; i < nomiCircuiti.length; i++) {

    let colonna = i % numeroColonne;
    let riga = floor(i / numeroColonne);

    let x = margine + colonna * larghezzaCella + larghezzaCella / 2;

    let y = altezzaIntestazione + riga * altezzaCella
            + altezzaCella / 2;

    // Controllo se il mouse è sopra un circuito
if (
  mouseX >= x - diametroCircuito / 2 &&
  mouseX <= x + diametroCircuito / 2 &&
  mouseY >= y - diametroCircuito / 2 &&
  mouseY <= y + diametroCircuito / 2
) {
  circuitoSottoMouse = nomiCircuiti[i];
}

    // Cerchio esterno
    noFill();
    stroke(25);
    strokeWeight(1);

    circle(x, y, diametroCircuito);

    // Vittorie delle scuderie
    disegnaVittorie(i, x, y);

    // Nome del circuito
    noStroke();
    fill(30);

    textAlign(CENTER, TOP);
    textStyle(NORMAL);

    textSize(min(10, altezzaCella * 0.16));

    text(
      nomiCircuiti[i],
      x - larghezzaCella / 2 + 3,
      y + diametroCircuito / 2 + 3,
      larghezzaCella - 6,
      altezzaCella - diametroCircuito / 2 - 5
    );
  }
    if (circuitoSottoMouse !== null) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}


// CERCHI COLORATI E VITTORIE
function disegnaVittorie(indiceCircuito, centroX, centroY) {

  for (let s = 0; s < nomiScuderie.length; s++) {

    let numeroVittorie = vittorieCircuiti[indiceCircuito][s];

    if (numeroVittorie > 0) {

      let colore = coloriScuderie[s];

      // Posizione del cerchio della scuderia
      let colonna = s % 4;
      let riga = floor(s / 4);

      let offsetX = (colonna - 1.5) * 7;
      let offsetY = (riga - 1.5) * 7;

      let x = centroX + offsetX;
      let y = centroY + offsetY;

      // Dimensione proporzionale alle vittorie
      let raggio = 2 + sqrt(numeroVittorie) * 0.65;

      // Cerchio trasparente della scuderia
      fill(colore[0], colore[1], colore[2], 55);
      stroke(colore[0], colore[1], colore[2]);
      strokeWeight(0.8);

      circle(x, y, 2);

      // Pallini: uno per ogni vittoria
      noStroke();
      fill(colore[0], colore[1], colore[2]);

      for (let v = 0; v < numeroVittorie; v++) {

        let angolo = v * 137.5;



        //creo una sovrapposizione a "spirale" per ingrandire caiscun pallino
        let distanza = numeroVittorie === 1
          ? 0
          : sqrt(v / numeroVittorie) * (raggio - 3);

        let px = x + cos(angolo) * distanza;
        let py = y + sin(angolo) * distanza;

        circle(px, py, 3.5);
      }
    }
  }
}
function mousePressed() {

  // Creo il nuovo URL
  let newURL = "detail.html?circuito=" + circuitoSottoMouse;

  console.log(newURL);

  // Apro la pagina nella stessa scheda
  if (circuitoSottoMouse !== null) {
    window.location.href = newURL;
  }
}