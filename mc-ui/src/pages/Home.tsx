import React from 'react';
import ProfileList from '../components/ProfileList';



const Home: React.FC = () => {

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileList />
    </div>
  );
};

export default Home;