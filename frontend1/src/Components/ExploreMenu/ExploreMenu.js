import React, { useRef } from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

const ExploreMenu = ({ category, setCategory }) => {
  const scrollRef = useRef(null)

  // Scroll handler
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollAmount = clientWidth / 2 // scroll half the container width
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      })
    }
  }

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>
        Choose from a diverse menu featuring a delectable array of dishes.
        Our mission is to satisfy your cravings and elevate your dining experience,
        one delicious meal at a time.
      </p>

      <div className="explore-menu-wrapper">
        {/* Left Button */}
        <button className="scroll-btn left" onClick={() => scroll("left")}>‹</button>

        {/* Scrollable Menu */}
        <div className="explore-menu-list" ref={scrollRef}>
          {/* All Option */}
          <div
            onClick={() => setCategory("All")}
            className='explore-menu-list-item'
          >
            <div className={`all-option ${category === "All" ? "active" : ""}`}>
              All
            </div>
          </div>

          {/* Other menu options */}
          {menu_list.map((item, index) => {
            return (
              <div
                onClick={() =>
                  setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)
                }
                key={index}
                className='explore-menu-list-item'
              >
                <img
                  className={`fdimg ${category === item.menu_name ? 'active' : ""}`}
                  src={item.menu_image}
                  alt={item.menu_name}
                />
              </div>
            )
          })}
        </div>

        {/* Right Button */}
        <button className="scroll-btn right" onClick={() => scroll("right")}>›</button>
      </div>

      <hr />
    </div>
  )
}

export default ExploreMenu
