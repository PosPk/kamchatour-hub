"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Position = [number, number]; // [lon, lat]
type Ring = Position[];
type Polygon = Ring[];

type GeoJSONGeometry = {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: Polygon | Polygon[];
};

type GeoJSONFeature = {
  type: 'Feature';
  geometry: GeoJSONGeometry;
  properties?: Record<string, unknown>;
};

type GeoJSON = {
  type: 'FeatureCollection' | 'Feature';
  features?: GeoJSONFeature[];
  geometry?: GeoJSONGeometry;
};

function computeBounds(geom: GeoJSONGeometry) {
  let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity;
  const push = (lon: number, lat: number) => {
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  };
  const asPolygons = geom.type === 'MultiPolygon' ? (geom.coordinates as Polygon[]) : [geom.coordinates as Polygon];
  for (const poly of asPolygons) {
    for (const ring of poly) {
      for (const [lon, lat] of ring) push(lon, lat);
    }
  }
  return { minLon, minLat, maxLon, maxLat };
}

function geoToSvgPath(geom: GeoJSONGeometry, viewW: number, viewH: number, padding = 8) {
  const { minLon, minLat, maxLon, maxLat } = computeBounds(geom);
  const lonSpan = Math.max(1e-9, maxLon - minLon);
  const latSpan = Math.max(1e-9, maxLat - minLat);
  const scaleX = (viewW - padding * 2) / lonSpan;
  const scaleY = (viewH - padding * 2) / latSpan;
  const scale = Math.min(scaleX, scaleY);
  const xOffset = (viewW - lonSpan * scale) / 2 - minLon * scale;
  // Y axis inverted (lat increases northward, SVG y increases downward)
  const yOffset = (viewH - latSpan * scale) / 2 + maxLat * scale;

  const project = (lon: number, lat: number) => [xOffset + lon * scale, yOffset - lat * scale] as [number, number];

  const parts: string[] = [];
  const polys = geom.type === 'MultiPolygon' ? (geom.coordinates as Polygon[]) : [geom.coordinates as Polygon];
  for (const poly of polys) {
    for (const ring of poly) {
      const ringPts = ring.map(([lon, lat]) => project(lon, lat));
      if (ringPts.length) {
        parts.push(`M ${ringPts[0][0].toFixed(2)} ${ringPts[0][1].toFixed(2)}`);
        for (let i = 1; i < ringPts.length; i++) {
          parts.push(`L ${ringPts[i][0].toFixed(2)} ${ringPts[i][1].toFixed(2)}`);
        }
        parts.push('Z');
      }
    }
  }
  return parts.join(' ');
}

export default function KamchatkaGeoButton() {
  const [geom, setGeom] = useState<GeoJSONGeometry | null>(null);
  const viewW = 500;
  const viewH = 600;

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch('/data/kamchatka_outline.geojson');
        const data: GeoJSON = await res.json();
        const feature = (data.type === 'FeatureCollection' ? data.features?.[0] : (data as any)) as GeoJSONFeature;
        if (feature?.geometry && isMounted) setGeom(feature.geometry);
      } catch (e) {
        console.error('Failed to load GeoJSON outline', e);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const d = useMemo(() => {
    if (!geom) return '';
    return geoToSvgPath(geom, viewW, viewH, 10);
  }, [geom]);

  return (
    <Link href="/hub/safety" aria-label="Открыть карту Камчатки" className="kamchatka-button inline-block">
      <svg viewBox={`0 0 ${viewW} ${viewH}`} width={viewW} height={viewH} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {d && (
          <path d={d} className="kamchatka-path" vectorEffect="non-scaling-stroke" shapeRendering="geometricPrecision" />
        )}
      </svg>
    </Link>
  );
}

