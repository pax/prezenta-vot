    // var timestamps = ['06_13', '06_21', '07_13', '07_21'];
    // var options = ['lista', 'LT', 'LS', 'LP', 'UM', 'dead', 'ghost'];

// var markers = L.markerClusterGroup();
  var geojsonLayer = new L.GeoJSON.AJAX("data/generated/sectii.json", {
    style: layerStyle,

    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) { return L.circleMarker(latlng) }
  });

// markers.addLayer(geojsonLayer);

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
    maxZoom: 15,
    zoomDelta: 0.15, //not working in leaflet 0.7?
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
judeteShape.setZIndex(1);
geojsonLayer.setZIndex(2);


   // map.addLayer(markers);
  map.attributionControl.addAttribution("<b>Sursă date</b>: <a target='_blank' href='https://prezenta.bec.ro'>Biroul Electoral Central</a>");
  new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);
  // L.tileLayer.provider('Esri.WorldTopoMap').addTo(map);
  // L.tileLayer.provider('Esri.WorldTerrain').addTo(map);
  L.tileLayer.provider('CartoDB.Positron').addTo(map);
  // L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map);
  // L.tileLayer.provider('Stamen.Watercolor').addTo(map);
  // L.tileLayer.provider('CartoDB.DarkMatter').addTo(map);
  // L.tileLayer.provider('Stamen.TonerLite').addTo(map);

  selectedLayer = document.getElementById('controlInfo').getAttribute("ts");
  selectedVar = document.getElementById('controlInfo').getAttribute("xvar");
  scaleLevel = document.getElementById('controlInfo').getAttribute("range");  

var titleBox = L.control({ position: 'topleft' });
  titleBox.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'mapTitle');
    this._div.innerHTML="<h1>Prezența la vot la referendumul pentru modificarea Constituției.</h1> <span> &larr; <a href='https://votcorect.ro'>votcorect.ro</a> / sursă date : <a target='_blank' href='https://prezenta.bec.ro'>BEC</a> </span>";
    // this.update();
    return this._div;
  };
titleBox.addTo(map);

  /* info box
  - - - - - - - - - - - - - - - - - - - - -  */

  var controlBox = L.control({ position: 'topright' });
  controlBox.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'controlBoxBox mapControl');
    this.update();
    return this._div;
  };
  controlBox.update = function(props) {
    this._div.innerHTML =
    '<div id="topControl">'
    + '<form id="timestamp" name="timestamp" class="formControl"><span class="title">Timestamps</span>'
    + '<div class="controlItem"><input type="radio" name="xlayers" id="06_10" value="06_10" /><label for="06_10">S @10</label></div>'
    + '<div class="controlItem"><input type="radio" name="xlayers" id="06_13" value="06_13" /><label for="06_13">S @13</label></div>'
    + '<div class="controlItem"><input type="radio" name="xlayers" id="06_16" value="06_16" /><label for="06_16">S @16</label></div>'
    + '<div class="controlItem"><input type="radio" name="xlayers" id="06_19" value="06_19" /><label for="06_19">S @19</label></div>'
    + '<div class="controlItem"><input type="radio" name="xlayers" id="06_21" value="06_21" /><label for="06_21">S @21</label></div>'
    + '<div class="controlItem"><input type="radio" name="xlayers" id="07_10" value="07_10" /><label for="07_10">D @10</label></div>'
    + '<div class="controlItem"><input type="radio" name="xlayers" id="07_13" value="07_13" /><label for="07_13">D @13</label></div>'
    + '<div class="controlItem"><input type="radio" name="xlayers" id="07_16" value="07_16" /><label for="07_16">D @16</label></div>'
    + '<div class="controlItem"><input type="radio" name="xlayers" id="07_19" value="07_19" /><label for="07_19">D @19</label></div>'
    + '<div class="controlItem"><input type="radio" name="xlayers" id="07_21" value="07_21" checked=checked /><label for="07_21">D @21</label></div>'
    + '</form>'
    + '<form id="varSwitch" name="varSwitch" class="formControl"><span class="title">Vars</span><div class="controlItem"><input type="radio" name="xvars" id="prezenta" value="prezenta" /><label for="prezenta">prezență</label></div>'
    + '<div class="controlItem"><input type="radio" name="xvars" id="LS" value="LS" checked=checked /><label for="LS">LS</label></div>'
    + '<div class="controlItem"><input type="radio" name="xvars" id="LP" value="LP" /><label for="LP">LP</label></div>'
    + '<div class="controlItem"><input type="radio" name="xvars" id="UM" value="UM" /><label for="UM">UM</label></div>'
    + '<div class="controlItem"><input type="radio" name="xvars" id="LT" value="LT" /><label for="LT">LT </label></div>'
    + '<div class="controlItem"><input type="radio" name="xvars" id="ghost" value="ghost" /><label for="ghost">LT&lt;5</label></div>'
    + '<div class="controlItem"><input type="radio" name="xvars" id="dead" value="dead" /><label for="dead">LT=0</label></div>'
    + '<div class="controlItem"><input type="radio" name="xvars" id="observatori" value="observatori" /><label for="observatori">MV</label></div>'
    + '<div id="xzoom" class="controlItem"><span class="title">Scale</span><span class="button" id="zoomin">+</span><span class="button" id="zoomout">-</span>  </div>'
    + '<!--<div id="scaleWrapper"><input type="range" min="0.25" max="2" value="1" step=".25" class="slider" id="scale" onchange="scaleBubbles(this.value)"></div>-->'
    + '</form>'
    + '<div class="controlItem legenda"><small><span><b>LS</b>: listă specială,</span><span><b>LP</b>: listă permanentă,</span><span><b>UM</b>: urnă mobilă, </span><span><b>LT</b>: total voturi</span><span><b>MV</b>: monitorizare vot</span></small></div></div>';
  };
  controlBox.addTo(map);

  /*end info bpx*/
  

document.querySelector('#xzoom #zoomin').addEventListener("click", function(){
  currScaleLevel=Number(document.getElementById('controlInfo').getAttribute("range"));
    document.getElementById('controlInfo').setAttribute("range", Number(currScaleLevel) + .25);
    document.querySelector('#controlInfo .range').innerHTML = Number(currScaleLevel) + .25;
    scaleBubbles(Number(currScaleLevel) + .25)
});

document.querySelector('#xzoom #zoomout').addEventListener("click", function(){
  currScaleLevel=Number(document.getElementById('controlInfo').getAttribute("range"));
    document.getElementById('controlInfo').setAttribute("range", Number(currScaleLevel) - .25);
    document.querySelector('#controlInfo .range').innerHTML = Number(currScaleLevel) - .25;
    scaleBubbles(Number(currScaleLevel) - .25)
});

  function layerStyle(feature) {
    const max_radius = 50

    selectedLayer = document.getElementById('controlInfo').getAttribute("ts")  ;
    selectedVar =  document.getElementById('controlInfo').getAttribute("xvar")  ;
    scaleLevel =   document.getElementById('controlInfo').getAttribute("range")  ;

    var xStyle = {
      // weight: 2,
      fillOpacity: 0.85,
      stroke: true
    };
    xStyle.color = "White";
    // xStyle.fillColor = "MediumSlateBlue";

     xStyle.radius = 0;
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
        value = (feature.props.ts[selectedLayer]['LT'] <= 5) && (feature.props.ts[selectedLayer]['LT'] >= 0) ? 5 : 0;
        max = 50;
        break;
      case 'LP':
        value = feature.props.ts[selectedLayer][selectedVar]/3;
        max = 1527;
        break;
      case 'LS':
        value = feature.props.ts[selectedLayer][selectedVar];
        max = 1000;
        break;
      case 'UM':
        value = feature.props.ts[selectedLayer][selectedVar]/2;
        max = 500;
        break;
      case 'LT':
        value = feature.props.ts[selectedLayer][selectedVar]/3;
        max = 1600;
        break;
      case 'observatori':
        value = feature.props.observatori ? 5 : 0;
        max = 50;
        break;
      case 'extremes':
        // here we should record the biggest change
        break;
      default:
        value = feature.props.ts[selectedLayer][selectedVar];
        max = 1000;
    }

    xStyle.radius = Math.round(value * max_radius / max, 0) * scaleLevel;
    xStyle.fillColor = getColor(value, max);
    xStyle.weight = value >> 0 ? 2 : 0;
    return xStyle;
  }


  // Add custom popups to each using our custom feature properties
  geojsonLayer.on("layeradd", function(e) {
    var marker = e.layer,
      feature = marker.feature;

        // Create custom popup content
        var out = "<header><strong>" + feature.props.nume + "</strong>, ";
                out += "" + feature.props.localitate + " – " + feature.props.jud + feature.props.nr + "<br/>Înscriși pe lista: <b>" + feature.props.pe_lista + "</b></header>";
        // out += JSON.stringify(feature.props.ts, null, 2)
        out += locationProfie(feature.props.ts,feature.props.pe_lista);
        var popupContent = out;

        marker.bindPopup(popupContent, {
          closeButton: true,
          minWidth: 200
        });
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

    // info.update(layer.feature.props);
  }


  function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
    // info.update();
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
    // document.getElementById('scale').innerHTML = xvalue;
    // document.getElementById('scale').value = xvalue;
    document.getElementById('controlInfo').setAttribute("range", xvalue);
    document.querySelector('#controlInfo .range').innerHTML = xvalue;
    geojsonLayer.setStyle(layerStyle);
  }

  function locationProfie(xjson, prezenta) {
    // return JSON.stringify(xjson);
    let xout = '<div class="locBadge">';
        xout += '<table ><thead><tr> <th>tstamp</th><th>LP</th><th>LS</th><th>UM</th><th>LT</th><th>prezență</th></tr></thead><tbody>';
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