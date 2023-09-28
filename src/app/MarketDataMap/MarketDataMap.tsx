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

const colorScaleFunction = scaleThreshold<number, RGBAColor>()
.domain([0, 5, 10])
.range([ 
  [255, 0, 0, 255],
  [255, 165, 0, 255],
  [255, 255, 0, 255],
  [0, 128, 0, 255],
]);

const MarketDataMap = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [layer1, setLayer1] = useState<boolean>(true);
  const [layer2, setLayer2] = useState<boolean>(false);

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/larsmichael/market-data-map/master/public/featurecollection-sample-caiso.json'
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
    <>
      <label style={{ fontSize: 14, fontFamily: "Helvetica", position: 'fixed', top: 11, left: 35, zIndex: 10000 }}>
        <input
          type="checkbox"
          style={{ position: 'fixed', top: 10, left: 10, zIndex: 10000 }}
          onChange={(event) => setLayer1(event.currentTarget.checked)}
        ></input>CAISO
      </label>
      <label style={{ fontSize: 14, fontFamily: "Helvetica", position: 'fixed', top: 31, left: 35, zIndex: 10000 }}>
        <input
          type="checkbox"
          style={{ position: 'fixed', top: 30, left: 10, zIndex: 10000 }}
          onChange={(event) => setLayer2(event.currentTarget.checked)}
        ></input>ISONE
      </label>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[
          ...(layer1
            ? [
                new GeoJsonLayer({
                  id: 'geojson-layer',
                  data: geoJsonData,
                  pickable: true,
                  lineWidthScale: 5,
                  lineWidthMinPixels: 2,
                  pointRadiusScale: 0.5,
                  getFillColor: (d: any) =>
                    colorScaleFunction(d.properties.priceDiff),
                  getLineColor: (d: any) =>
                    colorScaleFunction(d.properties.priceDiff),
                  getPointRadius: 100,
                  getElevation: 300,
                }) as any,
              ]
            : []),
          ...(layer2
            ? [
                new GeoJsonLayer({
                  id: 'geojson-layer',
                  data: geoJsonData,
                  pickable: true,
                  lineWidthScale: 5,
                  lineWidthMinPixels: 2,
                  pointRadiusScale: 0.5,
                  getFillColor: (d: any) =>
                    colorScaleFunction(d.properties.priceDiff),
                  getLineColor: (d: any) =>
                    colorScaleFunction(d.properties.priceDiff),
                  getPointRadius: 100,
                  getElevation: 300,
                }) as any,
              ]
            : []),
        ]}
        getTooltip={({object}) => object && object.properties.marketArea + '\n' +
          object.properties.name + '\n' +
          'DayAhead: $' +  (Math.round(object.properties.dayAheadPrice * 100) / 100).toFixed(2) + '\n' +
          'RealTime: $' +  (Math.round(object.properties.realTimePrice * 100) / 100).toFixed(2) + '\n' +
          'Diff: $' +  (Math.round(object.properties.priceDiff * 100) / 100).toFixed(2)
        }
      >
        <Map
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/mapbox/light-v9"
        />
      </DeckGL>
    </>
  );
};

export { MarketDataMap };
