import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Plus, LayoutDashboard, Trash2, PenLine, Sparkles } from "lucide-react";

const THUMBS = [
  "https://images.unsplash.com/photo-1646038572815-43fe759e459b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzV8MHwxfHNlYXJjaHw0fHxhYnN0cmFjdCUyMGNvbG9yZnVsJTIwZ3JhZGllbnQlMjBhZXN0aGV0aWN8ZW58MHx8fHwxNzgzMDEyNTIwfDA&ixlib=rb-4.1.0&q=85",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzV8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMGNvbG9yZnVsJTIwZ3JhZGllbnQlMjBhZXN0aGV0aWN8ZW58MHx8fHwxNzgzMDEyNTIwfDA&ixlib=rb-4.1.0&q=85",
];

export default function Gallery() {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/dashboards");
      setDashboards(data);
    } catch (e) {
      toast.error("Failed to load dashboards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createNew = async () => {
    try {
      const { data } = await api.post("/dashboards", {
        name: "Untitled Dashboard",
      });
      toast.success("Dashboard created");
      navigate(`/editor/${data.id}`);
    } catch (e) {
      toast.error("Failed to create dashboard");
    }
  };

  const remove = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this dashboard?")) return;
    try {
      await api.delete(`/dashboards/${id}`);
      toast.success("Deleted");
      setDashboards((s) => s.filter((d) => d.id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top bar */}
      <header
        className="h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-8"
        data-testid="gallery-header"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center rounded-md">
            <LayoutDashboard className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">
              Boardsmith
            </div>
            <div className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
              Dashboard Builder
            </div>
          </div>
        </div>
        <button
          data-testid="gallery-new-btn"
          onClick={createNew}
          className="inline-flex items-center gap-2 h-9 px-4 bg-neutral-900 text-white text-sm font-medium rounded-md hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2} /> New Dashboard
        </button>
      </header>

      {/* Hero */}
      <section className="px-8 md:px-12 pt-12 pb-8 max-w-[1400px]">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-600 mb-3">
          <Sparkles className="w-3.5 h-3.5" /> WORKSPACE
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight max-w-2xl">
          Design dashboards the way you'd design a
          <span className="text-blue-600"> canvas</span>.
        </h1>
        <p className="mt-4 text-neutral-600 text-base max-w-xl">
          Drag, drop, and resize charts, text and images into place. Save any
          layout as a dashboard and revisit it any time.
        </p>
      </section>

      {/* Grid */}
      <section className="px-8 md:px-12 pb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium tracking-tight">
            Your dashboards
          </h2>
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
            {dashboards.length} total
          </span>
        </div>

        {loading ? (
          <div
            className="text-sm text-neutral-500"
            data-testid="gallery-loading"
          >
            Loading…
          </div>
        ) : dashboards.length === 0 ? (
          <div
            data-testid="gallery-empty"
            className="border border-dashed border-neutral-300 rounded-lg p-16 flex flex-col items-center justify-center bg-white"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <LayoutDashboard
                className="w-6 h-6 text-blue-600"
                strokeWidth={1.5}
              />
            </div>
            <div className="text-base font-medium">No dashboards yet</div>
            <div className="text-sm text-neutral-500 mt-1">
              Create your first one to start building.
            </div>
            <button
              data-testid="gallery-empty-create"
              onClick={createNew}
              className="mt-6 inline-flex items-center gap-2 h-9 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Create dashboard
            </button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
            data-testid="gallery-grid"
          >
            {dashboards.map((d, i) => (
              <Link
                key={d.id}
                to={`/editor/${d.id}`}
                data-testid={`gallery-card-${d.id}`}
                className="group relative bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md hover:border-blue-500 transition-all"
              >
                <div className="aspect-[4/3] bg-neutral-100 overflow-hidden relative">
                  <img
                    src={THUMBS[i % THUMBS.length]}
                    alt=""
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      data-testid={`gallery-delete-${d.id}`}
                      onClick={(e) => remove(d.id, e)}
                      className="w-8 h-8 rounded-md bg-white/90 backdrop-blur border border-neutral-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-300"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-neutral-700" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-medium truncate">{d.name}</div>
                    <PenLine className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mt-1">
                    {d.elements?.length || 0} elements
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
