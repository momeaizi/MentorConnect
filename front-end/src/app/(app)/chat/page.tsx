
import React, {useState, useEffect} from 'react';
import '@/app/globals.css'
import { Input, Empty } from 'antd';
import useStore from '@/lib/store';
import axios from 'axios';
import {
  SearchOutlined,
  ArrowLeftOutlined
 } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';


interface CellData {
  image:string;
  name: string;
  lastMessage: string;
  time: string;
  isSeen: boolean;
  id: number
}

interface ButtonProps {
  isSelected: boolean;
  onClick: () => void;
  cellData: CellData;
}

// ? side nav chat 

function ChatCell({ isSelected, onClick, cellData }: ButtonProps) {
  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer w-full h-[70px] p-[8px] grid justify-center items-center grid-rows-1 grid-cols-[50px_1fr_50px] rounded-[4px] hover:bg-sky-900
        ${isSelected && 'bg-sky-700'}`}
      >
      <div className=' flex justify-center items-center rounded-[50px]'>
        <img
          className='rounded-[50px]'
          width={50}
          src={cellData.image}
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
        { !cellData.isSeen && <div className="bg-gradient-to-r from-pink-500 to-red-500 w-2.5 h-2.5 rounded-full"></div>}
      </div>
    </div>
  )
}

// const cellData = {
//   image:"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
//   name: "Abdelmounim Skerba",
//   lastMessage: "hello agains!",
//   time: "3:54AM",
//   isSeen: false,
//   id: 1
// }

function fetchData(id=''): Promise<Notification[]> {
  return  axios.get(`http://localhost:5000/api/chat/conversation${id != '' ? `/${id}`: ''}`)
      .then((response: any) => {
        return response.data;
      })
      .catch((error: any) => {
          console.error('Error fetching data:', error);
          throw error;
      });
}


function SideNavChat() {
  const {selectedIndex, setSelectedIndex, setSelectedConv} = useStore();
  const [cellData, setCellData] = useState<CellData[]>([])



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
  }, []);
  

  const handleChatCellClick = (index:number, id:number) => {
    setSelectedIndex(index);
    setSelectedConv(id);
  };

  useEffect(()=>{
    console.log("sedenav", selectedIndex);
  },[selectedIndex])

  return (
    <div className='flex flex-col h-full w-1/3 min-w-96 bg-[#1E2025] md:w-1/3 w-full'>

      {/* Search in Conversations */}
      <div className='flex justify-center items-center w-full h-fit p-[0.5em]'>

        <form className="w-full h-[2.0em]">   
            <div className="relative">
                <input
                  type="search"
                  id="default-search"
                  className="block w-full h-[1.0em] p-[1em] ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search"/>
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <SearchOutlined style={{"color":"white"}}/>
                </div>
            </div>
        </form>

      </div>

      {/* Cell navbar */}
      <div className='overflow-scroll flex flex-col h-full p-[12px]'>
        {cellData.map((cell:CellData, index:number) => (
          <ChatCell
            key={index}
            isSelected={selectedIndex === index}
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

const header = {
  image: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  name: 'Abdelmounim Skerba',
  is_online: true

}


function ConversationWindow() {
  const [returnToSide, setReturnToSide] = useState<boolean>(false)
  const [chatHeader, setChatHeader] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [loadding, setLodding] = useState<boolean>(false)
  const {socket, setSelectedIndex, setSelectedConv, selectedConv} = useStore();
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  useEffect(() => {
    socket.on('new_message', (data:any) => {
      console.log('---->', data);
      setChatMessages((prevMessages:any) => [...prevMessages, data]);
    });

    return () => {
      socket.off('new_message');
    };
  }, []);

  const sendMessage = async () => {
    const trimmedMessage = newMessage.trim();
    if (trimmedMessage.length) {
      const ret = await axios.post('http://localhost:5000/api/chat/message', {
        conversation_id: chatHeader.id,
        user_id: 1,
        message: trimmedMessage, 
      });
      console.log(ret);
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
    
    setLodding(false)
    
    if (selectedConv !== null) {
      getChatWindow();
      setLodding(true);
    }
  }, [selectedConv]);

  const handleReturnClick = () => {
    setSelectedIndex(null);
    setSelectedConv(null)
  }

  return(
    <>
      {
        (loadding) ?
        <div className='h-full grid grid-cols-1 grid-rows-[auto_1fr_auto] overflow-hidden w-2/3 bg-[#232736] md:w-2/3 w-full'>

              <div className='box-border flex gap-4 items-center w-full h-fit p-[0.5em] pl-10 border-b-[#616060] border-b-[0.1px]'>

                {returnToSide && <div className='cursor-pointer' onClick={handleReturnClick}>
                  <ArrowLeftOutlined className='w-[30px] font-extrabold font-[10px]'/> 
                </div>}
                <img
                  className='rounded-[50px]'
                  width={40}
                  src={chatHeader?.image}
                  // preview={false}
                />
                <div className='flex flex-col gap-0'>
                  <div className='font-bold	'>
                    {chatHeader?.name}
                  </div>
                  <div className='text-gray-400 text-sm'>
                    {(chatHeader?.is_online)?"Online":"Offline"}
                  </div>
                </div>

              </div>

              <div className='w-full h-full p-[0_4em] pt-4 flex flex-col justify-end  gap-3 overflow-y-scroll overflow-x-hidden grow'>

                {chatMessages.map((data:any, index:number) => (
                  (data.id === chatHeader.id)?
                    <SenderMessage message={data.message}/>
                    :
                    <ReceiveMessage message={data.message}/>
                ))}
        

              </div>

              <div className='flex justify-center items-center w-full h-fit p-[0.5em_4em]'>
                <Input

                  value={newMessage}
                  onChange={handleMessageChange}
                  onKeyDown={handleKeyDown}
                  size="larg"
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
  const {selectedIndex} = useStore();

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
    console.log("")
    if (selectedIndex != null && window.innerWidth <= 768)
      setMessagePages('window');
    else if (!selectedIndex && window.innerWidth <= 768)
      setMessagePages('list');
      
  },[selectedIndex])


  return (
    <div className='h-full w-screen  flex bg-red'>
      {lodding && 
        <>
          {(messagePages === 'both' || messagePages === 'list') && <SideNavChat />}
          {(messagePages === 'both' || messagePages === 'window') && <ConversationWindow />}
        </>
      }
    </div>
  );
}