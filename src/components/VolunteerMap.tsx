import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    L: any;
  }
}

export default function VolunteerMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    // Initialize map centered on UCLA
    const map = window.L.map(mapRef.current).setView([34.0689, -118.4452], 13);

    // Add OpenStreetMap tiles
    window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // UCLA Dining Halls
    const diningHalls = [
      { lat: 34.0689, lng: -118.4452, name: 'Bruin Plate' },
      { lat: 34.0707, lng: -118.4500, name: 'De Neve' },
      { lat: 34.0722, lng: -118.4511, name: 'Feast at Rieber' },
      { lat: 34.0661, lng: -118.4421, name: 'Epicuria at Covel' }
    ];

    // Shelters
    const shelters = [
      { lat: 34.0689, lng: -118.4400, name: 'Bruin Shelter' },
      { lat: 34.0522, lng: -118.2437, name: 'OPCC' },
      { lat: 34.0522, lng: -118.2500, name: 'The Midnight Mission' },
      { lat: 34.0400, lng: -118.2500, name: 'Union Rescue Mission' },
      { lat: 34.0600, lng: -118.3000, name: 'Harvest Home Inc' },
      { lat: 34.0900, lng: -118.3400, name: 'Gardner Street Women\'s Bridge' },
      { lat: 34.0800, lng: -118.3200, name: 'YWCA' },
      { lat: 34.1200, lng: -118.2800, name: 'The Arroyo - Women\'s Shelter' },
      { lat: 34.1000, lng: -118.3600, name: 'Loving Hands Children\'s Home' },
      { lat: 34.0700, lng: -118.3800, name: 'Help for Orphans International' },
      { lat: 34.0950, lng: -118.3300, name: 'New Beginnings Mai Am Organization' },
      { lat: 34.1028, lng: -118.3267, name: 'Hollywood Food Coalition' },
      { lat: 34.0928, lng: -118.3267, name: 'Food On Foot' },
      { lat: 34.0500, lng: -118.2800, name: 'Nourish LA' },
      { lat: 34.0689, lng: -118.4400, name: 'Center For Study Of Urban Poverty' },
      { lat: 34.0600, lng: -118.2900, name: 'OBKLA Our Big Kitchen LA' }
    ];

    // Add dining hall markers (blue)
    diningHalls.forEach(hall => {
      window.L.marker([hall.lat, hall.lng], {
        icon: window.L.divIcon({
          className: 'custom-div-icon',
          html: '<div style="background-color: #3B82F6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })
      })
        .addTo(map)
        .bindPopup(`<b>${hall.name}</b><br>UCLA Dining Hall`);
    });

    // Add shelter markers (red)
    shelters.forEach(shelter => {
      window.L.marker([shelter.lat, shelter.lng], {
        icon: window.L.divIcon({
          className: 'custom-div-icon',
          html: '<div style="background-color: #EF4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })
      })
        .addTo(map)
        .bindPopup(`<b>${shelter.name}</b><br>Shelter`);
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  return (
    <div>
      <div ref={mapRef} style={{ height: '300px', width: '100%' }} />
      <div className="mt-2 text-xs text-gray-600 flex gap-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>UCLA Dining Halls</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Shelters</span>
        </div>
      </div>
    </div>
  );
}