"use client";
import React, { useEffect, useRef } from "react";
import Map from "ol/Map.js";
import View from "ol/View.js";
import { Draw, Modify, Snap } from "ol/interaction.js";
import { OSM, Vector as VectorSource } from "ol/source.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { get } from "ol/proj.js";
import { Style, Fill, Stroke, Circle as CircleStyle } from "ol/style.js";

const DrawOnMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef<Draw | null>(null);
  const snapRef = useRef<Snap | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const raster = new TileLayer({
      source: new OSM(),
    });

    const source = new VectorSource();

    const vector = new VectorLayer({
      source: source,
      style: [
        new Style({
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)",
          }),
          stroke: new Stroke({
            color: "#ffcc33",
            width: 2,
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: "#ffcc33",
            }),
          }),
        }),
      ],
    });

    const extent = get("EPSG:3857").getExtent().slice();
    extent[0] += extent[0];
    extent[2] += extent[2];

    const map = new Map({
      layers: [raster, vector],
      target: mapRef.current, // Changed from mapRef.current.id
      view: new View({
        center: [-11000000, 4600000],
        zoom: 4,
        extent,
      }),
    });

    const modify = new Modify({ source: source });
    map.addInteraction(modify);

    const typeSelect = document.getElementById("type") as HTMLSelectElement;

    const addInteractions = () => {
      drawRef.current = new Draw({
        source: source,
        type: typeSelect.value as any,
      });
      map.addInteraction(drawRef.current);
      snapRef.current = new Snap({ source: source });
      map.addInteraction(snapRef.current);
    };

    const handleTypeChange = () => {
      if (drawRef.current && snapRef.current) {
        map.removeInteraction(drawRef.current);
        map.removeInteraction(snapRef.current);
      }
      addInteractions();
    };

    typeSelect.onchange = handleTypeChange;

    addInteractions();

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  return (
    <div>
      <div ref={mapRef} className="map h-[70vh] w-[100%]"></div>{" "}
      {/* Changed from id="map" to ref={mapRef} */}
      <form>
        <label htmlFor="type">Geometry type &nbsp;</label>
        <select style={{ color: "black" }} id="type">
          <option value="Point">Point</option>
          <option value="LineString">LineString</option>
          <option value="Polygon">Polygon</option>
          <option value="Circle">Circle</option>
        </select>
      </form>
    </div>
  );
};

export default DrawOnMap;
