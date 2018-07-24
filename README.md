# JDR_BL_sheets

Gestion des fiches de personnage du JDR Borderlands

##Pistes de développement :

**Solution 1**

Stocker dans le localStorage le fichier json / créer un nouveau json via \_blank et y insérer nom / sexe / classe en cas de création

*avantages* : c'est quasiment instantanée, pas besoin de php.

*inconvéniants* : la retranscription de tous les champs à faire en jquery... ça va deux minutes.

**Solution 2**

Utiliser PHP

*avantages* : Plus facile d'écrire les variables dans le HTML.

*inconvéniants* : Comment faire passer un fichier JSON en cas de non création ?