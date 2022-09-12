import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Swap_form from "./component/Swap_form.jsx";
import NaveBar from "./component/NavBar.jsx";
import Footer from "./component/Footer.jsx";
import Staking from "./component/Staking";
function App() {
  return (
    <BrowserRouter>
      <NaveBar />
      <Routes>
        <Route exact path="/" element={<Swap_form />} />

        <Route exact path="/swap" element={<Swap_form />} />
        <Route exact path="/staking" element={<Staking />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
