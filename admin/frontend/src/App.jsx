import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/navbar'
import { Routes, Route,BrowserRouter } from 'react-router-dom';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Dashboard from './pages/Dashboard/Dashboard';
import VerifyRecipes from './pages/VerifyRecipes/VerifyRecipes';
import { StoreContextProvider } from "./context/StoreContext";
function App() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <BrowserRouter>
    <StoreContextProvider>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : null} 
      <Navbar setShowLogin={setShowLogin} />
      <Routes>
          <Route path='admin/dashboard' element={<Dashboard />} />
          <Route path='admin/verify-recipes' element={<VerifyRecipes />} />
        </Routes>
    </StoreContextProvider>
    </BrowserRouter>
  )
}

export default App
