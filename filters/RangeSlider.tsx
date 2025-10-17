import * as React from "react";
import { Slider, Tooltip, IconButton } from "@mui/material";
import { fmtMMSS } from "@/lib/time";
import { Pencil } from "@phosphor-icons/react";

type Props = {
  label: string;
  value: [number, number];     // [minSec, maxSec]
  min?: number;                // default 0
  max?: number;                // e.g. 60*60
  step?: number;               // e.g. 5 sec
  onChange: (v: [number, number]) => void;
  disabled?: boolean;
};

export function RangeSlider({ label, value, min = 0, max = 3600, step = 5, onChange, disabled }: Props) {
  const [local, setLocal] = React.useState<[number, number]>(value);
  React.useEffect(() => setLocal(value), [value]);

  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">{label}</label>
      <div className="flex items-center gap-2">
        <Slider
          value={local}
          onChange={(_, v) => setLocal(v as [number, number])}
          onChangeCommitted={(_, v) => onChange(v as [number, number])}
          valueLabelDisplay="auto"
          valueLabelFormat={fmtMMSS}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          sx={{
            height: 4,
            '& .MuiSlider-thumb': { width: 12, height: 12 },
            '& .MuiSlider-valueLabel': { fontSize: 11, padding: '2px 6px' },
          }}
          aria-label={`${label} range`}
        />
        <Tooltip title="Edit exact values">
          <IconButton size="small" className="!p-1">
            <Pencil size={14}/>
          </IconButton>
        </Tooltip>
      </div>
      <div className="flex justify-between text-[11px] text-slate-500 tabular-nums mt-1">
        <span>{fmtMMSS(local[0])}</span>
        <span>{fmtMMSS(local[1])}</span>
      </div>
    </div>
  );
}