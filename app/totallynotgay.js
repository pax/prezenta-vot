  // TO DO, read from timestamps.json
  var timestamps = ["06_10", "06_13", "06_16", "06_19", "06_21", "07_10", "07_13", "07_16", "07_19", "07_21"];
/*
dynamic style for higlighting current TS row on tooltip table
 */

let stylesheet = document.createElement('style');
let dynStyle = dynStylex = '';
for (var i = 0; i < timestamps.length; i++) {
  dynStyle += 'body.ts_' + timestamps[i] + ' .locBadge table tr.ts_' + timestamps[i] + ' td, ';
  dynStylex += 'body.ts_' + timestamps[i] + ' .locBadge table tr.ts_' + timestamps[i] + ' td:first-child:before, ';
}
dynStyle = dynStyle + ' x {background-color: LightYellow; color: DarkRed;}' + dynStylex + ' x {content: \'≫\';   position: absolute; margin-left: -1em;}';
stylesheet.innerHTML = dynStyle;
document.body.appendChild(stylesheet);

  // var options = ['lista', 'LT', 'LS', 'LP', 'UM', 'dead', 'ghost'];

  // var markers = L.markerClusterGroup();
  // var myRenderer = L.canvas({ padding: 0.5 });
  var geojsonLayer = new L.GeoJSON.AJAX("data/generated/sectii.json", {
    style: layerStyle,
    // renderer: myRenderer,
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) { return L.circleMarker(latlng) }
  });


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
    preferCanvas: true,
    center: [46, 25],
    zoom: 7,
    zoomControl: false, // so we move zoom to the top right corner, see below
    minZoom: 6,
    maxZoom: 15,

    // fullscreenControl: true,
    maxBounds: [
      [43, 18],
      [49.7, 31]
    ],
    zoomControl: false, //we add it in different place
    // scrollWheelZoom: false,
    // layers: [romaniaShape, geojsonLayer]
    layers: [geojsonLayer]
  });
  // judeteShape.setZIndex(1);
  // geojsonLayer.setZIndex(2);
  new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);
  judeteShape.addTo(map);

  // map.addLayer(markers);
  map.attributionControl.addAttribution("<b>Sursă date</b>: <a target='_blank' href='https://prezenta.bec.ro'>Biroul Electoral Central</a>");

  // L.tileLayer.provider('Esri.WorldTopoMap').addTo(map);
  // L.tileLayer.provider('Esri.WorldTerrain').addTo(map);
  L.tileLayer.provider('CartoDB.Positron').addTo(map);
  // L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map);
  // L.tileLayer.provider('OpenTopoMap').addTo(map);
  // L.tileLayer.provider('Stamen.Watercolor').addTo(map);
  // L.tileLayer.provider('CartoDB.DarkMatter').addTo(map);
  // L.tileLayer.provider('Stamen.TonerLite').addTo(map);

  selectedTs = document.getElementById('controlInfo').getAttribute("ts");
  selectedVar = document.getElementById('controlInfo').getAttribute("xvar");
  scaleLevel = document.getElementById('controlInfo').getAttribute("range");
  varmode = document.getElementById('controlInfo').getAttribute("showdiff");

  var titleBox = L.control({ position: 'topleft' });
  titleBox.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'mapTitle');
    this._div.innerHTML = "<h1>Prezența la vot la referendumul pentru modificarea Constituției.</h1> <span> &larr; <a href='https://votcorect.ro'>votcorect.ro</a> / sursă date : <a target='_blank' href='https://prezenta.bec.ro'>BEC</a> </span>";
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
      '<div id="topControl">' +
      '<div id="timestamp" class="formControl"><span class="title">Timestamps</span>' +
      '<div id="wrapper_06_10"class="controlItem"><span id="06_10" data-target="ts" class="button btn-toggle tooltip" tooltip="6 oct, ora 10">S @10</span></div>' +
      '<div id="wrapper_06_13"class="controlItem"><span id="06_13" data-target="ts" class="button btn-toggle tooltip" tooltip="6 oct, ora 13">S @13</span></div>' +
      '<div id="wrapper_06_16"class="controlItem"><span id="06_16" data-target="ts" class="button btn-toggle tooltip" tooltip="6 oct, ora 16">S @16</span></div>' +
      '<div id="wrapper_06_19"class="controlItem"><span id="06_19" data-target="ts" class="button btn-toggle tooltip" tooltip="6 oct, ora 19">S @19</span></div>' +
      '<div id="wrapper_06_21"class="controlItem"><span id="06_21" data-target="ts" class="button btn-toggle tooltip" tooltip="6 oct, ora 21">S @21</span></div>' +
      '<div id="wrapper_07_10"class="controlItem"><span id="07_10" data-target="ts" class="button btn-toggle tooltip" tooltip="7 oct, ora 10">D @10</span></div>' +
      '<div id="wrapper_07_13"class="controlItem"><span id="07_13" data-target="ts" class="button btn-toggle tooltip" tooltip="7 oct, ora 13">D @13</span></div>' +
      '<div id="wrapper_07_16"class="controlItem"><span id="07_16" data-target="ts" class="button btn-toggle tooltip" tooltip="7 oct, ora 16">D @16</span></div>' +
      '<div id="wrapper_07_19"class="controlItem"><span id="07_19" data-target="ts" class="button btn-toggle tooltip" tooltip="7 oct, ora 19">D @19</span></div>' +
      '<div id="wrapper_07_21"class="controlItem"><span id="07_21" data-target="ts" class="button btn-toggle tooltip clicked" tooltip="7 oct, ora 21">D @21</span></div>' +
      '</div>' +
      '<div id="varSwitch"  class="formControl">'+
        '<span class="title">Vars</span>' +
        '<div id="wrapper_prezenta"class="controlItem"><span id="prezenta" data-target="xvar" class="button btn-toggle tooltip" tooltip="prezență de peste 50% (voturi pe lista permanentă / nr alegători înscriși)">prezență</span></div>' +
        '<div id="wrapper_LS"class="controlItem"><span id="LS" data-target="xvar" class="button btn-toggle tooltip clicked" tooltip="voturi pe lista suplimentară">liste suplimentare</span></div>' +
        '<div id="wrapper_LP"class="controlItem"><span id="LP" data-target="xvar" class="button btn-toggle tooltip" tooltip="voturi pe lista permanentă">liste permanente</span></div>' +
        '<div id="wrapper_UM"class="controlItem"><span id="UM" data-target="xvar" class="button btn-toggle tooltip" tooltip="voturi cu urnă mobilă">urne mobile</span></div>' +
        '<div id="wrapper_LT"class="controlItem"><span id="LT" data-target="xvar" class="button btn-toggle" >total voturi</span></div>' +
        '<div id="wrapper_ghost"class="controlItem"><span id="ghost" data-target="xvar" class="button btn-toggle tooltip" tooltip="secții cu mai puțin de 5 voturi">&lt; 5 voturi</span></div>' +
        '<div id="wrapper_dead"class="controlItem"><span id="dead" data-target="xvar" class="button btn-toggle tooltip" tooltip="secții unde nu s-a înregistrat niciun vot">niciun vot</span></div>' +
      '</div>' +
      '<div class="formControl">' +
      '<div id="xzoom" class="controlItem">' +
      '<span class="title">Scale</span>' +
      '<span class="button" id="zoomin">+</span>' +
      '<span class="button" id="zoomout">-</span>' +
      '</div>' +
      '</div>' +
      '<div id="maptype" class="formControl">' +
      '<span class="title">Mod afișare</span>' +
       '<div id="wrapper_showabs"class="controlItem"><span id="showabs"  data-target="showdiff" class="button btn-toggle tooltip clicked" tooltip="valori absolute" >abs</span></div>' +
       '<div id="wrapper_showdiff"class="controlItem"><span id="showdiff" data-target="showdiff" class="button btn-toggle tooltip" tooltip="creșterile de la un moment la altul">diff</span></div>' +
      '</div>' +
      '<a id="mobileMenu" onclick="document.querySelector(\'.leaflet-control-container\').classList.toggle(\'show\')">MENU</a>';
  };
  controlBox.addTo(map);
  /*end info bpx*/

  document.querySelector('#xzoom #zoomin').addEventListener("click", function() {
    currScaleLevel = Number(document.getElementById('controlInfo').getAttribute("range"));
    document.getElementById('controlInfo').setAttribute("range", Number(currScaleLevel) + .25);
    document.querySelector('#controlInfo .range').innerHTML = Number(currScaleLevel) + .25;
    scaleBubbles(Number(currScaleLevel) + .25)
  });

  document.querySelector('#xzoom #zoomout').addEventListener("click", function() {
    currScaleLevel = Number(document.getElementById('controlInfo').getAttribute("range"));
    document.getElementById('controlInfo').setAttribute("range", Number(currScaleLevel) - .25);
    document.querySelector('#controlInfo .range').innerHTML = Number(currScaleLevel) - .25;
    scaleBubbles(Number(currScaleLevel) - .25)
  });

  /*
      switches selected var / timestamp
   */
  var toggles = document.querySelectorAll('.controlItem .btn-toggle')
  for (i = 0; i < toggles.length; i++) {
    toggles[i].addEventListener("click", function() {
      document.querySelector('#controlInfo .' + this.getAttribute("data-target")).innerHTML = this.id;
      document.getElementById('controlInfo').setAttribute(this.getAttribute("data-target"), this.id);
      // geojsonLayer.setStyle(layerStyle);
      scaleBubbles(Number(scaleLevel));

      // remove class='clicked' from all siblings
      let zzx = this.parentElement.parentElement.childNodes;
      // console.log(zzx);
      for (ix = 1; ix < zzx.length; ix++) {
        zzx[ix].querySelector('.btn-toggle').classList.remove('clicked');
      }
      this.classList.add('clicked');
    });
  }

  function layerStyle(feature) {
    const max_radius = 50

    selectedTs = document.getElementById('controlInfo').getAttribute("ts");
    selectedVar = document.getElementById('controlInfo').getAttribute("xvar");
    scaleLevel = document.getElementById('controlInfo').getAttribute("range");
    varmode = document.getElementById('controlInfo').getAttribute("showdiff");
    let selectedTsIndex = timestamps.indexOf(selectedTs);
    var xStyle = {
      radius: 1,
      // weight: 2,
      // fillOpacity: 0.85,
      // stroke: true
    };

    // if (timestamps[selectedTsIndex - 1]) {
    // let previousTS=timestamps[selectedTsIndex - 1];
    if (varmode == 'showabs') {
      switch (selectedVar) {
        case 'prezenta':
          value = feature.props.ts[selectedTs]['LT'] * 2 / feature.props.pe_lista;
          max = 7;
          break;
        case 'dead':
          value = feature.props.ts[selectedTs]['LT'] == 0 ? 5 : 0;
          max = 35;
          break;
        case 'ghost':
          // value = (feature.props.ts[selectedTs]['LT'] <= 5) && (feature.props.ts[selectedTs]['LT'] <= 0) ? 5 : 0;
          value = (feature.props.ts[selectedTs]['LT'] <= 5) && (feature.props.ts[selectedTs]['LT'] >= 0) ? 5 : 0;
          max = 35;
          break;
        case 'LP':
          value = feature.props.ts[selectedTs]['LP'];
          max = 1527;
          break;
        case 'LS':
          value = feature.props.ts[selectedTs]['LS'];
          // value = feature.props.ts[selectedTs]['LT']   == 0 ? 5 : 0;
          max = 1100;
          break;
        case 'UM':
          value = feature.props.ts[selectedTs]['UM'];
          max = 500;
          break;
        case 'LT':
          value = feature.props.ts[selectedTs]['LT'];
          max = 1600;
          break;
        case 'observatori':
          value = feature.props.observatori ? 5 : 0;
          max = 40;
          break;

        default:
          value = feature.props.ts[selectedTs][selectedVar];
          max = 1000;
          alert('unknown selected var');
      }
    } else {
      // SHOW DELTA
      if (timestamps.indexOf(selectedTs) >> 0) {
        previousTS = timestamps[timestamps.indexOf(selectedTs)-1]; //get previous timestamp index
        switch (selectedVar) {
          case 'prezenta':
            value = (feature.props.ts[selectedTs]['LT'] - feature.props.ts[previousTS]['LT']) * 5 / feature.props.pe_lista;
            max = 10;
            break;
          case 'LP':
            value = feature.props.ts[selectedTs]['LP'] - feature.props.ts[previousTS]['LP'];
            max = 500;
            break;
          case 'LS':
            value = feature.props.ts[selectedTs]['LS'] - feature.props.ts[previousTS]['LS'];
            max = 300;
            break;
          case 'UM':
            value = feature.props.ts[selectedTs]['UM'] - feature.props.ts[previousTS]['UM'];
            max = 330;
            break;
          default:
            alert('unknown selected var');
        }
      }
    }

    // xStyle.radius =  (value / max).toFixed(2) * max_radius * scaleLevel;
    xStyle.radius = (value / max) > 0.1 ? (value / max).toFixed(2) * max_radius * scaleLevel : 0.001;
    // xStyle.fillColor = (value > 100) ? getColor(value, max) : 'orange';
    xStyle.fillColor = getColor(value, max);
    xStyle.weight = value >> 0 ? true : false;
    xStyle.color = 'White';
    xStyle.fillOpacity = value >> 0 ? 0.85 : 0
    xStyle.stroke = value >> 0 ? true : false
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
    out += locationProfie(feature.props.ts, feature.props.pe_lista);
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


  function scaleBubbles(xvalue) {
    // document.querySelector('#controlInfo .range').innerHTML=value;
    // document.getElementById('scale').innerHTML = xvalue;
    // document.getElementById('scale').value = xvalue;
    document.getElementById('controlInfo').setAttribute("range", xvalue);
    document.querySelector('#controlInfo .range').innerHTML = xvalue;
    geojsonLayer.setStyle(layerStyle);
    document.getElementsByTagName("BODY")[0].className='ts_' + selectedTs + ' var_' + selectedVar + ' mode_' + varmode;
  }

  function locationProfie(xjson, prezenta) {
    // return JSON.stringify(xjson);
    let xout = '<div class="locBadge">';
    xout += '<table><thead><tr> <th>tstamp</th><th>LP</th><th>LS</th><th>UM</th><th>LT</th><th>LS/LP</th><th>prezență</th></tr></thead><tbody>';

    let svgplotLS = '';
    let svgplotLT = '';
    let svgdataLS = [];
    let svgdataPrez = [];
    let last = '';
    for (var timestamp in xjson) {
      if (xjson.hasOwnProperty(timestamp)) {
        xout += '<tr class="ts_' + timestamp + '">';
        xout += "<td>" + timestamp + "</td>";
        xout += " <td class=x" + xjson[timestamp]['LP'] + ">" + xjson[timestamp]['LP'] + '</td>';
        xout += " <td class=x" + xjson[timestamp]['LS'] + ">" + xjson[timestamp]['LS'] + '</td>';
        xout += " <td class=x" + xjson[timestamp]['UM'] + ">" + xjson[timestamp]['UM'] + '</td>';
        xout += " <td class=x" + xjson[timestamp]['LT'] + ">" + xjson[timestamp]['LT'] + '</td>';
        xout += " <td>" + (xjson[timestamp]['LS'] * 100 / xjson[timestamp]['LP']).toFixed(1) + '<small>&#37;</small></td>';
        xout += " <td>" + (xjson[timestamp]['LT'] * 100 / prezenta).toFixed(1) + '<small>&#37;</small></td>';
        xout += '</tr>';
        svgdataLS[timestamp] = xjson[timestamp]['LS'];
        svgdataPrez[timestamp] = (xjson[timestamp]['LT'] * 1000 / prezenta).toFixed(0)
        last = timestamp;
        // svgplot += ii*20 + ',' + xjson[timestamp]['LS']/10 + ' ';

      }
    }
    /*   sparkline = '<svg class="sparkline x' + timestamp + xjson[timestamp]['LP'] + xjson[timestamp]['LT'] +'" width="100" height="30" stroke-width="3"></svg>';
          xout += '</table>' + sparkline + '</div>';
          sparkline(document.querySelector('x' + timestamp + xjson[timestamp]['LP'] + xjson[timestamp]['LT'] + ''), ['      + svgplot +']);*/
    let ii = 0;
    let beforeLS = 0;
    for (oneTs in svgdataLS) {
      // console.log(oneTs);
      svgplotLS += ii * 30 + ',' + (Number(svgdataLS[last]) - Number(svgdataLS[oneTs])) / 5 + ' ' +
        (ii * 30 + 15) + ',' + (Number(svgdataLS[last]) - Number(svgdataLS[oneTs])) / 5 + ' ';
      // svgplot += ii*30 + ',' + (Number(svgdataLS[oneTs]) - beforeLS )+ ' ';
      beforeLS = Number(svgdataLS[oneTs]);
      ii++;
    }
    svgplotLS = '<svg viewBox="0 0 300 140"  width="140" height="100" class="xchart"><g class="labels x-labels"><text x="5" y="5" class="label-title">Liste suplimentare</text></g><polyline fill="none" stroke="red" stroke-width="4" points=" ' + svgplotLS + '"/></svg>';

    ii = 0;
    let beforeLT = 0;
    for (oneTs in svgdataPrez) {
      // console.log(oneTs);
      svgplotLT += ii * 30 + ',' + (Number(svgdataPrez[last]) - Number(svgdataPrez[oneTs])) / 5 + ' ' +
        (ii * 30 + 15) + ',' + (Number(svgdataPrez[last]) - Number(svgdataPrez[oneTs])) / 5 + ' ';
      // svgplot += ii*30 + ',' + (Number(svgdataPrez[oneTs]) - beforeLT )+ ' ';
      beforeLT = Number(svgdataPrez[oneTs]);
      ii++;
    }
    svgplotLT = '<svg viewBox="0 0 300 140"  width="140" height="100" class="xchart"><g class="labels x-labels"><text x="5" y="5" class="label-title">Prezență</text></g><polyline fill="none" stroke="blue" stroke-width="4" points=" ' + svgplotLT + '"/></svg>';

    xout += '</table>' + svgplotLS + svgplotLT + '</div>';
    return xout;
  }


  function getColor(d, max) {
    // x = Math.round(d / 2, 0);

    /*  COLOR
      H:  0/360° reds, 120° greens, 240° blues
      */

    /* SATURATION
      S: 0-100%
      0 → 50
      max → 100
     */
    // sat = d - max + 100;
    sat = Math.round(d * 60 / max) + 60;
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
    zecolor = Math.round(d * 360 / max);
    // return 'hsla(350,' + sat + '%,' + light + '%,' + alpha + ')';
    return 'hsla(' + zecolor + ',' + sat + '%,' + light + '%)';

  }

  // https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
  function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'my_data.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function() {
      if (xobj.readyState == 4 && xobj.status == "200") {
        // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
        callback(xobj.responseText);
      }
    };
    xobj.send(null);
  }