"use client";
import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map.js";
import View from "ol/View.js";
import Overlay from "ol/Overlay.js";
import LayerTile from "ol/layer/Tile.js";
import SourceOSM from "ol/source/OSM.js";
import { toStringHDMS } from "ol/coordinate";
import { toLonLat } from "ol/proj";
import * as proj from "ol/proj";
import "./map.css";

const posDelhi = proj.fromLonLat([77.1025, 28.7041]);

const MapComponent = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [popupOverlay] = useState(
    new Overlay({ element: document.createElement("div") })
  );
  const [center, setCenter] = useState(posDelhi);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    const mapInstance = new Map({
      target: mapRef.current,
      layers: [
        new LayerTile({
          source: new SourceOSM(),
        }),
      ],
      view: new View({
        center: center,
        zoom: zoom,
      }),
    });

    mapInstance.on("moveend", () => {
      let newCenter = mapInstance.getView().getCenter();
      let newZoom = mapInstance.getView().getZoom();
      setCenter(newCenter);
      setZoom(newZoom);
    });

    // ==========================blue pinpoint ================================

    const overlay = new Overlay({
      position: posDelhi,
      element: popupOverlay.getElement(), // Corrected: Should be popupOverlay.getElement()
      positioning: "center-center",
      stopEvent: false,
    });

    mapInstance.addOverlay(overlay);

    const content = document.getElementById("popup-content");
    const closer = document.getElementById("popup-closer");

    const popupOverlayElement = document.getElementById("popup-overlay");
    if (popupOverlayElement) {
      popupOverlay.setElement(popupOverlayElement);
    }

    closer?.addEventListener("click", () => {
      overlay.setPosition(undefined);
    });

    mapInstance.on("singleclick", (evt) => {
      const coordinate = evt.coordinate;
      const hdms = toStringHDMS(toLonLat(coordinate));
      if (content) {
        content.innerHTML =
          "<p>Location Coordinates:</p><code>" + hdms + "</code>";
      }
      overlay.setPosition(coordinate);
    });

    setMap(null);

    return () => {
      mapInstance.setTarget(undefined);
    };
  }, []);

  return (
    <div>
      <div ref={mapRef} id="map" className="h-[70vh] w-[100%]" />
      {/* Corrected: Use popupOverlay.getElement() instead of id */}
      <div ref={popupOverlay.getElement()} title="overlay" />
      <div
        className="blue-circle"
        id="popup-overlay"
        title="Welcome to OpenLayers"
      />
      <div className="ol-popup" id="popup">
        <a href="#" id="popup-closer" className="ol-popup-closer" />
        <div id="popup-content" style={{ color: "black" }} />
      </div>
    </div>
  );
};

export default MapComponent;
