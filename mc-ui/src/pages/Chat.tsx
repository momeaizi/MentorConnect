import React, {useState, useEffect, useRef} from 'react';
import '../assets/styles/globals.css'
import { Input, Empty, notification } from 'antd';
import useStore from '../lib/store';
import {
  SearchOutlined,InfoCircleOutlined,
  ArrowLeftOutlined
 } from '@ant-design/icons';
 import { useAuth } from "../providers/AuthProvider";
import api from '../services/api';
import '../assets/styles/chat.css';
import { isAxiosError } from '../types/api';

interface CellData {
  image:string;
  name: string;
  lastMessage: string;
  time: string;
  isSeen: boolean;
  id: number
  user_id: number;
}

interface ButtonProps {
  isSelected: number;
  onClick: () => void;
  cellData: CellData;
}

interface HeaderTypes{
  image: string;
  name: string;
  is_logged_in: boolean;
  id: number;

}

interface MessageSend{
  selectedConv: number;
  user_id: number;
  message: string;
}

async function postMessage(data:MessageSend, openNotification:any) {
  try{
    await api.post('/chat/message', {
      conversation_id: data.selectedConv,
      user_id: data.user_id,
      message: data.message, 
    });

  } catch (error) {
    if (isAxiosError(error)) {
      if (error.status == 404)
        openNotification('This conversation already blocked', <InfoCircleOutlined style={{ color: 'red' }}/>);
      else 
        openNotification('Error posting data', <InfoCircleOutlined style={{ color: 'red' }}/>);
    }
  }


}

// ? side nav chat 

function ChatCell({ isSelected, onClick, cellData }: ButtonProps) {
  const {user} = useAuth();
  const is_read = !cellData.isSeen && user && cellData?.user_id != user.id
  
  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer w-full h-[70px] p-[8px] grid justify-center items-center grid-rows-1 grid-cols-[50px_1fr_50px] rounded-[4px] hover:bg-sky-900
        ${(isSelected == cellData.id ) && 'bg-sky-700'}`}
      >
      <div className=' flex justify-center items-center rounded-[50px]'>
        <img
          className='rounded-[50px] w-[40px] h-[40px]'
          width={50}
          src={`http://localhost:7777/api/profiles/get_image/${cellData.image}`}
          // preview={false}
        />
      </div>
      <div className=' pl-2 flex flex-col g-0'>
        <div className='cell-user-name'>
          {cellData.name}
        </div>
        <div className='cell-last-message'>
          {cellData.lastMessage}
        </div>
      </div>
      <div className='flex flex-col items-end gap-2'>
        <div className='cell-last-message-time'>
          {cellData.time}
        </div>
        { is_read && <div className="bg-gradient-to-r from-pink-500 to-red-500 w-2.5 h-2.5 rounded-full"></div>}
      </div>
    </div>
  )
}

function fetchData(id:string|number='') {
  return  api.get(`/chat/conversation${id != '' ? `/${id}`: ''}`)
      .then((response: any) => {
        return response.data;
      })
      .catch((error: any) => {
          console.error('Error fetching data:', error);
          throw error;
      });
}


function SideNavChat() {
  const {selectedIndex, setSelectedIndex, setSelectedConv, selectedConv, newMessageSocket} = useStore();
  const [cellData, setCellData] = useState<CellData[]>([]);
  const [listData, setListData] = useState<CellData[]>([]);;
  const [searchValue, setSearchValue] = useState<string>('');



  useEffect(() => {
    const getChatCell = async () => {
      try {
        const chatCells = await fetchData();
        setCellData(chatCells?.data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    getChatCell();
  }, [newMessageSocket, selectedIndex, selectedConv]);
  

  const handleChatCellClick = (index:number, id:number) => {
    setSelectedIndex(index);
    setSelectedConv(id);
  };


  function changeValueSearchInput(event: any) {
    setSearchValue(event.target.value)
  }

  useEffect(()=>{
    if (searchValue?.length) {
      const data = cellData?.filter((cell: any) => cell.name.toLowerCase().includes(searchValue?.toLocaleLowerCase()))
      setListData(data);
    } else {
      setListData(cellData)
    }
  },[searchValue, cellData])

  useEffect(()=>{
    // console.log("sedenav", selectedIndex);
  },[selectedIndex])

  return (
    <div className='flex flex-col h-full w-full min-w-96 bg-[#1E2025] md:w-1/3 w-full'>

      {/* Search in Conversations */}
      <div className='flex justify-center items-center w-full h-fit p-[0.5em]'>

        <form className="w-full h-[2.0em]">   
            <div className="relative">
                <input
                  type="search"
                  id="default-search"
                  value={searchValue}
                  onChange={changeValueSearchInput}
                  className="block w-full h-[40px] p-[1em] ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search"/>
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <SearchOutlined style={{"color":"white"}}/>
                </div>
            </div>
        </form>

      </div>

      {/* Cell navbar */}
      <div className='overflow-scroll flex flex-col h-full p-[12px]'>
        {listData.map((cell:CellData, index:number) => (
          <ChatCell
            key={index}
            isSelected={selectedConv}
            onClick={() => handleChatCellClick(index, cell.id)}
            cellData={cell}
          />
        ))}
      </div>
    </div>
  );
}

// ? conversation window


const CustomSendIcon = () => (
  <svg
    className="svg-custom-send-icon cursor-pointer"
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="gradient-id" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
    </defs>
    <path
      d="M14.14 0.960043L5.11 3.96004C-0.960005 5.99004 -0.960005 9.30004 5.11 11.32L7.79 12.21L8.68 14.89C10.7 20.96 14.02 20.96 16.04 14.89L19.05 5.87004C20.39 1.82004 18.19 -0.389957 14.14 0.960043ZM14.46 6.34004L10.66 10.16C10.51 10.31 10.32 10.38 10.13 10.38C9.94 10.38 9.75 10.31 9.6 10.16C9.46052 10.0189 9.38229 9.82847 9.38229 9.63004C9.38229 9.43161 9.46052 9.24118 9.6 9.10004L13.4 5.27684C13.69 4.99004 14.17 4.99004 14.46 5.27684C14.75 5.57004 14.75 6.05004 14.46 6.34004Z"
      fill="url(#gradient-id)"
    />
  </svg>
);

function SenderMessage({message}:{message: string}) {
  return (
    <div className='bg-[#4C4F59] p-4 rounded-[16px_16px_16px_0] self-start max-w-[60%] overflow-wrap text-ellipsis'
      style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
      {message}
    </div>
  );
}

function ReceiveMessage({message}:{message: string}) {
  return (
    <div className='bg-gradient-to-r from-pink-500 to-red-500 p-4 rounded-[16px_16px_0_16px] h-fit self-end max-w-[60%]'
      style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
      {message}
    </div>
  );
}

interface ChatMessage {
  message: string;
  user_id: number;
  conv_id: number;
}

function ConversationWindow() {
  const [returnToSide, setReturnToSide] = useState<boolean>(false)
  const [chatHeader, setChatHeader] = useState<HeaderTypes|null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loadding, setLodding] = useState<boolean>(false)
  const {setSelectedIndex, setSelectedConv, selectedConv, newMessageSocket, setNewMessageSocket, socket} = useStore();
  const [newMessage, setNewMessage] = useState('');
  const [status, setStatus] = useState<boolean>(true);
  const { user } = useAuth();
  const scrollableDivRef = useRef<HTMLDivElement | null>(null);
  const [api, contextHolder] = notification.useNotification();
    
  const openNotification = (message:string, icon:any) => {
      api.open({
        message: message,
        icon: icon,
      });
  };


  useEffect(() => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  useEffect(() => {
      if (newMessageSocket && newMessageSocket.conv_id === selectedConv) {
          setChatMessages((prevMessages) => [...prevMessages, newMessageSocket]);
          setNewMessageSocket(null);
      }
  }, [newMessageSocket]);

  const sendMessage = async () => {
    const trimmedMessage = newMessage.trim();
    if (trimmedMessage.length && user) {
        postMessage({
          selectedConv: selectedConv,
          user_id: user.id,
          message: trimmedMessage,
        }, openNotification)

    }
  
    setNewMessage('');
  }
  
  const handleKeyDown = (event:any) => {
    if (event.key === 'Enter')
      sendMessage();
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setReturnToSide(true)
      } else {
        setReturnToSide(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, [returnToSide, setReturnToSide]);

  useEffect(() => {
    const getChatWindow = async () => {
      try {
        const retData = await fetchData(selectedConv);
        setChatHeader(retData?.data.conversation);
        setChatMessages(retData?.data.messages);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };
    
    setLodding(false);
    
    if (selectedConv) {
      getChatWindow();
      setLodding(true);
    }
  }, [selectedConv]);

  const handleReturnClick = () => {
    setSelectedIndex(0);
    setSelectedConv(0);
  }

  useEffect(()=>{
    if (chatHeader)
      setStatus(chatHeader?.is_logged_in);
  },[chatHeader])



  useEffect(() => {
    const handleStatusEvent = (data:any) => {
      const { user_id, is_logged_in } = data;

      if (user_id === chatHeader?.id) {
        setStatus(is_logged_in);
      }

    };

    if (socket) {
      socket.on('status', handleStatusEvent);
    }

    return () => {
      if (socket) {
        socket.off('status', handleStatusEvent);
      }
    };
  }, [socket]);

  return(
    <>
      {contextHolder}
      {
        (loadding) ?
        <div className='parent-window-chat h-full overflow-hidden w-2/3 bg-[#232736] md:w-2/3 w-full'>
              <div className='header-window-chat box-border flex gap-4 items-center w-full h-full p-[0.5em] pl-10 border-b-[#616060] border-b-[0.1px]'>

                {returnToSide && <div className='cursor-pointer' onClick={handleReturnClick}>
                  <ArrowLeftOutlined className='w-[30px] font-extrabold font-[10px]'/> 
                </div>}
                <img
                  className='rounded-[50px] w-[40px] h-[40px]'
                  width={40}
                  src={`http://localhost:7777/api/profiles/get_image/${chatHeader?.image}`}
                />
                <div className='flex flex-col gap-0'>
                  <div className='font-bold	'>
                    {chatHeader?.name}
                  </div>
                  <div className='text-gray-400 text-sm'>
                    {(status)?"Online":"Offline"}
                  </div>
                </div>

              </div>

              <div ref={scrollableDivRef} className='messages-window-chat w-full p-[0_4em] pt-4 flex flex-col gap-3 overflow-y-scroll overflow-x-hidden '>
                {chatMessages.map((data:any) => (
                  (data.user_id === chatHeader?.id)?
                    <SenderMessage message={data.message}/>
                    :
                    <ReceiveMessage message={data.message}/>
                ))}
              </div>

              <div className='input-window-chat flex justify-center items-center w-full h-full p-[0.5em_4em]'>
                <Input

                  value={newMessage}
                  onChange={handleMessageChange}
                  onKeyDown={handleKeyDown}
                  size="large"
                  placeholder='typeMessage'
                  className="h-[3em] rounded-xl"
                  suffix={<div className="custom-send-icon">
                              <div className='custom-send-icon-parent' onClick={sendMessage}>
                                  <CustomSendIcon />
                              </div>
                          </div>}
                />

              </div>
        </div>
        :
        <div className='w-full h-full flex justify-center items-center bg-[#232736]'>
          <Empty description={false} />
        </div>
      }
    </>
  )

}

// ? Chat Page

export default function ChatPage() {
  const {messagePages, setMessagePages} = useStore();
  const [lodding, setLodding] = useState<boolean>(false);
  const {selectedIndex, selectedConv} = useStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        if (messagePages === 'list' || messagePages === 'window') {
          setMessagePages(messagePages);
        } else {
          setMessagePages('list');
        }
      } else {
        setMessagePages('both');
      }
      setLodding(true);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, [messagePages, setMessagePages]);

  useEffect(()=>{
    if (selectedConv && window.innerWidth <= 768)
      setMessagePages('window');
    else if (!selectedConv && window.innerWidth <= 768)
      setMessagePages('list');
      
  },[selectedConv, window, selectedIndex])


  return (
    <div className='chat-parent w-screen  flex'>
      {lodding && 
        <>
          {(messagePages === 'both' || messagePages === 'list') && <SideNavChat />}
          {(messagePages === 'both' || messagePages === 'window') && <ConversationWindow />}
        </>
      }
    </div>
  );
}
