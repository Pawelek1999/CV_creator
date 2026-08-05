import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CvListPage } from "./pages/CvListPage";
import { CvEditorPage } from "./pages/CvEditorPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<CvListPage />} />
          <Route path="/cvs/new" element={<CvEditorPage />} />
          <Route path="/cvs/:id" element={<CvEditorPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
