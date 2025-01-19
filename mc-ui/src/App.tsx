import AppRoutes from "./routes/AppRoutes"
import { ConfigProvider, notification } from 'antd';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useStore from './lib/store';
import { MailOutlined, SoundOutlined } from '@ant-design/icons';
import './App.css';
import { useAuth } from './providers/AuthProvider';

function App() {
  const { setNumberOfNotif, setNewNotif, setNewMessageSocket, setSocket, setNumberOfMessage } = useStore();
  const [api, contextHolder] = notification.useNotification();
  const { token, user } = useAuth()

  const openNotification = (message: string, icons: any) => {
    api.open({
      message: message,
      icon: icons
    });
  };

  useEffect(() => {
    const socket = io('http://localhost:7777',
      {
        transports: ['websocket'],
        query: {
          token: token,
        },
      }
    );

    socket.on('connect', () => {
      useStore.getState().setSocket(socket);
    });

    socket.on('new_message', (data: any) => {
      setNewMessageSocket(data);
      if (data.user_id != user?.id) {
        setNumberOfMessage(1);
        openNotification("You've a new Message!", <MailOutlined style={{ color: '#ef4444' }} />);
      }
    });
    socket.on('new_notification', (data: any) => {
      setNewNotif(data);
      console.log(data)
      if (data.user_id != user?.id) {
        setNumberOfNotif(1);
        openNotification("You've a new Notification!", <SoundOutlined style={{ color: '#ef4444' }} />);
      }
    });
    setSocket(socket);

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      useStore.getState().setSocket(null);
    });

    if (!user) {
      socket.disconnect();
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextPlaceholder: "#70707B",
          colorPrimary: '#ec4899',
          colorBgBase: '#1a1b27',
          colorText: "#FAFAFA",
          colorBorder: "#70707B",
          colorBorderSecondary: "#3F3F46",
          colorIcon: '#70707B',
          colorTextBase: '#ffffff',
          colorPrimaryBorderHover: '#4A5568',
          // Additional customizations for input fields
          controlOutline: 'rgba(236, 72, 153, 0.2)', // Subtle outline based on colorPrimary
          controlOutlineWidth: 1,
          controlTmpOutline: 'rgba(236, 72, 153, 0.4)', // Slightly more visible when clicked
        },
        components: {
          Input: {
            activeBorderColor: '#ec4899', // Use colorPrimary for active state
            hoverBorderColor: '#4A5568', // Use colorPrimaryBorderHover for hover state
            addonBg: '#1a1b27', // Match the background color
          },
        },
      }}
    >
      {contextHolder}
      <AppRoutes />
    </ConfigProvider>
  )
}

export default App
