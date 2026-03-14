
import unicodedata



# Ouverture des deux fichiers (lecture et écriture)
with open('mots.txt', 'r', encoding='utf-8') as fichier_entree, \
     open('mots_filtres.txt', 'w', encoding='utf-8') as fichier_sortie:
    
    for ligne in fichier_entree:
        # Nettoyer les espaces/retours à la ligne et mettre en minuscules
        mot = ligne.strip().lower()
        
        # Le filtre : on ne garde que les mots entre 3 et 5 lettres
        if 3 <= len(mot) <= 5:
            # On écrit le mot validé dans le nouveau fichier
            fichier_sortie.write(mot + '\n')

print("Filtrage terminé ! Regarde le fichier mots_filtres.txt")
