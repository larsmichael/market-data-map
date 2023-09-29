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
  longitude: -97.0000,
  latitude: 41.0000,
  zoom: 4.5,
  pitch: 0,
  bearing: 0,
};

const getToolTip = ({object} :any) => { 
  return object && object.properties.marketArea + '\n' +
  object.properties.name + '\n' +
  'DayAhead: $' +  (Math.round(object.properties.dayAheadPrice * 100) / 100).toFixed(2) + '\n' +
  'RealTime: $' +  (Math.round(object.properties.realTimePrice * 100) / 100).toFixed(2) + '\n' +
  'Diff: $' +  (Math.round(object.properties.priceDiff * 100) / 100).toFixed(2)
}

const colorScaleFunction = scaleThreshold<number, RGBAColor>()
.domain([0, 5, 10])
.range([ 
  [255, 0, 0, 255],
  [255, 165, 0, 255],
  [255, 255, 0, 255],
  [0, 128, 0, 255],
]);

const MarketDataMap = () => {
  const [geoJsonCaiso, setGeoJsonCaiso] = useState(null);
  const [geoJsonIsone, setGeoJsonIsone] = useState(null);
  const [layerCaiso, setLayerCaiso] = useState<boolean>(true);
  const [layerIsone, setLayerIsone] = useState<boolean>(false);

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/larsmichael/market-data-map/master/public/featurecollection-sample-caiso.json'
    )
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonCaiso(data);
      })
      .catch((error) => {
        console.error('Error fetching GeoJSON:', error);
      });
  }, []);

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/larsmichael/market-data-map/master/public/featurecollection-sample-isone.json'
    )
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonIsone(data);
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
          onChange={(event) => setLayerCaiso(event.currentTarget.checked)}
          defaultChecked={layerCaiso}
        ></input>CAISO
      </label>
      <label style={{ fontSize: 14, fontFamily: "Helvetica", position: 'fixed', top: 31, left: 35, zIndex: 10000 }}>
        <input
          type="checkbox"
          style={{ position: 'fixed', top: 30, left: 10, zIndex: 10000 }}
          onChange={(event) => setLayerIsone(event.currentTarget.checked)}
          defaultChecked={layerIsone}
        ></input>ISONE
      </label>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[
          ...(layerCaiso
            ? [
                new GeoJsonLayer({
                  id: 'geojson-layer',
                  data: geoJsonCaiso,
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
          ...(layerIsone
            ? [
                new GeoJsonLayer({
                  id: 'geojson-layer',
                  data: geoJsonIsone,
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
        getTooltip={getToolTip}
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
