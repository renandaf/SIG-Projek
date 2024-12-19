import './style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import Feature from 'ol/Feature';

//lirabry tambahan
import { Vector as VectorSource } from 'ol/source.js';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import { fromLonLat } from 'ol/proj.js';

import { Icon, Style } from 'ol/style.js';

import Overlay from 'ol/Overlay.js';
import { Fill, Stroke, Text } from 'ol/style';

function getColorForId(fid) {
  const colors = ['#edfbfd', '#c9f2fa', '#a6e9f6', '#82e0f3', '#5ed8ef', '#3acfec', '#17c6e8', '#13a8c5', '#1089a1', '#0c6b7d', '#094c59', '#052e36'];
  return colors[fid % colors.length];
}

// Untuk menampilkan polygon kecamatan dengan data .json
const kecamatan = new VectorLayer({
  background: '#FAF9FB',
  source: new VectorSource({
    format: new GeoJSON(),
    url: 'data/BatasPekanbaruJSON.json'
  }),
  style: function (feature) {
    const fid = feature.getId();
    return new Style({
      fill: new Fill({
        color: getColorForId(fid),
      }),
      stroke: new Stroke({
        color: '#333',
        width: 2,
      }),
      text: new Text({
        font: '15px Calibri,sans-serif',
        fill: new Fill({
          color: '#000',
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 3,
        }),
        text: feature.get('NAMOBJ'),
      }),
    });
  },
});
// end.

// Untuk menampilkan titik banjir dan icon
const banjir = new VectorLayer({
  source: new VectorSource({
    loader: function () {
      var url = 'http://localhost:5000/api/floods'
      var format = new GeoJSON();
      var source = this;

      //custom source listener
      this.set('loadstart', Math.random());

      getJson(url, '', function (response) {

        if (Object.keys(response).length > 0) {
          var features = format.readFeatures(response, {
            featureProjection: 'EPSG:3857'
          });
          source.addFeatures(features);
          //dispatch your custom event
          source.set('loadend', Math.random());
        }
      });
    }
  }),
  style: new Style({
    image: new Icon(({
      anchor: [0.5, 46],
      anchorXUnits: 'flaticon',
      anchorYUnits: 'pixels',
      src: 'icon/b.png',
      width: 35,
      height: 35
    }))
  })
});
// End.

function filterPointsInsidePolygon(points, polygonFeature) {
  const polygon = polygonFeature.getGeometry();

  if (!(polygon instanceof Polygon)) {
    console.error('The provided feature is not a polygon.');
    return [];
  }

  return points.filter((pointFeature) => {
    const point = pointFeature.getGeometry();
    if (point instanceof Point) {
      return polygon.intersectsCoordinate(point.getCoordinates());
    }
    return false;
  });
}

var source = banjir.getSource();
//custom source listener
source.set('loadstart', '');
source.set('loadend', '');

var getJson = function (url, data, callback) {

  // Must encode data
  if (data && typeof (data) === 'object') {
    var y = '', e = encodeURIComponent;
    for (var x in data) {
      y += '&' + e(x) + '=' + e(data[x]);
    }
    data = y.slice(1);
    url += (/\?/.test(url) ? '&' : '?') + data;
  }

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, true);
  xmlHttp.setRequestHeader('Accept', 'application/json, text/javascript');
  xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState != 4) {
      return;
    }
    if (xmlHttp.status != 200 && xmlHttp.status != 304) {
      callback('');
      return;
    }
    callback(JSON.parse(xmlHttp.response));
  };
  xmlHttp.send(null);
};


const popup = new Overlay({
  element: document.getElementById('popup'),
  positioning: 'top-center',
  stopEvent: false,
  offset: [0, -15]
});
//End.

const map = new Map({
  target: 'map',
  overlays: [popup],// tambah overlay
  layers: [
    new TileLayer({
      source: new OSM()
    }), kecamatan, banjir  //memanggil variasi data
  ],
  view: new View({
    center: fromLonLat([101.458309, 0.565440]),
    zoom: 12
  })
});

let bukitrayaLayer;
let limapuluhLayer;
let marpoyandamaiLayer;
let payungsekakiLayer;
let kotaLayer;
let rumbaiLayer;
let rumbaipesisirLayer;
let sailLayer;
let senapelanLayer;
let sukajadiLayer;
let tampanLayer;
let tenayanrayaLayer;

source.on('change:loadend', function (evt) {
  var bukitraya = filterPointsInsidePolygon(source.getFeatures(), kecamatan.getSource().getFeatureById(0));
  var limapuluh = filterPointsInsidePolygon(source.getFeatures(), kecamatan.getSource().getFeatureById(1));
  var marpoyandamai = filterPointsInsidePolygon(source.getFeatures(), kecamatan.getSource().getFeatureById(2));
  var payungsekaki = filterPointsInsidePolygon(source.getFeatures(), kecamatan.getSource().getFeatureById(3));
  var kota = filterPointsInsidePolygon(source.getFeatures(), kecamatan.getSource().getFeatureById(4));
  var rumbai = filterPointsInsidePolygon(source.getFeatures(), kecamatan.getSource().getFeatureById(5));
  var rumbaipesisir = filterPointsInsidePolygon(source.getFeatures(), kecamatan.getSource().getFeatureById(6));
  var sail = filterPointsInsidePolygon(source.getFeatures(), kecamatan.getSource().getFeatureById(7));
  var senapelan = filterPointsInsidePolygon(source.getFeatures(), kecamatan.getSource().getFeatureById(8));
  var sukajadi = filterPointsInsidePolygon(source.getFeatures(), kecamatan.getSource().getFeatureById(9));
  var tampan = filterPointsInsidePolygon(source.getFeatures(), kecamatan.getSource().getFeatureById(10));
  var tenayanraya = filterPointsInsidePolygon(source.getFeatures(), kecamatan.getSource().getFeatureById(11));

  var layerStyle = new Style({
    image: new Icon(({
      anchor: [0.5, 46],
      anchorXUnits: 'flaticon',
      anchorYUnits: 'pixels',
      src: 'icon/b.png',
      width: 35,
      height: 35
    }))
  })

  bukitrayaLayer = new VectorLayer({
    source: new VectorSource({
      features: bukitraya
    }),
    style: layerStyle
  });
  limapuluhLayer = new VectorLayer({
    source: new VectorSource({
      features: limapuluh
    }),
    style: layerStyle
  });
  marpoyandamaiLayer = new VectorLayer({
    source: new VectorSource({
      features: marpoyandamai
    }),
    style: layerStyle
  });
  payungsekakiLayer = new VectorLayer({
    source: new VectorSource({
      features: payungsekaki
    }),
    style: layerStyle
  });
  kotaLayer = new VectorLayer({
    source: new VectorSource({
      features: kota
    }),
    style: layerStyle
  });
  rumbaiLayer = new VectorLayer({
    source: new VectorSource({
      features: rumbai
    }),
    style: layerStyle
  });
  rumbaipesisirLayer = new VectorLayer({
    source: new VectorSource({
      features: rumbaipesisir
    }),
    style: layerStyle
  });
  sailLayer = new VectorLayer({
    source: new VectorSource({
      features: sail
    }),
    style: layerStyle
  });
  senapelanLayer = new VectorLayer({
    source: new VectorSource({
      features: senapelan
    }),
    style: layerStyle
  });
  sukajadiLayer = new VectorLayer({
    source: new VectorSource({
      features: sukajadi
    }),
    style: layerStyle
  });
  tampanLayer = new VectorLayer({
    source: new VectorSource({
      features: tampan
    }),
    style: layerStyle
  });
  tenayanrayaLayer = new VectorLayer({
    source: new VectorSource({
      features: tenayanraya
    }),
    style: layerStyle
  });

  map.addLayer(bukitrayaLayer);
  map.addLayer(limapuluhLayer);
  map.addLayer(marpoyandamaiLayer);
  map.addLayer(payungsekakiLayer);
  map.addLayer(kotaLayer);
  map.addLayer(rumbaiLayer);
  map.addLayer(rumbaipesisirLayer);
  map.addLayer(sailLayer);
  map.addLayer(senapelanLayer);
  map.addLayer(sukajadiLayer);
  map.addLayer(tampanLayer);
  map.addLayer(tenayanrayaLayer);
});

map.addOverlay(popup);

map.on('singleclick', function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feat) {
    return feat;
  });
  if (feature.get('NAMA') != undefined) {
    const coordinates = feature.getGeometry().getCoordinates();
    const content = '<h7>Nama jalan:</h7>' + '<h5>' + feature.get('NAMA') + '</h5><br>' + '<img src="' + feature.get('FOTO') + '" width=400 height=200></img>';
    document.getElementById('popup-content').innerHTML = content;
    popup.setPosition(coordinates);
  } else {
    popup.setPosition(undefined);
  }
});

const featureOverlay = new VectorLayer({
  source: new VectorSource(),
  map: map,
  style: {
    'stroke-color': '#FFEBB8',
    'stroke-width': 2,
  },
});

let highlight;
const highlightFeature = function (pixel) {
  const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
    return feature;
  });
  if (feature !== highlight) {
    if (highlight) {
      featureOverlay.getSource().removeFeature(highlight);
    }
    if (feature) {
      featureOverlay.getSource().addFeature(feature)
        ;
    }
    highlight = feature;
  }
};

const displayFeatureInfo = function (pixel) {
  const feature = map.forEachFeatureAtPixel(pixel, function (feat) {
    return feat;
  });
  const info = document.getElementById('info');
  if (feature) {
    info.innerHTML = feature.get('NAMOBJ') || '&nbsp;';
  } else {
    info.innerHTML = '&nbsp;';
  }
};

map.on('pointermove', function (evt) {
  if (evt.dragging) {
    popup.setPosition(undefined);
  }
  const pixel = map.getEventPixel(evt.originalEvent);
  highlightFeature(pixel);
  displayFeatureInfo(pixel);
});

const banjirCheckbox = document.getElementById('banjir')
const rumbaiCheckbox = document.getElementById('rumbai');
const rumbaiPesisirCheckbox = document.getElementById('rumbaipesisir');
const senapelanCheckbox = document.getElementById('senapelan');
const sukajadiCheckbox = document.getElementById('sukajadi');
const tampanCheckbox = document.getElementById('tampan');
const kotaCheckbox = document.getElementById('kota');
const bukitRayaCheckbox = document.getElementById('bukitraya');
const marpoyanDamaiCheckbox = document.getElementById('marpoyan');
const sailCheckbox = document.getElementById('sail');
const payungsekakiCheckbox = document.getElementById('payungsekaki');
const limapuluhCheckbox = document.getElementById('limapuluh');
const tenayanRayaCheckbox = document.getElementById('tenayanraya');

banjirCheckbox.addEventListener('change', function () {
  banjir.setVisible(banjirCheckbox.checked);
  rumbaiLayer.setVisible(banjirCheckbox.checked);
  rumbaipesisirLayer.setVisible(banjirCheckbox.checked);
  senapelanLayer.setVisible(banjirCheckbox.checked);
  sukajadiLayer.setVisible(banjirCheckbox.checked);
  tampanLayer.setVisible(banjirCheckbox.checked);
  kotaLayer.setVisible(banjirCheckbox.checked);
  bukitrayaLayer.setVisible(banjirCheckbox.checked);
  marpoyandamaiLayer.setVisible(banjirCheckbox.checked);
  sailLayer.setVisible(banjirCheckbox.checked);
  payungsekakiLayer.setVisible(banjirCheckbox.checked);
  limapuluhLayer.setVisible(banjirCheckbox.checked);
  tenayanrayaLayer.setVisible(banjirCheckbox.checked);


  rumbaiCheckbox.checked = banjirCheckbox.checked
  rumbaiCheckbox.disabled = banjirCheckbox.checked

  rumbaiPesisirCheckbox.checked = banjirCheckbox.checked
  rumbaiPesisirCheckbox.disabled = banjirCheckbox.checked

  senapelanCheckbox.checked = banjirCheckbox.checked
  senapelanCheckbox.disabled = banjirCheckbox.checked

  sukajadiCheckbox.checked = banjirCheckbox.checked
  sukajadiCheckbox.disabled = banjirCheckbox.checked

  kotaCheckbox.checked = banjirCheckbox.checked
  kotaCheckbox.disabled = banjirCheckbox.checked

  bukitRayaCheckbox.checked = banjirCheckbox.checked
  bukitRayaCheckbox.disabled = banjirCheckbox.checked

  marpoyanDamaiCheckbox.checked = banjirCheckbox.checked
  marpoyanDamaiCheckbox.disabled = banjirCheckbox.checked

  sailCheckbox.checked = banjirCheckbox.checked
  sailCheckbox.disabled = banjirCheckbox.checked

  payungsekakiCheckbox.checked = banjirCheckbox.checked
  payungsekakiCheckbox.disabled = banjirCheckbox.checked

  limapuluhCheckbox.checked = banjirCheckbox.checked
  limapuluhCheckbox.disabled = banjirCheckbox.checked

  tenayanRayaCheckbox.checked = banjirCheckbox.checked
  tenayanRayaCheckbox.disabled = banjirCheckbox.checked

  tampanCheckbox.checked = banjirCheckbox.checked
  tampanCheckbox.disabled = banjirCheckbox.checked
});

rumbaiCheckbox.addEventListener('change', function () {
  rumbaiLayer.setVisible(rumbaiCheckbox.checked);
});

rumbaiPesisirCheckbox.addEventListener('change', function () {
  rumbaipesisirLayer.setVisible(rumbaiPesisirCheckbox.checked);
});

senapelanCheckbox.addEventListener('change', function () {
  senapelanLayer.setVisible(senapelanCheckbox.checked);
});
sukajadiCheckbox.addEventListener('change', function () {
  sukajadiLayer.setVisible(sukajadiCheckbox.checked);
});
tampanCheckbox.addEventListener('change', function () {
  tampanLayer.setVisible(tampanCheckbox.checked);
});
kotaCheckbox.addEventListener('change', function () {
  kotaLayer.setVisible(kotaCheckbox.checked);
});
bukitRayaCheckbox.addEventListener('change', function () {
  bukitrayaLayer.setVisible(bukitRayaCheckbox.checked);
});
marpoyanDamaiCheckbox.addEventListener('change', function () {
  marpoyandamaiLayer.setVisible(marpoyanDamaiCheckbox.checked);
});
sailCheckbox.addEventListener('change', function () {
  sailLayer.setVisible(sailCheckbox.checked);
});
payungsekakiCheckbox.addEventListener('change', function () {
  payungsekakiLayer.setVisible(payungsekakiCheckbox.checked);
});

limapuluhCheckbox.addEventListener('change', function () {
  limapuluhLayer.setVisible(limapuluhCheckbox.checked);
});
tenayanRayaCheckbox.addEventListener('change', function () {
  tenayanrayaLayer.setVisible(tenayanRayaCheckbox.checked);
});