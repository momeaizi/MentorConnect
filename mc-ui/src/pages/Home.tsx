import React from 'react';
import ProfileList from '../components/ProfileList';
import Navbar from '../components/NavBar/NavBar';



const Home: React.FC = () => {

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileList />
    </div>
  );
};

export default Home;