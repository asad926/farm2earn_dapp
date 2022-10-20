import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Swap_form from "./component/Swap_form.jsx";
import NaveBar from "./component/NavBar.jsx";
import Footer from "./component/Footer.jsx";
import Staking from "./component/Staking";
import Admin from "./component/Admin";
function App() {
  return (
    <BrowserRouter>
      <NaveBar />
      <Routes>
        <Route exact path="/" element={<Swap_form />} />
        <Route path="/swap" element={<Swap_form />} />
        <Route path="/staking" element={<Staking />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
