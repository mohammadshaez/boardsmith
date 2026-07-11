import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Gallery from "@/pages/Gallery";
import Editor from "@/pages/Editor";
import { Analytics } from "@vercel/analytics/react";

function App() {
  useEffect(() => {
    // Warm up backend
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/editor/:id" element={<Editor />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" richColors />
      <Analytics />
    </div>
  );
}

export default App;
