import { Card, Avatar, Badge, Button, Typography, Space, Tag, Rate, Image } from 'antd';
import { HeartOutlined, MessageOutlined, StopOutlined, FlagOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import api from '../services/api';

const { Title, Text, Paragraph } = Typography;

const dummyUser = {
  id: '1',
  username: 'jane_doe',
  firstName: 'Jane',
  lastName: 'Doe',
  gender: 'Female',
  bio: 'I love hiking, reading, and trying new cuisines. Looking for someone who shares my passion for adventure and good conversations.',
  interests: ['hiking', 'reading', 'cooking', 'travel', 'photography'],
  common_interests: ['hiking', 'reading', 'cooking', 'travel', 'photography'],
  image: 'https://thispersondoesnotexist.com/',
  pictures: [
    'https://thispersondoesnotexist.com/',
    'https://thispersondoesnotexist.com/',
    'https://thispersondoesnotexist.com/',
    'https://thispersondoesnotexist.com/',
    'https://thispersondoesnotexist.com/',
  ],
  fameRating: 8.5,
  location: 'New York, NY',
  lastOnline: '2 hours ago',
  is_logged_in: true,
}


interface UserProfileProps {
  profile: any;
}



export default function UserProfile({ profile }: UserProfileProps) {
  return (
    <Card style={{ maxWidth: 600, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={4}>{dummyUser.username}</Title>
          <Badge 
            status={dummyUser.is_logged_in ? "success" : "default"} 
            text={dummyUser.is_logged_in ? "Online" : `Last seen: ${dummyUser.lastOnline}`}
          />
        </Space>

        <Space direction="vertical" align="center" style={{ width: '100%' }}>
          <Avatar size={128} src={dummyUser.image} alt={dummyUser.username}>
            {dummyUser.username[0].toUpperCase()}
          </Avatar>
          <Title level={3}>{`${dummyUser.firstName} ${dummyUser.lastName}`}</Title>
          <Text type="secondary">{dummyUser.gender}</Text>
          <Text type="secondary">{dummyUser.location} Km</Text>
        </Space>

        <Space wrap style={{ width: '100%', justifyContent: 'center' }}>
          <Button className="shadow-none" icon={<HeartOutlined />}>Like</Button>
          <Button className="shadow-none" icon={<MessageOutlined />}>Message</Button>
          <Button className="shadow-none" icon={<StopOutlined />} danger>Block</Button>
          <Button className="shadow-none" icon={<FlagOutlined />}>Report</Button>
        </Space>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={4}>About Me</Title>
          <Paragraph>{dummyUser.bio}</Paragraph>
        </Space>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={4}>Common Interests</Title>
          <Space wrap>
            {dummyUser.common_interests.map((interest, index) => (
              <Tag key={index} color="blue">{interest}</Tag>
            ))}
          </Space>
        </Space>


        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={4}>Interests</Title>
          <Space wrap>
            {dummyUser.interests.map((interest, index) => (
              <Tag key={index} color="blue">{interest}</Tag>
            ))}
          </Space>
        </Space>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={4}>Fame Rating</Title>
          <Rate disabled defaultValue={dummyUser.fameRating / 2} allowHalf />
          <Text>{dummyUser.fameRating} / 10</Text>
        </Space>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={4}>Photos</Title>
          <Image.PreviewGroup>
            <Space wrap>
              {dummyUser.pictures.map((picture, index) => (
                <Image
                  key={index}
                  width={150}
                  src={picture}
                  alt={`${dummyUser.username}'s photo ${index + 1}`}
                />
              ))}
            </Space>
          </Image.PreviewGroup>
        </Space>
      </Space>
    </Card>
  )
}

