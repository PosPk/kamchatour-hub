import Link from 'next/link';

export default function KamchatkaButton() {
  return (
    <Link href="/hub/safety" aria-label="Открыть карту Камчатки" className="kamchatka-button inline-block">
      <svg width="500" height="600" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <path
          className="kamchatka-path"
          d="M160,45
            C150,65 145,85 140,105
            C135,125 130,145 125,165
            C120,185 125,205 135,225
            C145,245 160,255 180,260
            C200,265 220,260 240,250
            C260,240 270,225 275,205
            C280,185 275,165 270,145
            C265,125 260,105 255,85
            C250,65 240,50 220,45
            C200,40 180,40 160,45 Z"
        />
      </svg>
    </Link>
  );
}

