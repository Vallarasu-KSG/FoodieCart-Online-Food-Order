import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItems from '../FoodItems/FoodItems'

const FoodDisplay = ({category}) => {

    const {food_list} = useContext(StoreContext)

  return (
    <div className='foodDisplay' id='foodDisplay'>
        <h2>Top to dishes near you</h2>
        <div className="food_display_list">
            {food_list.filter(item => category==="All" || category===item.category)
            .map((item, index)=>(
                <FoodItems key={index} id={item._id} name={item.name} image={item.image} price={item.price} offerPrice={item.offerPrice} category={item.category} address={item.address} />
            ))}
        </div>
    </div>
  )
}

export default FoodDisplay