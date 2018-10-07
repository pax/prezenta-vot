  var geojsonLayer = new L.GeoJSON.AJAX("data/generated/localitati.json",
  {
    style: layerStyle,
    pointToLayer: function (feature, latlng) { return L.circleMarker(latlng)}
  });

var map = L.map('map', {
      center: [46, 25],
      zoom: 7,
      zoomControl: false, // so we move zoom to the top right corner, see below
      minZoom: 7,
      maxZoom: 10,
      // fullscreenControl: true,
      maxBounds: [[43, 18], [48.7, 30.9]],
      // zoomControl:false ,
      // scrollWheelZoom: false,
      // layers: [romaniaShape, geojsonLayer]
      layers: [geojsonLayer]
    });
new L.Control.Zoom({ position: 'topright' }).addTo(map);
// L.tileLayer.provider('Esri.WorldTopoMap').addTo(map);
L.tileLayer.provider('CartoDB.Positron').addTo(map);

  selectedLayer=document.getElementById('controlInfo').getAttribute("ts");
  selectedVar=document.getElementById('controlInfo').getAttribute("xvar");

function layerStyle(feature) {
  selectedLayer=document.getElementById('controlInfo').getAttribute("ts");
  selectedVar=document.getElementById('controlInfo').getAttribute("xvar");

  var xStyle = {weight: 2,fillOpacity: 0.9,stroke: true};
  xStyle.color = "White";
  xStyle.fillColor = "MediumSlateBlue";


  switch(selectedVar) {
    case 'muchextra':
        radius=(feature.props.ts[selectedLayer]['LP'] + feature.props.ts[selectedLayer]['LS'] + feature.props.ts[selectedLayer]['UM'] - feature.props.ts[selectedLayer]['LT'])*2;
        break;
    case 'dead':
        radius= feature.props.ts[selectedLayer]['LT']==0 ? 2 : 0;
        break;
    case 'ghost':
        radius= (feature.props.ts[selectedLayer]['LT'] <=5) && (feature.props.ts[selectedLayer]['LT']>=0)  ? 2 : 0;
        break;
    case 'LP':
        radius=Math.round(feature.props.ts[selectedLayer][selectedVar]/25,0);
        break;
    case 'UM':
        radius=Math.round(feature.props.ts[selectedLayer][selectedVar]/25,0);
        break;
    case 'extremes':
        // here we should record the biggest change
        break;
    default:
      radius=Math.round(feature.props.ts[selectedLayer][selectedVar]/10,0);
  }


  // radius=Math.round(feature.props.ts[selectedLayer][selectedVar]/10,0);
  xStyle.radius=radius;
return xStyle;
}


// Add custom popups to each using our custom feature properties
geojsonLayer.on("layeradd", function(e) {
  var marker = e.layer,
    feature = marker.feature;

  // Create custom popup content
    var out = "<h4>" +  feature.props.nume_sectie  + "</h4>";
    out +=   "<b>" +  feature.props.localitate + "</b><br>Înscriși pe lista: <b>" + feature.props.pe_lista + "</b>";
    // out += JSON.stringify(feature.props.ts, null, 2)
    var popupContent = out;

  marker.bindPopup(popupContent,{
    closeButton: true,
    minWidth: 200
  });
});

  //  read select
  var rad = document.timestamp.xlayers;
  for(var i = 0; i < rad.length; i++) {
      rad[i].onclick = function() {
        // let selectedLayer=this.value;
        
        // document.getElementById('controlInfo').innerHTML=this.value;
        document.querySelector('#controlInfo .ts').innerHTML=this.value;
        document.getElementById('controlInfo').setAttribute("ts", this.value);
        geojsonLayer.setStyle(layerStyle);
      };
  }

    //  read select
  var xrad = document.varSwitch.xvars;
  for(var i = 0; i < xrad.length; i++) {
      xrad[i].onclick = function() {
        let selectedLayer=this.value;
        // document.getElementById('controlInfo').innerHTML=this.value;
        document.querySelector('#controlInfo .xvar').innerHTML=this.value;
        document.getElementById('controlInfo').setAttribute("xvar", this.value);
        geojsonLayer.setStyle(layerStyle);
      };
  }