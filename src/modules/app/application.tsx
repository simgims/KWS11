import React, { useEffect, useRef } from "react";
import { Map, MapBrowserEvent, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import "ol/ol.css";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

useGeographic();

const map = new Map({
  view: new View({ center: [10.8, 59.9], zoom: 13 }),
  layers: [
    new TileLayer({ source: new OSM() }),
    new VectorLayer({
      source: new VectorSource({ url: "/api/skoler", format: new GeoJSON() }),
    }),
  ],
});

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    map.setTarget(mapRef.current!);

    map.on("singleclick", (evt: MapBrowserEvent<MouseEvent>) => {
      map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        const schoolName = feature.get("skolenavn");
        if (schoolName) {
          alert(`School: ${schoolName}`);
        }
      });
    });
  }, []);

  return <div ref={mapRef}></div>;
}
