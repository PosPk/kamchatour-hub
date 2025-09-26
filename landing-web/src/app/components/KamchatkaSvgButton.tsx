"use client";

import { useEffect, useMemo, useState } from 'react';

type G = { type: 'Polygon'|'MultiPolygon'; coordinates: any };

export default function KamchatkaSvgButton({ href = '/hub/safety' }: { href?: string }) {
  const [geom, setGeom] = useState<G|null>(null);
  const [customD, setCustomD] = useState<string | null>(null);
  useEffect(() => { (async () => {
    try {
      // Try to load a custom SVG path first
      const t = await fetch('/graphics/kamchatka-path.txt', { cache: 'no-store' });
      if (t.ok) {
        const pathText = (await t.text()).trim();
        if (pathText && pathText.startsWith('M')) { setCustomD(pathText); return; }
      }
    } catch {}
    try { const r = await fetch('/data/kamchatka_outline.geojson', { cache: 'no-store' }); const j = await r.json(); const f = j.type==='FeatureCollection'? j.features?.[0] : j; setGeom(f.geometry); } catch {}
  })(); }, []);
  const d = useMemo(() => {
    if (customD) return customD;
    if (!geom) return '';
    const viewW = 500, viewH = 600, pad = 10;
    let minLon=Infinity,minLat=Infinity,maxLon=-Infinity,maxLat=-Infinity;
    const polys = geom.type==='MultiPolygon' ? geom.coordinates : [geom.coordinates];
    polys.forEach((poly:any)=>poly.forEach((ring:any)=>ring.forEach(([lon,lat]:number[])=>{ if(lon<minLon)minLon=lon; if(lon>maxLon)maxLon=lon; if(lat<minLat)minLat=lat; if(lat>maxLat)maxLat=lat; })));
    const lonSpan=Math.max(1e-9,maxLon-minLon), latSpan=Math.max(1e-9,maxLat-minLat);
    const scale=Math.min((viewW-pad*2)/lonSpan,(viewH-pad*2)/latSpan);
    const xOffset=(viewW-lonSpan*scale)/2 - minLon*scale;
    const yOffset=(viewH-latSpan*scale)/2 + maxLat*scale;
    const project=(lon:number,lat:number)=>[xOffset+lon*scale, yOffset-lat*scale];
    const parts:string[]=[];
    polys.forEach((poly:any)=>poly.forEach((ring:any)=>{ const pts=ring.map(([lon,lat]:number[])=>project(lon,lat)); if(!pts.length) return; parts.push(`M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`); for(let i=1;i<pts.length;i++){ parts.push(`L ${pts[i][0].toFixed(2)} ${pts[i][1].toFixed(2)}`);} parts.push('Z'); }));
    return parts.join(' ');
  }, [geom]);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group inline-block">
      <div className="rounded-2xl border border-white/10 bg-black grid place-items-center map-button-glow">
        <svg viewBox="0 0 500 600" className="w-full h-auto">
          <path d={d || 'M160,45 C150,65 145,85 140,105 C135,125 130,145 125,165 C120,185 125,205 135,225 C145,245 160,255 180,260 C200,265 220,260 240,250 C260,240 270,225 275,205 C280,185 275,165 270,145 C265,125 260,105 255,85 C250,65 240,50 220,45 C200,40 180,40 160,45 Z'} className="fill-black" stroke="#FFD700" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
        </svg>
      </div>
    </a>
  );
}

