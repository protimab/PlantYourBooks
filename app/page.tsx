'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from './popup';
import EditUserPopup from "./edituserpopup";
import filterByBooks from './filterBooks';
import FilterPopUp from './filterBooks';

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
  avg_rating: number;
  num_rating: number;
}

interface Reviews {
  reviewID: number;
  userName: string;
  bookName: string;
  rating: number;
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
  const [currentUser, setCurrentUser] = useState<Users | null>(null);
  const [isUserEditPopupOpen, setIsUserEditPopupOpen] = useState(false);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [showMessage, setshowMessage] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchBooks();
    fetchReviews();
    fetchGenres();
    fetchAuthors();
  }, []);

  // USERS
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

const handleEditClick = (user: Users) => {
  setCurrentUser(user);
  setIsUserEditPopupOpen(true);
};

const handleEditUser = async (editedUser: Users) => {
  try {
    const response = await axios.put(`http://localhost:5001/api/users`, editedUser);
    fetchUsers(); 
    fetchReviews();
    setIsUserEditPopupOpen(false);
  } catch (error) {
    console.error('Error editing user:', error);
  }
};

//BOOKS 
const fetchBooks = async () => {
  try {
    const resp = await axios.get<Books[]>('http://localhost:5001/api/books');
    const mappedBooks: Books[] = resp.data.map((booksData: any) => ({
      bookID: booksData[0],
      bookName: booksData[1],
      authorName: booksData[2], 
      genreName: booksData[3],
      synopsis: booksData[4],
      avg_rating: booksData[5] || 0,
      num_rating: booksData[6] || 0
    }));
    setBooks(mappedBooks);
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};

console.log(books);

  const handleOpenBookPopup = () => {
    setBookPopupOpen(true);
  };
  
  const handleCloseBookPopup = () => {
    setBookPopupOpen(false);
  };

  const handleFilterClick = () => {
    setIsFilterPopupOpen(true);
  };

  const handleCloseFilterPopup = () => {
    setIsFilterPopupOpen(false);
  };

  const handleResetFilters = async () => {
    try {
      await fetchBooks();
      setshowMessage(false);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleApplyFilters = async (filters: any) => {
    try {
      console.log(filters);
      const response = await axios.get('http://localhost:5001/api/books', {
        params: filters
      });
      const mappedBooks = response.data.map((booksData:any) => ({
        bookID: booksData[0],
        bookName: booksData[1],
        authorName: booksData[2], 
        genreName: booksData[3],
        synopsis: booksData[4],
        avg_rating: booksData[5],
        num_rating: booksData[6]
      }));
      setBooks(mappedBooks);
      setshowMessage(true);
    } catch (error) {
      console.error('Error fetching filtered books:', error);
    }
  };

  //REVIEWS 
  const fetchReviews = async () => {
    try {
      const resp = await axios.get<Reviews[]>('http://localhost:5001/api/reviews');
      console.log(resp.data);
      const mappedReviews: Reviews[] = resp.data.map((reviewsData: any) => ({
        reviewID: reviewsData[0],
        bookName: reviewsData[2], 
        userName: reviewsData[1],
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
 
  //GENRES
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

  //AUTHORS
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
    fetchUsers();
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
    fetchBooks();
    fetchAuthors();
    fetchGenres();
    fetchReviews();
  } catch (error) {
    console.error('Error adding book:', error);
  }
};

const handleDeleteBook = async (bookID: number) => {
  try {
    await axios.delete(`http://localhost:5001/api/books/${bookID}`);
    fetchBooks();
    fetchAuthors();
    fetchGenres();
    fetchReviews();
  } catch (error) {
    console.error('Error deleting book:', error);
  }
};

const handleAddGenre = async (genreName: string) => {
  try {
    await axios.post('http://localhost:5001/api/genres', { genre_name: genreName });
    handleCloseGenrePopup();
    fetchGenres();
    fetchAuthors();
    fetchBooks();
    fetchReviews();
  } catch (error) {
    console.error('Error adding genre:', error);
  }
};

const handleDeleteGenre = async (genreID: number) => {
  try {
    await axios.delete(`http://localhost:5001/api/genres/${genreID}`);
    fetchGenres();
    fetchAuthors();
    fetchBooks();
    fetchReviews();
  } catch (error) {
    console.error('Error deleting genre:', error);
  }
};

const handleAddAuthor = async (authorName: string) => {
  try {
    await axios.post('http://localhost:5001/api/authors', { author_name: authorName });
    handleCloseAuthorPopup();
    fetchAuthors();
    fetchBooks();
    fetchGenres();
    fetchReviews();
  } catch (error) {
    console.error('Error adding author:', error);
  }
};

const handleDeleteAuthor = async (authorID: number) => {
  try {
    await axios.delete(`http://localhost:5001/api/authors/${authorID}`);
    fetchAuthors();
    fetchBooks();
    fetchGenres();
    fetchReviews();
  } catch (error) {
    console.error('Error deleting author:', error);
  }
};

const handleAddReview = async (reviewData: Reviews) => {
  try {
    await axios.post('http://localhost:5001/api/reviews', reviewData);
    handleCloseReviewPopup();
    fetchReviews();
    fetchBooks();
  } catch (error) {
    console.error('Error adding review:', error);
  }
};

const handleDeleteReview = async (reviewID: number) => {
  try {
    await axios.delete(`http://localhost:5001/api/reviews/${reviewID}`);
    fetchReviews(); 
    fetchBooks();
  } catch (error) {
    console.error('Error deleting review:', error);
  }
};

const totalReviews = books.reduce((sum, book) => sum + book.num_rating, 0);

const meanReviews = books.length === 0 ? 0 : totalReviews / books.length;

const totalRating = books.reduce((sum, book) => sum + book.avg_rating, 0);

const meanRating = books.length === 0 ? 0 : totalRating / books.length;


return (
  <div className=" flex flex-col items-center min-h-screen">
    <h1 className="text-center text-4xl pt-7 font-reenie">PlantYourBooks 🪴 </h1>
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
      {isUserEditPopupOpen && currentUser && 
        <EditUserPopup 
          onClose={() => setIsUserEditPopupOpen(false)} 
          onEditUser={handleEditUser} 
          userToEdit={currentUser} 
        />
        }
      {isFilterPopupOpen && 
        <FilterPopUp onClose={handleCloseFilterPopup} onApplyFilters={handleApplyFilters} books={books} authors={authors} genres={genres} />
      }
  
  <div className="container">
  <h1 className="text-4xl mb-2 text-white font-reenie">Users</h1>
  <ul className="list-none p-0">
    <li className="py-2 border-b border-gray-300">
      <div className="flex justify-between">
        <div className="flex flex-col mr-4">
          <span className="text-gray-100 mb-1 font-bold">Username</span>
          {users.map(user => (
            <span key={user.userID} className="text-gray-100 mb-1">{user.username}</span>
          ))}
        </div>
        <div className="flex flex-col mr-4">
          <span className="text-gray-100 mb-1 font-bold">Email</span>
          {users.map(user => (
            <span key={user.userID} className="text-gray-100 mb-1">{user.email}</span>
          ))}
        </div>
        <div className="flex flex-col mr-4">
          <span className="text-gray-100 mb-1 font-bold">Join Date</span>
          {users.map(user => (
            <span key={user.userID} className="text-gray-100 mb-1">{user.join_date}</span>
          ))}
        </div>
        <div className="flex flex-col mr-4">
          <span className="text-gray-100 mb-1 font-bold">Bio</span>
          {users.map(user => (
            <div key={user.userID} className="flex items-center justify-between">
              <span className="text-gray-100 mb-1 mr-40">{user.bio}</span>
              <div className="flex">
                <button
                  onClick={() => handleEditClick(user)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold px-3 rounded-full mr-2"
                >
                  edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user.userID)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold px-2 rounded-full"
                >
                  x
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </li>
  </ul>
</div>

<div className="container">
  <h1 className="text-4xl mb-2 text-white font-reenie">Genres</h1>
  <ul className="list-none p-0">
    <li className="py-2 border-b border-gray-300">
      <div className="flex justify-between">
        <div className="flex flex-col mr-2">
          <span className="text-gray-200 mb-1 font-bold"></span>
          {genres.map(genre => (
            <div key={genre.genreID} className="flex items-center">
              <span className="text-gray-200 mb-1 mr-3">{genre.genre_name}</span>
              <button
                onClick={() => handleDeleteGenre(genre.genreID)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold px-2 rounded-full"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>
    </li>
  </ul>
</div>
<div className="container">
  <h1 className="text-4xl mb-2 text-white font-reenie">Authors</h1>
  <ul className="list-none p-0">
    <li className="py-2 border-b border-gray-300">
      <div className="flex justify-between">
        <div className="flex flex-col mr-2">
          <span className="text-gray-200 mb-1 font-bold"></span>
          {authors.map(author => (
            <div key={author.authorID} className="flex items-center">
              <span className="text-gray-200 mb-1 mr-9">{author.author_name}</span>
              <button
                onClick={() => handleDeleteAuthor(author.authorID)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold px-2 rounded-full"
              >
                x
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-col mr-4">
          {}
        </div>
        <div className="flex flex-col mr-4">
          {}
        </div>
        <div className="flex flex-col mr-4">
          {}
        </div>
      </div>
    </li>
  </ul>
</div>

<div className="container">
  <div>
  <h1 className="text-4xl mb-2 text-white font-reenie inline">Books</h1>
  <button onClick={handleFilterClick} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mb-8 ml-6">
      Filter Books
    </button>
    <button onClick={handleResetFilters} className="bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full mb-8 ml-6">
      Reset Filters
  </button>
  </div>
  {showMessage && <div className='mb-4 bold'>
    {books.length === 1 ? (
    <div className='mb-4 bold'>1 entry matched your filter! <br/>
    Average Number of Reviews: {meanReviews} <br/>
    Average Rating Received: {meanRating}/5 <br/>
    </div>

  ) : (
    <div className='mb-4 bold'>
      {books.length} entries matched your filter! <br/>
      Average Number of Reviews: {meanReviews} <br/>
      Average Rating Received: {meanRating}/5 <br/>
    </div>
  )}
  </div>}
  <ul className="list-none p-0">
    <li className="py-2 border-b border-gray-300">
      <div className="flex justify-between">
        <div className="flex flex-col mr-4">
          <span className="text-gray-200 mb-1 font-bold">Title</span>
          {books.map(book => (
            <span key={book.bookID} className="text-gray-200 mb-1">{book.bookName}</span>
          ))}
        </div>
        <div className="flex flex-col mr-4">
          <span className="text-gray-200 mb-1 font-bold">Author</span>
          {books.map(book => (
            <span key={book.bookID} className="text-gray-200 mb-1">{book.authorName}</span>
          ))}
        </div>
        <div className="flex flex-col mr-4">
          <span className="text-gray-200 mb-1 font-bold">Genre</span>
          {books.map(book => (
            <span key={book.bookID} className="text-gray-200 mb-1">{book.genreName}</span>
          ))}
        </div>
        <div className="flex flex-col mr-4">
          <span className="text-gray-200 mb-1 font-bold">Average Rating</span>
          {books.map(book => (
            <span key={book.bookID} className="text-gray-200 mb-1">{book.avg_rating}</span>
          ))}
        </div>
        <div className="flex flex-col mr-4">
          <span className="text-gray-200 mb-1 font-bold"># of Reviews</span>
          {books.map(book => (
            <span key={book.bookID} className="text-gray-200 mb-1">{book.num_rating}</span>
          ))}
        </div>
        <div className="flex flex-col mr-4">
          <span className="text-gray-200 mb-1 font-bold">Synopsis</span>
          {books.map(book => (
            <div key={book.bookID} className="flex items-center justify-between">
              <span className="text-gray-200 mb-1 mr-40">{book.synopsis}</span>
              <div className="flex">
                <button
                  onClick={() => handleDeleteBook(book.bookID)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold px-2 rounded-full"
                >
                  x
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>
    </li>
  </ul>
</div>

<div className="container">
  <h1 className="text-4xl mb-2 text-white font-reenie">Reviews</h1>
  <ul className="list-none p-0">
    <li className="py-2 border-b border-gray-300">
      <div className="flex justify-between">
        <div className="flex flex-col mr-4">
          <span className="text-gray-200 mb-1 font-bold">User</span>
          {reviews.map(review => (
            <span key={review.reviewID} className="text-gray-200 mb-1">{review.userName}</span>
          ))}
        </div>
        <div className="flex flex-col mr-4">
          <span className="text-gray-200 mb-1 font-bold">Title</span>
          {reviews.map(review => (
            <span key={review.reviewID} className="text-gray-200 mb-1">{review.bookName}</span>
          ))}
        </div>
        <div className="flex flex-col mr-4">
          <span className="text-gray-200 mb-1 font-bold">Rating</span>
          {reviews.map(review => (
            <span key={review.reviewID} className="text-gray-200 mb-1">{review.rating}</span>
          ))}
        </div>
        <div className="flex flex-col mr-4">
          <span className="text-gray-200 mb-1 font-bold">Date</span>
          {reviews.map(review => (
            <span key={review.reviewID} className="text-gray-200 mb-1">{review.review_date}</span>
          ))}
        </div>
        <div className="flex flex-col mr-4">
          <span className="text-gray-200 mb-1 font-bold">Review</span>
          {reviews.map(review => (
            <div key={review.reviewID} className="flex items-center justify-between">
              <span className="text-gray-200 mb-1 mr-40">{review.review}</span>
              <div className="flex flex-col mr-4">
          
        </div>
              <div className="flex">
                <button
                  onClick={() => handleDeleteReview(review.reviewID)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold px-2 rounded-full"
                >
                  x
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </li>
  </ul>
</div>
      </div>
);
}

// } Home