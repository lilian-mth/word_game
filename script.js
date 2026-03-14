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


// 3. La fonction principale déclenchée par le bouton
function lancerRecherche() {
    // On récupère les valeurs tapées par l'utilisateur
    const lettres = document.getElementById('lettres').value.toLowerCase();
    const debut = document.getElementById('debut').value.toLowerCase();
    const longueur = parseInt(document.getElementById('longueur').value);

    // Vérification de base
    if (lettres.length === 0) {
        alert("Tu dois entrer tes lettres au minimum !");
        return;
    }

    // On prépare le tableau des résultats
    let motsTrouves = [];

    // On parcourt tout notre dictionnaire
    for (let mot of dictionnaire) {
        
        // A. Vérification de la longueur (si l'utilisateur a rempli le champ)
        if (longueur && mot.length !== longueur) {
            continue; // On passe au mot suivant
        }

        // B. Vérification de la lettre de début (si rempli)
        if (debut && !mot.startsWith(debut)) {
            continue; // On passe au mot suivant
        }

        // C. L'épreuve finale : est-ce qu'on peut l'écrire avec nos lettres ?
        if (peutFormerMot(mot, lettres)) {
            motsTrouves.push(mot);
        }
    }

    // 4. Affichage des résultats dans le HTML
    const listeResultats = document.getElementById('resultats');
    const compteur = document.getElementById('compteur');
    
    // On vide l'ancienne liste
    listeResultats.innerHTML = '';
    compteur.innerText = motsTrouves.length;

    if (motsTrouves.length === 0) {
        listeResultats.innerHTML = '<li>Aucun mot trouvé 😢</li>';
    } else {
        // On trie les mots par ordre alphabétique ou par longueur avant de les afficher
        motsTrouves.sort((a, b) => b.length - a.length); // Les plus longs d'abord
        
        motsTrouves.forEach(mot => {
            let li = document.createElement('li');
            li.textContent = mot;
            listeResultats.appendChild(li);
        });
    }
}