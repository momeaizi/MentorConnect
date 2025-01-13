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
    const socket = io('http://localhost:5000',
      {
        transports: ['websocket'],
        query: {
          token: token,
        },
      }
    );

    socket.on('connect', () => {
      console.log('WebSocket connected');
      useStore.getState().setSocket(socket);
    });

    socket.on('new_message', (data: any) => {
      setNewMessageSocket(data);
      setNumberOfMessage(1);
      openNotification("You've a new Message!", <MailOutlined style={{ color: '#ef4444' }} />);
    });
    socket.on('new_notification', (data: any) => {
      setNumberOfNotif(1);
      openNotification("You've a new Notification!", <SoundOutlined style={{ color: '#ef4444' }} />);
      setNewNotif(data);

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
          colorPrimary: '#232735',
          colorBgBase: '#1a1b27',
          colorText: "#FAFAFA",
          colorTextBase: '#ffffff',
          colorBorder: "#70707B",
          colorBorderSecondary: "#3F3F46",
          borderRadius: 8,
        },
      }}
    >
      {contextHolder}
      <AppRoutes></AppRoutes>
    </ConfigProvider>
  )
}

export default App
