import type { WatermarkSettings } from "../lib/watermark";
import { PositionGrid } from "./PositionGrid";

type Props = {
  settings: WatermarkSettings;
  onChange: (patch: Partial<WatermarkSettings>) => void;
};

const Slider = ({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) => (
  <label className="block">
    <span className="mb-1 flex items-center justify-between text-[11px] font-semibold text-gray-700">
      {label}
      <span className="font-normal text-gray-400">{format(value)}</span>
    </span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="accent-olive-light w-full cursor-pointer"
    />
  </label>
);

export const WatermarkControls = ({ settings, onChange }: Props) => (
  <div className="space-y-4">
    <div>
      <p className="mb-1.5 text-[11px] font-semibold text-gray-700">위치</p>
      <PositionGrid
        value={settings.position}
        onChange={(position) => onChange({ position })}
      />
    </div>
    <Slider
      label="배지 크기"
      value={settings.scale}
      min={0.5}
      max={2}
      step={0.05}
      format={(v) => `${v.toFixed(2)}×`}
      onChange={(scale) => onChange({ scale })}
    />
    <Slider
      label="가장자리 여백"
      value={settings.paddingPct}
      min={0}
      max={10}
      step={0.5}
      format={(v) => `${v}%`}
      onChange={(paddingPct) => onChange({ paddingPct })}
    />
    <Slider
      label="불투명도"
      value={settings.opacity}
      min={0.2}
      max={1}
      step={0.05}
      format={(v) => `${Math.round(v * 100)}%`}
      onChange={(opacity) => onChange({ opacity })}
    />
    <Slider
      label="블러"
      value={settings.blur}
      min={0}
      max={0.3}
      step={0.01}
      format={(v) => `${Math.round((v / 0.3) * 100)}%`}
      onChange={(blur) => onChange({ blur })}
    />
    <Slider
      label="배경 농도"
      value={settings.tint}
      min={0}
      max={0.6}
      step={0.05}
      format={(v) => `${Math.round(v * 100)}%`}
      onChange={(tint) => onChange({ tint })}
    />
  </div>
);
