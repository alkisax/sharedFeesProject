import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import AdminLayout from "./layouts/AdminLayout";
import LayoutWithNavbar from './layouts/LayoutWithNavbar'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<LayoutWithNavbar />}>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminLayout />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
