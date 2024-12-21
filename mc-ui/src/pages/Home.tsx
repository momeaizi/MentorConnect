import React from 'react';
import { useAuth } from '../providers/AuthProvider';
import LandingPage from './landingPage';
import ProfileList from '../components/ProfileList';
import Navbar from '../components/NavBar/NavBar';



const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  // console.log("isAuthenticated: ", isAuthenticated, user);

  return !isAuthenticated ? <LandingPage /> :
    <>
      <Navbar/>  
      <div className="container mx-auto px-4 py-8">
        <ProfileList />
      </div>
    </>
};

export default Home;