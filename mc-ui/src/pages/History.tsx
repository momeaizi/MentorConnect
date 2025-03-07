import { useState, useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import api from "../services/api";
import { useNavigate } from 'react-router-dom';
import { Empty } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';


interface History {
  userPicture: string;
  username: string;
  time: string;
}


const HistoryCard = ({ history }: { history: History }) => {
  const [mobileNotif, setMobileNotif] = useState<boolean>(false);
  const { userPicture, username, time } = history;
  const navigteTo = useNavigate();
  const title = "Profile Visit Tracking";
  const subtitle = "Ensure Every Profile View is Logged in the User’s Visit History";
  
  const handleClickHistoryCard = ()=> {
    navigteTo(`/profiles/${history?.username}`);
  }
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 560) {
        setMobileNotif(true);
      } else {
        setMobileNotif(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, [mobileNotif, setMobileNotif]);



  return (
    <div onClick={handleClickHistoryCard}
      className='cursor-pointer grid grid-rows-1 grid-cols-[auto_1fr_auto] gap-4 w-full lg:w-[768px]  border-[#2e3f5a] items-center border-b-[1px] rounded-md p-[4px_12px] cursor-default  hover:bg-sky-950 '
    >
        <div className="w-12 h-12 md:w-15 md:h-15 ">
        <img
          src={`http://localhost:7777/api/profiles/get_image/${userPicture}`}
          alt="Image"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    
      <div className="h-full w-full flex flex-col">
        <div className="font-bold sm:text-xl">
          {username} {!mobileNotif && `, ${title}`}
        </div>
        <div className="text-gray-400 text-sm md:text-base">
          {mobileNotif? title : subtitle}
        </div>
      </div>
    
      <div className="h-full w-fit text-sm md:text-base text-gray-500">
        {time}
      </div>
    
    </div>
    
  );
};

function fetchData(): Promise<History[]> {
  return  api.get("/profiles/viewed")
      .then((response: any) => {
        return response.data?.data;
      })
      .catch((error: any) => {
          console.error('Error fetching data:', error);
          throw error;
      });
}

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState<History[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    const getHistory = async () => {
      if (!user) return;
      try {
        const history = await fetchData();
        setHistoryData(history);
      } catch (error) {
        console.error('Failed to fetch History:', error);
      }
    };

    getHistory();
  }, [user]);
  
  

  return (
    <div className="w-screen h-full p-[12px_0_0_0] md:p-[12px_2em_0_2em] flex items-center justify-center box-border overflow-x-scroll bg-[#232735]">
      { (historyData.length) ?
        <div className="w-full  h-full flex flex-col items-center gap-2 ">
        {historyData.map((history, index) => (
          <HistoryCard key={index} history={history} />
        ))}
        </div> :
        <Empty
          image={<HistoryOutlined style={{ fontSize: 64, color: '#8c8c8c' }} />}
          imageStyle={{ height: 60 }}
          description={
            <span>
              No history available
            </span>
          }
        >
          <p style={{ color: '#8c8c8c' }}>Your activity history will appear here as you use the application.</p>
        </Empty>
      }
    </div>
  );
};

export default HistoryPage;