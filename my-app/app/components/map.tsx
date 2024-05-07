import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

const MapComponent: React.FC = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const map = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });

      return () => {
        // map.setTarget(null);
      };
    }
  }, []);

  return <div id="map" className="map w-full h-[25vh]"></div>;
};

export default MapComponent;
