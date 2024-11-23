'use client';
import React,  { FC, useState } from 'react';
import Image from 'next/image';
import MyModal from '@/components/MyModal';
import Button from '@/components/Button';
import Login from '@/utils/Login'
import CreateAccount from '@/utils/CreateAccount'
import "@/app/globals.css"

export default function LandingPage() {
  const [openModal, setOpenModal] = useState<Boolean>(false);
  const [modalChildren, setModalChildren] = useState<FC>();


  const handleClickLogin = () => {
    setOpenModal(true);
    setModalChildren(()=><Login/>);
    console.log("FAfddsf")
  }
  
  const handleClickCreateAccount = () =>{
    setOpenModal(true);
    setModalChildren(()=><CreateAccount/>);
    console.log("FAfddsf")
  }

  return (
    <>
      <MyModal children={modalChildren} openModal={openModal} setOpenModal={setOpenModal}/>
      <div
        className="h-screen bg-cover bg-center grid grid-cols-1 grid-rows-[72px_1fr] gap-0"
        style={{ backgroundImage: "url('/dark_background.jpg')" }}
      >
        <div className="flex flex-row justify-between	items-center	px-8">


          <h1 className="flex items-center text-4xl font-bold text-white">
            <svg
              className="w-8 h-8 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C7.589 2 4 5.589 4 10c0 5.368 6.348 10 8 10s8-4.632 8-10c0-4.411-3.589-8-8-8zm0 15c-1.654 0-3-1.346-3-3 0-1.007.525-1.997 1.345-2.584.218-.156.255-.444.096-.662-.159-.217-.445-.252-.662-.095C8.474 11.588 8 12.785 8 14c0 2.206 1.794 4 4 4s4-1.794 4-4c0-1.216-.474-2.413-1.779-3.341-.217-.157-.504-.122-.662.095-.159.217-.122.506.096.662C14.475 12.003 15 12.993 15 14c0 1.654-1.346 3-3 3z" />
            </svg>
            <span className="ml-2">Matcha</span>
          </h1>
          
          <Button
            text="Log in"
            className="log_in_button cursor-pointer	flex justify-center items-center text-xl box-border bg-white text-black rounded-3xl w-32 h-11 px-5 py-2 font-mono"
            onclick={handleClickLogin}
          />

        </div>
        <div className="flex flex-col justify-center	items-center gap-3.5">
          <p
            className="text-5xl font-extrabold	 mb-4"
            style={{
              fontFamily: '"Proxima Nova", "Helvetica Neue", Arial, Helvetica, sans-serif',
              fontSize: '6vw',
              fontWeight: '800',
            }}
          >
          No boss here, change it
          </p>
          <p className="text-xl text-gray-300">
          He who has no skill should return to his mother's teaching
          </p>
          <Button
            text="Create account"
            className="log_in_button cursor-pointer	 flex justify-center gap-0 items-center text-xl box-border bg-white text-white rounded-3xl w-48/1 h-12 px-3 py-6 font-mono bg-gradient-to-r from-pink-500 to-red-500"
            onclick={handleClickCreateAccount}
          />
          <p 
            className=""
            style={{
              fontFamily: '"Proxima Nova", "Helvetica Neue", Arial, Helvetica, sans-serif',
              fontSize: '20px',
              fontWeight: '600',
            }}>
              
            </p>
        </div>
      </div>
    </>
  );
}