const NERO = "0x000000";

const VEL_FUOCO = 600;

const A_TERRENO = 96;
const Y_TERRENO = 624;

const X_GINO = 200;
const L_GINO = 81;
const A_GINO = 84;

const L_FUNGO = 90;
const A_FUNGO = 63;

const VEL_SALTO = 1000;
const TASTO_SALTO = PP.key_codes.SPACE;
const TASTO_FUOCO = PP.key_codes.F;

const VEL_INIZIALE = 400;
const ACCELERAZIONE = 20;

const DISTANZA_MAX = 600;

let terreno;
let gino;
let fungo;
let vel_fungo = VEL_INIZIALE;
let partita_finita = false;
let vite = 3;
let testo_fine;
let testo_rigioca;
let testo_vite;
let fuoco = null;

let img_sfondo;
let img_terreno;
let img_gino;
let img_fungo;
let img_fuoco;

function preload(s) {
    img_sfondo = PP.assets.image.load(s,
        "assets/images/sfondo.png");
    img_terreno = PP.assets.image.load(s,
        "assets/images/terreno.png");
    img_gino = PP.assets.image.load(s,
        "assets/images/gino.png");
    img_fungo = PP.assets.image.load(s,
        "assets/images/fungo.png");
    img_fuoco = PP.assets.image.load(s,
        "assets/images/fuoco.png");
}

function create(s) {
   PP.assets.image.add(s, img_sfondo, 0, 0, 0, 0);

    crea_terreno(s);
    crea_gino(s);
    crea_fungo(s);
    crea_fine(s);
    crea_vite(s);
}

function crea_terreno(s) {
    terreno = PP.assets.image.add(s, img_terreno,
        LARGHEZZA / 2, Y_TERRENO + A_TERRENO / 2, 0.5, 0.5);

    PP.physics.add(s, terreno, PP.physics.type.STATIC);
}

function crea_gino(s) {
    gino = PP.assets.image.add(s, img_gino,
        X_GINO, Y_TERRENO - A_GINO / 2, 0.5, 0.5);

    PP.physics.add(s, gino, PP.physics.type.DYNAMIC);
    PP.physics.set_collide_world_bounds(gino, true);
    PP.physics.add_collider(s, gino, terreno);
    PP.physics.set_collision_rectangle(gino, 51, 72, 15, 12);
}

function crea_fungo(s) {
    fungo = PP.assets.image.add(s, img_fungo,
        LARGHEZZA * 3 / 4,
        Y_TERRENO - A_FUNGO / 2, 0.5, 0.5);

    PP.physics.add(s, fungo, PP.physics.type.DYNAMIC);
    PP.physics.set_allow_gravity(fungo, false);
    PP.physics.set_velocity_x(fungo, -vel_fungo);
    PP.physics.add_overlap_f(s, gino, fungo, fine_partita);
}

function crea_fine(s) {
    testo_fine = PP.shapes.text_styled_add(
        s,
        LARGHEZZA / 2, ALTEZZA / 3, "GAME OVER",
        64, "Arial", "bold", NERO, null, 0.5, 0.5
    );

    testo_fine.visibility.hidden = true;

    testo_rigioca = PP.shapes.text_styled_add(
        s,
        LARGHEZZA / 2, ALTEZZA / 2, "RIGIOCA (SPAZIO)",
        40, "Arial", "bold", NERO, null, 0.5, 0.5
    );

    testo_rigioca.visibility.hidden = true;
}

function crea_vite(s) {
    testo_vite = PP.shapes.text_styled_add(
        s,
        30, 30, "VITE: " + vite,
        32, "Arial", "bold", NERO, null, 0, 0
    );
}

function aggiorna_vite() {
    testo_vite.ph_obj.setText("VITE: " + vite);
}

function update(s) {
    if (partita_finita) {
        ricomincia(s);
        return;
    }

    salta(s);
    spara(s);
    controlla_fungo();
    controlla_fuoco();
}

function salta(s) {
    if (PP.interactive.kb.is_key_just_down(s, TASTO_SALTO)
            && PP.physics.is_on_ground(gino)) {
        PP.physics.set_velocity_y(gino, -VEL_SALTO);
    }
}

function spara(s) {
    if (fuoco === null &&
            PP.interactive.kb.is_key_just_down(s, TASTO_FUOCO)) {

fuoco = PP.assets.image.add(s, img_fuoco,
    gino.geometry.body_x - 15 + L_GINO,
    gino.geometry.body_y - 12 + A_GINO / 4, 0.5, 0.5);

        PP.physics.add(s, fuoco, PP.physics.type.DYNAMIC);
        PP.physics.set_velocity_x(fuoco, VEL_FUOCO);
        PP.physics.add_collider(s, fuoco, terreno);
        PP.physics.set_bounce_y(fuoco, 1);
        PP.physics.add_overlap_f(s, fuoco, fungo, brucia);
    }
}

function controlla_fuoco() {
    if (fuoco !== null && fuoco.geometry.body_x > LARGHEZZA) {
        PP.assets.destroy(fuoco);
        fuoco = null;
    }
}

function brucia(s, a, b) {
    PP.assets.destroy(a);
    fuoco = null;
    resetta_fungo();
}

function controlla_fungo() {
    if (fungo.geometry.body_x < -L_FUNGO) {
        vel_fungo += ACCELERAZIONE;
        resetta_fungo();
    }
}

function resetta_fungo() {
    fungo.geometry.x = LARGHEZZA + L_FUNGO / 2 +
        Math.random() * DISTANZA_MAX;

    PP.physics.set_velocity_x(fungo, -vel_fungo);
}

function fine_partita(s, a, b) {
    if (partita_finita) {
        return;
    }

    vite -= 1;

    if (vite <= 0) {
        vite = 0;
        partita_finita = true;
        PP.physics.set_velocity_x(b, 0);

        testo_fine.visibility.hidden = false;
        testo_rigioca.visibility.hidden = false;
    } else {
        resetta_fungo();
    }

    aggiorna_vite();
}

function ricomincia(s) {
    if (PP.interactive.kb.is_key_just_down(s, TASTO_SALTO)) {
        partita_finita = false;
        vite = 3;
        aggiorna_vite();
        vel_fungo = VEL_INIZIALE;
        resetta_fungo();
        testo_fine.visibility.hidden = true;
        testo_rigioca.visibility.hidden = true;
    }
}

function destroy(s) {}

PP.scenes.add("gino", preload, create, update, destroy);
