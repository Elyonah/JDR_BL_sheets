<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>Borderlands JDR UI Character File</title>
  <link rel="stylesheet" href="css/module.css">
  <script
  	src="https://code.jquery.com/jquery-3.3.1.min.js"
  	integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
  	crossorigin="anonymous"></script>
  <script src="js/character.js"></script>
</head>
<body>

  <header>
  	<h1> Fiche de personnage de </h1>
    <span> Joueur : </span>
  </header>

  <div class="content">
    <div class="tab">
      <button class="tablinks" onclick="openCity(event, 'Sheet')">Fiche personnage</button>
      <button class="tablinks" onclick="openCity(event, 'Inventory')">Inventaire</button>
      <button class="tablinks" onclick="openCity(event, 'Skills')">Compétences</button>
    </div>

  	
    <div id="Sheet" class="tabcontent">
      <div class="name"> Nom : </div>
      <div class="class"> Classe : </div>
      <div class="sexe"> Sexe : </div>

    </div>

    <div id="Inventory" class="tabcontent">
      
     
    </div>

    <div id="Skills" class="tabcontent">
        
    </div>
  </div>
  <footer>
    By Estelle
  </footer>
</body>
</html>