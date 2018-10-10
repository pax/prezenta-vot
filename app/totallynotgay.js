    // var timestamps = ['06_13', '06_21', '07_13', '07_21'];
    // var options = ['lista', 'LT', 'LS', 'LP', 'UM', 'dead', 'ghost'];

  var geojsonLayer = new L.GeoJSON.AJAX("data/generated/localitati.json", {
    style: layerStyle,
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) { return L.circleMarker(latlng) }
  });


  // var romaniaShape= new L.GeoJSON.AJAX("data/gis/romania-borders.json", { style: stilGranita}).addTo(map);

  // var stilGranita = {
  //    "color": "SteelBlue",
  //    "weight": 1,
  //    "opacity": 1,
  //      "fillColor": "PaleTurquoise",
  //   // "fillOpacity": 1
  //    // "dashArray": "5, 5"
  // }
  //   var romaniaShape = new L.GeoJSON.AJAX("data/gis/romania-borders.json", { style: stilGranita} );

  var stilJudete = {
    "color": "LightSteelBlue",
    "weight": 2,
    "opacity": .6,
    "fillColor": "rgba(213, 239, 255, .85)",
    "fillOpacity": .5
    // "dashArray": "2, 6"
  }
  var judeteShape = new L.GeoJSON.AJAX("data/gis/ro_judete_poligon.json", { style: stilJudete });


  var map = L.map('map', {
    center: [46, 25],
    zoom: 7,
    zoomControl: false, // so we move zoom to the top right corner, see below
    minZoom: 6,
    maxZoom: 10,
    // fullscreenControl: true,
    maxBounds: [
      [43, 18],
      [48.7, 30.9]
    ],
    // zoomControl:false ,
    // scrollWheelZoom: false,
    // layers: [romaniaShape, geojsonLayer]
    layers: [judeteShape, geojsonLayer]
  });
  new L.Control.Zoom({ position: 'topleft' }).addTo(map);
  // L.tileLayer.provider('Esri.WorldTopoMap').addTo(map);
  L.tileLayer.provider('CartoDB.Positron').addTo(map);
  // L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map);

  selectedLayer = document.getElementById('controlInfo').getAttribute("ts");
  selectedVar = document.getElementById('controlInfo').getAttribute("xvar");
  scaleLevel = document.getElementById('scale').value;



  /* info box
  - - - - - - - - - - - - - - - - - - - - -  */

  var info = L.control({ position: 'topright' });
  info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'infoBox mapControl');
    this.update();
    return this._div;
  };
  info.update = function(props) {
    this._div.innerHTML = props ? "<header><strong>" + props.nume_sectie + "</strong> (" + props.jud + props.nr_sectie + ") – " + props.localitate + "<br><small>Înscriși pe lista: <b>" + props.pe_lista + "</b></small></header>" + locationProfie(props.ts, props.pe_lista) : 'click pe o localitate pentru informații suplimentare';
  };
  info.addTo(map);

  /*end info bpx*/

  function layerStyle(feature) {
    selectedLayer = document.getElementById('controlInfo').getAttribute("ts") ? document.getElementById('controlInfo').getAttribute("ts") : timestamps[0];
    selectedVar = document.getElementById('controlInfo').getAttribute("xvar") ? document.getElementById('controlInfo').getAttribute("xvar") : options[0];
    scaleLevel = document.getElementById('scale').value ? document.getElementById('scale').value : 1 ;

    var xStyle = {
      // weight: 2,
      fillOpacity: 0.85,
      stroke: true
    };
    xStyle.color = "White";
    // xStyle.fillColor = "MediumSlateBlue";


    switch (selectedVar) {
      case 'prezenta':
        value = feature.props.ts[selectedLayer]['LT'] / feature.props.pe_lista * 33;
        max = 330;
        break;
      case 'muchextra':
        value = feature.props.ts[selectedLayer]['LT'] - feature.props.ts[selectedLayer]['LP'] - feature.props.ts[selectedLayer]['LS'] - feature.props.ts[selectedLayer]['UM'] + 0;
        max = 50;
        break;
      case 'dead':
        value = feature.props.ts[selectedLayer]['LT'] == 0 ? 5 : 0;
        max = 50;
        break;
      case 'lista':
        value = feature.props.pe_lista;
        max = 5600;
        break;
      case 'ghost':
        value = (feature.props.ts[selectedLayer]['LT'] <= 5) && (feature.props.ts[selectedLayer]['LT'] >= 0) ? 10 : 0;
        max = 50;
        break;
      case 'LP':
        value = feature.props.ts[selectedLayer][selectedVar];
        max = 1527;
        break;
      case 'LS':
        value = feature.props.ts[selectedLayer][selectedVar];
        max = 1000;
        break;
      case 'UM':
        value = feature.props.ts[selectedLayer][selectedVar];
        max = 366;
        break;
      case 'LT':
        value = feature.props.ts[selectedLayer][selectedVar]/3;
        max = 1600;
        break;
      case 'extremes':
        // here we should record the biggest change
        break;
      default:
        value = feature.props.ts[selectedLayer][selectedVar];
        max = 1000;
    }


    // radius=Math.round(feature.props.ts[selectedLayer][selectedVar]/10,0);
    //  0 → 0
    //  max → 50
    // xStyle.radius = Math.floor(Math.log(value + 1.72)) * factor * scaleLevel;
    xStyle.radius = Math.round(value * 50 / max, 0) * scaleLevel;
    xStyle.fillColor = getColor(value, max);
    xStyle.weight = value >> 0 ? 2 : 0;
    return xStyle;
  }


  // Add custom popups to each using our custom feature properties
  geojsonLayer.on("layeradd", function(e) {
    var marker = e.layer,
      feature = marker.feature;

    /*    // Create custom popup content
        var out = "<strong>" + feature.props.nume_sectie + "</strong> (" + feature.props.jud + feature.props.nr_sectie + ")<br>";
        out += "" + feature.props.localitate + "<br>Înscriși pe lista: <b>" + feature.props.pe_lista + "</b>";
        // out += JSON.stringify(feature.props.ts, null, 2)
        out += locationProfie(feature.props.ts);
        var popupContent = out;

        marker.bindPopup(popupContent, {
          closeButton: true,
          minWidth: 200
        });
    */

  });


  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      click: highlightFeature,
      mouseout: resetHighlight,
      // mousedown: window.alert("sometext")
      // click: openUrl
    });
  }

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 7,
      color: 'Red',
      fillColor: 'Yellow',
      // "fillOpacity": 1
    });

    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }

    info.update(layer.feature.props);
  }


  function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
    info.update();
  }

  //  read select
  if (document.timestamp.xlayers != null) {
  var rad = document.timestamp.xlayers;
  for (var i = 0; i < rad.length; i++) {
    rad[i].onclick = function() {
      // let selectedLayer=this.value;

      // document.getElementById('controlInfo').innerHTML=this.value;
      document.querySelector('#controlInfo .ts').innerHTML = this.value;
      document.getElementById('controlInfo').setAttribute("ts", this.value);
      geojsonLayer.setStyle(layerStyle);
    };
  }
  }
  else {
    document.querySelector('#controlInfo .ts').innerHTML = timestamps[0];
      document.getElementById('controlInfo').setAttribute("ts", timestamps[0]);
      geojsonLayer.setStyle(layerStyle);
  }

  //  read select
if (document.varSwitch.xvars != null){
  var xrad = document.varSwitch.xvars;
  for (var i = 0; i < xrad.length; i++) {
    xrad[i].onclick = function() {
      let selectedLayer = this.value;
      // document.getElementById('controlInfo').innerHTML=this.value;
      document.querySelector('#controlInfo .xvar').innerHTML = this.value;
      document.getElementById('controlInfo').setAttribute("xvar", this.value);
      geojsonLayer.setStyle(layerStyle);
    };
  }
} else {
      document.querySelector('#controlInfo .xvar').innerHTML = options[0];
      document.getElementById('controlInfo').setAttribute("xvar", options[0]);
      geojsonLayer.setStyle(layerStyle);
}

  function scaleBubbles(xvalue) {
    // document.querySelector('#controlInfo .range').innerHTML=value;
    document.getElementById('scale').innerHTML = xvalue;
    document.getElementById('scale').value = xvalue;
    document.getElementById('controlInfo').setAttribute("range", xvalue);
    document.querySelector('#controlInfo .range').innerHTML = xvalue;
    geojsonLayer.setStyle(layerStyle);
  }

  function locationProfie(xjson, prezenta) {
    // return JSON.stringify(xjson);
    let xout = '<div class="locBadge">';
        xout += '<table ><thead><tr> <th>ts</th><th>LP</th><th>LS</th><th>UM</th><th>LT</th><th>prezență</th></tr></thead><tbody>';
        for (var xsectie in xjson) {
          if (xjson.hasOwnProperty(xsectie)) {
            xout += '<tr>';
            xout += "<td>" + xsectie + "</td>";
            xout += " <td class=x" + xjson[xsectie]['LP'] + ">" + xjson[xsectie]['LP'] + '</td>';
            xout += " <td class=x" + xjson[xsectie]['LS'] + ">" + xjson[xsectie]['LS'] + '</td>';
            xout += " <td class=x" + xjson[xsectie]['UM'] + ">" + xjson[xsectie]['UM'] + '</td>';
            xout += " <td class=x" + xjson[xsectie]['LT'] + ">" + xjson[xsectie]['LT'] + '</td>';
            xout += " <td class='prezenta x" + xjson[xsectie]['LT'] + "'>" + (xjson[xsectie]['LT']*100/prezenta).toFixed(1) + '<small>&#37;</small></td>';
            xout += '</tr>';
          }
        }
        xout += '</table></div>'
    return xout;
  }


  function getColor(d, max) {
    // x = Math.round(d / 2, 0);

    /*  COLOR
    H:  0/360° reds, 120° greens, 240° blues */

    /* SATURATION
    S: 0-100%
    0 → 50
    max → 100
    */
    // sat = d - max + 100;
    sat = Math.round(d * 50 / max) + 50;
    if (sat >> 100) sat == 100;
    if (sat << 50) sat == 50;
    /* LIGTNESS
    L: 0 - 100%  0 = white, 100 = black
    0 → 0
    max → 50
    */
    // light = Math.round(d/max, 0) + 49
    light = Math.round(d * 50 / max);
    /* ALPHA
    A: 0 - 1
    0 → 0
    1 → 1
    */
    // alpha = Math.round(d/max)

    // return 'hsla(350,' + sat + '%,' + light + '%,' + alpha + ')';
    return 'hsla(350,' + sat + '%,' + light + '%)';

  }