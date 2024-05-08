"use client";
import React, { Component, RefObject } from "react";
import ReactDOM from "react-dom";
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
interface MapComponentProps {}

interface MapComponentState {
  center: [number, number];
  zoom: number;
}

export default class MapComponent extends Component<
  MapComponentProps,
  MapComponentState
> {
  mapRef: RefObject<HTMLDivElement>;
  map: Map;
  popupOverlay: Overlay;

  constructor(props: MapComponentProps) {
    super(props);
    this.state = { center: posDelhi, zoom: 10 };
    this.mapRef = React.createRef();
    this.popupOverlay = new Overlay({
      element: document.createElement("div"),
    });

    this.map = new Map({
      target: null, // set this in componentDidMount
      layers: [
        new LayerTile({
          source: new SourceOSM(),
        }),
      ],
      view: new View({
        center: this.state.center,
        zoom: this.state.zoom,
      }),
    });
  }

  componentDidMount() {
    if (this.mapRef.current) {
      this.map.setTarget(this.mapRef.current);
      // Listen to map changes
      this.map.on("moveend", () => {
        let center = this.map.getView().getCenter() as [number, number];
        let zoom = this.map.getView().getZoom();
        this.setState({ center, zoom });
      });

      // Basic overlay
      const overlay = new Overlay({
        position: posDelhi,
        element: document.getElementById("overlay") as HTMLElement,
        positioning: "center-center",
        stopEvent: false,
      });

      this.map.addOverlay(overlay);
      const content = document.getElementById("popup-content");
      const closer = document.getElementById("popup-closer");

      // Popup showing the position the user clicked
      this.popupOverlay.setElement(
        document.getElementById("popup-overlay") as HTMLElement
      );

      // Listener to add Popup overlay showing the position the user clicked
      closer?.addEventListener("click", () => {
        overlay.setPosition(undefined);
        closer.blur();
      });

      this.map.on("singleclick", (evt) => {
        const coordinate = evt.coordinate;
        const hdms = toStringHDMS(toLonLat(coordinate));

        if (content)
          content.innerHTML =
            "<p>Location Coordinates:</p><code>" + hdms + "</code>";
        overlay.setPosition(coordinate);
      });
    }
  }

  componentWillUnmount() {
    this.map.setTarget(undefined);
  }

  render() {
    return (
      <div>
        <div ref={this.mapRef} id="map" className="h-[100vh] w-[100%]" />
        <div className="blue-circle" id="overlay" title="overlay" />
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
  }
}
