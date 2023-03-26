from http.server import BaseHTTPRequestHandler, HTTPServer



class MyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/":
            self.path = "/index.html"
        try:
            file_to_open = open(self.path[1:], encoding='utf-8').read()
            self.send_response(200)
        except Exception as e:
            file_to_open = "File not found"
            self.send_response(404)
            print(e)

        if self.path.endswith(".css"):
            self.send_header('Content-type', 'text/css; charset=utf-8')
        elif self.path.endswith(".js"):
            self.send_header('Content-type', 'application/javascript; charset=utf-8')
        else:
            self.send_header('Content-type', 'text/html; charset=utf-8')
        self.send_header('x-content-type-options', 'nosniff')
        self.end_headers()
        self.wfile.write(bytes(file_to_open, 'utf-8'))




def main():
    http_server = HTTPServer(('localhost', 8000), MyHandler)
    print("HTTP server started on port 8000")
    http_server.serve_forever()

if __name__ == '__main__':
    main()

