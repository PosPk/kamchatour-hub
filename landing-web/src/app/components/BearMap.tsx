"use client";

import { useEffect, useRef } from 'react';

export default function BearMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let map: any;
    (async () => {
      const L = await import('leaflet');
      // @ts-ignore
      await import('leaflet/dist/leaflet.css');
      if (!mapRef.current) return;
      map = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView([56, 160], 5);
      // Dark background (no tiles, just black div)
      const dark = L.tileLayer('', {});
      dark.addTo(map);
      // Draw Kamchatka outline
      const outlineRes = await fetch('/data/kamchatka_outline.geojson');
      const outlineGeo = await outlineRes.json();
      const outline = L.geoJSON(outlineGeo, {
        style: { color: '#ffffff', weight: 1.5, fill: false, opacity: 0.85 },
      }).addTo(map);
      try { map.fitBounds(outline.getBounds(), { padding: [10, 10] }); } catch {}
      const res = await fetch('/data/bears.geojson');
      const geo = await res.json();
      const icon = (severity: string) => L.divIcon({
        html: `<div style="background:${severity==='high'?'#FF3B30':severity==='medium'?'#FF9500':'#34C759'};width:12px;height:12px;border-radius:50%;border:2px solid rgba(255,255,255,0.9)"></div>`,
        className: '',
        iconSize: [12, 12],
      });
      L.geoJSON(geo, {
        pointToLayer: (feature: any, latlng: any) => L.marker(latlng, { icon: icon(feature.properties?.severity || 'low') }),
        onEachFeature: (feature: any, layer: any) => {
          const p = feature.properties || {};
          layer.bindPopup(`<b>${p.title || 'Наблюдение'}</b><br/>Статус: ${p.severity || '-'}<br/>Дата: ${p.date || '-'}`);
        },
      }).addTo(map);
    })();
    return () => { try { (map as any)?.remove(); } catch {} };
  }, []);
  return <div ref={mapRef} className="w-full h-72 rounded-2xl overflow-hidden border border-white/10 bg-black" />;
}

