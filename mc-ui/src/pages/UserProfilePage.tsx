import { Layout, notification } from 'antd';
import UserProfile from '../components/UserProfile';
import { useParams } from 'react-router-dom';
import LoadingProfile from '../components/LoadingProfile';
import { useEffect, useState } from 'react';
import api from '../services/api';
import NotFound from './NotFound';
import { Profile } from '../types/profile';
import useStore from '../lib/store';
import { isAxiosError } from '../types/api';
import { CloseCircleFilled } from '@ant-design/icons';

const { Content } = Layout;


export interface LoggedInData {
  isLoggedIn: boolean;
  lastLoggedIn: string;
}


interface StatusEventData {
  user_id: number;
  is_logged_in: boolean;
}


export default function UserProfilePage() {
  const [notFound, setNotFound] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setprofile] = useState<Profile | null>(null);
  const [loggedInStatus, setLoggedInStatus] = useState<LoggedInData | null>(null);
  const { username } = useParams();
  const { socket } = useStore();
  const [notifApi, contextHolder] = notification.useNotification();

  const openNotification = (message: string, icons: any) => {
    notifApi.open({
      message: message,
      icon: icons
    });
  };


  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/profiles/${username}`);
      const fetchedProfile = res.data.data;

      setprofile({
        age: Math.floor(fetchedProfile.age),
        bio: fetchedProfile.bio,
        birth_date: fetchedProfile.birth_date,
        common_interests: fetchedProfile.common_interests?.filter((common_interest: string | null) => (common_interest)),
        distance: Math.floor(fetchedProfile.distance),
        fameRating: fetchedProfile.fame_rating,
        firstName: fetchedProfile.first_name,
        gender: fetchedProfile.gender,
        image: (fetchedProfile.image) ? `http://localhost:7777/api/profiles/get_image/${fetchedProfile.image}` : null,
        interests: fetchedProfile.interests?.filter((interest: string | null) => (interest)),
        lastName: fetchedProfile.last_name,
        pictures: fetchedProfile.pictures?.filter((picture: string | null) => (picture)).map((picture: string) => `http://localhost:7777/api/profiles/get_image/${picture}`),
        id: fetchedProfile.user_id,
        username: fetchedProfile.username,
        likeStatus: fetchedProfile.like_status,
        conversationId: fetchedProfile.conversation_id,
        isFlagged: fetchedProfile.is_flagged,
      });

      setLoggedInStatus({
        isLoggedIn: fetchedProfile.is_logged_in,
        lastLoggedIn: fetchedProfile.last_logged_in,
      });

    } catch (error) {
      if (isAxiosError(error)) {
        if (error.status === 404) {
          setNotFound(true);
        } else {
          openNotification(error.response?.data?.message || 'An error occurred.', <CloseCircleFilled style={{ color: '#ff4d4f' }} />);
        }
      } else {
        openNotification('An unexpected error occurred. Please try again.', <CloseCircleFilled style={{ color: '#ff4d4f' }} />);
      }
    } finally {
      setLoading(false);
    }


  }

  useEffect(() => {
    fetchUser();
  }, []);


  useEffect(() => {
    const handleStatusEvent = (data: StatusEventData) => {
      const { user_id, is_logged_in } = data;

      const now = new Date();
      if (user_id === profile?.id) {
        setLoggedInStatus({
          isLoggedIn: is_logged_in,
          lastLoggedIn: now.toUTCString(),
        });

      }

    };

    if (socket && profile) {
      socket.on('status', handleStatusEvent);
    }

    return () => {
      if (socket) {
        socket.off('status', handleStatusEvent);
      }
    };
  }, [socket, profile]);


  function renderContent() {
    if (loading) {
      return (
        <LoadingProfile />
      );
    }

    if (notFound) {
      return (
        <NotFound />
      );
    }

    return (
      <>{profile && loggedInStatus && <UserProfile profile={profile} onRefresh={fetchUser} loggedInStatus={loggedInStatus} />}</>
    );

  }

  return (
    <>
      {contextHolder}
      {(notFound) ?
        <NotFound />
        :
        <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          {renderContent()}
        </Content>}
    </>
  )
}

