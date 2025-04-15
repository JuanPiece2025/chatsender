from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app) # Habilitar CORS para permitir solicitudes desde el frontend (en diferentes orígenes)

DATABASE = 'database.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row # Para acceder a las columnas por nombre
    return conn

def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

def execute_db(query, args=()):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(query, args)
    conn.commit()
    cur.close()

# Inicializar la base de datos y la tabla si no existen
with app.app_context():
    db = get_db()
    db.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    db.commit()

# Ruta para obtener todos los mensajes
@app.route('/api/messages', methods=['GET'])
def get_messages():
    messages = query_db('SELECT id, text, timestamp FROM messages ORDER BY timestamp DESC')
    return jsonify([dict(row) for row in messages])

# Ruta para recibir y guardar un nuevo mensaje
@app.route('/api/messages', methods=['POST'])
def post_message():
    data = request.get_json()
    text = data.get('text')
    if text:
        execute_db('INSERT INTO messages (text) VALUES (?)', (text,))
        return jsonify({'message': 'Mensaje enviado con éxito'}), 201
    return jsonify({'error': 'El mensaje es requerido'}), 400

if __name__ == '__main__':
    app.run(debug=True)
