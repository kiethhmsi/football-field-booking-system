import React, { useEffect, useRef } from 'react';

/**
 * MapComponent - Reusable OpenStreetMap component using Leaflet
 * @param {Array} points - Array of points to display [{ lat, lng, title, popupContent }]
 * @param {Array} center - Initial map center [lat, lng]
 * @param {Number} zoom - Initial zoom level
 * @param {String} className - Custom CSS classes
 */
const MapComponent = ({ points = [], center = [10.762622, 106.660172], zoom = 13, className = "" }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    // Initialize map if not already done
    if (!mapInstance.current && window.L) {
      mapInstance.current = window.L.map(mapRef.current).setView(center, zoom);

      // Add TileLayer (CartoDB Voyager style - clean and modern)
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstance.current);
    }

    // Update markers
    if (mapInstance.current && window.L) {
      // Clear existing markers (basic approach for simple maps)
      mapInstance.current.eachLayer((layer) => {
        if (layer instanceof window.L.Marker) {
          mapInstance.current.removeLayer(layer);
        }
      });

      // Add new markers
      const customIcon = window.L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #10b981; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      points.forEach(point => {
        if (point.lat && point.lng) {
          const marker = window.L.marker([point.lat, point.lng], { icon: customIcon })
            .addTo(mapInstance.current);
          
          if (point.popupContent) {
            marker.bindPopup(point.popupContent);
          }
        }
      });

      // Auto-fit bounds if multiple points
      if (points.length > 1) {
        const bounds = window.L.latLngBounds(points.map(p => [p.lat, p.lng]));
        mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
      } else if (points.length === 1) {
        mapInstance.current.setView([points[0].lat, points[0].lng], 15);
      }
    }

    return () => {
      // Cleanup on unmount if needed
    };
  }, [points, center, zoom]);

  return (
    <div 
      ref={mapRef} 
      className={`rounded-3xl overflow-hidden shadow-inner border border-slate-100 ${className}`} 
      style={{ minHeight: '300px', width: '100%' }} 
    />
  );
};

export default MapComponent;
