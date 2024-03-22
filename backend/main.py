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
                    bookID INTEGER PRIMARY KEY,
                    authorID INTEGER,
                    genreID INTEGER,
                    synopsis TEXT,
                    FOREIGN KEY (authorID) REFERENCES authors (authorID), 
                    FOREIGN KEY (genreID) REFERENCES genres (genreID)
              )''')
    
    # create reviews table
    c.execute(''' CREATE TABLE IF NOT EXISTS reviews (
                    reviewID TEXT PRIMARY KEY,
                    userID INTEGER,
                    bookID INTEGER,
                    rating TEXT, 
                    review TEXT, 
                    review_date DATE,
                    FOREIGN KEY (userID) REFERENCES users (userID), 
                    FOREIGN KEY (bookID) REFERENCES books (bookID)
              )''')
    
    # create user library table
    c.execute(''' CREATE TABLE IF NOT EXISTS user_library (
                   userID INTEGER,
                   bookID INTEGER,
                   has_read TEXT,
                   PRIMARY KEY (userID, bookID),
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


#ADDS

@app.route('/api/users', methods=['GET'])
def get_users():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT * FROM users')
    users = c.fetchall()
    conn.close()
    return jsonify(users)

@app.route('/api/books', methods=['GET'])
def get_books():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT * FROM books')
    books = c.fetchall()
    conn.close()
    return jsonify(books)

@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT * FROM reviews')
    reviews = c.fetchall()
    conn.close()
    return jsonify(reviews)

@app.route('/api/user_library', methods=['GET'])
def get_user_library():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT * FROM user_library')
    user_library = c.fetchall()
    conn.close()
    return jsonify(user_library)

@app.route('/api/genres', methods=['GET'])
def get_genres():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT * FROM genres')
    genres = c.fetchall()
    conn.close()
    return jsonify(genres)

@app.route('/api/authors', methods=['GET'])
def get_authors():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT * FROM authors')
    authors = c.fetchall()
    conn.close()
    return jsonify(authors)

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

        c.execute("INSERT INTO users (username, email, join_date, bio) VALUES (?, ?, ?, ?)",
                  (username, email, join_date, bio))
        conn.commit()
        conn.close()

        return jsonify({"message": "User added successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/books', methods=["POST"])
def post_added_books():
    try:
        data = request.json
        print(data)
        book = data.get('title')
        author = data.get('author_name')
        genre = data.get('genre_name')
        synopsis = data.get('synopsis')

        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()

        c.execute("INSERT INTO users (book, author, genre, synopsis) VALUES (?, ?, ?, ?)",
                  (book, author, genre, synopsis))
        conn.commit()
        conn.close()

        return jsonify({"message": "Book added successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


    
@app.route('/api/genres', methods=["POST"])
def post_added_genres():
    try:
        data = request.json
        print(data)
        genre_name = data.get('genre_name')
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()

        c.execute("INSERT INTO genres (genre_name) VALUES (?)",
                  (genre_name,))
        conn.commit()
        conn.close()

        return jsonify({"message": "Genre added successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/authors', methods=["POST"])
def post_added_authors():
    try:
        data = request.json
        print(data)
        author_name = data.get('author_name')
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()

        c.execute("INSERT INTO authors (author_name) VALUES (?)",
                  (author_name,))
        conn.commit()
        conn.close()

        return jsonify({"message": "Author added successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# DELETES 
    
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("DELETE FROM users WHERE userID = ?", (user_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/genres/<int:genre_id>', methods=['DELETE'])
def delete_genre(genre_id):
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("DELETE FROM genres WHERE genreID = ?", (genre_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Genre deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/authors/<int:author_id>', methods=['DELETE'])
def delete_author(author_id):
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("DELETE FROM authors WHERE authorID = ?", (author_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Author deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    create_tables()
    app.run(debug=True, port=5001)
