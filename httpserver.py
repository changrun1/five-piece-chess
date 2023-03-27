from http.server import BaseHTTPRequestHandler, HTTPServer



class MyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        print("Requested path:", self.path)
        if self.path == "/":
            if self.path == "/":
                self.path = "/index.html"
            else:
                self.path = self.path[1:]
        try:
            if self.path.endswith(".jpg"):
                file_to_open = open(self.path[1:], 'rb').read()
            else:
                file_to_open = open(self.path[1:], 'rb').read()
            self.send_response(200)
        except Exception as e:
            file_to_open = "File not found"
            self.send_response(404)
            print(e)

        if self.path.endswith(".css"):
            self.send_header('Content-type', 'text/css; charset=utf-8')
        elif self.path.endswith(".js"):
            self.send_header('Content-type', 'application/javascript; charset=utf-8')
        elif self.path.endswith(".jpg"):
            self.send_header('Content-type', 'image/jpg')
        else:
            self.send_header('Content-type', 'text/html; charset=utf-8')
        
        self.send_header('x-content-type-options', 'nosniff')
        self.end_headers()
        self.wfile.write(file_to_open)




def main():
    http_server = HTTPServer(('0.0.0.0', 8000), MyHandler)
    print("HTTP server started on port 8000")
    http_server.serve_forever()

if __name__ == '__main__':
    main()
