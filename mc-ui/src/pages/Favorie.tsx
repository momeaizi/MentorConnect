import { useState, useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import api from "../services/api";
import { useNavigate } from 'react-router-dom';
import { Empty } from 'antd';
import { StarOutlined } from '@ant-design/icons';


interface Favorie {
  userPicture: string;
  username: string;
  time: string;
}


const FavorieCard = ({ favorie }: { favorie: Favorie }) => {
  const [mobileNotif, setMobileNotif] = useState<boolean>(false);
  const { userPicture, username, time } = favorie;
  const navigteTo = useNavigate();
  const title = " Behind the Likes!" ;
  const subtitle = "Unveiling Who Engages and Why!";
  
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

  const handleClickFavorieCard = ()=> {
    navigteTo(`/profiles/${favorie?.username}`);
  }

  return (
    <div
      onClick={handleClickFavorieCard}
      className='cursor-pointer grid grid-rows-1 grid-cols-[auto_1fr_auto] gap-4 w-full lg:w-[768px]  border-[#2e3f5a] items-center border-b-[1px] rounded-md p-[4px_12px] cursor-default  hover:bg-sky-950 '
    >
      <div className="w-12 h-12 md:w-15 md:h-15 ">
        <img
          alt="Image"
          className="w-full h-full object-cover rounded-lg"
          src={`http://localhost:7777/api/profiles/get_image/${userPicture}`}
        />
      </div>
    
      <div className="h-full w-full flex flex-col">
        <div className="font-bold sm:text-xl">
          {username} {!mobileNotif && `, ${title}`}
        </div>
        <div className='text-sm md:text-base text-gray-400'>
          {mobileNotif? title : subtitle}
        </div>
      </div>
    
      <div className="h-full w-fit text-sm md:text-base text-gray-500">
        {time}
      </div>
    
    </div>
    
  );
};

function fetchData(): Promise<Favorie[]> {
  return  api.get('/profiles/liked')
      .then((response: any) => {
        return response.data?.data;
      })
      .catch((error: any) => {
          console.error('Error fetching data:', error);
          throw error;
      });
}

const FavoriePage = () => {
  const [favoriesData, setFavoriesData] = useState<Favorie[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    const getFavories = async () => {
      if (!user) return;
      try {
        const favorie = await fetchData();
        setFavoriesData(favorie);
      } catch (error) {
        console.error('Failed to fetch Favories:', error);
      }
    };

    getFavories();
  }, [user]);
  
  

  return (
    <div className="w-screen h-full p-[12px_0_0_0] md:p-[12px_2em_0_2em] flex items-center justify-center box-border overflow-x-scroll bg-[#232735]">
      {(favoriesData.length) ?
        <div className="w-full  h-full flex flex-col items-center gap-2 ">
          {favoriesData.map((favorie, index) => (
            <FavorieCard key={index} favorie={favorie} />
          ))}
        </div> : 
        <Empty
        image={<StarOutlined style={{ fontSize: 64, color: '#ffd666' }} />}
        imageStyle={{ height: 60 }}
        description={
          <span>
            You haven't added any favorites yet
          </span>
        }
        >
          <p style={{ color: '#8c8c8c' }}>Profiles you favorite will appear here for quick access.</p>
        </Empty>
      }
    </div>
  );
};

export default FavoriePage;