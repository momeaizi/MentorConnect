import { Layout } from 'antd';
import UserProfile from '../components/UserProfile';
import { useParams } from 'react-router-dom';
import LoadingProfile from '../components/LoadingProfile';
import { useEffect, useState } from 'react';
import api from '../services/api';
import NotFound from './NotFound';
import { Profile } from '../types/profile';
import { useAuth } from '../providers/AuthProvider';

const { Content } = Layout;





export default function UserProfilePage() {
  const [notFound, setNotFound] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setprofile] = useState<Profile>();
  const { username } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/profiles/${username}`);
        const fetchedProfile = res.data.data;

        console.log(res.data);
        setprofile({
              age: Math.floor(fetchedProfile.age),
              bio: fetchedProfile.bio,
              birth_date: fetchedProfile.birth_date,
              common_interests: fetchedProfile.common_interests.filter((common_interest: string | null) => (common_interest)),
              distance: Math.floor(fetchedProfile.distance),
              fameRating: fetchedProfile.fame_rating,
              firstName: fetchedProfile.first_name,
              gender: fetchedProfile.gender,
              image: fetchedProfile.image,
              interests: fetchedProfile.interests.filter((interest: string | null) => (interest)),
              is_logged_in: fetchedProfile.is_logged_in,
              last_logged_in: fetchedProfile.last_logged_in,
              lastName: fetchedProfile.last_name,
              pictures: fetchedProfile.pictures.filter((picture: string | null) => (picture)),
              id: fetchedProfile.user_id,
              username: fetchedProfile.username,
      
        });

      } catch (error) {
        console.log(error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }


    }
    loadData();
  }, []);


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
      <>{ profile && user && <UserProfile profile={profile} currentUserId={user.id} /> }</>
    );
    
  }

  return (
    notFound ?
      <NotFound />
      :
      <Layout style={{ background: '#1a1b27', minHeight: '100vh' }}>
        <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          {renderContent()}
        </Content>
      </Layout>
  )
}
