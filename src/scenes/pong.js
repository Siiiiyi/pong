const BIANCO = "0xFFFFFF";
const L_RACCHETTA = 20;
const A_RACCHETTA = 120;
const L_PALLINA = 24;
const MARGINE = 40;

const VEL_RACCHETTA = 8;
const TASTO_SU_SX = PP.key_codes.W;
const TASTO_GIU_SX = PP.key_codes.S;
const TASTO_SU_DX = PP.key_codes.UP;
const TASTO_GIU_DX = PP.key_codes.DOWN;

let punti_sx = 0;
let punti_dx = 0;
let testo_punti;
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
    testo_punti = PP.shapes.text_styled_add(
    s, LARGHEZZA / 2, 30,
    "0 - 0",
    48,
    "Arial",
    "bold",
    BIANCO,
    null,
    0.5,
    0
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
function muovi_racchetta(s, racchetta, tasto_su, tasto_giu) {
    if (PP.interactive.kb.is_key_down(s, tasto_su)) {
        racchetta.geometry.y -= VEL_RACCHETTA;
    }

    if (PP.interactive.kb.is_key_down(s, tasto_giu)) {
        racchetta.geometry.y += VEL_RACCHETTA;
    }

    let meta = A_RACCHETTA / 2;

    if (racchetta.geometry.y < meta) {
        racchetta.geometry.y = meta;
    }

    if (racchetta.geometry.y > ALTEZZA - meta) {
        racchetta.geometry.y = ALTEZZA - meta;
    }
}
function controlla_punto() {
    let x = pallina.geometry.x;

    if (x < 0) {
        punti_dx += 1;
        pallina.geometry.x = LARGHEZZA / 2;
        pallina.geometry.y = ALTEZZA / 2;
    }

    if (x > LARGHEZZA) {
        punti_sx += 1;
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

    muovi_racchetta(s, racchetta_sx, TASTO_SU_SX, TASTO_GIU_SX);
    muovi_racchetta(s, racchetta_dx, TASTO_SU_DX, TASTO_GIU_DX);

    muovi_pallina();
    controlla_punto();
    PP.shapes.text_change(
    testo_punti,
    punti_sx + " - " + punti_dx
);
}

function destroy() {}

PP.scenes.add("pong",
    preload, create, update, destroy);
