import { Card, Avatar, Badge, Button, Typography, Space, Tag, Image, Empty, Tooltip } from 'antd';
import { HeartOutlined, HeartFilled, MessageOutlined, StopOutlined, FlagOutlined, StarOutlined, ManOutlined, WomanOutlined, PictureOutlined, TagOutlined } from '@ant-design/icons';
import { MapPinIcon } from 'lucide-react';
import { Profile } from '../types/profile';
import { useState } from 'react';
import { Modal } from 'antd';

const { Title, Text, Paragraph } = Typography;

interface UserProfileProps {
  profile: Profile;
  currentUserId: number;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.floor(Math.abs((Math.sin(hash) * 16777215) % 1) * 16777215).toString(16);
  return '#' + '0'.repeat(6 - color.length) + color;
}


const getLikeButtonProps = (isLikedByCurrentUser: boolean, hasLikedCurrentUser: boolean) => {
  if (isLikedByCurrentUser && hasLikedCurrentUser) {
    return {
      icon: <HeartFilled style={{ color: '#eb2f96' }} />,
      children: 'Matched',
    };
  } else if (isLikedByCurrentUser) {
    return {
      icon: <HeartFilled style={{ color: '#eb2f96' }} />,
      children: 'Liked',
    };
  } else if (hasLikedCurrentUser) {
    return {
      icon: <HeartOutlined style={{ color: '#eb2f96' }} />,
      children: 'Like Back',
    };
  } else {
    return {
      icon: <HeartOutlined />,
      children: 'Like',
    };
  }
};


export default function UserProfile({ profile, currentUserId }: UserProfileProps) {

  const initials = getInitials(profile.firstName, profile.lastName);
  const avatarColor = stringToColor(profile.username);

  const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false);
  const hasLikedCurrentUser = true;
  const [likeButtonProps, setLikeButtonProps] = useState(getLikeButtonProps(isLikedByCurrentUser, hasLikedCurrentUser));



  const onRemoveLike = (profileId: number) => {
    Modal.confirm({
      title: 'Confirm Action',
      content: 'Are you sure you want to remove your like from this profile?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        setIsLikedByCurrentUser(false);
        setLikeButtonProps(getLikeButtonProps(false, hasLikedCurrentUser));
        console.log(profileId);
      },
      onCancel: () => {
        console.log('Action canceled');
      },
    });
  };
  


  const onLike = async (profileId: number) => {
    if (!isLikedByCurrentUser) {
      setIsLikedByCurrentUser(true);
      setLikeButtonProps(getLikeButtonProps(true, hasLikedCurrentUser));
    } else {
      onRemoveLike(profileId);
    }
    console.log(profileId, currentUserId);
  }

  

  return (
    <Card style={{ maxWidth: 600, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={4}>{profile.username}</Title>
          <Badge 
            status={profile.is_logged_in ? "success" : "default"} 
            text={profile.is_logged_in ? "Online" : `Last seen: ${profile.last_logged_in}`} 
          />
        </Space>

        <Space direction="vertical" align="center" style={{ width: '100%' }}>
          {profile.image ? (
            <Avatar size={128} src={profile.image} alt={profile.username} />
          ) : (
            <Avatar size={128} style={{ backgroundColor: avatarColor, fontSize: '3rem', fontWeight: 'bold' }}>
              {initials}
            </Avatar>
          )}
          <Title level={3}>{`${profile.firstName} ${profile.lastName}`}</Title>
          
          <Space size="large">
            <Space direction="vertical" align="center">
              <Text strong>Fame Rating</Text>
              <Space>
                <StarOutlined style={{ fontSize: '18px', color: '#faad14' }} />
                <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>{profile.fameRating}</Text>
              </Space>
            </Space>
            <Space direction="vertical" align="center">
              <Text strong>Distance</Text>
              <Space>
                <MapPinIcon size={18} />
                <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>{profile.distance} km</Text>
              </Space>
            </Space>
            <Space direction="vertical" align="center">
              <Text strong>Gender</Text>
              <Space>
                {profile.gender.toLowerCase() === 'male' ? (
                  <ManOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                ) : profile.gender.toLowerCase() === 'female' ? (
                  <WomanOutlined style={{ fontSize: '18px', color: '#eb2f96' }} />
                ) : (
                  <span style={{ fontSize: '18px' }}>⚧</span>
                )}
                <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>{profile.gender}</Text>
              </Space>
            </Space>
          </Space>
        </Space>

        <Space wrap style={{ width: '100%', justifyContent: 'center' }}>
          <Tooltip title={(isLikedByCurrentUser && hasLikedCurrentUser) ? "You've matched!" : hasLikedCurrentUser ? "This user likes you" : ""}>
            <Button
              className="shadow-none"
              onClick={() => onLike(profile.id)}
              {...likeButtonProps}
            >
              {likeButtonProps.children}
            </Button>
          </Tooltip>
          {profile.conversationId && <Button className="shadow-none" icon={<MessageOutlined />}>Message</Button>}
          <Button className="shadow-none" icon={<StopOutlined />} danger>Block</Button>
          <Button className="shadow-none" icon={<FlagOutlined />}>Report</Button>
        </Space>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={4}>About Me</Title>
          <Paragraph>{profile.bio || "No bio provided."}</Paragraph>
        </Space>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={4}>Common Interests</Title>
          {profile.common_interests && profile.common_interests.length > 0 ? (
            <Space wrap>
              {profile.common_interests.map((interest: string, index: number) => (
                <Tag key={index} color="blue">{interest}</Tag>
              ))}
            </Space>
          ) : (
            <Empty
              image={<TagOutlined style={{ fontSize: 60, color: '#1890ff' }} />}
              imageStyle={{ height: 60 }}
              description={
                <Space direction="vertical" align="center">
                  <Text strong>No common interests found</Text>
                  <Text type="secondary">You don't share any interests with this user yet.</Text>
                </Space>
              }
            />
          )}
        </Space>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={4}>Interests</Title>
          {profile.interests && profile.interests.length > 0 ? (
            <Space wrap>
              {profile.interests.map((interest: string, index: number) => (
                <Tag key={index} color="blue">{interest}</Tag>
              ))}
            </Space>
          ) : (
            <Empty
              image={<TagOutlined style={{ fontSize: 60, color: '#1890ff' }} />}
              imageStyle={{ height: 60 }}
              description={
                <Space direction="vertical" align="center">
                  <Text strong>No interests listed</Text>
                  <Text type="secondary">This user hasn't added any interests to their profile.</Text>
                </Space>
              }
            />
          )}
        </Space>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={4}>Photos</Title>
          {profile.pictures && profile.pictures.length > 0 ? (
            <Image.PreviewGroup>
              <Space wrap>
                {profile.pictures.map((picture: string, index: number) => (
                  <Image
                    key={index}
                    width={150}
                    src={picture}
                    alt={`${profile.username}'s photo ${index + 1}`}
                  />
                ))}
              </Space>
            </Image.PreviewGroup>
          ) : (
            <Empty
              image={<PictureOutlined style={{ fontSize: 60, color: '#1890ff' }} />}
              imageStyle={{ height: 60 }}
              description={
                <Space direction="vertical" align="center">
                  <Text strong>No photos uploaded</Text>
                  <Text type="secondary">This user hasn't added any photos to their profile yet.</Text>
                </Space>
              }
            />
          )}
        </Space>
      </Space>
    </Card>
  )
}
