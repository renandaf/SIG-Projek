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
import {Fill, Stroke, Text} from 'ol/style';

function getColorForId(fid) {
  const colors = ['#006400', '#00008b', '#b03060', '#ff4500', '#ffd700','#7fff00','#00ffff','#ff00ff','#6495ed','#ffdab9','#ff0000','#8b4513']; 
  return colors[fid % colors.length]; 
}

// Untuk menampilkan polygon kecamatan dengan data .json
const kecamatan = new VectorLayer({
  background: '#1a2b39',
  source: new VectorSource({
    format: new GeoJSON(),
    url: 'data/BatasPekanbaruJSON.json'
  }),
  style: function(feature) {
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
    format: new GeoJSON(),
    url: 'data/databanjir.json'
  }),
  style: new Style({
    image: new Icon(({
      anchor: [0.5, 46],
      anchorXUnits: 'flaticon',
      anchorYUnits: 'pixels',
      src: 'icon/flood.png',
      width: 32,
      height: 32
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
    }),kecamatan,banjir  //memanggil variasi data
  ],
  view: new View({
    center: fromLonLat([101.438309, 0.510440]),
    zoom: 12
  })
});

// banjir.getSource().on('addfeature', () => {
//   var a = filterPointsInsidePolygon(banjir.getSource().getFeatures(), kecamatan.getSource().getFeatureById(5));

//   const pointSource = new ol.source.Vector({
//     features: a
//     });

//     // Create a vector layer to display the points
//     const pointLayer = new ol.layer.Vector({
//         source: pointSource
//     });

//     // Add the vector layer to the map
//     map.addLayer(pointLayer);
    
// });

map.addOverlay(popup);

map.on('singleclick', function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feat) {
    return feat;
  });
  if (feature.get('NAMA') != undefined) {
    const coordinates = feature.getGeometry().getCoordinates();
    const content = '<h3>Nama jalan:</h3>' + '<p>' +feature.get('NAMA') + '</p><br>' + '<img src="'+feature.get('FOTO')+'"></img>';
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
    'stroke-color': 'rgba(255, 255, 255, 0.7)',
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

rumbaiCheckbox.addEventListener('change', function () {
  kabRiau.setVisible(polygonLayerCheckbox.checked);
});

rumbaiPesisirCheckbox.addEventListener('change', function () {
  
});

senapelanCheckbox.addEventListener('change', function () {
  
});
sukajadiCheckbox.addEventListener('change', function () {
  
});
tampanCheckbox.addEventListener('change', function () {
  
});
kotaCheckbox.addEventListener('change', function () {
  
});
bukitRayaCheckbox.addEventListener('change', function () {
  
});
marpoyanDamaiCheckbox.addEventListener('change', function () {
  
});
sailCheckbox.addEventListener('change', function () {
  
});
payungsekakiCheckbox.addEventListener('change', function () {
  
});

limapuluhCheckbox.addEventListener('change', function () {
  
});
tenayanRayaCheckbox.addEventListener('change', function () {
  
});

