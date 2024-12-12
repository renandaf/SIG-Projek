import './style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

//lirabry tambahan
import { Vector as VectorSource } from 'ol/source.js';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import { fromLonLat } from 'ol/proj.js';

import { Icon, Style } from 'ol/style.js';

import Overlay from 'ol/Overlay.js';
import {Fill, Stroke, Text} from 'ol/style';

const container = document.getElementById('popup');
const content_element = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');
//Create overlay popup

function getColorForId(fid) {
  // Example: Cycle through colors based on FID (adjust as needed)
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
        color: getColorForId(fid), // Get fill color based on FID
      }),
      stroke: new Stroke({
        color: '#333',
        width: 2,
      }),
      text: new Text({
        font: '12px Calibri,sans-serif',
        fill: new Fill({
          color: '#000',
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 3,
        }),
        text: feature.get('NAMOBJ'), // Access the 'name' property 
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

const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});
//End.

const map = new Map({
  target: 'map',
  overlays:[overlay], // tambah overlay
  layers: [
    new TileLayer({
      source: new OSM()
    }),kecamatan,banjir    //memanggil variasi data
  ],
  view: new View({
    center: fromLonLat([101.438309, 0.510440]),
    zoom: 12
  })
});

// map.addOverlay(overlay); //untuk menambah overlay
// JS for click popup
map.on('singleclick', function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  if (!feature) {
    return;
  }
  const coordinate = evt.coordinate;
  const content = '<h3>Nama jalan:</h3>' + '<p>' +feature.get('NAMA') + '</p><br>' + '<img src="'+feature.get('FOTO')+'"></img>';
  
  content_element.innerHTML = content;
  overlay.setPosition(coordinate);
});

//Click handler to hide popup
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};


