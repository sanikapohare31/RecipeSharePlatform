import React from 'react';

import { useState } from 'react';
import './App.css';
import { Routes,Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import SavedRecipes from './pages/SavedRecipes/SavedRecipes';
import AddRecipe from './pages/AddRecipe/AddRecipe';
import SharedByYou from './pages/SharedByYou/SharedByYou';
import Navbar from './components/Navbar/navbar';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Profile from './pages/Profile/Profile';
import RecipeDetail from './components/RecipeDetail/RecipeDetail';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
    {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : null}  {/* Pass setShowLogin to LoginPopup */}
    
    <div className="App">
           <Navbar setShowLogin={setShowLogin} />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/savedRecipes' element={<SavedRecipes />} />
            <Route path='/sharedByYou' element={<SharedByYou />} />
            <Route path='/addRecipe' element={<AddRecipe />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/recipe/:id' element={<RecipeDetail/>} />
          </Routes>
          
      </div>
    </>
  );
};

export default App;