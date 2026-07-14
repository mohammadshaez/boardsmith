import { useEffect, useRef } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function CanvasElement({ element, isSelected, onUpdateProps }) {
  const ref = useRef(null);

  // Sync innerHTML for text on external changes (font-size, etc)
  useEffect(() => {
    if (
      element.type === "text" &&
      ref.current &&
      ref.current.innerHTML !== element.props.html
    ) {
      ref.current.innerHTML = element.props.html || "";
    }
  }, [element.type, element.props.html]);

  if (element.type === "text") {
    return (
      <div
        className="w-full h-full flex items-stretch"
        style={{
          backgroundColor:
            element.props.bg === "transparent"
              ? "transparent"
              : element.props.bg,
        }}
      >
        <div
          ref={ref}
          contentEditable={isSelected}
          autoCapitalize="on"
          suppressContentEditableWarning
          spellCheck={false}
          onBlur={(e) => onUpdateProps({ html: e.currentTarget.innerHTML })}
          style={{
            fontSize: `${element.props.fontSize || 16}px`,
            fontWeight: element.props.fontWeight || 400,
            color: element.props.color || "#171717",
            textAlign: element.props.align || "left",
            lineHeight: 1.3,
            width: "100%",
            height: "100%",
          }}
          data-testid={`el-text-${element.id}`}
        />
      </div>
    );
  }

  if (element.type === "image") {
    const imageSrc =
      typeof element.props.src === "string"
        ? element.props.src
        : element.props.src?.url || element.props.src?.s3Url || "";

    return (
      <div
        className="w-full h-full overflow-hidden flex items-center justify-center bg-neutral-100"
        style={{
          borderRadius: `${element.props.radius || 0}px`,
          opacity: (element.props.opacity ?? 100) / 100,
        }}
        data-testid={`el-image-${element.id}`}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt=""
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
        ) : (
          <div className="text-xs text-neutral-500 font-mono">no image</div>
        )}
      </div>
    );
  }

  if (element.type === "shape") {
    return (
      <div
        className="w-full h-full"
        style={{
          backgroundColor: element.props.fill,
          border: `${element.props.borderWidth || 0}px solid ${element.props.border || "transparent"}`,
          borderRadius: `${element.props.radius || 0}px`,
          opacity: (element.props.opacity ?? 100) / 100,
        }}
        data-testid={`el-shape-${element.id}`}
      />
    );
  }

  if (element.type === "bar") {
    return (
      <div
        className="w-full h-full bg-white border border-neutral-200 rounded-md p-3 flex flex-col"
        data-testid={`el-bar-${element.id}`}
      >
        <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
          {element.props.title || "Bar Chart"}
        </div>
        <div
          className="flex-1 min-h-0"
          data-values={element.props.data.map((d) => d.value).join(",")}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={element.props.data}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#737373" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#737373" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "#F5F5F5" }}
                contentStyle={{ fontSize: 11, borderRadius: 6 }}
              />
              <Bar
                dataKey="value"
                fill={element.props.color || "#2563EB"}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (element.type === "line") {
    return (
      <div
        className="w-full h-full bg-white border border-neutral-200 rounded-md p-3 flex flex-col"
        data-testid={`el-line-${element.id}`}
      >
        <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
          {element.props.title || "Line Chart"}
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={element.props.data}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#737373" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#737373" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={element.props.color || "#16A34A"}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return null;
}
