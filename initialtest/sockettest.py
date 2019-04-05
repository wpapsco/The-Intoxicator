import socket
from time import sleep

HOST = '127.0.0.1'
PORT = 42069


def handleData(data):
    print(data)

# keep trying to connect
# when connected, continuously recieve data
# when closed, go back to trying to connect

while True:  # retry connection if it was closed
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    while s.connect_ex((HOST, PORT)) != 0:  # continually try to re-connect
        sleep(1)
    while True:  # continuously recieve data
        data = [ord(b) for b in s.recv(255)]
        if not data:
            break
        handleData(data)
    s.close()
