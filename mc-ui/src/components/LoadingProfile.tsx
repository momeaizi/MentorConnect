import { Card, Skeleton, Space, Typography } from 'antd';

const { Title } = Typography;

export default function LoadingProfile() {
  return (
    <Card style={{ maxWidth: 600, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <Skeleton.Input style={{ width: 120 }} active size="small" />
          <Skeleton.Input style={{ width: 150 }} active size="small" />
        </Space>

        <Space direction="vertical" align="center" style={{ width: '100%' }}>
          <Skeleton.Avatar active size={128} />
          <Skeleton.Input style={{ width: 200 }} active size="large" />
          <Skeleton.Input style={{ width: 150 }} active size="small" />
          <Skeleton.Input style={{ width: 120 }} active size="small" />
        </Space>

        <Space wrap style={{ width: '100%', justifyContent: 'center' }}>
          {[1, 2, 3, 4].map((_, index) => (
            <Skeleton.Button key={index} active style={{ width: 100 }} />
          ))}
        </Space>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={4}>About Me</Title>
          <Skeleton active paragraph={{ rows: 3 }} />
        </Space>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={4}>Common Interests</Title>
          <Space wrap>
            {[1, 2, 3, 4, 5].map((_, index) => (
              <Skeleton.Button key={index} active style={{ width: 80 }} />
            ))}
          </Space>
        </Space>


        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={4}>Interests</Title>
          <Space wrap>
            {[1, 2, 3, 4, 5].map((_, index) => (
              <Skeleton.Button key={index} active style={{ width: 80 }} />
            ))}
          </Space>
        </Space>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={4}>Fame Rating</Title>
          <Skeleton.Input style={{ width: 200 }} active size="small" />
          <Skeleton.Input style={{ width: 100 }} active size="small" />
        </Space>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={4}>Photos</Title>
          <Space wrap>
            {[1, 2, 3, 4, 5].map((_, index) => (
              <Skeleton.Image key={index} style={{ width: 150, height: 150 }} active />
            ))}
          </Space>
        </Space>
      </Space>
    </Card>
  );
}

