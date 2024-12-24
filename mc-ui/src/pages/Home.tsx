import React from 'react';
import ProfileList from '../components/ProfileList';



const Home: React.FC = () => {

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Find Your Perfect Match</h1>
      <ProfileList />
    </div>
  );
};

export default Home;