'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from './popup';

interface Users {
  userID: number;
  username: string;
  email: string;
  join_date: string;
  bio: string;
}

interface Books {
  bookID: number;
  bookName: string;
  authorName: string;
  genreName: string;
  synopsis: string;
}

interface Reviews {
  reviewID: number;
  userName: string;
  bookName: string;
  rating: string;
  review: string;
  review_date: string; 
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
  const [genres, setGenres] = useState<Genres[]>([]);
  const [authors, setAuthors] = useState<Authors[]>([]);
  const [isUserPopupOpen, setUserPopupOpen] = useState(false);
  const [isBookPopupOpen, setBookPopupOpen] = useState(false);
  const [isGenrePopupOpen, setGenrePopupOpen] = useState(false);
  const [isAuthorPopupOpen, setAuthorPopupOpen] = useState(false);
  const [isReviewPopupOpen, setReviewPopupOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchBooks();
    fetchReviews();
    fetchGenres();
    fetchAuthors();
  }, []);

  const fetchUsers = async () => {
  try {
  const resp = await axios.get<Users[]>('http://localhost:5001/api/users');
  const mappedUsers: Users[] = resp.data.map((usersData: any) => ({
    userID: usersData[0],
    username: usersData[1],
    email: usersData[2],
    join_date: usersData[3],
    bio: usersData[4],
  }));
  setUsers(mappedUsers);
  console.log(resp);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
 };

 const handleOpenUserPopup = () => {
  setUserPopupOpen(true);
};

const handleCloseUserPopup = () => {
  setUserPopupOpen(false);
};

const fetchBooks = async () => {
  try {
    const resp = await axios.get<Books[]>('http://localhost:5001/api/books');
    const mappedBooks: Books[] = resp.data.map((booksData: any) => ({
      bookID: booksData[0],
      bookName: booksData[1],
      authorName: booksData[2], 
      genreName: booksData[3],
      synopsis: booksData[4],
    }));
    console.log(mappedBooks);
    setBooks(mappedBooks);
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};

  const handleOpenBookPopup = () => {
    setBookPopupOpen(true);
  };
  
  const handleCloseBookPopup = () => {
    setBookPopupOpen(false);
  };


  const fetchReviews = async () => {
    try {
      const resp = await axios.get<Reviews[]>('http://localhost:5001/api/reviews');
      const mappedReviews: Reviews[] = resp.data.map((reviewsData: any) => ({
        reviewID: reviewsData[0],
        bookName: reviewsData[1], 
        userName: reviewsData[2],
        rating: reviewsData[3],
        review: reviewsData[4],
        review_date: reviewsData[5],
      }));
      setReviews(mappedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleOpenReviewPopup = () => {
    setReviewPopupOpen(true);
  };
  
  const handleCloseReviewPopup = () => {
    setReviewPopupOpen(false);
  };
 
  const fetchGenres = async () => {
    try {
      const resp = await axios.get<Genres[]>('http://localhost:5001/api/genres');
      const mappedGenres: Genres[] = resp.data.map((genresData: any) => ({
        genreID: genresData[0],
        genre_name: genresData[1], 
      }));
      setGenres(mappedGenres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleOpenGenrePopup = () => {
    setGenrePopupOpen(true);
  };
  
  const handleCloseGenrePopup = () => {
    setGenrePopupOpen(false);
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

  const handleOpenAuthorPopup = () => {
    setAuthorPopupOpen(true);
  };
  
  const handleCloseAuthorPopup = () => {
    setAuthorPopupOpen(false);
  };

const handleAddUser = async (userData: Users) => {
  try {
    await axios.post('http://localhost:5001/api/users', userData);
    handleCloseUserPopup();
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

const handleDeleteUser = async (userID: number) => {
  try {
    await axios.delete(`http://localhost:5001/api/users/${userID}`);
    fetchUsers(); 
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

const handleAddBook = async (bookData: Books) => {
  try {
    await axios.post('http://localhost:5001/api/books', bookData);
    handleCloseBookPopup();
  } catch (error) {
    console.error('Error adding book:', error);
  }
};

const handleDeleteBook = async (bookID: number) => {
  try {
    await axios.delete(`http://localhost:5001/api/books/${bookID}`);
    fetchBooks();
  } catch (error) {
    console.error('Error deleting book:', error);
  }
};

const handleAddGenre = async (genreName: string) => {
  try {
    await axios.post('http://localhost:5001/api/genres', { genre_name: genreName });
    handleCloseGenrePopup();
  } catch (error) {
    console.error('Error adding genre:', error);
  }
};

const handleDeleteGenre = async (genreID: number) => {
  try {
    await axios.delete(`http://localhost:5001/api/genres/${genreID}`);
    fetchGenres();
  } catch (error) {
    console.error('Error deleting genre:', error);
  }
};

const handleAddAuthor = async (authorName: string) => {
  try {
    await axios.post('http://localhost:5001/api/authors', { author_name: authorName });
    handleCloseAuthorPopup();
  } catch (error) {
    console.error('Error adding author:', error);
  }
};

const handleDeleteAuthor = async (authorID: number) => {
  try {
    await axios.delete(`http://localhost:5001/api/authors/${authorID}`);
    fetchAuthors();
  } catch (error) {
    console.error('Error deleting author:', error);
  }
};

const handleAddReview = async (reviewData: Reviews) => {
  try {
    await axios.post('http://localhost:5001/api/reviews', reviewData);
    handleCloseReviewPopup();
  } catch (error) {
    console.error('Error adding review:', error);
  }
};

const handleDeleteReview = async (reviewID: number) => {
  try {
    await axios.delete(`http://localhost:5001/api/reviews/${reviewID}`);
    fetchReviews(); 
  } catch (error) {
    console.error('Error deleting review:', error);
  }
};

return (
  <div className="flex flex-col items-center min-h-screen">
    <h1 className="text-center text-5xl pt-30 font-reenie">PlantYourBooks</h1>
    <div className='space-x-5'>
    <button
      onClick={handleOpenUserPopup}
      className="mt-4 py-2 px-4 border border-gray-400 rounded-md bg-white text-gray-800 hover:bg-gray-100 transition duration-300"
    >
      Add User
    </button>
    <button
      onClick={handleOpenGenrePopup}
      className="mt-4 py-2 px-4 border border-gray-400 rounded-md bg-white text-gray-800 hover:bg-gray-100 transition duration-300"
    >
      Add Genre
    </button>
    <button
      onClick={handleOpenAuthorPopup}
      className="mt-4 py-2 px-4 border border-gray-400 rounded-md bg-white text-gray-800 hover:bg-gray-100 transition duration-300"
    >
      Add Author
    </button>
    <button
      onClick={handleOpenBookPopup}
      className="mt-4 py-2 px-4 border border-gray-400 rounded-md bg-white text-gray-800 hover:bg-gray-100 transition duration-300"
    >
      Add Book
    </button>
    <button
      onClick={handleOpenReviewPopup}
      className="mt-4 py-2 px-4 border border-gray-400 rounded-md bg-white text-gray-800 hover:bg-gray-100 transition duration-300"
    >
      Add Review
    </button>
    </div>
    
    {isUserPopupOpen && (
        <Popup
          onClose={handleCloseUserPopup}
          onAddUser={handleAddUser}
        />
      )}
      {isGenrePopupOpen && (
        <Popup
          onClose={handleCloseGenrePopup}
          onAddGenre={handleAddGenre}
        />
      )}
      {isAuthorPopupOpen && (
        <Popup
          onClose={handleCloseAuthorPopup}
          onAddAuthor={handleAddAuthor}
        />
      )}
       {isBookPopupOpen && (
        <Popup
          onClose={handleCloseBookPopup}
          onAddBook={handleAddBook}
        />
      )}
      {isReviewPopupOpen && (
        <Popup
          onClose={handleCloseReviewPopup}
          onAddReview={handleAddReview}
        />
      )}
    <div className="text-center">
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.userID}>
            {user.username} - {user.email} - {user.join_date} - {user.bio}
            <button
                  onClick={() => handleDeleteUser(user.userID)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 ml-5 rounded-full transition duration-300"
                >
                  x
                </button>
          </li>
        ))}
      </ul>
    </div>
    <div className="text-center">
        <h1>Books</h1>
        <ul>
          {books.map(book => (
              <li key={book.bookID}>
              {book.bookName} - {book.authorName} - {book.genreName} - {book.synopsis} 
              <button
                onClick={() => handleDeleteBook(book.bookID)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 ml-2 rounded-full transition duration-300"
              >
                x
              </button>
            </li>
          ))}
        </ul>
      </div>
    <div className="text-center">
        <h1>Genres</h1>
        <ul>
          {genres.map(genre => (
            <li key={genre.genreID}>
              {genre.genre_name}
              <button
                onClick={() => handleDeleteGenre(genre.genreID)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 ml-2 rounded-full transition duration-300"
              >
                x
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="text-center">
        <h1>Authors</h1>
        <ul>
          {authors.map(author => (
            <li key={author.authorID}>
            {author.author_name}
            <button
                onClick={() => handleDeleteAuthor(author.authorID)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full transition duration-300"
              >
                x
                </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="text-center">
        <h1>Reviews</h1>
        <ul>
          {reviews.map(review => (
            <li key={review.reviewID}>
              {review.bookName} - {review.userName} - {review.rating} - {review.review} - {review.review_date}
              <button
                  onClick={() => handleDeleteReview(review.reviewID)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full transition duration-300"
                >
                  x
                </button>
            </li>
          ))}
        </ul>
      </div>
      </div>
);
}

// } Home