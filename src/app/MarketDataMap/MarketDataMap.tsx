import 'mapbox-gl/dist/mapbox-gl.css';
import DeckGL from '@deck.gl/react/typed';
import { Map } from 'react-map-gl';
import { useEffect, useState } from 'react';
import { GeoJsonLayer } from '@deck.gl/layers';

const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoibGFyc21pY2hhZWwiLCJhIjoiY2xsZG1tMWl3MGQ5bTNlcWhiaXp0YWlhNSJ9.Cf3LuoACqQY6pRwE_PhV8Q';

const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

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
          lineWidthScale: 5,
          lineWidthMinPixels: 2,
          getFillColor: (d: any) => [255, 0, 0, 255],
          getLineColor: (d: any) => [255, 0, 0, 255],
          getPointRadius: 100,
          getElevation: 300,
        }) as any,
      ]}
    >
      <Map
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v9"
      />
    </DeckGL>
  );
};

export { MarketDataMap };
