import  { useState, useEffect } from 'react';
import Join from './components/Join/Join';
import ChatRoom from '../src/pages/Chat';

function App() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('userName'));

  useEffect(() => {
    if (!userName) {
      setIsJoinModalOpen(true);
    }
  }, [userName]);

  const handleJoin = (name: string) => {
    localStorage.setItem('userName', name);
    setUserName(name);
    setIsJoinModalOpen(false);
  };

  return (
    <div className="wrapper">
      <div className="app-container">
        <div className="app-container__content">
          {isJoinModalOpen && <Join onJoin={handleJoin} />}
          {!isJoinModalOpen && <ChatRoom />}
        </div>
      </div>
    </div>
  );
}

export default App;