'use client'
import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import "@/styles/navBar.css";
import {
  HomeOutlined, MessageOutlined,
  HistoryOutlined, HeartOutlined,
  FireFilled, BellOutlined,
  UserOutlined, LogoutOutlined
 } from '@ant-design/icons';

function FullScreen() {
  return (
    <>
      <div className='flex'>
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
      </div>
      <div className='flex gap-0'>
        <Menu.Item className='menu-item-top-navbar-pages' icon={<BellOutlined className='antd-icon'/>} key="notif">
        </Menu.Item>
        <Menu.SubMenu 
        className='menu-item-top-navbar-pages' 
        key="profile"  
        icon={<UserOutlined className='antd-icon' />}
        >
          <Menu.Item className='menu-item-top-navbar-pages' key="view-profile" icon={<UserOutlined className='antd-icon'/>}>
            View Profile
          </Menu.Item>
          <Menu.Item className='menu-item-top-navbar-pages' key="logout" icon={<LogoutOutlined className='antd-icon'/>}>
            Logout
          </Menu.Item>
        </Menu.SubMenu>
      </div>
    </>
  );
}

function MobileNavBar(){
  return  (
    <>
    </>
  );
}

const Navbar= () => {
    const [navBarView, setNavBarView] = useState<boolean>(true);
  
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 1000) {
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
          <div className=' flex items-center justify-between w-full'>

            <Menu.Item className='menu-item-top-navbar' icon={<FireFilled style={{color:"#eb2f96"}} className='logo-navbar-fire-icon'/>} key="logo" >
              <h1 className="flex items-center text-4xl font-bold text-white">
                <span className="italic text-3xl font-extrabold	font-sans bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">Matcha</span>
              </h1>
            </Menu.Item>
            <FullScreen />
            {/* <MobileNavBar/> */}
          </div>
        </Menu>
    );
};

export default Navbar;
