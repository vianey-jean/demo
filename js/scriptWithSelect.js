// On initialise la latitude et la longitude de Paris (centre de la carte)
/*
//France
var lat = 48.852969;
var lon = 2.349903;
*/

//Réunion
var lat = -21.115141;
var lon = 55.536384;

var macarte = null;

var markerClusters; // Servira à stocker les groupes de marqueurs

// Nous initialisons une liste de marqueurs
/*
//France
var villes = {
	"Paris": { "lat": 48.852969, "lon": 2.349903 },
	"Brest": { "lat": 48.383, "lon": -4.500 },
	"Quimper": { "lat": 48.000, "lon": -4.100 },
	"Bayonne": { "lat": 43.500, "lon": -1.467 }
};
*/

//Réunion
var villes = {
	"Saint-André":  { "lat": -20.967916, "lon": 55.647949 },
	"Saint Gilles": { "lat": -21.049964, "lon": 55.220856 },
	"Saint-desnis": { "lat": -20.880666, "lon": 55.448170 },
	"Saint-Pierre": { "lat": -21.342675, "lon": 55.478348 }
};

function recupCoordonneDepuisJson(){
	var monURL = 'https://polenumerique.re/dl/dwwm2019/ws/2/';
	// var monURL ="https://raw.githubusercontent.com/high54/Communes-France-JSON/master/france.json";
	$.ajax(
		{
			url : monURL , 
			complete:  function(xhr,textstatus){
				//	on convertit le stringJSON en objetJS
				var responseJson = JSON.parse(xhr.responseText);
				chargerListeVilles(responseJson);
			}

		}
	);
}


function chargerListeVilles(objetJson){
	var objData = objetJson.data;
	for (var pos = 0; pos < objData.length; pos++) {						
		var option = '<option>'+objData[pos].ville+'</option>';
		$("#ville").append(option);
	}

	$('#ville').change(function(){					
		$('#lattitude').val(objData[$("select").prop('selectedIndex')].lat);
		$('#longitude').val(objData[$("select").prop('selectedIndex')].lng);
		removeMap(); 
		genMap();
	});
}


// Fonction d'initialisation de la carte
function genMap() {

	lat = document.getElementById('lattitude').value;
	lon = document.getElementById('longitude').value;

	var markers = []; // Nous initialisons la liste des marqueurs

	// Nous définissons le dossier qui contiendra les marqueurs
	var iconBase = '../img/icones/';
	// Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
	macarte = L.map('map').setView([lat, lon], 11);

	// Nous initialisons les groupes de marqueurs
	markerClusters = L.markerClusterGroup();

	// Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut.
	// Nous devons lui préciser où nous souhaitons les récupérer.
	// Ici, openstreetmap.fr
	L.tileLayer(
	'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
	{ attribution: 'OpenStreetMap/ODbL carte La Réunion',//'données © OpenStreetMap/ODbL - rendu OSM France',
	minZoom: 1,
	maxZoom: 20
	}).addTo(macarte);

	// Nous parcourons la liste des villes
	for (ville in villes) {
		// Nous définissons l'icône à utiliser pour le marqueur, ses taille affichée
		// (iconSize), position (iconAnchor) et décalage de son ancrage (popupAnchor)
		var myIcon = L.icon({
		iconUrl: iconBase + "icon.png",
		iconSize: [50, 50],
		iconAnchor: [25, 50],
		popupAnchor: [-3, -76],
		});

		//sans le marker cluster
		// var marker = L.marker(
		// 	[villes[ville].lat, villes[ville].lon],
		// 	{icon: myIcon }
		// 	).addTo(macarte);

		//avec le marker cluster on a enlevé le addTo
		var marker = L.marker(
			[villes[ville].lat, villes[ville].lon],
			{icon: myIcon }
			);
		// pas de addTo(macarte), l'affichage sera géré par la bibliothèque des clusters

		// Nous ajoutons la popup. A noter que son contenu (ici la variable ville) peut être du HTML
		marker.bindPopup(ville);

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
}

// Fonction d'initialisation qui s'exécute lorsque le DOM est chargé
window.onload = function(){
	genMap();
};