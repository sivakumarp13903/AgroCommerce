import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

const ExploreMenu = ({category,setCategory}) => {


  return (
    <div className='explore-menu' id='explore-menu'>
        <h1>Explore our menu</h1>
        <p className='explore-menu-text'>In the "Explore Items" section, you can easily browse through our extensive collection of glossaries designed to support your educational needs. This user-friendly interface allows you to explore items categorized by subject, making it simple to find exactly what you're looking for. Each glossary entry comes with detailed descriptions, definitions, and examples to enhance your understanding. You can quickly filter and sort items based on criteria like relevance and popularity, ensuring that you find the most useful resources efficiently. Whether you're using a desktop or a mobile device, our responsive design ensures a seamless experience, allowing you to access valuable educational materials anytime, anywhere. Start exploring today to enrich your learning journey!</p>
        <div className="explore-menu-list">
            {menu_list.map((item,index)=>{
                return (
                    <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} key={index} className='explore-menu-list-item'>
                        <img className={category===item.menu_name?"active":""} src={item.menu_image} alt="" />
                        <p>{item.menu_name}</p>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default ExploreMenu