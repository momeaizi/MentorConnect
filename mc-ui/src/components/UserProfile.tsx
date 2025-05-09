import { Card, notification, Avatar, Badge, Button, Typography, Space, Tag, Image, Empty, Tooltip } from 'antd';
import { HeartOutlined, HeartFilled, CloseCircleFilled, MessageOutlined, StopOutlined, FlagOutlined, StarOutlined, ManOutlined, WomanOutlined, PictureOutlined, TagOutlined, FlagFilled } from '@ant-design/icons';
import { MapPinIcon } from 'lucide-react';
import { Profile } from '../types/profile';
import { Modal } from 'antd';
import { getLastSeen } from '../utils/getLastSeen';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import useStore from '../lib/store';
import { LoggedInData } from '../pages/UserProfilePage';
import { useState } from 'react';
import { isAxiosError } from '../types/api';

const { Title, Text, Paragraph } = Typography;

interface UserProfileProps {
  profile: Profile;
  loggedInStatus: LoggedInData;
  onRefresh: () => void;
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


const getLikeButtonProps = (profile: Profile) => {
  if (profile.likeStatus == 'mutual') {
    return {
      icon: <HeartFilled style={{ color: '#eb2f96' }} />,
      children: 'Matched',
    };
  } else if (profile.likeStatus == 'one-way') {
    return {
      icon: <HeartFilled style={{ color: '#eb2f96' }} />,
      children: 'Liked',
    };
  } else if (profile.likeStatus == 'liked-by') {
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


export default function UserProfile({ profile, loggedInStatus, onRefresh }: UserProfileProps) {
  const [isRemoveLikeModalOpen, setIsRemoveLikeModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);


  const initials = getInitials(profile.firstName, profile.lastName);
  const avatarColor = stringToColor(profile.username);

  const likeButtonProps = getLikeButtonProps(profile);

  const navigate = useNavigate();
  const { setSelectedConv } = useStore();
  const [notifApi, contextHolder] = notification.useNotification();

  const openNotification = (message: string, icons: any) => {
    notifApi.open({
      message: message,
      icon: icons
    });
  };




  const onRemoveLike = () => {
    setIsRemoveLikeModalOpen(true);
  };



  const onLike = async () => {
    if (profile.likeStatus == 'liked-by' || profile.likeStatus == 'none') {
      handleLike();
    } else {
      onRemoveLike();
    }
  }



  const handleLike = async () => {
    try {
      await api.post(`/profiles/${profile.id}/like`);

      onRefresh();

    } catch (error) {
      if (isAxiosError(error)) {
        openNotification(error.response?.data?.message || 'An error occurred.', <CloseCircleFilled style={{ color: '#ff4d4f' }} />);
      } else {
        openNotification('An unexpected error occurred. Please try again.', <CloseCircleFilled style={{ color: '#ff4d4f' }} />);
      }
    }
  }

  const handleRemoveLike = async () => {
    try {
      await api.delete(`/profiles/${profile.id}/like`);

      onRefresh();



    } catch (error) {
      if (isAxiosError(error)) {
        openNotification(error.response?.data?.message || 'An error occurred.', <CloseCircleFilled style={{ color: '#ff4d4f' }} />);
      } else {
        openNotification('An unexpected error occurred. Please try again.', <CloseCircleFilled style={{ color: '#ff4d4f' }} />);
      }
    }
  }

  const handleReport = async () => {
    try {
      await api.post(`/users/${profile.id}/report`);
      navigate(0);

    } catch (error) {
      if (isAxiosError(error)) {
        openNotification(error.response?.data?.message || 'An error occurred.', <CloseCircleFilled style={{ color: '#ff4d4f' }} />);
      } else {
        openNotification('An unexpected error occurred. Please try again.', <CloseCircleFilled style={{ color: '#ff4d4f' }} />);
      }
    }
  }


  const handleBlock = async () => {
    try {
      await api.post(`/users/${profile.id}/block`);
      navigate(0);

    } catch (error) {
      if (isAxiosError(error)) {
        openNotification(error.response?.data?.message || 'An error occurred.', <CloseCircleFilled style={{ color: '#ff4d4f' }} />);
      } else {
        openNotification('An unexpected error occurred. Please try again.', <CloseCircleFilled style={{ color: '#ff4d4f' }} />);
      }
    }
  }

  const handleMessage = () => {
    if (profile.conversationId) {
      setSelectedConv(profile.conversationId);
      navigate('/chat');
    }

  }

  return (
    <>
      {contextHolder}
      <Card style={{ maxWidth: 600, margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Title level={4}>{profile.username}</Title>
            <Badge
              status={loggedInStatus.isLoggedIn ? "success" : "default"}
              text={loggedInStatus.isLoggedIn ? "Online" : getLastSeen(loggedInStatus.lastLoggedIn)}
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
            <Space align="center">
              <Title level={3}>{`${profile.firstName} ${profile.lastName}`}</Title>
              {profile.isFlagged && (
                <Tooltip title="This account has been flagged as potentially fake">
                  <FlagFilled style={{ fontSize: '24px', color: '#ff4d4f' }} />
                </Tooltip>
              )}
            </Space>

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
            <Tooltip title={(profile.likeStatus == 'mutual') ? "You've matched!" : profile.likeStatus == 'liked-by' ? "This user likes you" : ""}>
              <Button
                onClick={() => onLike()}
                {...likeButtonProps}
              >
                {likeButtonProps.children}
              </Button>
            </Tooltip>
            {profile.conversationId && <Button icon={<MessageOutlined />} onClick={() => handleMessage()}>Message</Button>}
            <Button icon={<StopOutlined />} onClick={() => setIsBlockModalOpen(true)} danger>Block</Button>
            <Button icon={<FlagOutlined />} onClick={() => setIsReportModalOpen(true)} danger>Report</Button>
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
        <Modal
          title="Confirm Action"
          open={isRemoveLikeModalOpen}
          onOk={() => {
            handleRemoveLike();
            setIsRemoveLikeModalOpen(false);
          }}
          onCancel={() => setIsRemoveLikeModalOpen(false)}
          okText="Yes"
          cancelText="No"
        >
          <p>Are you sure you want to remove your like from this profile?</p>
        </Modal>

        <Modal
          title="Confirm Action"
          open={isBlockModalOpen}
          onOk={() => {
            handleBlock();
            setIsBlockModalOpen(false);
          }}
          onCancel={() => setIsBlockModalOpen(false)}
          okText="Yes"
          cancelText="No"
        >
          <p>Are you sure you want to block this user?</p>
        </Modal>

        <Modal
          title="Confirm Action"
          open={isReportModalOpen}
          onOk={() => {
            handleReport();
            setIsReportModalOpen(false);
          }}
          onCancel={() => setIsReportModalOpen(false)}
          okText="Yes"
          cancelText="No"

        >
          <p>Are you sure you want to report this user as fake account?</p>
        </Modal>
      </Card>
    </>
  )
}

