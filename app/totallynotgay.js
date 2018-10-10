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
  scaleLevel=document.getElementById('controlInfo').getAttribute("range");

function layerStyle(feature) {
  selectedLayer=document.getElementById('controlInfo').getAttribute("ts");
  selectedVar=document.getElementById('controlInfo').getAttribute("xvar");
  scaleLevel=document.getElementById('controlInfo').getAttribute("range");

  var xStyle = {weight: 2,fillOpacity: 0.9,stroke: true};
  xStyle.color = "White";
  xStyle.fillColor = "MediumSlateBlue";

  Object.keys(feature.props.sectii).forEach(function(k){
    xx=feature.props.sectii;
    total=[];
    Object.keys(xx).forEach(function(jk){
      Object.keys(xx[jk]['ts']).forEach(function(xk){
        zz=xx[jk]['ts'][xk];
        total[xk]=[] ;
        Object.keys(zz).forEach(function(nk){
          if (!total[xk][nk]) total[xk][nk] = 0 ;
            total[xk][nk]+=zz[nk];
          });
        });
      });
    });


//   switch(selectedVar) {
//     case 'muchextra':
//         radius=(feature.props.ts[selectedLayer]['LP'] + feature.props.ts[selectedLayer]['LS'] + feature.props.ts[selectedLayer]['UM'] - feature.props.ts[selectedLayer]['LT'])*2;
//         break;
//     case 'dead':
//         radius= feature.props.ts[selectedLayer]['LT']==0 ? 2 : 0;
//         break;
//     case 'ghost':
//         radius= (feature.props.ts[selectedLayer]['LT'] <=5) && (feature.props.ts[selectedLayer]['LT']>=0)  ? 2 : 0;
//         break;
//     case 'LP':
//         radius=Math.round(feature.props.ts[selectedLayer][selectedVar]/25,0);
//         break;
//     case 'UM':
//         radius=Math.round(feature.props.ts[selectedLayer][selectedVar]/25,0);
//         break;
//     case 'LT':
//         radius=Math.round(feature.props.ts[selectedLayer][selectedVar]/60,0);
//         break;
//     case 'extremes':
//         // here we should record the biggest change
//         break;
//     default:
//       radius=Math.round(feature.props.ts[selectedLayer][selectedVar]/10,0);
//   }


  radius=Math.round(total[selectedLayer][selectedVar]/scaleLevel,0);
  // xStyle.fillColor =  "hsl(74, "+ radius*2 +", 50%)";
  xStyle.radius=radius;
  // xStyle.radius=3;

return xStyle;
}


// Add custom popups to each using our custom feature properties
geojsonLayer.on("layeradd", function(e) {
  var marker = e.layer,
  feature = marker.feature;

  // Create custom popup content
  var out = "<u><b>" + feature.props.loc + "</b> " + feature.props.jud  + "</u><br/>";
  // out += "" +  feature.props.localitate + ", "+ feature.props.jud + "<br/>pe lista: " + feature.props.pe_lista + "";

  // out += JSON.stringify(feature.props, null, 2)
    // out += JSON.stringify(feature.props.sectii, null, 2)
    out += locationProfie(feature.props.sectii);
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


  function locationProfie(xjson){
 // return JSON.stringify(xjson);
return '';
    // let xout='';
    // for (var xsectie in xjson) {
    //     if (xjson.hasOwnProperty(xsectie)) {
    //         // console.log(key + " -> " + p[key]);
    //       xout+=xjson[xsectie]['nume_sectie'] ;
    //       xout+='<table class="locBadge"><thead><tr><th>TS</th><th>LP</th><th>LS</th><th>UM</th><th>LT</th></tr></thead><tbody>' ;
    //       for (var ykey in xjson[xsectie]['ts']) {
    //         if (xjson[xsectie]['ts'].hasOwnProperty(ykey)) {
    //           // xout+= "<br>ts: "  + ykey;
    //           var xx = xjson[xsectie]['ts'][ykey];
    //           // xout+="\n x " + JSON.stringify(xx);
    //           xout+='<tr>';
    //            xout+= "<td>"  + ykey + "</td>";
    //           xout+=" <td>" +  xx['LP'] + '</td>';
    //           xout+=" <td>" +  xx['LS'] + '</td>';
    //           xout+=" <td>" +  xx['UM'] + '</td>';
    //           xout+=" <td>" +  xx['LT'] + '</td>';
    //           xout+='</tr>';
    //       }
    //     }
    //     xout+='</table>'
    //   }
    // }
    // return   xout ;
  }

  function scaleBubbles(value){
document.querySelector('#controlInfo .range').innerHTML=value;
document.getElementById('controlInfo').setAttribute("range", value);
geojsonLayer.setStyle(layerStyle);
  }