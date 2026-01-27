import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Loading from "@/pages/Loading";
import Result from "@/pages/Result";
import Guide from "@/pages/Guide";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generating" element={<Loading />} />
        <Route path="/result" element={<Result />} />
        <Route path="/guide" element={<Guide />} />
      </Routes>
    </Router>
  );
}
