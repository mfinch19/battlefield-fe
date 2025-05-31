import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const points = [
    { lat: 48.6, lng: 38.0 },  // Bakhmut
    { lat: 48.0, lng: 37.8 },  // Donetsk
    { lat: 47.1, lng: 37.6 },  // Mariupol
    { lat: 49.9, lng: 36.2 }, // Kharkiv
    { lat: 49.9, lng: 36.2 }, // Kharkiv

];

const Map = () => {
    const [visiblePoints, setVisiblePoints] = useState<{ lat: number; lng: number }[]>([]);

    // const customLabelIcon = (label: string) =>
    //     L.divIcon({
    //         className: "custom-label",
    //         html: label,
    //         iconSize: [60, 20], // optional sizing
    //         iconAnchor: [0, 0],  // tweak to position it above marker
    //     });


    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < points.length - 1) {
                console.log("Adding point:", points[i]);
                setVisiblePoints(prev => [...prev, points[i]]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 1000); // 1 marker per second

        return () => clearInterval(interval);
    }, []);

    return (
        <MapContainer
            bounds={[
            [52.5, 22.0],
            [44.0, 40.0],
            ]}
            className="w-full h-full"
        >
            <TileLayer
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
            />
            {visiblePoints.map((point, i) => (
            <Marker key={i} position={[point.lat, point.lng]}>
                <Popup>
                <h3 className="font-bold text-sm">title</h3>
                <p className="text-xs">this is a description</p>
                </Popup>
            </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
