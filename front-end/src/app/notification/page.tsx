"use client";
import React, { useState, useEffect } from "react";
import { BellOutlined } from "@ant-design/icons";
import axios, { AxiosError } from 'axios';
import { Avatar } from 'antd';
import { useAuth } from "@/context/AuthContext";


interface Notification {
  userPicture: string;
  username: string;
  type: string;
  time: string;
  isUnread: boolean;
}

const notificationMap = {
  like: {
    title: "you've got a new like!",
    subtitle: "Someone appreciates your profile—check it out!"
  },
  viewed: {
    title: "your profile was just viewed!",
    subtitle: "Curious eyes are on you—find out who!"
  },
  message: {
    title: "you’ve received a new message!",
    subtitle: "Someone has something to say—read it now!"
  },
  match: {
    title: "it's a match!",
    subtitle: "The feeling is mutual—start a conversation!"
  },
  unliked: {
    title: "a connection changed.",
    subtitle: "One connection has been updated—see what's new."
  },
  unread: {
    title: "you have unread notifications—check now!",
    subtitle: "Don't miss out—check your notifications!"
  }
};


const NotificationCard = ({ notification }: { notification: Notification }) => {
  const [mobileNotif, setMobileNotif] = useState<boolean>(false);
  const { userPicture, username, type, time, isUnread } = notification;
  const title = notificationMap[type]?.title;
  const subtitle = notificationMap[type]?.subtitle;
  
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
    <div className={`grid grid-rows-1 grid-cols-[auto_1fr_auto] gap-4 w-full lg:w-[768px]  border-[#2e3f5a] items-center border-b-[1px] rounded-md p-[4px_12px] cursor-default  hover:bg-sky-950 ${!isUnread && "bg-sky-900"}`}>
      <div className="w-12 h-12 md:w-15 md:h-15 ">
        <img src={userPicture} alt="Image" className="w-full h-full object-cover rounded-lg" />
      </div>
    
      <div className="h-full w-full flex flex-col">
        <div className="font-bold sm:text-xl">
          {username} {!mobileNotif && `, ${title}`}
        </div>
        <div className={`${isUnread? "text-gray-400" : "text-gray-600"} text-sm md:text-base`}>
          {mobileNotif? title : subtitle}
        </div>
      </div>
    
      <div className="h-full w-fit text-sm md:text-base text-gray-500">
        {time}
      </div>
    
    </div>
    
  );
};

function fetchData(userId: number): Promise<Notification[]> {
  return  axios.get('http://localhost:5000/api/notif/')
      .then((response: any) => {
        return response.data;
      })
      .catch((error: any) => {
          console.error('Error fetching data:', error);
          throw error;
      });
}

const NotificationPage = () => {
  const [notificationsData, setNotificationsData] = useState<Notification[]>([]);
  const { user, loading } = useAuth();

  useEffect(() => {
    const getNotifications = async () => {
      if (loading || !user) return;
      try {
        const notification = await fetchData(user.id);
        setNotificationsData(notification.data);
        console.log("-->", notification);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    getNotifications();
  }, [user, loading]);

  return (
    <div className="w-screen h-full p-[12px_0_0_0] md:p-[12px_2em_0_2em] flex items-center justify-center box-border overflow-x-scroll bg-[#232735]">
      <div className="w-full  h-full flex flex-col items-center gap-2 ">
        {notificationsData.map((notif, index) => (
          <NotificationCard key={index} notification={notif} />
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;