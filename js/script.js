// On initialise la latitude et la longitude de Paris (centre de la carte)

//Réunion
var lat = -21.115141;
var lon = 55.536384;

var macarte = null;

var markerClusters; // Servira à stocker les groupes de marqueurs

// Nous initialisons une liste de marqueurs

//Réunion
// var villes = {
// 	"Saint-André":  { "lat": -20.967916, "lon": 55.647949 },
// 	"Saint Gilles": { "lat": -21.049964, "lon": 55.220856 },
// 	"Saint-desnis": { "lat": -20.880666, "lon": 55.448170 },
// 	"Saint-Pierre": { "lat": -21.342675, "lon": 55.478348 }
// };


//genere la carte initiale
function initMap() {	
	macarte = L.map('map').setView([lat, lon], 10);
	// Nous initialisons les groupes de marqueurs
	// Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut.
	// Nous devons lui préciser où nous souhaitons les récupérer. Ici, osm
	L.tileLayer(
		'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
		{ attribution: 'données © OpenStreetMap</a>/ODbL - Carte de La Réunion',
		minZoom: 1,
		maxZoom: 20
	}).addTo(macarte);

	//Ajouter marker
	//var marker = L.marker([lat, lon]).addTo(macarte);
}

// Fonction d'initialisation qui s'exécute lorsque le DOM est chargé
window.onload = function(){	
	initMap();
};

// Fonction de regeneration de la carte
function reDessinerMap(objetJson) {	
	if(objetJson.flag=="OK"){	//On execute les instruction dans le bloc si et seulement si l'utilisateur est correctement authentifié (c-à-d si le serveur retourne un fichier JSON comporte comme valeur de flag "OK")
		removeMap();

		var forms = $(".needs-validation");

		forms.css({"display":"none"});
		$('#btn_valider').css({"display":"none"});
		$("#divProfil").html("<p>Bienvenu dans votre espace personnel! Vous avez maintenant accès à la carte interactive de La Réunion avec les différentes donnée mésuré.<p/>");	
		$('#btn_deconnexion').css({"display":"inline"});
		$('#divDeconn').css({"text-align":"center"});

		$('#btn_deconnexion').click(
			function(){
				location.reload();
			}
		);			

		var objData = objetJson.data;

		var markers = []; // Nous initialisons la liste des marqueurs

		// Nous définissons le dossier qui contiendra les marqueurs
		var iconBase = '../img/icones/';
		// Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
		macarte = L.map('map').setView([lat, lon], 12);

		// Nous initialisons les groupes de marqueurs
		markerClusters = L.markerClusterGroup();

		// Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut.
		// Nous devons lui préciser où nous souhaitons les récupérer.
		// Ici, openstreetmap.fr
		L.tileLayer(
		'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
		{ attribution: 'données © OpenStreetMap</a>/ODbL - Carte de La Réunion',//'données © OpenStreetMap/ODbL - rendu OSM France',
		minZoom: 1,
		maxZoom: 20
		}).addTo(macarte);

		// Nous parcourons la liste des villes
		//for (ville in villes) {
		for (var pos = 0; pos < objData.length; pos++) {
			// Nous définissons l'icône à utiliser pour le marqueur, ses taille affichée
			// (iconSize), position (iconAnchor) et décalage de son ancrage (popupAnchor)
			// var myIcon = L.icon({
			// iconUrl: iconBase + "icon.png",
			// iconSize: [50, 50],
			// iconAnchor: [25, 50],
			// popupAnchor: [-3, -76],
			// });

			var marker = L.marker(
			 	[objData[pos].lat, objData[pos].lng],
			// 	{icon: myIcon }
			 	);
			// pas de addTo(macarte), l'affichage sera géré par la bibliothèque des clusters

			// Nous ajoutons la popup. A noter que son contenu (ici la variable ville) peut être du HTML
			marker.bindPopup("Ville : "+objData[pos].ville+"<br/>"+
				"Code postal : "+objData[pos].cp+"<br/>"+
				"Latitude : "+objData[pos].lat+"<br/>"+
				"Longitude : "+objData[pos].lng+"<br/>"+
				"Relevé mesuré : "+objData[pos].valeur
				);

			markerClusters.addLayer(marker); // Nous ajoutons le marqueur aux groupes
			markers.push(marker); // Nous ajoutons le marqueur à la liste des marqueurs
		}  

		// Nous créons le groupe des marqueurs pour adapter le zoom
		var group = new L.featureGroup(markers);
		// Nous demandons à ce que tous les marqueurs soient visibles, et ajoutons un
		// padding (pad(0.5)) pour que les marqueurs ne soient pas coupés
		macarte.fitBounds(group.getBounds().pad(0.5));
		macarte.addLayer(markerClusters);

		//ajouter un marqueur sur un coordonné préscis
		//var marker = L.marker([lat, lon]).addTo(macarte);
	}else{
		alert("Identifiant ou Mot de passe Incorrect!");	//message afficher si l'utilisateur n'set pas authentifié
	}
	
}

//affiche sous forme de liste dans le bloc 3 les données reçu en format JSON depuis le WS
function chargerListeVilles(objetJson){
	var divListeVille = $(".listeVille");
	var htm = "";
	htm += "<p>";
	var objData = objetJson.data;
	for (var pos = 0; pos < objData.length; pos++) {
		htm += "<ul>";					
		htm += "<h4> Ville : "+objData[pos].ville+"</h4>";	
		htm += "<li> Code postal : "+objData[pos].cp+"</li>";
		// htm += "<li> Latitude : "+objData[pos].lat+"</li>";
		// htm += "<li> Longitude : "+objData[pos].lng+"</li>";						
		htm += "<li> Relevé mesuré : "+objData[pos].valeur+"<br/> </li>";
		htm += "</ul>";
	}
	htm +="</p";
	divListeVille.html(htm);
}

//fonction permetant de detruire la carte afin de pouvoir le regenerer après
function removeMap(){
	macarte.off();
	macarte.remove();
	macarte = null;
}


$(document).ready(function(){
	var forms = $(".needs-validation");
	$('#btn_deconnexion').css({"display":"none"});

	//permet d'empecher le comportement par defaut
	forms.submit(function(){
		return false;
	});	

   Array.prototype.filter.call(forms, function(form){
	   $(".btn").click(function(){
			if (form.checkValidity() === true){	  	
				event.preventDefault();
				var identifiant = $("#idLogin").val();
				var pswd = $("#pswd").val();
				var chk = $("#chk").val();
				var url = "http://polenumerique.re/dl/dwwm2019/ws/11/";
				//envoie les données de la formulaire au URL cible correspondant à notre web service et exploite les données retourner par le WS
				 $.get(url,{login:identifiant,pswd:pswd,chk:chk},function(reponses){
				 	//Remarque reponses correspond au fichier JSON retourné par le serveur
				 	chargerListeVilles(reponses);
					reDessinerMap(reponses);						
				});
		    }
		    form.classList.add('was-validated');
	    });
    });
});