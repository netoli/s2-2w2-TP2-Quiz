/**
 * @description Ce ficier contient les déclencheurs d'événement permettant 
 * d'interagir avec le DOM, la sauvegarde de données et leurs manipulations
 * pour retouner une valeur en fonction de certaines conditions  
 * @author Vernet Olivier
 */

// ===============DÉCLARATION & SÉLECTIONS DES ÉLÉMENTS HTML===============
// La surface de manipulation entière
let sufaceGlobale = document.documentElement;

// Les défférents mains qui s'afficheront
let leMain1 = document.querySelector("#accueil");
let leMain2 = document.querySelector("#formulaire");
let leMain3 = document.querySelector("#questionnaire");
let leMain4 = document.querySelector("#reussite");
let leMain5 = document.querySelector("#echec");

// Les défférents boutons qui ont un écouteur d'événement
let leBtnEnrInfos = document.querySelector("footer > .btn-enr");
let leBtnDbtQuestionnaire = document.querySelector("footer > .btn-dbt-quiz");
let leBtnTerminer = document.querySelector("footer > .btn-terminer");
let leBtnRessayer = document.querySelector("footer > .btn-n-essaie");

// Le curseur personnalisé
let leCurseur = document.querySelector(".curseur");

// Le tableau des réponses aux questions
const reponses = ["b", "d", "c", "c", "a", "a", "d", "c", "b"];

// Le tableau des sources audio en cas de succès ou échec
const audio = {
    succes: new Audio('assets/sons/succes.mp3'),
    echec: new Audio('assets/sons/echec.mp3')
};

// Les éléments input pour une interaction différente avec le curseur personnalisé
let lesInputsTxt = document.querySelectorAll('#formulaire input[type="text"], #formulaire input[type="email"], #formulaire textarea');
let lesInputsRadio = document.querySelectorAll('#formulaire input[type="radio"]');
let lesSelections = document.querySelectorAll("#formulaire select");
let leCalendrier = document.querySelector('#formulaire input[type="date"]');

// L'élément HTML qui recueille le tableau de lettre contenant dans le mot questionnaire
let leMotQuestionnaire = document.querySelector("#accueil > .motQuestionnaire");


// ===============L'ATTRIBUTION DES ÉCOUTEURS D'ÉVÉNEMENT ===============
//Pour détecter le mouvement de la souris dans la fenêtre
window.addEventListener('mousemove', bougerCurseur);

// Pour des animations lors du défilement des contenus du main contenant le questionnaire
document.addEventListener("scroll", animationDefilement);

// Pour l'interaction du curseur personnalisé avec les boutons
leBtnEnrInfos.addEventListener('mouseover', changerCurseurBouton);
leBtnEnrInfos.addEventListener('mouseout', changerCurseurBouton);

leBtnDbtQuestionnaire.addEventListener('mouseover', changerCurseurBouton);
leBtnDbtQuestionnaire.addEventListener('mouseout', changerCurseurBouton);
leBtnDbtQuestionnaire.classList.add('inactif');

leBtnTerminer.addEventListener('mouseover', changerCurseurBtnTerminer);
leBtnTerminer.addEventListener('mouseout', changerCurseurBtnTerminer);

leBtnRessayer.addEventListener('mouseover', changerCurseurBtnRessayer);
leBtnRessayer.addEventListener('mouseout', changerCurseurBtnRessayer);

// Pour l'interaction du curseur personnalisé et aux entrés de valeurs avec les éléments 
// input du main contenant le formulaire
lesInputsTxt.forEach(input => {
    input.addEventListener('mouseover', changerCurseurEcrire);
    input.addEventListener('mouseout', changerCurseurEcrire);
    input.addEventListener('input', verifierFormulaireComplet);
});

lesInputsRadio.forEach(input =>{
    input.addEventListener('mouseover', changerCurseurRadio);
    input.addEventListener('mouseout', changerCurseurRadio);
    input.addEventListener('change', verifierFormulaireComplet);
});

lesSelections.forEach(select =>{
    select.addEventListener('mouseover', changerCurseurSelect);
    select.addEventListener('mouseout', changerCurseurSelect);
    select.addEventListener('change', verifierFormulaireComplet);
});

leCalendrier.addEventListener('mouseover', changerCurseurCalendrier);
leCalendrier.addEventListener('mouseout', changerCurseurCalendrier);
leCalendrier.addEventListener('change', verifierFormulaireComplet);

// Pour les changements survenus dans le DOM lors de clique sur les boutons
//afin d'engendrer des changements
leBtnEnrInfos.addEventListener('click', function(){
    enleverContenusMain();
    afficherFormulaireEnrInfos();
    afficherBtnDbtQuestionnaire();
});
leBtnDbtQuestionnaire.addEventListener('click', function(){
    enregistrerInfos();
    enleverFormulaire();
    afficherQuestionnaire();
    afficherBtnTerminer();
});

// Ici, la grande différence, c'est que les fonctionnalités attribuées à ce bouton
// sont directement dans l'écouteur d'événement au lieu de juste rappeler les fonctions
leBtnTerminer.addEventListener('dblclick', function(){
    console.log("Clic détecté !");

    // Récupérer les informations de l'utilisateur depuis le localStorage
    const infos = JSON.parse(localStorage.getItem('infosUtilisateur')) || {};
    let prenom = infos.prenom || '';  // Si pas trouvé, on met une valeur par défaut
    let nom = infos.nom || '';        // Même chose pour le nom

    // Si prénom et nom sont vides, il faut les récupérer depuis le formulaire
    if (!prenom || !nom) {
        const prenomInput = document.querySelector('#prenom');
        const nomInput = document.querySelector('#nom');

        if (prenomInput && nomInput) {
            // Si les champs prénom et nom sont dans le formulaire, récupère leurs valeurs
            prenom = prenomInput.value.trim();
            nom = nomInput.value.trim();
        }
    }

    // Calculer le score à partir des réponses sélectionnées
    let resultat = 0;

    // On parcourt chaque question
    for (let i = 0; i < reponses.length; i++) {
        const question = document.querySelector(`input[name="q${i + 1}"]:checked`); // Récupère la réponse sélectionnée
        if (question && question.value === reponses[i]) { // Si la réponse est correcte
            resultat++;
        }
    }
    // Cacher le questionnaire et afficher le résultat
    leMain3.style.display = "none"; 

    // Appeler la fonction afficherResultat avec les bons paramètres
    afficherResultat(prenom, nom, resultat);

    let verifResultat = (resultat >= 7) ? 'succes' : 'echec';

    const son = audio[verifResultat];
    if (son && son.readyState >= 2) {
        son.pause();
        son.currentTime = 0;
        son.play();
    }

    // Afficher le bouton "Réessayer"
    leBtnTerminer.style.display = "none";
    leBtnRessayer.style.display = "flex";
});

// C'est un peu comme leBtnTerminer
leBtnRessayer.addEventListener('dblclick', function(){
    reinitialiseQuestionnaire();
    leBtnRessayer.style.display = 'none';
    leBtnTerminer.style.display = 'flex';
    
    document.querySelector('.q1').classList.add('visible');
    document.querySelector('.q2').classList.add('visible');
    document.querySelector('.q3').classList.add('visible');
})


// On place le mot "QUESTIONNAIRE" lettre par lettre dans un div pour l'afficher dans
// l'interface d'accueil avec un boucle "for"
let divParLettre;
const angleAleatoire = Math.random() * 90; 
//Ici, c'est un nombre aléatoire qui sera donné sur 90,
// pour servir d'angle par l'intermédiaire d'attribution de style css 
// à un du DOM HTML
for (uneLettre of "QUESTIONNAIRE"){
	divParLettre = document.createElement("div");
	divParLettre.innerHTML = uneLettre;
	divParLettre.classList.add("motQuestionnaire");
	divParLettre.style.animationDelay = Math.random() * 3 + "s"; 
    //Ici, un délai aléatoire d'apparition est attribué à chaque élément du tableau "QUESTIONNAIRE"
    divParLettre.style.transform = `rotate(${angleAleatoire}deg)`;
    // C'est ici le nombre aléatoire se voit utiliser comme un angle
	leMotQuestionnaire.append(divParLettre);
    // Les divs créés pour chaque lettre seront un enfant de la portion donné dans le DOM
}


// ===============LES FONCTIONS EXÉCUTÉ LORS D'ÉVÉNEMENT SUR LE DOM===============

/**
 * FONCTION verifierFormulaireComplet ()
 * @description Cette fonction permet de vérifier que les différents
 * qu'il y a eu entré de text dans les inputs (text, courriel, date),
 * textarea, et qu'il y a bien eu sélection sur les inputs de type radio
 * et les sélections
 * Cela permet de s'assurer que le formulaire est bien complété
 * @param void
 * @returns void
 */
function verifierFormulaireComplet() {
    let champRempli = true;

    // Vérifie les champs texte, courriel et textarea
    // .trim permet de vérifier qu'il n'y pas d'espace vide
    lesInputsTxt.forEach(input => {
        if (input.value.trim() === '') {
            champRempli = false;
        }
    });

    // Vérifie les boutons radio (au moins un sélectionné)
    const radioCoche = document.querySelector('input[name="sexe"]:checked');
    if (!radioCoche) {
        champRempli = false;
    }

    // Vérifie les sélections
    lesSelections.forEach(select => {
        if (select.selectedIndex === 0) {
            champRempli = false;
        }
    });

    // Vérifie la date
    if (!leCalendrier.value.trim()) {
        champRempli = false;
    }

    // Active ou désactive le bouton
    if (champRempli) {
        leBtnDbtQuestionnaire.classList.remove('inactif');
    } else {
        leBtnDbtQuestionnaire.classList.add('inactif');
    }
}




/**
 * Les FONCTIONS bougerCurseur(event),
 * changerCurseurBouton(event),
 * changerCurseurBtnTerminer(event),
 * changerCurseurBtnRessayer(event),
 * changerCurseurEcrire(event),
 * changerCurseurRadio(event),
 * changerCurseurCalendrier(event)
 * @description Permet de modifier la forme du curseur personnalisé lorsqu'on survole un "bouton"
 * ou un input de type :text, radio, date, email et textarea
 * @param {Event} event : objet Event de l'événement en cours 
 */

// C'est pour la détection de l'endroit où se trouve le curseur dans la fenêtre
function bougerCurseur(event) {
    // Modifiez les valeurs des propriétés personnalisées définis sur la racine 
    // du document HTML
    sufaceGlobale.style.setProperty('--mouse-x', event.clientX + 'px');
    sufaceGlobale.style.setProperty('--mouse-y', event.clientY + 'px');
}


//C'est pour une forme du curseur lors de survole des boutons par défaut
 function changerCurseurBouton(event) {
    //En fonction de l'événement, le curseur prend telle forme ou pas
    if (event.type === 'mouseover') {
        leCurseur.classList.add('formeCurseurBtn');
    } else {
        leCurseur.classList.remove('formeCurseurBtn');
    }
}

//Pour les changements de forme du curseur pour ces boutons spécifiquement
 function changerCurseurBtnTerminer(event) {
    if (event.type === 'mouseover') {
        leCurseur.classList.add('formeCurseurBtnTerminer');
        leCurseur.classList.add('formeCurseurBtn');
    } else {
        leCurseur.classList.remove('formeCurseurBtnTerminer');
        leCurseur.classList.remove('formeCurseurBtn');
    }
}
function changerCurseurBtnRessayer(event){
    if (event.type === 'mouseover') {
        leCurseur.classList.add('formeCurseurBtnTerminer');
        leCurseur.classList.add('formeCurseurBtn');
    } else {
        leCurseur.classList.remove('formeCurseurBtnTerminer');
        leCurseur.classList.remove('formeCurseurBtn');
    }
}

//Pour les inputs de type text
 function changerCurseurEcrire(event) {
    if (event.type === 'mouseover') {
        leCurseur.classList.add('formeCurseurEcrire');
    } else {
        leCurseur.classList.remove('formeCurseurEcrire');
    }
}

//Pour les inputs de type radio
 function changerCurseurRadio(event) {
    if (event.type === 'mouseover') {
        leCurseur.classList.add('formeCurseurRadio');
    } else {
        leCurseur.classList.remove('formeCurseurRadio');
    }
}

//Pour les options de sélection
 function changerCurseurSelect(event) {
    if (event.type === 'mouseover') {
        leCurseur.classList.add('formeCurseurSelect');
    } else {
        leCurseur.classList.remove('formeCurseurSelect');
    }
}

// Pour les inputs de type date
 function changerCurseurCalendrier(event) {
    if (event.type === 'mouseover') {
        leCurseur.classList.add('formeCurseurCalendrier');
    } else {
        leCurseur.classList.remove('formeCurseurCalendrier');
    }
}


/**
 * FONCTION animationDeDefilement ()
 * @description Cette fonction permet de faire apparaitre des éléments
 * dans le main questionnaire lors de défilement arrivé à une certaine
 * hauteur intérieur de la fenêtre
 * @param void
 * @returns void
 */
function animationDefilement() {
    let hauteurViewport = window.innerHeight;

    let lesQuestions = document.querySelectorAll(".q1, .q2, .q3, .q4, .q5, .q6, .q7, .q8, .q9");

    for (let uneQuestion of lesQuestions) {
        let position = uneQuestion.getBoundingClientRect();

        if (position.top < hauteurViewport - 10) { // visible avec marge
            uneQuestion.classList.add("visible");
        }
    }
}

/**
 * FONCTION enleverContenusMain ()
 * @description Cette fonction d'enlever les enfants du main
 * de la page accueil et de l'enlever complètement
 * @param void
 * @returns void
 */
function enleverContenusMain() {
    for (let i = leMain1.children.length - 1; i >=0; i--){
        leMain1.removeChild(leMain1.children[i]);
    }
    leMain1.remove();
	leBtnEnrInfos.removeEventListener("click", enleverContenusMain);
	leBtnEnrInfos.remove();
}

/**
 * FONCTION afficherFormulaireEnrInfos ()
 * @description Cette fonction permet d'afficher le main contenant
 * le formulaire lors du clique sur le bouton leBtnEnrInfos
 * @param void
 * @returns void
 */
function afficherFormulaireEnrInfos() {
    leMain2.style.display = "flex";
}

/**
 * FONCTION enregistrerInfos ()
 * @description Cette fonction permet d'enregistrer les valeur entrée
 * dans les éléments inputs du formulaire
 * @param void
 * @returns void
 */
function enregistrerInfos(){
    const infos = {
        nom: document.querySelector('#nom').value.trim(),
        prenom: document.querySelector('#prenom').value.trim(),
        sexe: document.querySelector('input[name="sexe"]:checked')?.id || '',
        dateNaissance: document.querySelector('#date-naissance').value.trim(),
        courriel: document.querySelector('#courriel').value.trim(),
        occupation: document.querySelector('#typesOccupation').value.trim(),
        niveauEtude: document.querySelector('#etude').value.trim(),
        programmeEtude: document.querySelector('#prog-etude').value.trim(),
        description: document.querySelector('#qui').value.trim()
    };

    // Sauvegarde dans le localStorage
    localStorage.setItem('infosUtilisateur', JSON.stringify(infos));
}

/**
 * FONCTION enleverFormulaire ()
 * @description Cette fonction permet d'enlever le formulaire
 * pour laisser la place au questionnaire et d'enlever 
 * un écouteur d'événement
 * @param void
 * @returns void
 */
function enleverFormulaire(){
    leBtnDbtQuestionnaire.removeEventListener("click", afficherQuestionnaire);
	leBtnDbtQuestionnaire.remove();
    leMain2.remove();
}

/**
 * FONCTION reinitialiserQuestionnaire ()
 * @description Cette fonction permet d'afficher le main du questionnaire
 * et les 3 premières questions parce que l'événement scroll les affecte;
 * ici, on les fait déjà apparaitre
 * @param void
 * @returns void
 */
function afficherQuestionnaire() {
    leMain2.style.display = "none"; // on cache le formulaire
    leMain3.style.display = "flex"; // on affiche le questionnaire

    document.querySelector('.q1').classList.add('visible');
    document.querySelector('.q2').classList.add('visible');
    document.querySelector('.q3').classList.add('visible');
}

/**
 * FONCTION reinitialiserQuestionnaire ()
 * @description Cette fonction permet de remettre d'enlever les éléments (reponses)
 * coché dans le questionnaire
 * @param void
 * @returns void
 */
function reinitialiseQuestionnaire() {
    const btnRadio = document.querySelectorAll('#questionnaire input[type="radio"]');
    btnRadio.forEach(reponse => reponse.checked = false);

    const questions = document.querySelectorAll('.q1, .q2, .q3, .q4, .q5, .q6, .q7, .q8, .q9');
    questions.forEach(questions => questions.classList.remove('visible'));

    leMain4.style.display = 'none';
    leMain5.style.display = 'none';
    leMain3.style.display = 'flex';

    leBtnRessayer.style.display = 'none';
    leBtnTerminer.style.display = 'flex';

    window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * FONCTION afficherBtnDbtQuestionnaire ()
 * @description Cette fonction permet d'afficher le bouton leBtnDbtQuestionnaire
 * à la place du bouton leBtnEnrInfos
 * @param void
 * @returns void
 */
function afficherBtnDbtQuestionnaire() {
    leBtnDbtQuestionnaire.style.display = "flex";
}


/**
 * FONCTION afficherBtnTerminer ()
 * @description Cette fonction permet d'afficher le bouton leBtnTerminer
 * à la place du bouton leBtnDbtQuestionnaire
 * @param void
 * @returns void
 */
function afficherBtnTerminer() {
    leBtnDbtQuestionnaire.style.display = "none";
    leBtnTerminer.style.display = "flex";
}

/**
 * FONCTION afficherResultat(prenom, nom, resultat)
 * @description Cette fonction permet d'afficher le résultat
 * de l'utilisateur en fonction de la comparaison des choix de réponses
 * et le tableau des bonne réponses
 * Permet de récupérer les nom, le prénom et le résultat de l'utilisateur
 * pour l'afficher en cas de réussite ou pas
 * @param {Event} prenom
 * @param {Event} nom 
 * @param {Event} resultat
 * @returns void
 */
function afficherResultat(prenom, nom, resultat) {
    if (resultat >= 7) {
        leMain4.innerHTML = `
            <p>Votre score est de ${resultat}/9</p>
            <h2>Félicitation ${prenom} ${nom}!!! Vous avez réussi.</h2>
            <p>Double cliquer sur réessayer pour recommencer si vous voulez.</p>
        `; //Le nom et le prénom récupéré dans la fonction enregistrerInfos() sont directement mis dans
            //le texte affiché
        leMain4.style.display = "flex";
    } else {
        leMain5.innerHTML = `
            <p>Votre score est de ${resultat}/9</p>
            <h2>Oups! Vous n'avez pas réussi ${prenom} ${nom}</h2>
            <p>Double cliquer sur réessayer pour recommencer.</p>
        `;
        leMain5.style.display = "flex";
    }
}

