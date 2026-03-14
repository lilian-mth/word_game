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
        alert("Tu dois entrer tes lettres disponibles au minimum !");
        return;
    }

    // 2. GESTION DES ERREURS DYNAMIQUE
    // Vérifie automatiquement si on a rempli une case qui est au-delà de la longueur demandée
    if (longueur) {
        for (let i = longueur; i < 8; i++) {
            if (pattern[i] !== "") {
                alert(`Erreur : Tu as mis une lettre en position ${i + 1}, alors que tu cherches un mot de ${longueur} lettres !`);
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
        listeResultats.innerHTML = '<li>Aucun mot trouvé 😢</li>';
    } else {
        motsTrouves.sort((a, b) => b.length - a.length);
        motsTrouves.forEach(mot => {
            let li = document.createElement('li');
            li.textContent = mot;
            listeResultats.appendChild(li);
        });
    }
}

