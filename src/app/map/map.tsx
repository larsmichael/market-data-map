import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import DeckGL from '@deck.gl/react/typed';
import { Map } from 'react-map-gl';

/* eslint-disable-next-line */
export interface MapProps {}

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoibGFyc21pY2hhZWwiLCJhIjoiY2xsZG1tMWl3MGQ5bTNlcWhiaXp0YWlhNSJ9.Cf3LuoACqQY6pRwE_PhV8Q";

const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

const layers: never[] = [];

export function MarketDataMap(props: MapProps) {
  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    >
      <Map
       mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
       mapStyle="mapbox://styles/mapbox/light-v9"
      />
    </DeckGL>
  );
}

export default Map;
