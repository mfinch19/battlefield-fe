import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useAtom } from "jotai";
import coordinates from '../data/coordinates.json';

import { locationsAtom, visiblePointsAtom } from "../atom";
import L from "leaflet";

const points = [
    { lat: 48.6, lng: 38.0 },  // Bakhmut
    { lat: 48.0, lng: 37.8 },  // Donetsk
    { lat: 47.1, lng: 37.6 },  // Mariupol
    { lat: 49.9, lng: 36.2 }, // Kharkiv
    { lat: 49.9, lng: 36.2 }, // Kharkiv

];

const Map = () => {
    const [visiblePoints, setVisiblePoints] = useAtom(visiblePointsAtom);
    const [locations, setLocations] = useAtom(locationsAtom);

    const createOverlayMarker = (label: string) =>
        L.divIcon({
          className: '',
          html: `
            <div class="overlay-marker">
              <div class="overlay-ring"></div>
              <div class="overlay-label">${label}</div>
            </div>
          `,
          iconSize: [40, 30],
          iconAnchor: [15, 15],
        });

    useEffect(() => {
        if (locations && locations.length > 0) {
            let i = 0;
            const newCoordinates = locations.map(location => {
                const coordinate = coordinates[location.name as keyof typeof coordinates];
                if (!coordinate) {
                    console.warn(`No coordinate found for ${location.name}`);
                    return null;
                }
                if (coordinate.lat == null || coordinate.lon == null) {
                    console.warn(`Missing lat/lon for ${location.name}`, coordinate);
                    return null;
                }
                return { lat: coordinate.lat, lng: coordinate.lon };
            }).filter(coord => coord !== null) as { lat: number, lng: number }[];

            const interval = setInterval(() => {
                if (i < newCoordinates.length) {
                    setVisiblePoints(prev => [...prev, newCoordinates[i]]);
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [locations]);

    // should we make this one big screen? 

    return (
        <MapContainer
            bounds={[
                [52.5, 22.0],
                [44.0, 40.0],
            ]}
            className="w-full h-full"
        >
            <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            />
            {visiblePoints.map((point, i) => (



                <Marker
                    key={i}
                    position={[point.lat, point.lng]}
                    icon={createOverlayMarker(`${i + 1}. ${locations[i]?.name}`)}
                >
                    <Popup>
                        <h3 className="font-bold text-sm">{i + 1}. {locations[i]?.name}</h3>
                        <p className="text-xs">{locations[i]?.explanation}</p>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
