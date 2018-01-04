/*
 *	JavaScript corespondant à la partie paramétrage de l'application.
 */
window.onload = initialisation;

//evenement initialisé à l'initialisation de la page.
$( document ).bind ( 'pageinit', function() {
    $( '#popupAfficheInfo-Listes' ).on( 'popupafterclose', function() {//retire les boutons "retirer" de la popup lorsqu'elle se ferme
		$('.boutonsupprimeraretirer').remove();
	});
      $( '#popupAfficheInfo-Contact' ).on( 'popupafterclose', function() {//retire les boutons "retirer" de la popup lorsqu'elle se ferme
		$('.boutonmodifaretirer').remove();
	});
});

function initialisation(){
	//localStorage.clear();
	if(typeof(Storage) == "undefined"){
		alert("No web storage supported");
	} else{
		//alert("storage supporté");
		if(localStorage.getItem('init')=='done'){//Storage initialisé
			/*var data = extractionData();
			alert(data.length);
			alert(data[0].length);
			alert(data[0][0].length);*/
		}else{//non initialisé, on initialise sauf la liste contenant tous les contacts*/
			localStorage.sites = "--";//Stockage des sites : Un site de chaque coté d'un tiret
			localStorage.eve = "Incendie & Explosion_Deversement & Pollution_Evenement naturel_Accident grave a personne_Autre"
			localStorage.contacteve = "";//format de sauvegarde des contacts : '/' sépare les contacts; '_' sépare les evenements; '-' sépare les sites.
			for(var i = 1; i < 4; i++){
				for(var j = 1; j < 6; j++){
					for(var k = 1; k < 6; k++){
						localStorage.contacteve += "/";
					}
					if(j != 5) localStorage.contacteve += "_";
				}
				if(i != 3) localStorage.contacteve += "-";
			}
			localStorage.contacts = "";//liste de contacts distincts - contient les id des contacts
			localStorage.nbContacts = 0;//nombre de contacts distincts
			localStorage.init = "done";//On spécifie que l'initialisation à été faite.

			
		}
	}
	verrouileParaCL(); //Fonction qui verrouille deux items des paramètres si aucun site n'est enregistré (pour éviter les erreurs)
	buildPages(); //fonction qui appelle les fonctions de construction des pages.
	alert(extractionData());//A utiliser pour debug mais à enlever apres
}

function verrouileParaCL(){
	//Fonction qui permet de verrouiller le paramétrage des contacts et des listes tant qu'aucun site n'est saisi.
	if(localStorage.sites == "--"){ //Si il n'y a pas de sites enregistrés
		document.getElementById('pageParaRedirectContact').setAttribute("href","");
		document.getElementById('pageParaRedirectListes').setAttribute("href","");
	}else{
		if(document.getElementById('pageParaRedirectContact').getAttribute("href") == ""){//Si la redirection n'est pas effective
			document.getElementById('pageParaRedirectContact').setAttribute("href","#pageParaContact");
			document.getElementById('pageParaRedirectListes').setAttribute("href","#pageParaListes");
		}
	}
}

function buildPages(){
	//Fonction qui 'construit' les différentes pages.
	buildPageAccueil();
	buildPageParaSite();
	buildPageParaContact();
	buildPageParaListes();
	buildPopupSelectSite();
}

function buildPageAccueil(){//fonction qui construit la page d'accueil 
	var choixSite = document.getElementById('choixSite');
	var sites = extractionSite();
	for(i = 0; i < 3; i++){//On ajoute les site présents dans la mémoire
		if(sites[i] != "" && !$('#balise'+sites[i]).length){
			var a = document.createElement("a");
			a.setAttribute("id","balise"+sites[i]);
			a.setAttribute("class","ui-btn ui-shadow ui-btn-a");
			a.setAttribute("href","#popupMenu");
			a.setAttribute("data-rel","popup");
			a.setAttribute("data-transition","slideup");
			a.setAttribute("onclick","ajoutSiteAlerte(" + i + ")");//Fonction qui ajoute l'indice du site cliqué dans la mémoire pour gerer l'alerte.
			a.innerHTML = sites[i];
			choixSite.appendChild(a);
		}
	}
}

function buildPageParaSite(){//fonction qui construit la page de parametre des sites
	var sites = extractionSite();
	for(i = 0; i < 3; i++){//On ajoute les sites présents dans la memoire
		if(sites[i]!="" && !$('#'+sites[i]).length){
			var div = document.createElement('div');
			div.setAttribute('class','content ui-btn');
			div.setAttribute('id',sites[i]);
			div.setAttribute('data-role','content');
			div.innerHTML = sites[i];
			button = document.createElement("button");
			button.setAttribute("class","ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext");
			button.setAttribute("name",sites[i]);
			button.addEventListener('click', function(){removeSite(this.name)});
			div.appendChild(button);
			var cps = document.getElementById('contentParaSite');
			cps.appendChild(div);
		}
	}
}

function buildPageParaContact(){//Fonction qui construit la page de parametre des contacts 
	var contacts = extractionContacts();
	for(var i = 0; i < localStorage.nbContacts; i++){
		insertContactHTML(i, contacts[i]);
	}
}

function buildPageParaListes(){//fonction qui construit la page de consultation des listes.
	var supercontent = document.getElementById("listetabs");
	var content = document.getElementById("tabsSiteListes");
	var sites = extractionSite();
	var eve = extractionEve();
	var data = extractionData();
	for(var i = 0; i < 3; i++){
		if(sites[i]!="" && !$("#itemTabsListes" + i).length){//Si le site est ajouté
			//Onglet des Sites
			var item = document.createElement("li");
			item.setAttribute("id", "itemTabsListes" + i);
			var ancre = document.createElement("a");
			ancre.setAttribute("class","ui-btn itemListesHaut");
			ancre.setAttribute("id","ancreColoration" + i);
			ancre.setAttribute("onclick","colorationOnglet('ancreColoration" + i + "','itemListesHaut')");
			ancre.setAttribute("href","#tablistesite"+i);
			ancre.innerHTML = sites[i];
			item.appendChild(ancre);
			content.appendChild(item);
			
			//zone affichée lors du clic sur l'onglet
			var divtab = document.createElement("div");
			divtab.setAttribute("id","tablistesite"+i);
			divtab.setAttribute("class","tab");
			divtab.setAttribute("data-role","tabs");
			supercontent.appendChild(divtab);
			var divnav = document.createElement("div");
			divnav.setAttribute("data-role","navbar");
			divtab.appendChild(divnav);
			var ul = document.createElement("ul");
			divnav.appendChild(ul);
			
			//Contenu des onglets
			for(var j = 0; j < 5; j++){
				var li = document.createElement("li");
				var a = document.createElement("a");
				a.setAttribute("class","ui-btn itemListesBas" + i + "");
				a.setAttribute("id","ancreColorationBas" + i + j);
				a.setAttribute("onclick","colorationOnglet('ancreColorationBas" + i + j + "','itemListesBas" + i + "')");
				a.setAttribute("href","#site" + i + "eve" + j + "liste");
				a.innerHTML = eve[j];
				li.appendChild(a);
				ul.appendChild(li);
				
				var liste = document.createElement("div");
				liste.setAttribute("id","site" + i + "eve" + j + "liste");
				liste.setAttribute("class","tab");
				divnav.appendChild(liste);
				
				//Affichage de tous les contact d'une liste
				var nombreDajout = 0;
				for(var k = 0; k < 6; k++){
					if(data[i][j][k] != ""){
						nombreDajout++;
						var contact = document.createElement("div");
						contact.setAttribute("class","ui-btn");
						data[i][j][k] = extractionInfosContact(data[i][j][k]);
						contact.setAttribute("onclick","afficheInfosContact('" + data[i][j][k][0] + "','" + data[i][j][k][1] + "','" + data[i][j][k][2] + "','" + data[i][j][k][3] + "','" + data[i][j][k][4] + "','Listes'," + i + "," + j + ")");						
						contact.setAttribute("id","" + i + j + data[i][j][k][0] + "");//permet de le supprimer facilement
						contact.innerHTML = data[i][j][k][0] + " - " + data[i][j][k][1] + " " + data[i][j][k][2];
						liste.appendChild(contact);
						
					}
				}
				liste.setAttribute("value",nombreDajout);//permet de savoir combien de contact il y a par liste
				ajouteBoutonAjoutContactListe(i, j); //ajout du bouton '+'
			}
			colorationOnglet('ancreColorationBas' + i + '0','itemListesBas' + i);//permier onglet en bleu
		}
		colorationOnglet('ancreColoration0','itemListesHaut');//permier onglet en bleu
	}
}

function buildPopupSelectSite(){
	//fonction qui construit la popup qui s'affiche pour sélectioner les listes où affecter un contact.
	var content = document.getElementById("tabs-selectSite");
	var sites = extractionSite();
	var eve = extractionEve();
	var liste = document.getElementById("tabsSelectionSite");
	for(var i = 0; i < 3; i++){
		//On ajoute les onglets en fonction du nombre de sites
		if(sites[i] != "" && !($("#onglet" + sites[i]).length != 0)){
			var onglet = document.createElement("li");
			onglet.setAttribute("id", "onglet" + sites[i]);
			onglet.setAttribute("class", "tailledesonglets OngletsPopupAjoutContact");
			onglet.setAttribute("onclick", "colorationOnglet('onglet" + sites[i] + "','OngletsPopupAjoutContact')"); //gere la coloration des onglets
			if(i==0){onglet.style.backgroundColor = 'lightblue';}//permier onglet en bleu
			liste.appendChild(onglet);
			
			var item = document.createElement("a");
			item.setAttribute("href", "#tab" + sites[i]);
			if(i == 0) item.setAttribute("class", "ui-btn ui-state-persist");
			else item.setAttribute("class", "ui-btn");
			item.innerHTML = sites[i];
			onglet.appendChild(item);
			
			var contenuOnglet = document.createElement("fieldset");
			contenuOnglet.setAttribute("id", "tab" + sites[i]);
			contenuOnglet.setAttribute("data-role", "controlgroup");
			contenuOnglet.setAttribute("class", "tab");
			content.appendChild(contenuOnglet);
			
			for(var j = 0; j < 5; j++){//Liste de checkbox
				var checkbox = document.createElement("INPUT");
				checkbox.setAttribute("type", "checkbox");
				checkbox.setAttribute("id", "check" + sites[i] + j);
				checkbox.setAttribute("class","checkboxeve");
				contenuOnglet.appendChild(checkbox);
				
				var label = document.createElement("label");
				label.setAttribute("class","labelcheckeve");
				label.setAttribute("for","check" + sites[i] + j);
				label.innerHTML = eve[j];
				contenuOnglet.appendChild(label);	
			}
		}		
	}
}

function insertContactHTML(numeroContact, contact){
	//fonction qui créer les div de chaque contact.
	contact = extractionInfosContact(contact);
	texte = contact[0] + " - " + contact[1] + " " + contact[2];

	var conteneur = document.createElement("div");
	conteneur.setAttribute("class","ui-shadow ui-corner-all");
	conteneur.setAttribute("id","idContact"+numeroContact);
	
	var boutonInfo = document.createElement("button");
	boutonInfo.setAttribute("id","boutonInfosContact" + numeroContact);
	boutonInfo.setAttribute("class","ui-btn ui-icon ui-icon-info ui-btn-icon-notext");
	boutonInfo.setAttribute("style","display:inline-block");
	boutonInfo.setAttribute("onclick","afficheInfosContact('" + contact[0] + "','" + contact[1] + "','" + contact[2] + "','" + contact[3] + "','" + contact[4] + "','Contact',0,0)");						
	conteneur.appendChild(boutonInfo);
	
	var texte = document.createTextNode(texte);
	conteneur.appendChild(texte);
	
	var boutonDelete = document.createElement("button");
	boutonDelete.setAttribute("class","ui-btn ui-icon ui-icon-delete ui-btn-icon-notext");
	boutonDelete.setAttribute("id","boutonRemoveContact" + numeroContact);
	boutonDelete.setAttribute("style","display:inline-block; text-align:right");
	boutonDelete.setAttribute("onclick", "removeContact("+numeroContact+")");
	conteneur.appendChild(boutonDelete);
	
	var content = document.getElementById("contentContactPara");
	content.appendChild(conteneur);
}

function extractionData(){
	//On extrait les données des contacts en itérant sur différents niveaux
	var data = localStorage.contacteve;
	data = data.split('-');
	for(var i = 0; i < 3; i++){
		data[i] = data[i].split('_');
		for(j = 0; j < 5; j++){
			data[i][j] = data[i][j].split('/');
		}
	}
	return data;
}
function updateData(data){
	//Enregistre les données liées aux contacts
	var enregistrement = "";
	for(var i = 0; i < 3; i++){
		for(var j = 0; j < 5; j++){
			for(var k = 0; k < 6; k++){
				enregistrement += data[i][j][k];
				if(k < 5) enregistrement += "/";
			}
			if(j < 4) enregistrement += "_";
		}
		if(i < 2) enregistrement += "-";
	}
	localStorage.contacteve = enregistrement; 
}

function extractionContacts(){
	//On extrait les différents contacts (liste générale)
	var data = localStorage.contacts;
	data = data.split('/');
	return data	
}
function updateContacts(contacts){
	//Enregistre la liste générale des contacts.
	var enregistrement = "";
	for(var i = 0; i < contacts.length; i++){
		if(contacts[i] != ""){
			if(i != 0) enregistrement += "/";
			enregistrement += contacts[i];
		}
	}
	localStorage.contacts = enregistrement;
}

function extractionInfosContact(contact){
	//Prend un contact en chaine et le rend en tableau
	contact = contact.replace("[","");
	contact = contact.replace("]","");
	contact = contact.split(",");
	return contact;
}
function assembleContact(contact){
	//Prends un contact en tableau et le renvoi en chaine
	contact = "[" + contact[0] + "," + contact[1] + "," + contact[2] + "," + contact[3] + "," + contact[4] + "]";
	return contact;
}

function extractionSite(){
	//On extrait les différents sites
	var data = localStorage.sites;
	data = data.split('-');
	return data;
}
function updateSite(sites){
	//enregistrement des sites.
	localStorage.sites = sites[0] + "-" + sites[1] + "-" + sites[2];
}

function extractionEve(){
	//On extrait les différents evenements
	var data = localStorage.eve;
	data = data.split('_');
	return data;
}

function ajoutSite(){//Gestion de l'ajout d'un site (3 sites max)
	var popupSite = $("#popupSite").popup();
	popupSite.popup("close");
	var sites = extractionSite();
	var nomSite = document.getElementById("inputNomSite").value;
	if(nomSite == ""){
		alert("Pas de site saisi");
	}else if(nomSite != sites[0] && nomSite != sites[1] && nomSite != sites[2]){
		for(var i = 0; i < 3; i++){
			if(sites[i] == ""){
				sites[i] = nomSite;
				alert("Site " + (i+1) + " ajoute : " + nomSite);
				break;//on arrete dès que le site a été ajouté
			}else{
				if(i == 2) alert("Nombre de site maximum déjà atteint.");
			}
		}
	}else{
		alert("site deja ajoute");
	}
	updateSite(sites); //sauvegarde des sites
	buildPageParaSite();//On met tout à jour l'affichage de la page
}

function removeSite(site){//fonction qui est appelée quand on enleve un site.
	$('#'+site).remove();//Correspond à l'affichage du site dans les parametres
	var sites = extractionSite();
	for(var i = 0; i < 3; i++){
		if(site == sites[i]){ //On evite de créer une memoire lacunaire (ex : site1-vide-site2)
			var data = extractionData();
			
			sites[i]="";
			if(i == 0){ //si le premier site est supprimé 
				sites[0] = sites[1];
				sites[1] = "";
				for(var j = 0; j < 5; j++){
					for(var k = 0; k < 6; k++){
						data[0][j][k] = data[1][j][k];
						data[1][j][k]="";
					}
				}
			}
			
			if(i < 2){ //si c'est le premier ou le deuxieme 
				sites[1] = sites[2];
				for(var j = 0; j < 5; j++){
					for(var k = 0; k < 6; k++){
						data[1][j][k] = data[2][j][k];
					}
				}
			}
			
			//dans tous les cas le dernier indice sera vide apres une suppression
			sites[2] = "";
			for(var j = 0; j < 5; j++){
				for(var k = 0; k < 6; k++){
					data[2][j][k]="";
				}
			}
			
			updateSite(sites);
			updateData(data);//remplacment des listes par vide en mémoire
		}
	}
}

function valideId(){//Fonction qui est appelée lors de la validation d'un identifiant dans pageParaContact
	var identifiant = document.getElementById("inputIdContact").value;
	var contacts = extractionContacts();
	var verif = true;
	for(var i = 0; i < localStorage.nbContacts; i++){//On vérifie que le contact ne soit pas déja dans la liste.
		contacts[i] = extractionInfosContact(contacts[i]);
		if(contacts[i][0] == identifiant){
			alert("contact deja dans la liste des contacts");
			verif = false;
		}
	}
	if(identifiant != "" && verif){//On ne veut pas que la mémoire puisse etre lacunaire ou créer des doublons
		
		document.getElementById('idSelectionne').innerHTML = identifiant;//On indique en haut de la popup le contact qui est en train d'etre ajouté
		var popupAjoutContact = $('#popupAjoutContact').popup();
		popupAjoutContact.popup('close');
		setTimeout(ouvrePopupSelectSite,200);//Il faut laisser un temps avant d'ouvrir l'autre popup pour laisser le temps aux animations
	}
}

function ouvrePopupSelectSite(){//fonction qui ouvre la popup qui permet de choisir les sites où affecter un contact.
	var popupSelectSite = $('#popupSelectSite').popup();
	popupSelectSite.popup('open');
}	

function ajoutContact(){//fonction qui est appelée lors de l'ajout d'un contact
	var erreur = "";//listes pleines
	var indice = 1;//Permet de gerer un certain nombre de cas qui causerait des erreurs.
	var contacts = extractionContacts();
	var id = document.getElementById('inputIdContact');
	var nom = document.getElementById('inputNomContact');
	var prenom = document.getElementById('inputPrenomContact');
	var mail = document.getElementById('inputMailContact');
	var tel = document.getElementById('inputTelContact');
	
	//Début des itérations pour voir dans quelle liste on ajoute le contact et si c'est possible
	var data = extractionData();
	var eve = extractionEve();
	var sites = extractionSite();
	for(i = 0; i < 3; i++){//itération dans les sites	
		for(j = 0; j < 5; j++){ // itérations dans les différents evenements
			if($("#check" + sites[i] + j).is(':checked')){
				var indice = 0;
				for(k = 0; k < 6; k++){//itération dans la liste de 6 contacts
					if(data[i][j][k] == "" && indice == 0){
						data[i][j][k] = "[" + id.value + "," + nom.value + "," + prenom.value + "," + mail.value + "," + tel.value +"]";
						indice = 1;
					}
				}
				if(indice==0){erreur = erreur + "site" + i + "_eve" + j + " ";}//Si pas d'ajout possible alors que ça aurait du => erreur
			}
		}
	}
	
	
	//ajout du contact dans la liste principale
	var i = localStorage.nbContacts;
	var sauvegarde = "[" + id.value + "," + nom.value + "," + prenom.value + "," + mail.value + "," + tel.value +"]";
	if(localStorage.contacts == "") localStorage.contacts = sauvegarde;
	else localStorage.setItem("contacts", localStorage.contacts + "/" + sauvegarde);
	localStorage.nbContacts++;
	insertContactHTML(i,  sauvegarde);
	
	if(erreur != ""){alert(erreur);}

	updateData(data);
	
	//fermeture popup
	var popupSelectSite = $('#popupSelectSite').popup();
	
	/*reset des affichages*/
	//reset de l'identifiant saisi
	id.value = "";
	//reset des infos contacts
	nom.value = "";
	prenom.value = "";
	mail.value = "";
	tel.value = "";
	//reset des checkbox cochées
	$('.checkboxeve').prop('checked',false);
	$('.labelcheckeve').removeClass('ui-checkbox-on');
	$('.labelcheckeve').addClass('ui-checkbox-off');
	
	//fermeture popup
	var popupSelectSite = $('#popupSelectSite').popup();
	popupSelectSite.popup('close');
}

function removeContact(numeroContact){
	//Fonction qui est appelée quand on supprime un contact.
	data = extractionData();
	contacts = extractionContacts();
	$( "#idContact" + numeroContact ).remove();
	for(var i = 0; i < 3; i++){
		for(var j = 0; j < 5; j++){
			for(var k = 0; k < 6; k++){
				if(contacts[numeroContact] == data[i][j][k])
					data[i][j][k] = "";
			}
		}
	}
	data = enleveLesTrous(data);
	updateData(data);
	
	contacts[numeroContact] = "";
	numeroContact++;
	for(numeroContact; numeroContact < localStorage.nbContacts; numeroContact++){//On empeche la mémoire d'être lacunaire
		contacts[numeroContact-1] = contacts[numeroContact];
		contacts[numeroContact] = "";
		var boutonDelete = document.getElementById("boutonRemoveContact" + numeroContact);//On corrige les valeur de suppression des boutons pour qu'ils conrespondent toujours au meme contact.
		boutonDelete.removeAttribute("onclick");
		boutonDelete.setAttribute("onclick", "removeContact(" + (numeroContact-1) + ")");
		boutonDelete.removeAttribute("id");
		boutonDelete.setAttribute("id", "boutonRemoveContact" + (numeroContact-1));	
		var boutonContact = document.getElementById('idContact' + numeroContact);
		boutonContact.removeAttribute("id");
		boutonContact.setAttribute("id","idContact" + (numeroContact-1));
	}	

	
	localStorage.nbContacts--;
	updateContacts(contacts);
}

function enleveLesTrous(data){
	//Fonction qui décale les contacts supprimé pour eviter de créer des trous dans les listes. 
	var fin; //boolean qui indique si une liste est finie (un elément vide) et permet de savoir si la liste contient des trous.
	for(var i = 0; i < 3; i++){
		for(var j = 0; j < 5; j++){
			fin = false;
			for(var k = 0; k < 6; k++){
				if(data[i][j][k] == ""){
					fin = true;
				}
				else if(fin){
					fin = false;
					data[i][j][k-1] = data[i][j][k];
					data[i][j][k] = "";
					k = 0;
				}
			}
		}
	}
	return data;
}

function colorationOnglet(idDeLonglet, idDeLaFamille){
	$('.' + idDeLaFamille).css('background-color','#ededed');
	$('.' + idDeLaFamille).css('border-color','#ddd');
	$('.' + idDeLaFamille).css('color','#333');
	$('.' + idDeLaFamille).css('text-shadow','0 1px 0 #f3f3f3');
	document.getElementById(idDeLonglet).style.backgroundColor = '#3388cc';
	document.getElementById(idDeLonglet).style.borderColor = '#3388cc';
	document.getElementById(idDeLonglet).style.color = '#fff';
	document.getElementById(idDeLonglet).style.textShadow = '0 1px 0 #005599';
}

/*Les trois fonctions suivantes fonctionnent ensemble. Elles s'enchainent via différents clique sur des boutons
	ajouteBoutonAjoutContactListe 	--> Est appelée après avoir ajouté le dernier contact d'une liste. 
										Si la liste contient 6 contacts, pas d'ajout du bonton +
										Elle sert à créer le bouton '+' qui lancera la fonction suivante à son clic.
	popupAjoutContactListe          --> Est appelée après avoir cliqué sur le '+'.
										Elle sert à afficher une popup et la remplir avec les contacts non présent dans la liste.
	ajouteBoutonContactAListe		--> Est appelée après avoir cliqué sur un contact.
										Sert à ajouter le contact cliqué à la liste (interface et données).
										Elle appelle la fonction du début, ajouteBoutonAjoutContactListe.
	Lire les commentaires de chaucne pour plus de précision.
*/
function ajouteBoutonAjoutContactListe(numSite, numEve){
/*Fonction appelé quand on veut ajouter un bouton '+' à la fin d'une liste de contacts
	
	Etape 1 : On vérifie que l'on a moins de 6 contacts dan la liste.
	Etape 2 : On ajoute le bouton '+' avec 'onclick' qui permet d'appelé la fonction suivante.
*/
	if($('#site' + numSite + 'eve' + numEve + 'listeplus')){
		$('#site' + numSite + 'eve' + numEve + 'listeplus').remove();
	}
	
	if($('#site' + numSite + 'eve' + numEve + 'liste').attr('value') < 6){ 
		//Div avec un + pour pouvoir ajouter un autre contact à la liste
		var idListe = "site" + numSite + "eve" + numEve + "liste";
		var liste = document.getElementById(idListe);
		var boutonAjoutContactAListe = document.createElement("div");
		boutonAjoutContactAListe.setAttribute("class","ui-btn");
		boutonAjoutContactAListe.setAttribute("id",idListe + "plus");
		boutonAjoutContactAListe.innerHTML = "+";
		//Appelle la prochaine fonction quand le bouton '+' sera cliqué.
		boutonAjoutContactAListe.setAttribute("onclick","popupAjoutContactListe(" + numSite + "," + numEve + ")");
		liste.appendChild(boutonAjoutContactAListe);
	}
}

function popupAjoutContactListe(numSite, numEve){
/*Fonction qui construit la popup.

	Etape 1 :	On retire de la popup tout élément retirable qui pourrait s'y trouver. (class : enleverContact)
	Etape 2 : 	On prépare les données.
	Etape 3 : 	On itère dans la liste générale des contacts (contacts) pour savoir lesquels ne sont pas déjà 
				dans la listes (data) et que l'on affiche donc dans la popup.
	Etape 4 : 	Si il n'y a pas eu d'ajout, on affiche un texte pour prévenir.
	Etape 5 : 	On ajoute un bouton "fermer" et on ouvre la popup.
*/
	var popup = document.getElementById('popupAjoutContactListe');
	$(popup).on('close',$('.enleverContact').remove()); //Quand la popup est amenée à se fermer, on la nettoye.
	
	var data = extractionData();
	var contacts = extractionContacts();
	var ajout = false;//Sert  à savoir si un ajout dans la popup à eu lieu.
	for(i = 0; i < localStorage.nbContacts; i++){
		if(data[numSite][numEve].indexOf(contacts[i])<0){//On cherche l'indice auquel se trouve l'id du contact dans [id,nom,prenom,...] si il n'y est pas, renvoie -1.
			var contact = extractionInfosContact(contacts[i]);
			var boutonContactDansPopup = document.createElement("div");
			boutonContactDansPopup.setAttribute("class","ui-btn enleverContact");
			//Appel la prochaine fonction quand le bouton contact sera cliqué.
			boutonContactDansPopup.setAttribute("onclick","ajouteBoutonContactAListe(" + numSite + "," + numEve + ",'" + contacts[i] + "')");
			boutonContactDansPopup.innerHTML = contact[0] + " - " + contact[1] + " " + contact[2];
			popup.appendChild(boutonContactDansPopup);
			ajout = true;
		}
	}
	
	if(!ajout){
		texte = document.createElement('p');
		texte.innerHTML = 'Pas de contact supplementaire a ajouter';
		texte.setAttribute('class','enleverContact');
		popup.appendChild(texte);
	}
	boutonFermer = document.createElement("div");
	boutonFermer.setAttribute("class","ui-btn enleverContact");
	boutonFermer.setAttribute("onclick","$('#popupAjoutContactListe').popup('close');");
	boutonFermer.innerHTML = 'Fermer';
	popup.appendChild(boutonFermer);
	$(popup).popup('open');
}

function ajouteBoutonContactAListe(numSite, numEve, contact){
/*Fonction qui gère l'ajout du contact à la liste (interface et données).
	
	contact --> Le contact sur lequel le clic a eu lieu.
	
	Etape 1 : Fermer la popup, incrémenter le nombre de contact dans la liste (data) et ajouter le contact en interface et données.
	Etape 2 : On enleve le précédent bouton '+' et on appelle la fonction du début pour éventuellement en rajouter un autre à la suite des boutons contacts.
*/
	$('#popupAjoutContactListe').popup('close');
	/*	On extrait le numéro de site et d'évènement de l'id de la liste. 
		(id : siteXeveYliste [où X et Y sont des chiffres])	*/
	
	var nombreContact = $('#site' + numSite + 'eve' + numEve + 'liste').attr('value');
	var data = extractionData();
	data[numSite][numEve][nombreContact] = contact;
	var contact = extractionInfosContact(contact);
	var liste = document.getElementById("site" + numSite + "eve" + numEve + "liste");
	var boutonContact = document.createElement("div");
	boutonContact.setAttribute("class","ui-btn");
	boutonContact.setAttribute("onclick","afficheInfosContact('" + contact[0] + "','" + contact[1] + "','" + contact[2] + "','" + contact[3] + "','" + contact[4] + "','Listes'," + numSite + "," + numEve +")");
	boutonContact.setAttribute("id","" + numSite + numEve + contact[0]);
	updateData(data);
	boutonContact.innerHTML = contact[0] + " - " + contact[1] + " " + contact[2];
	$('#site' + numSite + 'eve' + numEve + 'listeplus').remove();
	liste.appendChild(boutonContact);
	$('#site' + numSite + 'eve' + numEve + 'liste').attr('value',parseInt(nombreContact)+1);
	ajouteBoutonAjoutContactListe(numSite, numEve);
}

function afficheInfosContact(id, nom, prenom, mail, tel, from, numSite, numEve){
	//Récupere les éléments grâce au DOM puis modifie la popup en fonction du contact.
	//from sert à savoir si l'on appelle cette fonction depuis les listes ou les contacts.
	document.getElementById('idPopupAfficheInfo-' + from).innerHTML = "Identifiant : " + id;
	document.getElementById('nomPopupAfficheInfo-' + from).innerHTML = "Nom : " + nom;
	document.getElementById('prenomPopupAfficheInfo-' + from).innerHTML = "Prenom : " + prenom;
	document.getElementById('mailPopupAfficheInfo-' + from).innerHTML = "Mail : " + mail;
	document.getElementById('telPopupAfficheInfo-' + from).innerHTML = "Tel : " + tel;
	if(from == "Listes"){
		var boutonSupprimer = document.createElement("a");
		boutonSupprimer.innerHTML = "Retirer";
		boutonSupprimer.setAttribute("class","ui-btn ui-icon ui-icon-delete boutonsupprimeraretirer");
		boutonSupprimer.setAttribute("onclick","supprimerContactDuneListe('"+ numSite + "','" + numEve + "','" + id  +"')");//On supprime le contact
		document.getElementById('popupAfficheInfo-Listes').appendChild(boutonSupprimer);
	}
	if(from == "Contact"){    
		var boutonModifier = document.createElement("a");
		boutonModifier.innerHTML = "Modifier";
		boutonModifier.setAttribute("id","boutonModifContact");
		boutonModifier.setAttribute("class","ui-btn boutonmodifaretirer");
		boutonModifier.setAttribute("onclick","changeInterfacePourModification()");
		document.getElementById('popupAfficheInfo-Contact').appendChild(boutonModifier);
	}
	$('#popupAfficheInfo-' + from).popup('open');
}

function supprimerContactDuneListe(numSite, numEve, idContact){ 
	//Fonction qui supprime un contact de l'interface et des données d'une liste.
	$('#' + numSite + numEve + idContact).remove();
	
	var data = extractionData();
	var place = 0;
	for(i = 0; i < 6; i++){
		var temp = extractionInfosContact(data[numSite][numEve][i]);
		if(temp[0] == idContact){
			data[numSite][numEve][i] = "";
			place = i;
		}
	}
	
	for(i = place; i < 6; i++){
		if(data[numSite][numEve][i+1]){
			data[numSite][numEve][i] = data[numSite][numEve][i+1];
		}else{data[numSite][numEve][i]="";}
	} 
	updateData(data);

	
	$('#site' + numSite + 'eve' + numEve + 'liste').attr('value',parseInt($('#site' + numSite + 'eve' + numEve + 'liste').attr('value'))-1);
	ajouteBoutonAjoutContactListe(numSite,numEve);
	$('#popupAfficheInfo-Listes').popup('close');
}

function changeInterfacePourModification(){
	//Fonction qui change l'affichage d'info pour passer en mode modification. 
	var id = document.getElementById('idPopupAfficheInfo-Contact');
	var valId = id.innerHTML.substring(14);//En fonction de la longueur de l'intitulé, on sépare la partie intitulé et donnée du contact.
	
	var nom = document.getElementById('nomPopupAfficheInfo-Contact');
	var textenom = document.createElement("input");
	textenom.setAttribute("id","inputNomPopup");
	textenom.setAttribute("type","text");
	textenom.value = nom.innerHTML.substring(6);
	nom.innerHTML = "Nom : ";
	nom.appendChild(textenom);
	
	
	var prenom = document.getElementById('prenomPopupAfficheInfo-Contact');
	var texteprenom = document.createElement("input");
	texteprenom.setAttribute("id","inputPrenomPopup");
	texteprenom.setAttribute("type","text");
	texteprenom.value = prenom.innerHTML.substring(9);
	prenom.innerHTML = "Prenom : ";
	prenom.appendChild(texteprenom);
	
	
	var mail = document.getElementById('mailPopupAfficheInfo-Contact');
	var textemail = document.createElement("input");
	textemail.setAttribute("id","inputMailPopup");
	textemail.setAttribute("type","text");
	textemail.value = mail.innerHTML.substring(7);
	mail.innerHTML = "Mail : ";
	mail.appendChild(textemail);
	
	
	var tel = document.getElementById('telPopupAfficheInfo-Contact');
	var textetel = document.createElement("input");
	textetel.setAttribute("id","inputTelPopup");
	textetel.setAttribute("type","text");
	textetel.value = tel.innerHTML.substring(6);
	tel.innerHTML = "Tel : ";
	tel.appendChild(textetel);
	
	var boutonModifier = document.getElementById('boutonModifContact');
	boutonModifier.innerHTML = "Valider";
	boutonModifier.removeAttribute("onclick");
	boutonModifier.setAttribute("onclick","validerModificationContact('" + valId + "')");
}

function validerModificationContact(valId){
	//Fonction qui modifie les données du contact en fonction de son ID.
	//Les données sont modifiées dans les deux listes.
	var data = extractionData();
	for(i = 0; i < 3; i++){
		for(j = 0; j < 5; j++){
			for(k = 0; k < 6; k++){
				if(data[i][j][k]){
					data[i][j][k] = extractionInfosContact(data[i][j][k])
					if(data[i][j][k][0] == valId){
						data[i][j][k][1] = $('#inputNomPopup').val();
						data[i][j][k][2] = $('#inputPrenomPopup').val();
						data[i][j][k][3] = $('#inputMailPopup').val();
						data[i][j][k][4] = $('#inputTelPopup').val();
						data[i][j][k] = assembleContact(data[i][j][k]);
					}
				}
			}
		}
	}
	updateData(data);
	
	var contacts = extractionContacts();
	for(i = 0; i < localStorage.nbContacts; i++){
		contacts[i] = extractionInfosContact(contacts[i])
		if(contacts[i][0] == valId){
			var contact = contacts[i];
			var numeroContact = i;
			contacts[i][1] = $('#inputNomPopup').val();
			contacts[i][2] = $('#inputPrenomPopup').val();
			contacts[i][3] = $('#inputMailPopup').val();
			contacts[i][4] = $('#inputTelPopup').val();
			contacts[i] = assembleContact(contacts[i]);
		}
	}
	updateContacts(contacts);
	
	//On met ensuite à jour les affichages.
	var contactAModifier = document.getElementById('idContact'+ numeroContact);
	contactAModifier.nodeValue = contact[0] + " - " + contact[1] + " " + contact[2];
	var boutonAModifier = document.getElementById('boutonInfosContact' + numeroContact);
	boutonAModifier.removeAttribute("onclick");
	boutonAModifier.setAttribute("onclick","afficheInfosContact('" + contact[0] + "','" + contact[1] + "','" + contact[2] + "','" + contact[3] + "','" + contact[4] + "','Contact',0,0)");
	
	$('#popupAfficheInfo-Contact').popup('close');
}

function reinitialisation(){
	//Fonction qui reinitialise les données en mémoire puis rafraichit la page.
	if(confirm("Reinitialiser la memoire ?")){
		localStorage.clear();
		rafraichir();
	}
}

function rafraichir(){//fonction qui est appelée quand on valide les sites.
//Cette fonction sert rédimensionner bien tous les onglets en fonction du nombre de site. Si redimensionnement dynamique et propre, possibilité de ne plus tout recharger apres avoir touché aux sites.
//Fonction aussi appelée apres avoir réinitialiser les données.
	location.href = "#pageAccueil" ; 
	location.reload();
}

function toast(msg){
	//Fonction qui affiche un toast.
	$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>"+msg+"</h3></div>")
	.css({ display: "block", 
		opacity: 0.90, 
		position: "fixed",
		padding: "7px",
		"text-align": "center",
		width: "270px",
		left: ($(window).width() - 284)/2,
		top: $(window).height()/2 })
	.appendTo( $.mobile.pageContainer ).delay( 1500 )
	.fadeOut( 400, function(){
		$(this).remove();
	});
}