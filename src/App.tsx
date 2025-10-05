import { useState } from 'react';
import HomePage from './components/HomePage';
import DiningPortal from './components/DiningPortal';
import ShelterPortal from './components/ShelterPortal';
import VolunteerPortal from './components/VolunteerPortal';
import { UserType } from './types';

function App() {
  const [currentView, setCurrentView] = useState<UserType | 'home'>('home');

  const handleSelectUserType = (type: UserType) => {
    setCurrentView(type);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  return (
    <>
      {currentView === 'home' && <HomePage onSelectUserType={handleSelectUserType} />}
      {currentView === 'dining' && <DiningPortal onBack={handleBackToHome} />}
      {currentView === 'shelter' && <ShelterPortal onBack={handleBackToHome} />}
      {currentView === 'volunteer' && <VolunteerPortal onBack={handleBackToHome} />}
    </>
  );
}

export default App;
