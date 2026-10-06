const BIANCO = "0xFFFFFF";
const L_RACCHETTA = 20;
const A_RACCHETTA = 120;
const L_PALLINA = 24;
const MARGINE = 40;
const TASTO_PAUSA = PP.key_codes.P;
let in_pausa = false;

let racchetta_sx;
let racchetta_dx;
let pallina;
let vel_x = 6;
let vel_y = 4;
let img_sfondo;
let img_racchetta;
let img_pallina;
function preload(s) {
    img_sfondo = PP.assets.image.load(
        s, "assets/images/sfondo.png"
    );

    img_racchetta = PP.assets.image.load(
        s, "assets/images/racchetta.png"
    );

    img_pallina = PP.assets.image.load(
        s, "assets/images/pallina.png"
    );
}

function create(s) {
    PP.assets.image.add(s, img_sfondo, 0, 0, 0, 0);

    racchetta_sx = PP.assets.image.add(
        s, img_racchetta, MARGINE, ALTEZZA / 2, 0.5, 0.5
    );

    racchetta_dx = PP.assets.image.add(
        s, img_racchetta, LARGHEZZA - MARGINE, ALTEZZA / 2, 0.5, 0.5
    );

    racchetta_dx.geometry.flip_x = true;

    pallina = PP.assets.image.add(
        s, img_pallina, LARGHEZZA / 2, ALTEZZA / 2, 0.5, 0.5
    );
}

function tocca(racchetta) {
    let sinistra = racchetta.geometry.x - L_RACCHETTA / 2;
    let destra = racchetta.geometry.x + L_RACCHETTA / 2;
    let sopra = racchetta.geometry.y - A_RACCHETTA / 2;
    let sotto = racchetta.geometry.y + A_RACCHETTA / 2;

    let x = pallina.geometry.x;
    let y = pallina.geometry.y;
    let meta = L_PALLINA / 2;

    return x + meta > sinistra && x - meta < destra &&
           y + meta > sopra && y - meta < sotto;
}
function muovi_pallina() {
    pallina.geometry.x += vel_x;
    pallina.geometry.y += vel_y;

    let y = pallina.geometry.y;
    let meta = L_PALLINA / 2;

    if (y < meta || y > ALTEZZA - meta) {
        vel_y = -vel_y;
    }

    if (vel_x < 0 && tocca(racchetta_sx)) {
        vel_x = -vel_x;
    }

    if (vel_x > 0 && tocca(racchetta_dx)) {
        vel_x = -vel_x;
    }
}

function controlla_punto() {
    let x = pallina.geometry.x;

    if (x < 0 || x > LARGHEZZA) {
        pallina.geometry.x = LARGHEZZA / 2;
        pallina.geometry.y = ALTEZZA / 2;
    }
}

function update(s) {
    if (PP.interactive.kb.is_key_down(s, TASTO_PAUSA)) {
        in_pausa = !in_pausa;
    }

    if (in_pausa) {
        return;
    }

    muovi_pallina();
    controlla_punto();
}

function destroy() {}

PP.scenes.add("pong",
    preload, create, update, destroy);
