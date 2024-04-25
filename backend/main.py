from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)
DB_FILE = 'backend/database.db'

#CREATES

def create_tables():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()

    # create user table
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    userID INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT,
                    email TEXT, 
                    join_date DATE, 
                    bio TEXT
                )''')
    
    # create books table
    c.execute(''' CREATE TABLE IF NOT EXISTS books (
                    bookID INTEGER PRIMARY KEY AUTOINCREMENT,
                    book_name TEXT,
                    authorID INTEGER,
                    genreID INTEGER,
                    synopsis TEXT,
                    FOREIGN KEY (authorID) REFERENCES authors (authorID), 
                    FOREIGN KEY (genreID) REFERENCES genres (genreID)
              )''')
    
    # create reviews table
    c.execute(''' CREATE TABLE IF NOT EXISTS reviews (
                    reviewID INTEGER PRIMARY KEY AUTOINCREMENT,
                    userID INTEGER,
                    bookID INTEGER,
                    rating INTEGER, 
                    review TEXT, 
                    review_date DATE,
                    FOREIGN KEY (userID) REFERENCES users (userID), 
                    FOREIGN KEY (bookID) REFERENCES books (bookID)
              )''')
    
    # create genres table
    c.execute(''' CREATE TABLE IF NOT EXISTS genres (
                   genreID INTEGER PRIMARY KEY, 
                   genre_name TEXT
              )''')
    
    # create authors table
    c.execute(''' CREATE TABLE IF NOT EXISTS authors (
                   authorID INTEGER PRIMARY KEY, 
                   author_name TEXT
              )''')
    
    conn.commit()
    conn.close()

def initialize_indexes():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()

    c.execute('''CREATE INDEX IF NOT EXISTS author_name_idx ON authors(author_name)''')
    c.execute('''CREATE INDEX IF NOT EXISTS rating_idx ON reviews(rating)''')
    c.execute('''CREATE INDEX IF NOT EXISTS title_idx ON books(book_name)''')
    c.execute('''CREATE INDEX IF NOT EXISTS genres_idx ON genres(genre_name)''')
    c.execute('''CREATE INDEX IF NOT EXISTS review_idx ON reviews(reviewID)''')
    
    conn.commit()
    conn.close()

@app.route('/api/users', methods=['GET'])
def get_users():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    try:
        c.execute("PRAGMA read_uncommitted = 1")
        c.execute("BEGIN TRANSACTION")
        c.execute('SELECT * FROM users')
        users = c.fetchall()
        c.execute("COMMIT")
        conn.close()
        return jsonify(users)
    except Exception as e:
        c.execute("ROLLBACK")
        conn.close()
        return jsonify({"error": str(e)}), 500


@app.route('/api/books', methods=['GET'])
def get_books():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    try:
        c.execute("PRAGMA read_uncommitted = 1")
        c.execute("BEGIN TRANSACTION")
        conditional = "WHERE"
        args = tuple()
        genres = []
        
        for v in request.args.getlist("genres[]"):
            if len(v) != 0:
                genres.append(v)

        for genre in genres:
            conditional += " G.genre_name = ? OR"
            args += (genre, )
        
        if conditional != "WHERE":
            conditional = conditional[:-2]
            conditional += "AND"

        for q, v in request.args.items():
            if (q != "genres[]"):
                if (q == "bookName") and (len(v)!=0):
                    q = "book_name"
                    conditional += f" B.{q} = ? AND"
                    args += (v,)
                elif (q == "avg_rating" or q == 'num_rating') and (len(v)!=0):
                    conditional+=f" {q} > ? AND"
                    args += (float(v), )
                elif (q == "authorName") and (len(v)!=0):
                    q = "author_name"
                    conditional += f" A.{q} = ? AND"
                    args += (v,)

        if (conditional != "WHERE"):
            conditional = conditional[:-3]
        else:
            conditional = ""
        
        query = f'''SELECT B.bookID, B.book_name, A.author_name, G.genre_name, B.synopsis,
                (SELECT AVG(rating) FROM reviews WHERE bookID=B.bookID) AS avg_rating,
                (SELECT COUNT(*) FROM reviews WHERE bookID=B.bookID) AS num_rating
                FROM books B JOIN authors A ON A.authorID = B.authorID JOIN genres G ON g.genreID = b.genreID {conditional}'''

        c.execute(query, args)
        books = c.fetchall()
        c.execute("COMMIT")
        conn.close()
        return jsonify(books)
    except Exception as e:
        c.execute("ROLLBACK")
        conn.close()
        return jsonify({"error": str(e)}), 500

@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    try:
        c.execute("PRAGMA read_uncommitted = 1")
        c.execute("BEGIN TRANSACTION")
        c.execute('SELECT R.reviewID, U.username, B.book_name, R.rating, R.review, R.review_date FROM reviews R JOIN users U ON U.userID = R.userID JOIN books B ON B.bookID = R.bookID')
        reviews = c.fetchall()
        c.execute("COMMIT")
        conn.close()
        return jsonify(reviews)
    except Exception as e:
        c.execute("ROLLBACK")
        conn.close()
        return jsonify({"error": str(e)}), 500


@app.route('/api/genres', methods=['GET'])
def get_genres():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    try:
        c.execute("PRAGMA read_uncommitted = 1")
        c.execute("BEGIN TRANSACTION")
        c.execute('SELECT * FROM genres')
        genres = c.fetchall()
        c.execute("COMMIT")
        conn.close()
        return jsonify(genres)
    except Exception as e:
        c.execute("ROLLBACK")
        conn.close()
        return jsonify({"error": str(e)}), 500

@app.route('/api/authors', methods=['GET'])
def get_authors():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    try:
        c.execute("PRAGMA read_uncommitted = 1")
        c.execute("BEGIN TRANSACTION")
        c.execute('SELECT * FROM authors')
        authors = c.fetchall()
        c.execute("COMMIT")
        conn.close()
        return jsonify(authors)
    except Exception as e:
        c.execute("ROLLBACK")
        conn.close()
        return jsonify({"error": str(e)}), 500



#ADDS

@app.route('/api/users', methods=["POST"])
def post_added_users():
    try:
        data = request.json
        print(data)
        username = data.get('username')
        email = data.get('email')
        join_date = data.get('join_date')
        bio = data.get('bio')

        if '@' not in email:
            return jsonify({"error": "Invalid email format"}), 400

        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("PRAGMA read_uncommitted = 1")
        c.execute("BEGIN TRANSACTION")

        c.execute("INSERT INTO users (username, email, join_date, bio) VALUES (?, ?, ?, ?)",
                  (username, email, join_date, bio))
        c.execute("COMMIT") 
        conn.commit()
        conn.close()

        return jsonify({"message": "User added successfully"}), 200
    except Exception as e:
        c.execute("ROLLBACK")
        conn.close()
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/books', methods=["POST"])
def post_added_books():
    try:
        data = request.json
        book = data.get('bookName')
        author = data.get('authorName')
        genre = data.get('genreName')
        synopsis = data.get('synopsis')

        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("PRAGMA read_uncommitted = 1")
        c.execute("BEGIN TRANSACTION")

        c.execute('''INSERT INTO books (book_name, authorID, genreID, synopsis)
                        VALUES (?, (SELECT min(authorID) FROM authors WHERE author_name = ?), (SELECT min(genreID) FROM genres WHERE genre_name = ?), ?)''',
                  (book, author, genre, synopsis))
        c.execute("COMMIT")
        conn.commit()
        conn.close()

        return jsonify({"message": "Book added successfully"}), 200
    except Exception as e:
        c.execute("ROLLBACK")
        conn.close()
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/reviews', methods=["POST"])
def post_added_reviews():
    try:
        data = request.json
        print(data)
        user = data.get('userName')
        book = data.get('bookName')
        rating = data.get('rating')
        review = data.get('review')
        review_date = data.get('review_date')

        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()

        c.execute("PRAGMA read_uncommitted = 1")
        c.execute("BEGIN TRANSACTION")
        c.execute('''INSERT INTO reviews (userID, bookID, rating, review, review_date) 
                        VALUES ((SELECT min(userID) FROM users WHERE username = ?), (SELECT min(bookID) FROM books WHERE book_name = ?), ?, ?, ?)''',
                  (user, book, rating, review, review_date))
        c.execute("COMMIT")
        conn.commit()
        conn.close()

        return jsonify({"message": "Review added successfully"}), 200
    except Exception as e:
        c.execute("ROLLBACK")
        conn.close()
        return jsonify({"error": str(e)}), 500

@app.route('/api/genres', methods=["POST"])
def post_added_genres():
    try:
        data = request.json
        print(data)
        genre_name = data.get('genre_name')
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("PRAGMA read_uncommitted = 1")
        c.execute("BEGIN TRANSACTION")
        c.execute("INSERT INTO genres (genre_name) VALUES (?)",
                  (genre_name,))
        c.execute("COMMIT")
        conn.commit()
        conn.close()

        return jsonify({"message": "Genre added successfully"}), 200
    except Exception as e:
        c.execute("ROLLBACK")
        conn.close()
        return jsonify({"error": str(e)}), 500

@app.route('/api/authors', methods=["POST"])
def post_added_authors():
    try:
        data = request.json
        print(data)
        author_name = data.get('author_name')
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("PRAGMA read_uncommitted = 1")
        c.execute("BEGIN TRANSACTION")
        c.execute("INSERT INTO authors (author_name) VALUES (?)",
                  (author_name,))
        c.execute("COMMIT") 
        conn.commit()
        conn.close()

        return jsonify({"message": "Author added successfully"}), 200
    except Exception as e:
        c.execute("ROLLBACK")
        conn.close()
        return jsonify({"error": str(e)}), 500
    

# DELETES 
    
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("PRAGMA read_uncommitted = 1")
        c.execute("BEGIN TRANSACTION")
        c.execute("DELETE FROM users WHERE userID = ?", (user_id,))
        c.execute("COMMIT")
        conn.commit()
        conn.close()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        c.execute("ROLLBACK")
        conn.close()
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("PRAGMA read_uncommitted = 1")
        c.execute("BEGIN TRANSACTION")
        c.execute("DELETE FROM books WHERE bookID = ?", (book_id,))
        c.execute("COMMIT")
        conn.commit()
        conn.close()
        return jsonify({"message": "Book deleted successfully"}), 200
    except Exception as e:
        c.execute("ROLLBACK")
        conn.close()
        return jsonify({"error": str(e)}), 500
    
    
@app.route('/api/reviews/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("PRAGMA read_uncommitted = 1")
        c.execute("BEGIN TRANSACTION")
        c.execute("DELETE FROM reviews WHERE reviewID = ?", (review_id,))
        c.execute("COMMIT")
        conn.commit()
        conn.close()
        return jsonify({"message": "Review deleted successfully"}), 200
    except Exception as e:
        c.execute("ROLLBACK")
        conn.close()
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/genres/<int:genre_id>', methods=['DELETE'])
def delete_genre(genre_id):
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("PRAGMA read_uncommitted = 1")
        c.execute("BEGIN TRANSACTION")
        c.execute("UPDATE books SET genreID = NULL WHERE genreID = ?", (genre_id,))
        c.execute("DELETE FROM genres WHERE genreID = ?", (genre_id,))
        c.execute("COMMIT")
        conn.commit()
        conn.close()
        return jsonify({"message": "Genre deleted successfully"}), 200
    except Exception as e:
        c.execute("ROLLBACK")
        conn.close()
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/authors/<int:author_id>', methods=['DELETE'])
def delete_author(author_id):
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("PRAGMA read_uncommitted = 1")
        c.execute("BEGIN TRANSACTION")
        c.execute("UPDATE books SET authorID = NULL WHERE authorID = ?", (author_id,))
        c.execute("DELETE FROM authors WHERE authorID = ?", (author_id,))
        c.execute("COMMIT")
        conn.commit()
        conn.close()
        return jsonify({"message": "Author deleted successfully"}), 200
    except Exception as e:
        c.execute("ROLLBACK")
        conn.close()
        return jsonify({"error": str(e)}), 500
    
#EDITS
    
@app.route('/api/users/', methods=["PUT"])
def edit_user():
    try:
        data = request.json
        print(data)
        userID = data.get('userID')
        username = data.get('username')
        email = data.get('email')
        join_date = data.get('join_date')
        bio = data.get('bio')
        
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("PRAGMA read_uncommitted = 1")
        c.execute("BEGIN TRANSACTION")
        c.execute("UPDATE users SET username=?, email=?, join_date=?, bio=? WHERE userID=?",
                  (username, email, join_date, bio, userID))
        c.execute("COMMIT")
        conn.commit()
        conn.close()

        return jsonify({"message": "User updated successfully"}), 200
    except Exception as e:
        c.execute("ROLLBACK")
        conn.close()
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    create_tables()
    initialize_indexes()
    app.run(debug=True, port=5001)
