import React from 'react';
import '@/app/globals.css'
import { Image } from 'antd';

function ChatCell() {
  return (
    <div className='cursor-pointer w-full h-[70px] p-[8px] grid justify-center items-center grid-rows-1 grid-cols-[50px_1fr_50px] rounded-[4px] hover:bg-sky-900'>
      <div className=' flex justify-center items-center rounded-[50px]'>
        <Image
          className='rounded-[50px]'
          width={50}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          // preview={false}
        />
      </div>
      <div className=' pl-2 flex flex-col g-0'>
        <div className='cell-user-name'>
          abdelmounaim skerba
        </div>
        <div className='cell-last-message'>
          Hello agains!
        </div>
      </div>
      <div className='flex flex-col items-end gap-2'>
        <div className='cell-last-message-time'>
          3:54AM
        </div>
        <div className='cell-no-viewd-message-icon'>
        </div>
      </div>
    </div>
  )
}

function SideNavChat() {
  return (
    <div className='flex flex-col h-full w-1/3 min-w-96 bg-[#1E2025]'>
      {/* Search in Conversations */}
      <div className='flex w-full h-fit p-[16px]'>

        <form className="w-full h-[40px]">   
            <div className="relative">
                <input
                  type="search"
                  id="default-search"
                  className="block w-full h-[40px] p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search"/>
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
            </div>
        </form>

      </div>
      {/* Cell navbar */}
      <div className='overflow-scroll flex flex-col h-full p-[12px]'>
        {Array.from({ length: 40 }, (_, index) => (
          <ChatCell key={index} />
        ))}
      </div>


    </div>
  );
}

export default function ChatPage() {
  return (
    <div className='h-full w-screen  flex bg-red text-red-600'>
      <SideNavChat />
      <div className='h-full w-2/3 bg-blue-600'>conversation</div>
    </div>
  );
}
