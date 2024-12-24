import { AuthProvider } from './providers/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from "./routes/AppRoutes"
import { ConfigProvider } from 'antd';

function App() {

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
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes></AppRoutes>
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
