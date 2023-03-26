import subprocess
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

http_server = subprocess.Popen(['python', 'httpserver.py'])
websocket_server = subprocess.Popen(['python', 'websocketserver.py'])

http_server.wait()
websocket_server.wait()


