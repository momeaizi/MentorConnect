'use client'
import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, Badge } from 'antd';
import "@/styles/navBar.css";
import {
  HomeOutlined, MessageOutlined,
  HistoryOutlined, HeartOutlined,
  FireFilled, BellOutlined,
  UserOutlined, LogoutOutlined,
  MenuOutlined
 } from '@ant-design/icons';
import useStore from '@/lib/store';
import { useRouter } from 'next/navigation';
import axios from 'axios';

function fetchData(): Promise<Notification[]> {
  return  axios.get('http://localhost:5000/api/notif/number')
      .then((response: any) => {
        return response.data;
      })
      .catch((error: any) => {
          console.error('Error fetching data:', error);
          throw error;
      });
}

function FullScreen() {
  const {numberOfNotif, setNumberOfNotif} = useStore();
  const router = useRouter();

  const handleNavigation = (to:string) => {
    router.push(to);
  }

  useEffect(()=>{
    const notif = async () => {
      try {await fetchData();
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };
    setNumberOfNotif(notif)
  },[])

  return (
    <div className=' flex items-center justify-between w-full'>
      <Menu.Item className='menu-item-top-navbar' icon={<FireFilled style={{color:"#eb2f96"}} className='logo-navbar-fire-icon'/>} key="logo" >
        <h1 className="flex items-center text-4xl font-bold text-white">
          <span className="italic text-3xl font-extrabold	font-sans bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">Matcha</span>
        </h1>
      </Menu.Item>
      <div className='flex'>
        <Menu.Item className='menu-item-top-navbar-pages' icon={<HomeOutlined  className='antd-icon'/>} key="home">
          Home
        </Menu.Item>

        <Menu.Item onClick={() => handleNavigation('/chat')} className='menu-item-top-navbar-pages' icon={<MessageOutlined className='antd-icon'/>} key="chat">
          Chat
        </Menu.Item>
        <Menu.Item className='menu-item-top-navbar-pages' icon={<HistoryOutlined className='antd-icon'/>} key="history">
          History
        </Menu.Item>
        <Menu.Item className='menu-item-top-navbar-pages' icon={<HeartOutlined className='antd-icon'/>} key="favorie">
          Favories
        </Menu.Item>
      </div>
      <div className='flex gap-0'>
        <Menu.Item onClick={() => handleNavigation('/notification')} className='menu-item-top-navbar-pages' icon={<div><Badge count={numberOfNotif} dot><BellOutlined className='antd-icon' /></Badge></div>} key="notif">
        </Menu.Item>
        <Menu.SubMenu 
        className='menu-item-top-navbar-pages' 
        key="profile"  
        icon={<UserOutlined className='antd-icon' />}
        >
          <Menu.Item onClick={() => handleNavigation('/profile')} className='menu-item-top-navbar-pages' key="view-profile" icon={<UserOutlined className='antd-icon'/>}>
            View Profile
          </Menu.Item>
          <Menu.Item className='menu-item-top-navbar-pages' key="logout" icon={<LogoutOutlined className='antd-icon'/>}>
            Logout
          </Menu.Item>
        </Menu.SubMenu>
      </div>
    </div>
  );
}

function MobileNavBar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const {numberOfNotif} = useStore();


  const handleMenuClick = () => {
    setDropdownVisible(!dropdownVisible); // Toggle visibility
  };

  const handleDropdownVisibleChange = (visible) => {
    setDropdownVisible(visible); // Sync visibility state with Dropdown
  };

  const menu = (
    <Menu className="flex flex-col justify-center  gap-2 w-[200px]"
      theme="dark"
    >
      <Menu.Item className='menu-item-top-navbar-pages' icon={<HomeOutlined className='antd-icon'/>} key="home">
          Home
        </Menu.Item>

        <Menu.Item className='menu-item-top-navbar-pages' icon={<MessageOutlined className='antd-icon'/>} key="chat">
          Chat
        </Menu.Item>
        <Menu.Item className='menu-item-top-navbar-pages' icon={<HistoryOutlined className='antd-icon'/>} key="history">
          History
        </Menu.Item>
        <Menu.Item className='menu-item-top-navbar-pages' icon={<HeartOutlined className='antd-icon'/>} key="favorie">
          Favories
        </Menu.Item>
        <Menu.Item className='menu-item-top-navbar-pages' icon={<div><Badge count={numberOfNotif} dot><BellOutlined className='antd-icon' /></Badge></div>} key="notif">
          Notification
        </Menu.Item>
        <Menu.Item className='menu-item-top-navbar-pages' key="view-profile" icon={<UserOutlined className='antd-icon'/>}>
          View Profile
        </Menu.Item>
        <Menu.Item className='menu-item-top-navbar-pages' key="logout" icon={<LogoutOutlined className='antd-icon'/>}>
          Logout
        </Menu.Item>
    </Menu>
  );

  return (
    <div className="w-full p-9 grid grid-cols-[40px_1fr] grid-rows-1 gap-4">
      <Dropdown
        overlay={menu}
        placement="bottomRight"
        visible={dropdownVisible}
        onVisibleChange={handleDropdownVisibleChange}
      >
        <div onClick={handleMenuClick} className="w-fit p-[4px] cursor-pointer hover:bg-slate-700 flex items-end justify-end rounded-full">
          <MenuOutlined className="menu-outlined-navbar w-fit h-fit p-2 cursor-pointer hover:bg-slate-400 flex items-end justify-end rounded-full" />
        </div>
      </Dropdown>
      <Menu.Item
        className="menu-item-top-navbar"
        icon={<FireFilled style={{ color: '#eb2f96' }} className="logo-navbar-fire-icon" />}
        key="logo"
      >
        <h1 className="flex items-center text-4xl font-bold text-white">
          <span className="italic text-3xl font-extrabold font-sans bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
            Matcha
          </span>
        </h1>
      </Menu.Item>
    </div>
  );
}

const Navbar= () => {
    const [navBarView, setNavBarView] = useState<boolean>(true);
  
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 900) {
          setNavBarView(false);
        } else {
          setNavBarView(true);
        }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, [navBarView, setNavBarView]);


    return (
        <Menu 
          mode="horizontal" 
          className='top-navbar flex items-center '
          theme="dark"
        >
            {navBarView ? 
              <FullScreen />:
              <MobileNavBar/>
            }

        </Menu>
    );
};

export default Navbar;
