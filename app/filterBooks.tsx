import React, { useState, useEffect } from 'react';

interface Book {
    bookID: number;
    bookName: string;
    authorName: string;
    genreName: string;
    synopsis: string;
    avg_rating: number;
    num_rating: number;
  }

interface filterByBooks {
  onClose: () => void;
  onApplyFilters: (filters: any) => void; 
  books: Book[];
}

const FilterPopUp: React.FC<filterByBooks> = ({ onClose, onApplyFilters, books }) => {
    useEffect(() => {
        const handleEscapeKeyPress = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            onClose();
          }
        };
    
        document.addEventListener('keydown', handleEscapeKeyPress);
    
        return () => {
          document.removeEventListener('keydown', handleEscapeKeyPress);
        };
      }, [onClose]);

  const [filters, setFilters] = useState<any>({
    bookName: '',
    authorName: '',
    genreName:'',
    synopsis: '',
    avg_rating: '',
    num_rating: ''
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'num_rating' && parseInt(value) < 0) {
        setFilters({ ...filters, [name]: '0' });
      } else {
        setFilters({ ...filters, [name]: value });
      }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-emerald-600 p-6 rounded shadow-lg relative">
        <button onClick={onClose} className="absolute top-1 right-2 text-white hover:text-gray-300 size-3">
          x
        </button>
        <div className="mb-4">
          <label className="text-center text-5xl mb-4 font-reenie">
            Filtering
          </label>
          <select name="authorName" 
          value={filters.authorName} 
          onChange={handleSelectChange} 
          className="border border-gray-300 text-center rounded-md px-3 py-2 mb-2 w-full font-serif text-black">
            <option value="" disabled>Select Author</option>
            {books.map(book => (
              <option key={book.bookID} value={book.authorName}>{book.authorName}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="avg_rating" className="text-white">Rating:</label>
            <select
              name="avg_rating"
              value={filters.avg_rating}
              onChange={handleSelectChange}
              className="border border-gray-300 text-center rounded-md px-3 py-2 mb-2 w-full font-serif text-black">
              <option value="" disabled>Select a Rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">
            Title
          </label>
          <input type="text" name="bookName" value={filters.bookName} onChange={handleInputChange} className="border border-gray-300 text-center rounded-md px-3 py-2 mb-2 w-full font-serif text-black" />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">
            Genre
          </label>
          <input type="text" name="genreName" value={filters.genreName} onChange={handleInputChange} className="border border-gray-300 text-center rounded-md px-3 py-2 mb-2 w-full font-serif text-black" />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">
            # of Reviews
          </label>
          <input type="number" name="num_rating" value={filters.num_rating} onChange={handleInputChange} className="border border-gray-300 text-center rounded-md px-3 py-2 mb-2 w-full font-serif text-black" />
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={handleApplyFilters} className="bg-green-700 hover:bg-green-500 text-white font-bold text-sm py-1 px-5 font-reenie rounded-full mx-auto block transition duration-300">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};




export default FilterPopUp;