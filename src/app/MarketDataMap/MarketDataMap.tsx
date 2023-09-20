import 'mapbox-gl/dist/mapbox-gl.css';
import DeckGL from '@deck.gl/react/typed';
import { Map } from 'react-map-gl';
import { useEffect, useState } from 'react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { scaleThreshold } from 'd3-scale';
import { RGBAColor } from 'deck.gl';

const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoibGFyc21pY2hhZWwiLCJhIjoiY2xsZG1tMWl3MGQ5bTNlcWhiaXp0YWlhNSJ9.Cf3LuoACqQY6pRwE_PhV8Q';

const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

const colorScaleFunction = scaleThreshold<number, RGBAColor>().domain([25, 50, 75]).range([[255, 0, 0, 100],
  [255, 255, 0, 100],
  [255, 165, 0, 100],
  [0, 128, 0, 100],
]);

const MarketDataMap = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/larsmichael/market-data-map/master/public/featurecollection-sample.json'
    )
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonData(data);
      })
      .catch((error) => {
        console.error('Error fetching GeoJSON:', error);
      });
  }, []);

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={[
        new GeoJsonLayer({
          id: 'geojson-layer',
          data: geoJsonData,
          pickable: true,
          lineWidthScale: 5,
          lineWidthMinPixels: 2,
          pointRadiusScale: 0.5,
          getFillColor: (d: any) => colorScaleFunction(d.properties.price),
          getLineColor: (d: any) => colorScaleFunction(d.properties.price),
          getPointRadius: 100,
          getElevation: 300,
        }) as any,
      ]}
      getTooltip={({object}) => object && object.properties.name + '\n' +
        object.properties.marketArea + '\n' +
        '$' +  (Math.round(object.properties.price * 100) / 100).toFixed(2)
      }
    >
      <Map
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v9"
      />
    </DeckGL>
  );
};


export { MarketDataMap };
