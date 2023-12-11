const http = require("http")
const fs = require("fs")
const path = require("path")

const read = (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    return data
}

function getContentType(url){
    extension = path.extname(url)
    if ([".png", ".jpg", ".jpeg", ".gif", ".ico"].includes(extension))
        return "image/" + extension.substring(1);
    if(extension == ".css")
        return "text/css"
    return "text/html"
}

function printLog(request, response){
    console.log("Se ha producido una petición")
    console.log("URL: " + request.url)
    console.log("Método: " + request.method)
    console.log("Algunos campos de la cabecera:")
    console.log("Host: " + request.headers['host'])
    console.log("User-Agent: " + request.headers['user-agent'])
    console.log("Accept-Language: " + request.headers['accept-language']) 
}

const requestListener = function (request, response){
    printLog(request, response)

    p = request.url == "/" ? "/index.html" : request.url

    const contentType = getContentType(p)
    console.log("Content type: " + contentType)
    console.log("Path: " + p)

    fs.readFile("." + p, (err, data) =>{
        if (err) {
            response.writeHead(500)
            response.end("Internal server error")
            return
        }
        

        response.setHeader("Content-Type", contentType);
        response.writeHead(200);
        response.write(data);
        response.end();
    }); 
    console.log("")
};

const server = http.createServer(requestListener);
server.listen(80);