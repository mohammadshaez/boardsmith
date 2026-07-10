import { ChevronDown } from "lucide-react";

const Label = ({ children }) => (
  <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 block mb-1">
    {children}
  </label>
);

const NumberInput = ({ value, onChange, min, max, step = 1, suffix, tid }) => (
  <div className="relative">
    <input
      data-testid={tid}
      type="number"
      value={value ?? 0}
      onChange={(e) =>
        onChange(e.target.value === "" ? 0 : Number(e.target.value))
      }
      min={min}
      max={max}
      step={step}
      className="w-full h-8 px-2 pr-6 border border-neutral-200 rounded-md text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    {suffix && (
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-neutral-400 pointer-events-none">
        {suffix}
      </span>
    )}
  </div>
);

const ColorInput = ({ value, onChange, tid }) => (
  <div className="flex items-center gap-2 border border-neutral-200 rounded-md h-8 px-2 bg-white">
    <input
      data-testid={tid}
      type="color"
      value={value === "transparent" ? "#FFFFFF" : value}
      onChange={(e) => onChange(e.target.value)}
      className="w-5 h-5 rounded border-none cursor-pointer p-0"
    />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 text-xs font-mono bg-transparent focus:outline-none"
    />
  </div>
);

const Section = ({ title, children }) => (
  <div className="border-b border-neutral-200 px-4 py-4">
    <div className="flex items-center justify-between mb-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-700">
        {title}
      </div>
      <ChevronDown className="w-3 h-3 text-neutral-400" />
    </div>
    {children}
  </div>
);

const Row = ({ children }) => (
  <div className="grid grid-cols-2 gap-2">{children}</div>
);

export default function PropertiesPanel({
  selected,
  canvas,
  onCanvasChange,
  onUpdate,
  onUpdateProps,
  elementsCount,
}) {
  if (!selected) {
    return (
      <div className="flex-1" data-testid="props-empty">
        <div className="px-4 py-4 border-b border-neutral-200">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-700 mb-2">
            Canvas
          </div>
          <div className="text-xs text-neutral-500 mb-3">
            Nothing selected. Click an element on the artboard to edit it.
          </div>
        </div>
        <Section title="Artboard">
          <Row>
            <div>
              <Label>Width</Label>
              <NumberInput
                tid="canvas-w"
                value={canvas.width}
                onChange={(v) => onCanvasChange({ ...canvas, width: v })}
                min={200}
                suffix="px"
              />
            </div>
            <div>
              <Label>Height</Label>
              <NumberInput
                tid="canvas-h"
                value={canvas.height}
                onChange={(v) => onCanvasChange({ ...canvas, height: v })}
                min={200}
                suffix="px"
              />
            </div>
          </Row>
          <div className="mt-3">
            <Label>Background</Label>
            <ColorInput
              tid="canvas-bg"
              value={canvas.bg}
              onChange={(v) => onCanvasChange({ ...canvas, bg: v })}
            />
          </div>
        </Section>
        <div className="px-4 py-4 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
          {elementsCount} element{elementsCount === 1 ? "" : "s"} on canvas
        </div>
      </div>
    );
  }

  const p = selected.props || {};

  return (
    <div className="flex-1" data-testid="props-panel">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div
          className="text-xs font-medium capitalize"
          data-testid="props-type-label"
        >
          {selected.type} element
        </div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
          ID: {selected.id.slice(0, 8)}
        </div>
      </div>

      <Section title="Position">
        <Row>
          <div>
            <Label>X</Label>
            <NumberInput
              tid="prop-x"
              value={selected.x}
              onChange={(v) => onUpdate({ x: v })}
            />
          </div>
          <div>
            <Label>Y</Label>
            <NumberInput
              tid="prop-y"
              value={selected.y}
              onChange={(v) => onUpdate({ y: v })}
            />
          </div>
        </Row>
      </Section>

      <Section title="Size">
        <Row>
          <div>
            <Label>Width</Label>
            <NumberInput
              tid="prop-w"
              value={selected.width}
              onChange={(v) => onUpdate({ width: v })}
              min={40}
            />
          </div>
          <div>
            <Label>Height</Label>
            <NumberInput
              tid="prop-h"
              value={selected.height}
              onChange={(v) => onUpdate({ height: v })}
              min={30}
            />
          </div>
        </Row>
      </Section>

      {/* Type-specific */}
      {selected.type === "text" && (
        <Section title="Text">
          <Label>Font size</Label>
          <NumberInput
            tid="prop-fontsize"
            value={p.fontSize}
            onChange={(v) => onUpdateProps({ fontSize: v })}
            min={8}
            max={200}
            suffix="px"
          />
          <div className="mt-3">
            <Label>Font weight</Label>
            <select
              data-testid="prop-fontweight"
              value={p.fontWeight || 400}
              onChange={(e) =>
                onUpdateProps({ fontWeight: Number(e.target.value) })
              }
              className="w-full h-8 px-2 border border-neutral-200 rounded-md text-xs font-mono bg-white"
            >
              {[300, 400, 500, 600, 700].map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3">
            <Label>Color</Label>
            <ColorInput
              tid="prop-textcolor"
              value={p.color || "#171717"}
              onChange={(v) => onUpdateProps({ color: v })}
            />
          </div>
        </Section>
      )}

      {selected.type === "image" && (
        <Section title="Image">
          <Label>Radius</Label>
          <NumberInput
            tid="prop-radius"
            value={p.radius || 0}
            onChange={(v) => onUpdateProps({ radius: v })}
            min={0}
            suffix="px"
          />
          <div className="mt-3">
            <Label>Opacity</Label>
            <NumberInput
              tid="prop-opacity"
              value={p.opacity ?? 100}
              onChange={(v) =>
                onUpdateProps({ opacity: Math.max(0, Math.min(100, v)) })
              }
              min={0}
              max={100}
              suffix="%"
            />
          </div>
        </Section>
      )}

      {selected.type === "shape" && (
        <Section title="Shape">
          <Label>Fill</Label>
          <ColorInput
            tid="prop-fill"
            value={p.fill || "#DBEAFE"}
            onChange={(v) => onUpdateProps({ fill: v })}
          />
          <div className="mt-3">
            <Label>Border color</Label>
            <ColorInput
              tid="prop-bordercolor"
              value={p.border || "#93C5FD"}
              onChange={(v) => onUpdateProps({ border: v })}
            />
          </div>
          <Row>
            <div className="mt-3">
              <Label>Border</Label>
              <NumberInput
                tid="prop-borderwidth"
                value={p.borderWidth || 0}
                onChange={(v) => onUpdateProps({ borderWidth: v })}
                min={0}
                suffix="px"
              />
            </div>
            <div className="mt-3">
              <Label>Radius</Label>
              <NumberInput
                tid="prop-shape-radius"
                value={p.radius || 0}
                onChange={(v) => onUpdateProps({ radius: v })}
                min={0}
                suffix="px"
              />
            </div>
          </Row>
          <div className="mt-3">
            <Label>Opacity</Label>
            <NumberInput
              tid="prop-shape-opacity"
              value={p.opacity ?? 100}
              onChange={(v) =>
                onUpdateProps({ opacity: Math.max(0, Math.min(100, v)) })
              }
              min={0}
              max={100}
              suffix="%"
            />
          </div>
        </Section>
      )}

      {(selected.type === "bar" || selected.type === "line") && (
        <Section title="Chart">
          <Label>Title</Label>
          <input
            data-testid="prop-chart-title"
            value={p.title || ""}
            onChange={(e) => onUpdateProps({ title: e.target.value })}
            className="w-full h-8 px-2 border border-neutral-200 rounded-md text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-3">
            <Label>Color</Label>
            <ColorInput
              tid="prop-chart-color"
              value={p.color || "#2563EB"}
              onChange={(v) => onUpdateProps({ color: v })}
            />
          </div>
          <div className="mt-3">
            <Label>Randomize data</Label>
            <button
              data-testid="prop-chart-randomize"
              onClick={() => {
                const data = p.data.map((d) => ({
                  ...d,
                  value: Math.floor(Math.random() * 90) + 10,
                }));
                onUpdateProps({ data });
              }}
              className="w-full h-8 border border-neutral-200 rounded-md text-xs font-medium hover:bg-neutral-100 transition-colors"
            >
              Regenerate values
            </button>
          </div>
        </Section>
      )}
    </div>
  );
}
