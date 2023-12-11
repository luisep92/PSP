const http = require("http")
const fs = require("fs")

const read = (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    return data
}

const requestListener = function (request, response){
    console.log("Se ha producido una petición")
    console.log("URL: " + request.url)
    console.log("Método: " + request.method)
    console.log("Algunos campos de la cabecera:")
    console.log("Host: " + request.headers['host'])
    console.log("User-Agent: " + request.headers['user-agent'])
    console.log("Accept-Language: " + request.headers['accept-language']) 
    path = request.url
    if (path == "/")
        path = "/index.html"
        console.log(path)
    fs.readFile("." + path, (err, data) =>{
        if (err) {
            response.writeHead(500)
            response.end("Internal server error")
            return
        }
        response.setHeader("Content-Type", "text/html");
        response.writeHead(200);
        response.write(data);
        response.end();
        
    });
};


const server = http.createServer(requestListener);
server.listen(80);