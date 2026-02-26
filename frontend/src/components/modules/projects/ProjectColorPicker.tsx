import React from 'react';

interface ProjectColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#6366f1', // Indigo (default)
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#ef4444', // Red
];

export function ProjectColorPicker({ value, onChange }: ProjectColorPickerProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        Project Color
      </label>
      <div className="flex flex-wrap items-center gap-3">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
              value === color ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
        
        {/* Custom hex color input */}
        <div className="relative flex items-center">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded-full cursor-pointer appearance-none border-0 p-0 overflow-hidden bg-transparent"
            aria-label="Pick custom color"
          />
        </div>
      </div>
      <input type="hidden" name="labelColor" value={value} />
    </div>
  );
}
