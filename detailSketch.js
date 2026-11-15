
let database;
let selectedCircuito;

let nomiScuderie = [
  "McLaren", "Red Bull", "Ferrari", "Mercedes",
  "Lotus", "Williams", "Renault", "Benetton",
  "Brabham", "Tyrrell", "BRM", "Cooper", "Alfa Romeo"
];

let coloriScuderie = [
  [255, 125, 35], [35, 55, 125], [220, 35, 45],
  [115, 170, 175], [190, 155, 65], [40, 100, 190],
  [245, 205, 40], [35, 155, 110], [35, 75, 115],
  [50, 125, 190], [30, 115, 75], [65, 145, 85],
  [150, 30, 45]
];

async function setup() {

  database = await loadTable(
    "assets/database.csv",
    ",",
    "header"
  );

  let params = getURLParams();
  selectedCircuito = decodeURIComponent(params.circuito);

  createCanvas(windowWidth, windowHeight);
}


function draw() {

  background(230, 230, 230);

  let circuitoRow = null;

  // CERCO IL CIRCUITO NEL DATABASE
  for (let r = 0; r < database.getRowCount(); r++) {

    if (database.get(r, 0) === selectedCircuito) {
      circuitoRow = r;
    }
  }

  if (circuitoRow !== null) {

    textAlign(CENTER);
    textSize(28);
    fill(30);
    text(selectedCircuito, width / 2, 60);

    let massimoVittorie = 0;

    // CALCOLO IL NUMERO MASSIMO DI VITTORIE
    for (let i = 0; i < nomiScuderie.length; i++) {

      let vittorie = database.getNum(circuitoRow, i + 1);

      if (vittorie > massimoVittorie) {
        massimoVittorie = vittorie;
      }
    }

    let vittorieScuderie = [];

    let nomiScuderieOrdinate = [];
    let coloriScuderieOrdinate = [];

    // COPIO NOMI E COLORI DELLE SCUDERIE
    for (let i = 0; i < nomiScuderie.length; i++) {

      nomiScuderieOrdinate.push(nomiScuderie[i]);
      coloriScuderieOrdinate.push(coloriScuderie[i]);
    }

    // LEGGO LE VITTORIE
    for (let i = 0; i < nomiScuderie.length; i++) {

      let vittorie = database.getNum(circuitoRow, i + 1);

      vittorieScuderie.push(vittorie);
    }

    // ORDINO LE SCUDERIE PER NUMERO DI VITTORIE
    for (let i = 0; i < nomiScuderie.length; i++) {

      for (let j = i + 1; j < nomiScuderie.length; j++) {

        if (vittorieScuderie[j] > vittorieScuderie[i]) {

          let vittoriaTemporanea = vittorieScuderie[i];
          vittorieScuderie[i] = vittorieScuderie[j];
          vittorieScuderie[j] = vittoriaTemporanea;

          let nomeTemporaneo = nomiScuderieOrdinate[i];
          nomiScuderieOrdinate[i] = nomiScuderieOrdinate[j];
          nomiScuderieOrdinate[j] = nomeTemporaneo;

          let coloreTemporaneo = coloriScuderieOrdinate[i];
          coloriScuderieOrdinate[i] = coloriScuderieOrdinate[j];
          coloriScuderieOrdinate[j] = coloreTemporaneo;
        }
      }
    }

    // DIMENSIONI DELLE BARRE
    let larghezzaMassima = width * 0.55;
    let altezzaBarra = 22;
    let spazioBarre = 42;

    // DISEGNO LE BARRE
    for (let i = 0; i < nomiScuderie.length; i++) {

      let vittorie = vittorieScuderie[i];

      let x = 180;
      let y = 120 + i * spazioBarre;

      let larghezzaBarra = 0;

      if (massimoVittorie > 0) {
        larghezzaBarra = vittorie / massimoVittorie * larghezzaMassima;
      }

      fill(30);
      textAlign(RIGHT, CENTER);
      textSize(14);
      text(nomiScuderieOrdinate[i], x - 15, y + altezzaBarra / 2);

      fill(coloriScuderieOrdinate[i]);
      noStroke();
      rect(x, y, larghezzaBarra, altezzaBarra);

      fill(30);
      textAlign(LEFT, CENTER);
      text(vittorie, x + larghezzaBarra + 10, y + altezzaBarra / 2);
    }

    // PULSANTE PER TORNARE ALLA OVERVIEW
    fill(50);
    rect(width - 210, height - 55, 180, 35);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(14);
    text("Torna alla Overview", width - 120, height - 37);

  } else {

    textAlign(CENTER);
    text("Circuito non trovato", width / 2, 100);
  }
}


// RITORNO ALLA OVERVIEW
function mousePressed() {

  if (
    mouseX >= width - 210 &&
    mouseX <= width - 30 &&
    mouseY >= height - 55 &&
    mouseY <= height - 20
  ) {
    window.location.href = "index.html";
  }
}
