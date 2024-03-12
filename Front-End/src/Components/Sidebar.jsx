import React, { useState } from 'react'
import './Sidebar.css'
import { FaBars ,FaDatabase,FaUserEdit,FaUserCheck} from "react-icons/fa";
import { MdFamilyRestroom } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import user from './Assets/user.jpg'
import user_icon from './Assets/user_icon.png'
import logout from './Assets/logout.png'

const Sidebar = ({children}) => {

    const [isOpen,setIsOpen] = useState(false);
    const toggle = ()=> setIsOpen(!isOpen);

    const [open,setOpen]=useState(false);

    const navigate = useHistory();
    const menuItem=[

        {
            path:"/UpdateUserdetail",
            name:"UpdateUser",
            icon:<FaUserEdit/>
        },
        {
            path:"/Userdetail",
            name:"Userdetail",
            icon:<FaUserCheck />
        },
        {
            path:"/Familydetail",
            name:"Family",
            icon:<MdFamilyRestroom />
        },
        {
            path:"/JsonData",
            name:"JsonData",
            icon:<FaDatabase />
        },
        // {
        //     path:"/DisplayCategory",
        //     name:"DisplayCategory",
        //     icon:<FaDatabase />
        // },
        {
            path:"/login",
            name:"Logout",
            icon:<CiLogout />
        }

    ];
    const handleLogout = ()=>{
        localStorage.removeItem('loggedInEmail');
        navigate.push('/');
    }

  return (
    <>
    <div className='menu-container'>
        <div className="menu-trigger" onClick={()=>{setOpen(!open)}}>
            <h2>Welcome To Web</h2>
            <img src={user} alt="" />
        </div>
        <div className={"dropdown-menu"}>
            <ul>
                <img src={user_icon} alt=""/><h3>Daxa Chhatrodiya</h3>
                <DropdownItem img={logout} text={"Logout"} onClick={handleLogout}/>
            </ul>
        </div>
    </div>
    <div className='containers'>
        <div style={{width:isOpen? "300px" : "60px"}} className="sidebar">
            <div className="top-section">
                <h1 style={{display:isOpen? "block" : "none"}} className="logo">Daxa<br/> <span>Chhatrodiya</span></h1>
                <div style={{marginLeft:isOpen? "30px" : "0px"}} className="bars">
                <FaBars onClick={toggle}/>
                </div>
            </div>
            {
                menuItem.map((item,index)=>(
                    <NavLink to={item.path} key={index} className='link' activeClassName='active'>
                        <div className="icons">{item.icon}</div>
                        <div style={{display:isOpen? "block" : "none"}} className="link-text">{item.name}</div>
                    </NavLink>
                ))
            }
        </div>
        <main>{children}</main>
    </div>
    </>
  );
}

function DropdownItem(props){
    return(
        <li className='dropdownItem'>
            <img src={props.img} alt=""/>
            <a href="/">{props.text}</a>
        </li>
    );
}

export default Sidebar