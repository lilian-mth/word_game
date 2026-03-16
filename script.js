let dictionnaire = [];

// 1. Chargement du dictionnaire au lancement de la page
// ATTENTION: Ton fichier txt doit s'appeler "mots_filtres.txt" et être dans le même dossier
fetch('mots_filtres.txt')
    .then(response => response.text())
    .then(texte => {
        // On sépare le texte ligne par ligne pour créer notre tableau de mots
        dictionnaire = texte.split('\n').map(mot => mot.trim()).filter(mot => mot.length > 0);
        console.log("Dictionnaire chargé : " + dictionnaire.length + " mots.");
    })
    .catch(erreur => console.error("Erreur de chargement du dictionnaire :", erreur));


// 2. La fonction mathématique/logique qui vérifie SI un mot peut être fait avec les lettres
function peutFormerMot(motDico, lettresDispo) {
    // On transforme les lettres dispo en tableau (ex: "aebrm" -> ['a', 'e', 'b', 'r', 'm'])
    let poolLettres = lettresDispo.split('');
    
    // On vérifie chaque lettre du mot du dictionnaire
    for (let char of motDico) {
        let index = poolLettres.indexOf(char);
        
        if (index !== -1) {
            // La lettre est dans le pool, on la retire pour ne pas l'utiliser deux fois !
            poolLettres.splice(index, 1);
        } else {
            // La lettre n'y est pas (ou on l'a déjà trop utilisée), le mot est invalide
            return false;
        }
    }
    // Si on a pu vérifier toutes les lettres sans erreur, le mot est valide
    return true;
}


function lancerRecherche() {
    const lettres = document.getElementById('lettres').value.toLowerCase();
    const longueurInput = document.getElementById('longueur').value;
    const longueur = longueurInput ? parseInt(longueurInput) : null;

    // 1. On récupère maintenant les 8 cases
    const pattern = [
        document.getElementById('pos1').value.toLowerCase(),
        document.getElementById('pos2').value.toLowerCase(),
        document.getElementById('pos3').value.toLowerCase(),
        document.getElementById('pos4').value.toLowerCase(),
        document.getElementById('pos5').value.toLowerCase(),
        document.getElementById('pos6').value.toLowerCase(),
        document.getElementById('pos7').value.toLowerCase(),
        document.getElementById('pos8').value.toLowerCase()
    ];

    if (lettres.length === 0) {
        alert("You must enter your available letters at least!");
        return;
    }

    // 2. GESTION DES ERREURS DYNAMIQUE
    // Vérifie automatiquement si on a rempli une case qui est au-delà de la longueur demandée
    if (longueur) {
        for (let i = longueur; i < 8; i++) {
            if (pattern[i] !== "") {
               // Avant : alert(`Erreur : Tu as mis une lettre en position ${i + 1}, alors que tu cherches un mot de ${longueur} lettres !`);
                alert(`Error: You put a letter in position ${i + 1}, but you are looking for a ${longueur}-letter word!`);
                return;
            }
        }
    }
    
    // ... Le reste de la boucle "for (let mot of dictionnaire)" ne change absolument pas !

    let motsTrouves = [];

    // On parcourt le dictionnaire
    for (let mot of dictionnaire) {
        
        // A. Vérification de la longueur
        if (longueur && mot.length !== longueur) {
            continue;
        }

        // B. L'épreuve : est-ce qu'on peut l'écrire avec nos lettres ?
        if (!peutFormerMot(mot, lettres)) {
            continue;
        }

        // C. Vérification du "Pattern" (les 5 cases)
        let correspondAuPattern = true;
        for (let i = 0; i < mot.length; i++) {
            // Si la case n'est pas vide ET que la lettre ne correspond pas à celle du mot
            if (pattern[i] !== "" && pattern[i] !== mot[i]) {
                correspondAuPattern = false;
                break; // On arrête de vérifier ce mot, il est invalide
            }
        }

        // Si le mot a passé tous les tests, on l'ajoute !
        if (correspondAuPattern) {
            motsTrouves.push(mot);
        }
    }

    // Affichage des résultats
    const listeResultats = document.getElementById('resultats');
    const compteur = document.getElementById('compteur');
    
    listeResultats.innerHTML = '';
    compteur.innerText = motsTrouves.length;

    if (motsTrouves.length === 0) {
        // Avant : listeResultats.innerHTML = '<li>Aucun mot trouvé 😢</li>';
        listeResultats.innerHTML = '<li>No words found 😢</li>';
    } else {
        motsTrouves.sort((a, b) => b.length - a.length);
        motsTrouves.forEach(mot => {
            let li = document.createElement('li');
            li.textContent = mot;
            listeResultats.appendChild(li);
        });
    }
}


// --- EFFET DE NAVIGATION AUTOMATIQUE DANS LA GRILLE ---

// On récupère toutes les cases de la grille d'un coup
const casesGrille = document.querySelectorAll('.grille-pattern input');

casesGrille.forEach((caseActuelle, index) => {
    
    // 1. Quand l'utilisateur tape une lettre
    caseActuelle.addEventListener('input', () => {
        // Si la case contient une lettre et qu'on n'est pas à la dernière case
        if (caseActuelle.value.length === 1 && index < casesGrille.length - 1) {
            // On met le curseur sur la case suivante
            casesGrille[index + 1].focus();
        }
    });

    // 2. Quand l'utilisateur appuie sur la touche "Effacer" (Backspace)
    caseActuelle.addEventListener('keydown', (evenement) => {
        // Si la case est vide et qu'on n'est pas à la première case
        if (evenement.key === 'Backspace' && caseActuelle.value === '' && index > 0) {
            // On remet le curseur sur la case précédente
            casesGrille[index - 1].focus();
        }
    });
});


// --- GESTION DES BOUTONS + ET - POUR LA LONGUEUR ---

const btnMoins = document.getElementById('btn-moins');
const btnPlus = document.getElementById('btn-plus');
const affichageLongueur = document.getElementById('affichage-longueur');
const inputLongueur = document.getElementById('longueur');

// On commence à 0 (ce qui signifie "Toutes les longueurs", affiché par un tiret)
let longueurActuelle = 0; 

function mettreAJourAffichage() {
    if (longueurActuelle === 0) {
        affichageLongueur.textContent = "-"; // Tiret = pas de limite
        inputLongueur.value = ""; // L'input caché est vide
    } else {
        affichageLongueur.textContent = longueurActuelle;
        inputLongueur.value = longueurActuelle;
    }
}

btnMoins.addEventListener('click', () => {
    if (longueurActuelle > 3) {
        longueurActuelle--;
    } else if (longueurActuelle === 3) {
        longueurActuelle = 0; // Si on descend en dessous de 3, on désactive la limite
    }
    mettreAJourAffichage();
});

btnPlus.addEventListener('click', () => {
    if (longueurActuelle === 0) {
        longueurActuelle = 3; // Le minimum pour un mot est souvent 3
    } else if (longueurActuelle < 8) { // 8 est ton max actuel d'après les inputs
        longueurActuelle++;
    }
    mettreAJourAffichage();
});

