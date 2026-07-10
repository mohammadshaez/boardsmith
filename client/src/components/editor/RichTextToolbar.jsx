import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 60];

export default function RichTextToolbar({ element, onUpdateProps }) {
  const exec = (cmd) => {
    document.execCommand(cmd, false, null);
  };

  return (
    <div
      className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-white border border-neutral-200 rounded-md shadow-lg shadow-black/5 ring-1 ring-black/5 h-10 px-2 flex items-center gap-1"
      data-testid="rich-text-toolbar"
    >
      <button
        data-testid="rt-bold"
        onMouseDown={(e) => {
          e.preventDefault();
          exec("bold");
        }}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors"
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        data-testid="rt-italic"
        onMouseDown={(e) => {
          e.preventDefault();
          exec("italic");
        }}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors"
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        data-testid="rt-underline"
        onMouseDown={(e) => {
          e.preventDefault();
          exec("underline");
        }}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors"
        title="Underline"
      >
        <Underline className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-neutral-200 mx-1" />

      <select
        data-testid="rt-font-size"
        value={element.props.fontSize || 16}
        onChange={(e) =>
          onUpdateProps({ fontSize: parseInt(e.target.value, 10) })
        }
        className="h-8 px-2 rounded-md border border-neutral-200 text-xs font-mono bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {FONT_SIZES.map((s) => (
          <option key={s} value={s}>
            {s}px
          </option>
        ))}
      </select>

      <div className="w-px h-5 bg-neutral-200 mx-1" />

      {[
        { k: "left", icon: AlignLeft },
        { k: "center", icon: AlignCenter },
        { k: "right", icon: AlignRight },
      ].map(({ k, icon: Icon }) => (
        <button
          key={k}
          data-testid={`rt-align-${k}`}
          onMouseDown={(e) => {
            e.preventDefault();
            onUpdateProps({ align: k });
          }}
          className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
            (element.props.align || "left") === k
              ? "bg-blue-50 text-blue-600"
              : "hover:bg-neutral-100"
          }`}
          title={`Align ${k}`}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}

      <div className="w-px h-5 bg-neutral-200 mx-1" />

      <input
        data-testid="rt-color"
        type="color"
        value={element.props.color || "#171717"}
        onChange={(e) => onUpdateProps({ color: e.target.value })}
        className="w-8 h-8 rounded-md border border-neutral-200 cursor-pointer p-1"
        title="Color"
      />
    </div>
  );
}
