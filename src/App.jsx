import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AccountContext } from "./AccountContext";
import { useEffect, useState } from "react";
import Main from "./pages/main";
import Mint from "./pages/mint";

import { AnimatePresence } from "framer-motion";
import Gallery from './pages/gallery';

function App() {
  const [account, setAccount] = useState(""); // 계정 상태 저장

  return (
    <BrowserRouter>
      <AccountContext.Provider value={{ account, setAccount }}>
        <AnimatePresence>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/mint" element={<Mint />} />           
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </AnimatePresence>
      </AccountContext.Provider>
    </BrowserRouter>
  );
}

export default App;
