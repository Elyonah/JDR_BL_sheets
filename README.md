# JDR_BL_sheets

Gestion des fiches de personnage du JDR Borderlands

## TODO LIST

- Gérer l'export et téléchargement fichier : récupérer tous les champs et les mettre dans un fichier json qui sera téléchargé.
- Style (**réservé Estelle**)


### Classes
- Character.js (main class à priori)
- Inventory.js
- Item.js
- Skills.js

### Enum
- Weapon type
- Brand weapon
- Brand shield
- Elementary ?
- Grenad type
- Rarity

### Panneau Inventory :

- Fonction vendre => input pour montant, ajouter dans money.
- Fonction ajouter un item dans l'inventaire, form pour stats + retirer argent si c'est un achat.
- Fonction déplacer :
 -> Cas fait : 
 --> Inventaire to slot OK
 -> TODO :
 --> RESOUDRE BUG
 --> Slot to inventaire (vérification nb max slot dispo)
 --> Slot to slot (échange, même si cette option n'est pas super utile)

### Panneau Character :

- Gérer nouveau personnage (pas super fonctionnel)

### Panneau Skills :

- Afficher tous les skills
- Afficher les points restants
- Gérer les poins dans les skills (ajouter, supprimer si besoin, dans ce cas ça remet un point aux points restants) ==> Voir avec Antoine