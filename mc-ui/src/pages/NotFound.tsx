import { Button, Typography, Layout, Space } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function NotFound() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#1E2A38' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Space direction="vertical" align="center" size="large">
          <RocketOutlined style={{ color: '#FF6B6B', fontSize: '64px' }} />
          <Title level={2} style={{ color: '#FFFFFF', margin: 0 }}>404 - Page Not Found</Title>
          <Text style={{ color: '#E0E0E0', fontSize: '18px' }}>
            This page is lost in space.
          </Text>
          <Link to="/">
            <Button type="primary" size="large" icon={<RocketOutlined />}>
              Back to Earth
            </Button>
          </Link>
        </Space>
      </Content>
    </Layout>
  );
}

