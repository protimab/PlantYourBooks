from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)
DB_FILE = 'backend/database.db'

def create_tables():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()

    # create user table
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    userID INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT,
                    email TEXT, 
                    join_date DATE, 
                    profile_picture TEXT, 
                    bio TEXT
                )''')
    
    # create books table
    c.execute(''' CREATE TABLE IF NOT EXISTS books (
                    bookID INTEGER PRIMARY KEY,
                    authorID INTEGER,
                    publication_date DATE,
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
def post_added_courses():
    try:
        data = request.json
        print(data)
        username = data.get('username')
        email = data.get('email')
        join_date = data.get('join_date')
        profile_picture = data.get('profile_picture')
        bio = data.get('bio')
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()

        c.execute("INSERT INTO users (username, email, join_date, profile_picture, bio) VALUES (?, ?, ?, ?, ?)",
                  (username, email, join_date, profile_picture, bio))
        conn.commit()
        conn.close()

        return jsonify({"message": "Course added successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    create_tables()
    app.run(debug=True, port=5001)
