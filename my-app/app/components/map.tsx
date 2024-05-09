"use client";
import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map.js";
import View from "ol/View.js";
import Overlay from "ol/Overlay.js";
import LayerTile from "ol/layer/Tile.js";
import SourceOSM from "ol/source/OSM.js";
import { Coordinate, toStringHDMS } from "ol/coordinate";
import { toLonLat } from "ol/proj";
import * as proj from "ol/proj";
import "./map.css";

const posDelhi = proj.fromLonLat([77.1025, 28.7041]);

const MapComponent = () => {
  const mapRef = useRef(null);
  const popupOverlayRef = useRef<HTMLDivElement>(null);

  const [map, setMap] = useState<null>(null);
  const [popupOverlay] = useState<Overlay>(
    new Overlay({ element: document.createElement("div") })
  );
  const [center, setCenter] = useState(posDelhi);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    // const mapInstance = new Map({
    //   target: mapRef.current,
    //   layers: [
    //     new LayerTile({
    //       source: new SourceOSM(),
    //     }),
    //   ],
    //   view: new View({
    //     center: center,
    //     zoom: zoom,
    //   }),
    // });

    const mapInstance = new Map({
      target: mapRef.current as unknown as HTMLElement,
      layers: [
        new LayerTile({
          source: new SourceOSM(),
        }),
      ],
      view: new View({
        center: center as [number, number], // Assuming center is an array of numbers
        zoom: zoom as number, // Assuming zoom is a number
      }),
    });

    // mapInstance.on("moveend", () => {
    //   let newCenter = mapInstance.getView().getCenter();
    //   let newZoom = mapInstance.getView().getZoom();
    //   setCenter(newCenter);
    //   setZoom(newZoom);
    // });

    mapInstance.on("moveend", () => {
      let newCenter = mapInstance.getView().getCenter() as [number, number];
      let newZoom = mapInstance.getView().getZoom() as number;
      setCenter(newCenter);
      setZoom(newZoom);
    });

    // ==========================blue pinpoint ================================

    const overlay = new Overlay({
      position: posDelhi,
      element: popupOverlay.getElement(),
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

  useEffect(() => {
    if (popupOverlayRef.current) {
      popupOverlay.setElement(popupOverlayRef.current);
    }
  }, []);

  return (
    <div>
      <div ref={mapRef} id="map" className="h-[90vh] w-[100%]" />
      {/* Corrected: Use popupOverlay.getElement() instead of id */}
      <div ref={popupOverlayRef} title="overlay" />

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
