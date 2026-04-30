from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DB_FILE = "hsr_characters.db"


def connect():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = connect()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS characters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            rarity TEXT,
            element TEXT,
            path TEXT,
            faction TEXT
        )
    """)
    conn.commit()
    conn.close()


init_db()


@app.route("/")
def home():
    return jsonify({"message": "Backend is running"})


@app.route("/characters", methods=["GET"])
def get_characters():
    conn = connect()
    rows = conn.execute("SELECT * FROM characters ORDER BY name").fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])


@app.route("/characters", methods=["POST"])
def add_character():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data received"}), 400

    name = data.get("name", "").strip()
    rarity = data.get("rarity", "").strip()
    element = data.get("element", "").strip()
    path = data.get("path", "").strip()
    faction = data.get("faction", "").strip()

    if not name:
        return jsonify({"error": "Name is required"}), 400

    try:
        conn = connect()
        conn.execute("""
            INSERT INTO characters (name, rarity, element, path, faction)
            VALUES (?, ?, ?, ?, ?)
        """, (name, rarity, element, path, faction))
        conn.commit()
        conn.close()

        return jsonify({"message": "Character added successfully"}), 201

    except sqlite3.IntegrityError:
        return jsonify({"error": "Character name already exists"}), 400


@app.route("/characters/<int:id>", methods=["DELETE"])
def delete_character(id):
    conn = connect()
    conn.execute("DELETE FROM characters WHERE id = ?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Character deleted successfully"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)