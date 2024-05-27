import React, { useContext, useState } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import mainLogo from '../Assets/headLogo.svg'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'


export const Navbar = () => {

  const [menu, setMenu] = useState("men")
  const {getTotalCartItems} = useContext(ShopContext)
  return (
    <div className='navbar'>

        <div className='nav-logo'>
            <img src={mainLogo} alt="" />
            
        </div>        

        <ul className='nav-menu'>
            <li onClick={() =>{setMenu("shop")}}><Link to='/' style={{textDecoration: 'none'}}>Shop{menu === "shop"?<hr /> : <></>}</Link></li>
            <li onClick={() =>{setMenu("men")}}><Link to='/men' style={{textDecoration: 'none'}}>Men{menu === "men"?<hr /> : <></>}</Link></li>
            <li onClick={() =>{setMenu("women")}}><Link to='/women' style={{textDecoration: 'none'}}>Women{menu === "women"?<hr /> : <></>}</Link></li>
            <li onClick={() =>{setMenu("kids")}}><Link to='/kids' style={{textDecoration: 'none'}}>Kids{menu === "kids"?<hr /> : <></>}</Link></li>
        </ul>

        <div className='nav-login-cart'>
          {localStorage.getItem('auth-token') ? <button onClick={() =>{localStorage.removeItem('auth-token'); window.location.replace('/')}} >Logout</button> : 
            <Link to='/login'>
              <button>Login</button>
            </Link>}
            <Link to='/cart'>
              <img src={cart_icon} alt=''/>
            </Link>
            <div className="nav-cart-count">{getTotalCartItems()}
            </div>
        </div>
    </div>
  )
}
