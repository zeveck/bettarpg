#!/usr/bin/env python3
"""
Simple Flask development server for Betta Fish RPG
Serves the game on all network interfaces
"""

from flask import Flask, send_from_directory, send_file
import os
import socket

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

def get_local_ip():
    """Get the local IP address"""
    try:
        # Connect to a remote address to determine local IP
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            return s.getsockname()[0]
    except Exception:
        return "127.0.0.1"

if __name__ == '__main__':
    local_ip = get_local_ip()
    
    print("🐠 Starting Betta Fish RPG development server...")
    print(f"🌐 Game available at:")
    print(f"   Local:    http://localhost:5555")
    print(f"   Network:  http://{local_ip}:5555")
    print("🛑 Press Ctrl+C to stop the server")
    
    app.run(
        host='0.0.0.0',  # Listen on all interfaces
        port=5555,
        debug=True,
        use_reloader=True
    )