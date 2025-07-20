#!/usr/bin/env python3
"""
Simple Flask development server for Betta Fish RPG
Serves the game on http://localhost:5555
"""

from flask import Flask, send_from_directory, send_file
import os

app = Flask(__name__)

# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def index():
    """Serve the main game page"""
    return send_file(os.path.join(BASE_DIR, 'index.html'))

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files (CSS, JS, graphics)"""
    return send_from_directory(BASE_DIR, filename)

if __name__ == '__main__':
    print("🐠 Starting Betta Fish RPG development server...")
    print("🌐 Game available at: http://localhost:5555")
    print("🛑 Press Ctrl+C to stop the server")
    
    app.run(
        host='localhost',
        port=5555,
        debug=True,
        use_reloader=True
    )