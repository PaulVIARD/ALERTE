/*
 *	JavaScript corespondant � la partie alerte de l'application.
 */
 
function afficheContact(numeroEve){
//Function affiche l'�v�nement choisit en titre et les contacts de la liste d'un �v�nement en fonction du site dans un tableau.
	//Ajout de l'�v�nement s�lectionn� dans la m�moire.
	localStorage.alerteEve = numeroEve;
	
	//Ajout du titre dans le header
	var title = document.getElementById("titreEveSelect");
	var content = document.getElementById("tableChoixContact");
	var eve = extractionEve();
	var sites = extractionSite();
	var data = extractionData();
	var numeroSite = localStorage.alerteSite;
	title.innerHTML = eve[numeroEve] + " - " + sites[numeroSite] ;	

	//Il est possible que cette page contienne deja des lignes anciennes, il faut les enlever.
	$(".ligneAEnlever").remove();
	
	
	//Ajout des contacts � la page 
	for( i = 0; i < 6; i++){//On it�re sur le nombre maximum de contact d'une liste
		if(data[numeroSite][numeroEve][i]!="" &&  !$("#cellcontact" + numeroSite + numeroEve + i).length){
			//On cr�er la ligne qui va contenir le contact et l'option de rappel (r�partition espace : 80% -> 20%)
			//La classe 'ligneAEnlever' sert � sp�cifier les div qu'on ajoute en dynamique et �vite l'affichage d'ancienne ligne
			//On cr�er la cellule qui contient le contact.
			var cellContact = document.createElement("div");
			data[numeroSite][numeroEve][i] = extractionInfosContact(data[numeroSite][numeroEve][i]);
			cellContact.innerHTML = data[numeroSite][numeroEve][i][0] + " - " + data[numeroSite][numeroEve][i][1] + " " + data[numeroSite][numeroEve][i][2];
			cellContact.setAttribute("id","cellcontact" + numeroSite + numeroEve + i);
			cellContact.setAttribute("onclick","changeCouleur(this, 'cellrappel" + numeroSite + numeroEve + i + "', 0)");
			cellContact.setAttribute("class","SelectionContactGauche ligneAEnlever SelectionContactHauteur ui-btn");
			content.appendChild(cellContact);
			
			//On cr�er la cellule qui contient l'option de rappel
			var cellRappel = document.createElement("div");
			cellRappel.setAttribute("id","cellrappel" + numeroSite + numeroEve + i);
			cellRappel.setAttribute("class","SelectionContactDroite ligneAEnlever SelectionContactHauteur ui-btn ui-icon ui-icon-heart");
			cellRappel.setAttribute("onclick","changeCouleur(this, 'cellcontact" + numeroSite + numeroEve + i + "', 1)");
			content.appendChild(cellRappel);
		}
	}
}

function ajoutSiteAlerte(numeroSite){
//Fonction qui ajoute le num�ro du site cliqu� en m�moire pour qu'il soit accessible facilement pour la suite..
	localStorage.alerteSite = numeroSite;
}

function changeCouleur(itemClique, idItemAffecte, jeton){
//Function qui change la couleur d'un contact quand on clique dessus lors d'une alerte.
//Vert = selectionn�; vide = non s�lectionn�.
	var itemAffecte = document.getElementById(idItemAffecte);
	if(jeton == 0){//Le clic a eu lieu sur le contact.
		if(itemClique.style.backgroundColor != "lime"){
			itemClique.style.backgroundColor = "lime";
		}else{
			itemClique.style.backgroundColor = "";
			itemAffecte.style.backgroundColor = "";
		}
	}else if(jeton == 1){//Le clic a eu lieu sur le rappel.
		if(itemClique.style.backgroundColor != "lime"){
			itemClique.style.backgroundColor = "lime";
			itemAffecte.style.backgroundColor = "lime";
		}else{
			itemClique.style.backgroundColor = "";
		}
	}

}

function validerSelectionContact(){
//Fonction qui est appel�e une fois la s�lection des contacts effetu�e.
//Elle enregistre les contacts s�lectionn�s dans la m�moire et affiche une fiche de r�capitulatif.
	var numeroSite = localStorage.alerteSite;
	var numeroEve = localStorage.alerteEve;
	var listeAContacter = "";//Liste des contacts qu'il faut joindre.
	var listeQuiRappel = "";//Liste des contacts qui sont invit� � rappeler l'�metteur.
	
	for( i = 0; i < 6; i++){
		var itemContact = document.getElementById("cellcontact" + numeroSite + numeroEve + i);
		if(itemContact && itemContact.style.backgroundColor == "lime"){//On v�rifie que l'�l�ment soit pr�sent et s�lectionn�
			listeAContacter += itemContact.innerHTML + "/";
			var itemRappel = document.getElementById("cellrappel" + numeroSite + numeroEve + i);
			if(itemRappel.style.backgroundColor == "lime"){
				listeQuiRappel += itemContact.innerHTML + "/";
			}
		}
	}
	listeAContacter = listeAContacter.substring(0, listeAContacter.length-1);//On enleve le dernier '/'
	listeQuiRappel = listeQuiRappel.substring(0, listeQuiRappel.length-1);//idem
	localStorage.listeAContacter = listeAContacter;
	localStorage.listeQuiRappel = listeQuiRappel;
	
	location.href = "#pageRecapitulatif";
	buildRecapitulatif();
}

function buildRecapitulatif(){
//Fonction qui  remplit les champs du r�capitulatif.
	var site = extractionSite();
	site = site[localStorage.alerteSite];
	
	var eve = extractionEve();
	eve = eve[localStorage.alerteEve];
	var listeAContacter = localStorage.listeAContacter.split("/");;
	var listeQuiRappel = localStorage.listeQuiRappel.split("/");
	document.getElementById("recapTextSite").value = site;//On indique le site dans le chmps pr�vu � cet effet
	document.getElementById("recapTextEve").value = eve;//On indique l'evenement dans le champs pr�vu � cet effet
	var champContact = document.getElementById("recapListeContact");
	var champRappel = document.getElementById("recapListeRappel");
	
	for( i = 0; i < listeAContacter.length; i++){
		champContact.innerHTML += listeAContacter[i] + "<br/>";
	}
	
	for( i = 0; i < listeQuiRappel.length; i++){
		champRappel.innerHTML += listeQuiRappel[i] + "<br/>";
	}
}

function envoiMail(){
	var site = extractionSite();
	siten = site[localStorage.alerteSite];
	
	var eve = extractionEve();
	even = eve[localStorage.alerteEve];

	$.ajax({
		type: "POST",
		url: "main.php",
		data: { to: localStorage.listeAContacter.replace("/",","), object: "Alerte Evenement : " + eve + " - " + site, message: eve + " sur le site de " + site +"\n message � titre informatif \n Ceci est un mail de test, merci de ne pas y preter attention."}
	})
	.done(function( msg ) {
		alert( "Data Saved: " + msg );
	});
	location.href = '#pageAccueil'
}
