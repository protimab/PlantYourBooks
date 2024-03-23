import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface PopupProps {
  onClose: () => void;
  onAddUser?: (user: User) => void;
  onAddBook?: (book: Book) => void;
  onAddReview?: (review: Review) => void;
  onAddGenre?: (genreName: string) => void; 
  onAddAuthor?: (authorName: string) => void;
}

interface User {
  userID: number;
  username: string;
  email: string;
  join_date: string;
  bio: string;
}

interface Book {
  bookID: number;
  bookName: string;
  authorName: string;
  genreName: string;
  synopsis: string;
}

interface Review {
  reviewID: number;
  userName: string;
  bookName: string;
  rating: string;
  review: string;
  review_date: string;
}

const Popup: React.FC<PopupProps> = ({ onClose, onAddUser, onAddBook, onAddGenre, onAddAuthor, onAddReview}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState<User>({
    userID: 0,
    username: '',
    email: '',
    join_date: '',
    bio: ''
  });
  const [book, setBook] = useState<Book>({
    bookID: 0,
    bookName: '',
    authorName: '',
    genreName: '',
    synopsis: ''
  });
  const [review, setReview] = useState<Review>({
    reviewID: 0,
    userName: '',
    bookName: '',
    rating: '',
    review: '',
    review_date: ''
  });
  const [genreName, setGenreName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [emailError, setEmailError] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setShowPopup(true);
  }, []);

  useEffect(() => {
    validateForm();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'bio') {
      setUser({ ...user, [name]: value });
    } else if (name === 'bookName' || name === 'authorName' || name === 'genreName' || name === 'synopsis') {
      setBook({ ...book, [name]: value });
    } else {
      setReview({ ...review, [name]: value });
    }
    validateForm();
  };

  const validateForm = () => {
    // check if all required fields are filled out
    if (user.username && user.email && user.join_date && user.bio) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };
  
  const handleClosePopup = () => {
    setShowPopup(false);
    onClose();
  };

  const handleAddUser = () => {
    if (onAddUser) {
      onAddUser(user);
      setShowPopup(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setUser({ ...user, email });
    
    // Email validation
    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };
  
  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleAddBook = () => {
    if (onAddBook) {
      onAddBook(book);
      setShowPopup(false);
    }
  };
 
  const handleAddGenre = () => {
    if (onAddGenre) {
      onAddGenre(genreName);
      setShowPopup(false);
    }
  };

  const handleAddAuthor = () => {
    if (onAddAuthor) {
      onAddAuthor(authorName);
      setShowPopup(false);
    }
  };

  const handleAddReview = () => {
    if (onAddReview) {
      onAddReview(review);
      setShowPopup(false);
    }
  };


  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center ${
        showPopup ? '' : 'hidden'
      }`}
    >
      <div className="bg-emerald-600 p-6 rounded shadow-lg relative">
        <button onClick={handleClosePopup} className="absolute top-1 right-2 text-white hover:text-gray-300 size-3">
          x
        </button>
        {onAddUser && (
          <div>
            <h2 className="text-center text-5xl mb-4 font-reenie">Add User</h2>
            <input
              type="text"
              value={user.username}
              name="username"
              onChange={handleInputChange}
              placeholder="Username"
              className="border border-gray-300 text-center rounded-md px-3 py-2 mb-2 w-full font-serif text-black"
            />
            <input
              type="email"
              value={user.email}
              name="email"
              onChange={handleEmailChange}
              placeholder="Email"
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full text-black"
            />
            {emailError && <p className="text-red-500">{emailError}</p>}
            <input
              type="text"
              value={user.join_date}
              name="join_date"
              onChange={handleInputChange}
              placeholder="Join Date"
              className="border border-gray-300 text-center rounded-md px-3 py-2 mb-2 w-full font-serif text-black"
            />
            <textarea
              value={user.bio}
              name="bio"
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
              placeholder="Bio"
              className="border border-gray-300 text-center rounded-md px-3 py-2 mb-2 w-full font-serif text-black"
            />
            <button
              onClick={handleAddUser}
              disabled={!isFormValid}
              className={`bg-green-700 ${
                !isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-500'
              } text-white text-center font-serif font-bold py-2 px-4 rounded-full mr-2 transition duration-300`}
            >
              Add User
            </button>
          </div>
        )}
       {onAddBook && (
      <div>
        <h2 className="text-center text-5xl mb-4 font-reenie">Add Book</h2>
        <input
          type="text"
          value={book.bookName}
          name="bookName"
          onChange={handleInputChange}
          placeholder="Title"
          className="border border-gray-300 text-center rounded-md px-3 py-2 mb-2 w-full font-serif text-black"
        />
        <input
          type="text"
          value={book.authorName}
          name="authorName"
          onChange={handleInputChange}
          placeholder="Author"
          className="border border-gray-300 text-center rounded-md px-3 py-2 mb-2 w-full font-serif text-black"
        />
        <input
          value={book.genreName}
          name="genreName"
          onChange={handleInputChange}
          placeholder="Genre"
          className="border border-gray-300 text-center rounded-md px-3 py-2 mb-2 w-full font-serif text-black"
        />
        <input
          value={book.synopsis}
          name="synopsis"
          onChange={handleInputChange}
          placeholder="Synopsis"
          className="border border-gray-300 text-center rounded-md px-3 py-2 mb-2 w-full font-serif text-black"
        />
        <button
          onClick={handleAddBook}
          className="bg-green-700 hover:bg-green-500 text-white font-bold text-center py-2 px-4 rounded-full mr-2 transition duration-300"
        >
          Add Book
        </button>
      </div>
    )}
        {onAddGenre && (
          <div>
            <h2 className="text-4xl mb-4 text-center font-reenie ">Genre!</h2>
            <input
              type="text"
              value={genreName}
              onChange={(e) => setGenreName(e.target.value)}
              placeholder="Genre Name"
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 -mt-1 w-full font-serif text-center text-black"
            /> 
            <button
              onClick={handleAddGenre}
              className="bg-green-700 hover:bg-green-500 text-white font-bold text-sm py-1 px-2 font-reenie rounded-full mx-auto block transition duration-300"
            >
              add
            </button>
          </div>
        )}
        {onAddAuthor && (
          <div>
            <h2 className="text-4xl mb-4 text-center font-reenie ">Author!</h2>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Author Name"
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 -mt-1 w-full font-serif text-center text-black"
            />
            <button
              onClick={handleAddAuthor}
              className="bg-green-700 hover:bg-green-500 text-white font-bold text-sm py-1 px-2 font-reenie rounded-full mx-auto block transition duration-300"
            >
              add
            </button>

          </div>
        )}
         {onAddReview && (
      <div>
        <h2 className="text-center text-5xl mb-4 font-reenie">Add Review</h2>
        <input
          type="text"
          value={review.bookName}
          name="bookName"
          onChange={handleInputChange}
          placeholder="Title"
          className="border border-gray-300 text-center rounded-md px-3 py-2 mb-2 w-full font-serif text-black"
        />
        <input
          type="text"
          value={review.userName}
          name="userName"
          onChange={handleInputChange}
          placeholder="username"
          className="border border-gray-300 text-center rounded-md px-3 py-2 mb-2 w-full font-serif text-black"
        />
        <input
          value={review.rating}
          name="rating"
          onChange={handleInputChange}
          placeholder="rating"
          className="border border-gray-300 text-center rounded-md px-3 py-2 mb-2 w-full font-serif text-black"
        />
        <textarea
          value={review.review}
          name="review"
          onChange={handleInputChange}
          placeholder="review"
          className="border border-gray-300 text-center rounded-md px-3 py-2 mb-2 w-full font-serif text-black"
        />
        <input
          value={review.review_date}
          name="review_date"
          onChange={handleInputChange}
          placeholder="review date"
          className="border border-gray-300 text-center rounded-md px-3 py-2 mb-2 w-full font-serif text-black"
        />
        <button
          onClick={handleAddReview}
          className="bg-green-700 hover:bg-green-500 text-white font-bold text-center py-2 px-4 rounded-full mr-2 transition duration-300"
        >
          Add Review
        </button>
      </div>
    )}
      </div>
    </div>
  );  
};

export default Popup;
