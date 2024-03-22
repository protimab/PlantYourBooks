import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface PopupProps {
  onClose: () => void;
  onAddUser: (user: User) => void;
}

interface User {
  userID: number;
  username: string;
  email: string;
  join_date: string;
  profile_picture: string;
  bio: string;
}

const Popup: React.FC<PopupProps> = ({ onClose, onAddUser }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState<User>({
    userID: 0,
    username: '',
    email: '',
    join_date: '',
    profile_picture: '',
    bio: ''
  });

  useEffect(() => {
    setShowPopup(true);
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    onClose();
  };

  const handleAddUser = () => {
    onAddUser(user);
    setShowPopup(false);
  };

  return (
    <div className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center ${showPopup ? '' : 'hidden'}`}>
      <div className="bg-black p-6 rounded shadow-lg relative">
        <button
          onClick={handleClosePopup}
          className="absolute top-1 right-2 text-white hover:text-gray-300"
        >
          x
        </button>
        <div>
          <h2 className="text-2xl mb-4">Add User</h2>
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Username"
            className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full text-black"
          />
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Email"
            className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full text-black"
          />
          <input
            type="text"
            value={user.join_date}
            onChange={(e) => setUser({ ...user, join_date: e.target.value })}
            placeholder="Join Date"
            className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full text-black"
          />
          <input
            type="text"
            value={user.profile_picture}
            onChange={(e) => setUser({ ...user, profile_picture: e.target.value })}
            placeholder="Profile Picture"
            className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full text-black"
          />
          <textarea
            value={user.bio}
            onChange={(e) => setUser({ ...user, bio: e.target.value })}
            placeholder="Bio"
            className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full text-black"
          />
          <button
            onClick={handleAddUser}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2"
          >
            Add User
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
