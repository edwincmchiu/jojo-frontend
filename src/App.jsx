// src/App.jsx
import { useState } from 'react';
import CreateEventWizard from './features/create-event/CreateEventWizard';
import EventFeed from './features/join-event/EventFeed';
import BottomNav from './components/layout/BottomNav';
import UserProfile from './features/profile/UserProfile';

function App() {
  const [currentTab, setCurrentTab] = useState('feed');

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-gray-50 min-h-screen relative shadow-2xl flex flex-col">
        
        <div className="flex-1">
          {currentTab === 'feed' && <EventFeed />}
          {currentTab === 'create' && <div className="pb-24 pt-4 px-2"><CreateEventWizard /></div>}
          
          {/* 2. 替換這裡 */}
          {currentTab === 'profile' && <UserProfile />}
        </div>

        <BottomNav currentTab={currentTab} setTab={setCurrentTab} />
      </div>
    </div>
  );
}

export default App;