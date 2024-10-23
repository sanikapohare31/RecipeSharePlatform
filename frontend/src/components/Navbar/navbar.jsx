import React, { useState, useContext } from 'react';
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext.jsx';
import { assets } from '../../assets/assets';
const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { token, setToken } = useContext(StoreContext);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <nav className='navbar'>
      {/* Logo */}
      <div className="logo">Reciply</div>

      {/* Menu items */}
      <ul className='navbar-menu'>
        <li>
          <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
        </li>
        <li>
          <Link to="/sharedByYou" onClick={() => setMenu("sharedByYou")} className={menu === "sharedByYou" ? "active" : ""}>Shared By You</Link>
        </li>
        <li>
          <Link to="/addRecipe" onClick={() => setMenu("addRecipe")} className={menu === "addRecipe" ? "active" : ""}>Add Recipe</Link>
        </li>
        <li>
          <Link to="/savedRecipes" onClick={() => setMenu("savedRecipes")} className={menu === "savedRecipes" ? "active" : ""}>Saved Recipes</Link>
        </li>
      </ul>

      {/* Sign In / Logout Button */}
      <div className="navbar-right">
      {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className='navbar-profile'>
            <div className='navbar-profile'>
            {/* Profile Icon Link */}
            <Link to="/profile" onClick={() => setMenu("profile")} className="profile-link">
              <img 
                src={assets.profile_icon} 
                alt="Profile" 
                style={{ cursor: 'pointer' }} // Indicate it's clickable
              />
            </Link>
            <span className="logout-icon" onClick={logout}>
              <img src={assets.logout_icon} alt="Logout" style={{ cursor: 'pointer' }} />
            </span>
          </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
