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
    const [locationLabels, setLocationLabels] = useState<string[]>([]);
    const [locations, setLocations] = useAtom(locationsAtom);

    const createFuturisticDot = (label: string) =>
        L.divIcon({
            className: '',
            html: `
            <div class="hud-dot">
              <div class="hud-glow" style="position: absolute; left: 7px;"></div>
              <div class="hud-label">
                ${label}
              </div>
            </div>
          `,
            iconSize: [30, 30],
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
            }, 300);

            return () => clearInterval(interval);
        }
    }, [locations]);

    useEffect(() => {
        // for the latest point, animate the word typewriter style 
        if (visiblePoints.length > 0) {
            const latestLocation = locations[visiblePoints.length - 1]?.name || "";
            let currentLabel = "";
            let index = 0;

            const interval = setInterval(() => {
            if (index < latestLocation.length) {
                currentLabel += latestLocation[index];
                setLocationLabels(prev => {
                const updatedLabels = [...prev];
                updatedLabels[visiblePoints.length - 1] = currentLabel;
                return updatedLabels;
                });
                index++;
            } else {
                clearInterval(interval);
            }
            }, 100);

            return () => clearInterval(interval);
        }
    }, [visiblePoints.length]);

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
                    icon={createFuturisticDot(`${locations[i]?.name.toLocaleUpperCase()}`)}
                >
                    <Popup>
                        <div className="hud-popup">
                            <div className="hud-header font-mono" style={{ fontFamily: 'Orbitron-Bold', color: `rgb(255, 255, 255)` }}>
                                {locations[i]?.name.toLocaleUpperCase()}
                            </div>
                            <div className="hud-body  font-mono">
                                <h3></h3>
                                <p>{locations[i]?.explanation}</p>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
