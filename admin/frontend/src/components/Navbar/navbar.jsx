import React, { useState, useContext } from 'react';
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext.jsx';
import {assets} from '../../assets/assets';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("dashboard");
  const { token, setToken } = useContext(StoreContext);
  
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <nav className='navbar'>
      <div className='logo'>Reciply</div>
      <ul className='navbar-menu'>
        <li>
          <Link to="/admin/dashboard" onClick={() => setMenu("dashboard")} className={menu === "dashboard" ? "active" : ""}>Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/verify-recipes" onClick={() => setMenu("verifyRecipes")} className={menu === "verifyRecipes" ? "active" : ""}>Verify Recipes</Link>
        </li>

      </ul>

      <div className="navbar-right">
      {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className='navbar-profile'>
            <div className='navbar-profile'>
            <Link to="/profile" onClick={() => setMenu("profile")} className="profile-link">
              <img 
                src={assets.profile_icon} 
                alt="Profile" 
                style={{ cursor: 'pointer' }}
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
