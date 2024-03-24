import React, { useState, useEffect } from 'react';

interface PopupProps {
  onClose: () => void;
  onEditUser: (updatedUser: User) => void;
  userToEdit: User;
}

interface User {
  userID: number;
  username: string;
  email: string;
  join_date: string;
  bio: string;
}

const Popup: React.FC<PopupProps> = ({ onClose, onEditUser, userToEdit }) => {
  const [editedUser, setEditedUser] = useState<User>({
    userID: userToEdit.userID,
    username: userToEdit.username,
    email: userToEdit.email,
    join_date: userToEdit.join_date,
    bio: userToEdit.bio,
  });

  useEffect(() => {
    setEditedUser({
      userID: userToEdit.userID,
      username: userToEdit.username,
      email: userToEdit.email,
      join_date: userToEdit.join_date,
      bio: userToEdit.bio,
    });
  }, [userToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleEditUser = () => {
    onEditUser(editedUser);
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <button className="absolute top-1 right-2 text-gray-600" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-center text-2xl mb-4">Edit User</h2>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={editedUser.username}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={editedUser.email}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="join_date">Join Date:</label>
          <input
            type="text"
            id="join_date"
            name="join_date"
            value={editedUser.join_date}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            value={editedUser.bio}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full"
          />
        </div>
        <button onClick={handleEditUser} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full mt-4">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Popup;
