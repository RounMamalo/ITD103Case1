import React from 'react'
import './Hero.css'
import hand_icon from '../Assets/hand_icon.png'
import arrow_icon from '../Assets/arrow.png'
import hero_image from '../Assets/hero_image.png'
import logo from '../Assets/Converse_Logo.svg'
export const Hero = () => {
  return (
    <div className='hero'>
        <div className="hero-left">
            <h2>NEW ARRIVALS</h2>
            <div>
                <div className="hero-hand-icon">
                    <p>new</p>
                </div>
                <p>collections</p> 
                <p>for everyone</p>
            </div>
        </div>

        <div className="hero-right">
            <img src={logo} alt='' />
        </div>

    </div>
  )
}

export default Hero