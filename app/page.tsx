'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    fetchUsers();
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





} //Home