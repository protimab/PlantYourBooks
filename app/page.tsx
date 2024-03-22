'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from './popup';

interface Users {
  userID: number;
  username: string;
  email: string;
  join_date: string;
  profile_picture: string;
  bio: string;
}

interface Books {
  bookID: number;
  authorID: number;
  publication_date: string;
  genreID: number;
  synposis: string;
}

interface Reviews {
  reviewID: number;
  userID: number;
  bookID: number;
  rating: string;
  review: string;
  review_date: string; 
}

interface UserLibrary {
  userID: number;
  bookID: number;
  has_read: string;
}

interface Genres {
  genreID: number;
  genre_name: string;
}

interface Authors {
  authorID: number;
  author_name: string;
}

export default function Home() {
  const [users, setUsers] = useState<Users[]>([]);
  const [books, setBooks] = useState<Books[]>([]);
  const [reviews, setReviews] = useState<Reviews[]>([]);
  const [userLibrary, setUserLibrary] = useState<UserLibrary[]>([]);
  const [genres, setGenres] = useState<Genres[]>([]);
  const [authors, setAuthors] = useState<Authors[]>([]);
  const [isPopupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
    //fetchBooks();
    //fetchReviews();
    //fetchUserLibrary();
    //fetchGenres();
    //fetchAuthors();
  }, []);

  const fetchUsers = async () => {
  try {
  const resp = await axios.get<Users[]>('http://localhost:5001/api/users');
  const mappedUsers: Users[] = resp.data.map((usersData: any) => ({
    userID: usersData[0],
    username: usersData[1],
   email: usersData[2],
    join_date: usersData[3],
    profile_picture: usersData[4],
    bio: usersData[5],
  }));
  setUsers(mappedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
 };

 const handleOpenPopup = () => {
  setPopupOpen(true);
};

const handleClosePopup = () => {
  setPopupOpen(false);
};

/*
  const fetchBooks = async () => {
    try {
      const resp = await axios.get<Books[]>('http://localhost:5001/api/books');
      const mappedBooks: Books[] = resp.data.map((booksData: any) => ({
        bookID: booksData[0],
        authorID: booksData[1], 
        publication_date: booksData[2],
        genreID: booksData[3],
       synposis: booksData[4],
      }));
      setBooks(mappedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const resp = await axios.get<Reviews[]>('http://localhost:5001/api/reviews');
      const mappedReviews: Reviews[] = resp.data.map((reviewsData: any) => ({
        reviewID: reviewsData[0],
        bookID: reviewsData[1], 
        userID: reviewsData[2],
        rating: reviewsData[3],
        review: reviewsData[4],
        review_date: reviewsData[5],
      }));
      setReviews(mappedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };


  const fetchUserLibrary = async () => {
    try {
      const resp = await axios.get<UserLibrary[]>('http://localhost:5001/api/userlibrary');
      const mappedUserLibrary: UserLibrary[] = resp.data.map((userLibraryData: any) => ({
        userID: userLibraryData[0],
        bookID: userLibraryData[1], 
        has_read: userLibraryData[2],
      }));
      setUserLibrary(mappedUserLibrary);
    } catch (error) {
      console.error('Error fetching user library:', error);
    }
  };


  const fetchGenres = async () => {
    try {
      const resp = await axios.get<Genres[]>('http://localhost:5001/api/reviews');
      const mappedGenres: Genres[] = resp.data.map((genresData: any) => ({
        genreID: genresData[0],
        genre_name: genresData[1], 
      }));
      setGenres(mappedGenres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };


  const fetchAuthors = async () => {
    try {
      const resp = await axios.get<Authors[]>('http://localhost:5001/api/authors');
      const mappedAuthors: Authors[] = resp.data.map((authorsData: any) => ({
        authorID: authorsData[0],
        author_name: authorsData[1], 
      }));
      setAuthors(mappedAuthors);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
    <h1 className="text-center text-5xl pt-30 font-reenie">PlantYourBooks</h1>
    <div className="text-center">
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.userID}>{user.username} - {user.email} - {user.join_date} -   {user.profile_picture} - {user.bio} </li>
        ))}
      </ul>
    </div>
    </div>
  )
*/

const handleAddUser = async (userData: Users) => {
  try {
    await axios.post('http://localhost:5001/api/users', userData);
    // Optionally, you can fetch users again after adding a new user
    // fetchUsers();
    handleClosePopup();
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

return (
  <div className="flex flex-col items-center min-h-screen">
    <h1 className="text-center text-5xl pt-30 font-reenie">PlantYourBooks</h1>
    <button onClick={handleOpenPopup}>Add User</button>
    {isPopupOpen && (
      <Popup 
        onClose={handleClosePopup} 
        onAddUser={handleAddUser} 
      />
    )} {/* Render the Popup component if isPopupOpen is true */}
    <div className="text-center">
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.userID}>
            {user.username} - {user.email} - {user.join_date} - {user.profile_picture} - {user.bio}
          </li>
        ))}
      </ul>
    </div>
  </div>
);
}

// } Home