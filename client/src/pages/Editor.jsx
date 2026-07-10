import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Rnd } from "react-rnd";
import { toast } from "sonner";
import {
  ArrowLeft,
  Type,
  Image as ImageIcon,
  BarChart3,
  LineChart as LineIcon,
  Square,
  Save,
  Trash2,
  Layers,
  Copy,
} from "lucide-react";
import { api, fileUrl } from "@/lib/api";
import CanvasElement from "@/components/editor/CanvasElement";
import PropertiesPanel from "@/components/editor/PropertiesPanel";
import RichTextToolbar from "@/components/editor/RichTextToolbar";

const uid = () => Math.random().toString(36).slice(2, 10);

const DEFAULT_ELEMENTS = {
  text: () => ({
    id: uid(),
    type: "text",
    x: 60,
    y: 60,
    width: 260,
    height: 60,
    props: {
      html: "Double-click to edit text",
      fontSize: 20,
      fontWeight: 500,
      color: "#171717",
      align: "left",
      bg: "transparent",
    },
    z: 1,
  }),
  image: () => ({
    id: uid(),
    type: "image",
    x: 80,
    y: 140,
    width: 240,
    height: 180,
    props: { src: "", radius: 8, opacity: 100 },
    z: 1,
  }),
  bar: () => ({
    id: uid(),
    type: "bar",
    x: 100,
    y: 220,
    width: 360,
    height: 240,
    props: {
      title: "Revenue",
      color: "#2563EB",
      data: [
        { label: "Jan", value: 42 },
        { label: "Feb", value: 68 },
        { label: "Mar", value: 55 },
        { label: "Apr", value: 81 },
        { label: "May", value: 74 },
        { label: "Jun", value: 92 },
      ],
    },
    z: 1,
  }),
  line: () => ({
    id: uid(),
    type: "line",
    x: 140,
    y: 260,
    width: 380,
    height: 240,
    props: {
      title: "Active Users",
      color: "#16A34A",
      data: [
        { label: "Mon", value: 12 },
        { label: "Tue", value: 19 },
        { label: "Wed", value: 15 },
        { label: "Thu", value: 27 },
        { label: "Fri", value: 32 },
        { label: "Sat", value: 24 },
        { label: "Sun", value: 30 },
      ],
    },
    z: 1,
  }),
  shape: () => ({
    id: uid(),
    type: "shape",
    x: 200,
    y: 300,
    width: 200,
    height: 120,
    props: {
      fill: "#DBEAFE",
      border: "#93C5FD",
      borderWidth: 1,
      radius: 8,
      opacity: 100,
    },
    z: 0,
  }),
};

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [canvas, setCanvas] = useState({
    width: 1200,
    height: 800,
    bg: "#FFFFFF",
  });
  const fileInputRef = useRef(null);

  const selected = useMemo(
    () => elements.find((e) => e.id === selectedId) || null,
    [elements, selectedId],
  );

  // Load dashboard
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/dashboards/${id}`);
        setDashboard(data);
        setName(data.name);
        setElements(data.elements || []);
        setCanvas(data.canvas || { width: 1200, height: 800, bg: "#FFFFFF" });
      } catch {
        toast.error("Dashboard not found");
        navigate("/");
      }
    })();
  }, [id, navigate]);

  const addElement = (type) => {
    if (type === "image") {
      fileInputRef.current?.click();
      return;
    }
    const el = DEFAULT_ELEMENTS[type]();
    setElements((s) => [...s, el]);
    setSelectedId(el.id);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    const t = toast.loading("Uploading…");
    try {
      const { data } = await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const el = DEFAULT_ELEMENTS.image();
      el.props.src = fileUrl(data.id);
      setElements((s) => [...s, el]);
      setSelectedId(el.id);
      toast.success("Image added", { id: t });
    } catch (err) {
      toast.error("Upload failed", { id: t });
    }
  };

  const updateElement = useCallback((elId, patch) => {
    setElements((s) =>
      s.map((el) => (el.id === elId ? { ...el, ...patch } : el)),
    );
  }, []);

  const updateElementProps = useCallback((elId, propsPatch) => {
    setElements((s) =>
      s.map((el) =>
        el.id === elId ? { ...el, props: { ...el.props, ...propsPatch } } : el,
      ),
    );
  }, []);

  const removeElement = useCallback(
    (elId) => {
      setElements((s) => s.filter((el) => el.id !== elId));
      if (selectedId === elId) setSelectedId(null);
    },
    [selectedId],
  );

  const duplicateElement = useCallback((elId) => {
    setElements((s) => {
      const el = s.find((e) => e.id === elId);
      if (!el) return s;
      const copy = {
        ...el,
        id: uid(),
        x: el.x + 20,
        y: el.y + 20,
        props: { ...el.props },
      };
      return [...s, copy];
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (!selectedId) return;
      const target = e.target;
      const isEditable =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (isEditable) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        removeElement(selectedId);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        duplicateElement(selectedId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, removeElement, duplicateElement]);

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/dashboards/${id}`, { name, elements, canvas });
      toast.success("Saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!dashboard) {
    return (
      <div
        className="h-screen w-screen flex items-center justify-center text-sm text-neutral-500"
        data-testid="editor-loading"
      >
        Loading editor…
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-neutral-50">
      {/* Top bar */}
      <header
        className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-4 shrink-0 z-20"
        data-testid="editor-topbar"
      >
        <div className="flex items-center gap-3">
          <button
            data-testid="editor-back-btn"
            onClick={() => navigate("/")}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="h-6 w-px bg-neutral-200" />
          <input
            data-testid="editor-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-sm font-medium bg-transparent border-none outline-none focus:bg-neutral-50 px-2 py-1 rounded-md w-64"
          />
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
            {elements.length} elements
          </span>
        </div>
        <div className="flex items-center gap-2">
          {selected && (
            <>
              <button
                data-testid="editor-duplicate-btn"
                onClick={() => duplicateElement(selected.id)}
                className="h-8 px-3 text-xs font-medium border border-neutral-200 rounded-md hover:bg-neutral-100 flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" /> Duplicate
              </button>
              <button
                data-testid="editor-delete-btn"
                onClick={() => removeElement(selected.id)}
                className="h-8 px-3 text-xs font-medium border border-neutral-200 rounded-md hover:bg-red-50 hover:border-red-300 hover:text-red-700 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
              <div className="h-6 w-px bg-neutral-200 mx-1" />
            </>
          )}
          <button
            data-testid="editor-save-btn"
            onClick={save}
            disabled={saving}
            className="h-8 px-4 bg-neutral-900 text-white text-xs font-medium rounded-md hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </header>

      {/* Rich text floating toolbar */}
      {selected && selected.type === "text" && (
        <RichTextToolbar
          element={selected}
          onUpdateProps={(patch) => updateElementProps(selected.id, patch)}
        />
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Left toolbar */}
        <aside
          className="w-14 border-r border-neutral-200 bg-white flex flex-col items-center py-4 gap-2 shrink-0 z-10"
          data-testid="editor-left-toolbar"
        >
          <ToolBtn
            label="Text"
            tid="tool-add-text"
            icon={Type}
            onClick={() => addElement("text")}
          />
          <ToolBtn
            label="Image"
            tid="tool-add-image"
            icon={ImageIcon}
            onClick={() => addElement("image")}
          />
          <ToolBtn
            label="Bar Chart"
            tid="tool-add-bar"
            icon={BarChart3}
            onClick={() => addElement("bar")}
          />
          <ToolBtn
            label="Line Chart"
            tid="tool-add-line"
            icon={LineIcon}
            onClick={() => addElement("line")}
          />
          <ToolBtn
            label="Shape"
            tid="tool-add-shape"
            icon={Square}
            onClick={() => addElement("shape")}
          />
          <div className="mt-auto">
            <ToolBtn
              label="Layers"
              tid="tool-layers"
              icon={Layers}
              onClick={() => {}}
            />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            data-testid="editor-file-input"
          />
        </aside>

        {/* Canvas area */}
        <main
          className="flex-1 relative overflow-auto thin-scroll bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center p-10"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedId(null);
          }}
          data-testid="editor-canvas-wrapper"
        >
          <div
            className="relative shrink-0 shadow-xl shadow-neutral-900/10 canvas-dots"
            style={{
              width: canvas.width,
              height: canvas.height,
              backgroundColor: canvas.bg,
            }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setSelectedId(null);
            }}
            data-testid="editor-artboard"
          >
            {elements
              .slice()
              .sort((a, b) => (a.z || 0) - (b.z || 0))
              .map((el) => (
                <Rnd
                  key={el.id}
                  size={{ width: el.width, height: el.height }}
                  position={{ x: el.x, y: el.y }}
                  bounds="parent"
                  onDragStop={(e, d) =>
                    updateElement(el.id, {
                      x: Math.round(d.x),
                      y: Math.round(d.y),
                    })
                  }
                  onResizeStop={(e, dir, ref, delta, pos) =>
                    updateElement(el.id, {
                      width: parseInt(ref.style.width, 10),
                      height: parseInt(ref.style.height, 10),
                      x: Math.round(pos.x),
                      y: Math.round(pos.y),
                    })
                  }
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setSelectedId(el.id);
                  }}
                  className={
                    selectedId === el.id ? "rnd-selected" : "rnd-hover"
                  }
                  enableResizing={{
                    top: true,
                    right: true,
                    bottom: true,
                    left: true,
                    topRight: true,
                    bottomRight: true,
                    bottomLeft: true,
                    topLeft: true,
                  }}
                  minWidth={40}
                  minHeight={30}
                >
                  <CanvasElement
                    element={el}
                    isSelected={selectedId === el.id}
                    onUpdateProps={(patch) => updateElementProps(el.id, patch)}
                  />
                </Rnd>
              ))}
          </div>
        </main>

        {/* Right sidebar */}
        <aside
          className="w-[280px] border-l border-neutral-200 bg-white flex flex-col overflow-y-auto shrink-0 z-10 thin-scroll"
          data-testid="editor-right-panel"
        >
          <PropertiesPanel
            selected={selected}
            canvas={canvas}
            onCanvasChange={setCanvas}
            onUpdate={(patch) => selected && updateElement(selected.id, patch)}
            onUpdateProps={(patch) =>
              selected && updateElementProps(selected.id, patch)
            }
            elementsCount={elements.length}
          />
        </aside>
      </div>
    </div>
  );
}

function ToolBtn({ label, icon: Icon, onClick, tid }) {
  return (
    <button
      data-testid={tid}
      onClick={onClick}
      title={label}
      aria-label={label}
      className="w-10 h-10 rounded-md flex items-center justify-center text-neutral-700 hover:bg-neutral-100 hover:text-blue-600 transition-colors"
    >
      <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
    </button>
  );
}
