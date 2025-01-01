import { Typography, Layout } from 'antd';
import UserProfile from '../components/UserProfile';
import { useParams } from 'react-router-dom';
import LoadingProfile from '../components/LoadingProfile';
import { useEffect, useState } from 'react';
import api from '../services/api';
import NotFound from './NotFound';

const { Title } = Typography;
const { Content } = Layout;

export default function UserProfilePage() {
  const [notFound, setNotFound] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setprofile] = useState(null);
  const { username } = useParams();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/profiles/${username}`);

        console.log(res.data);
        setprofile(res.data.data);

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
      <UserProfile profile={profile} />
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

