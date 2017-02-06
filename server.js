var http = require('http'),
    Tail = require('tail').Tail,
    fs = require('fs'),

    // NEVER use a Sync function this is for demo !
    index = fs.readFileSync(__dirname + '/index.html');


// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

// read log.txt file as tail command in linux
var tail = new Tail('log.txt');

tail.on("line", function(data) {
  // Send current data to clients
  io.emit('welcome', { message: data})
});

function writeFile() {
  var data = ' [info  log] ' + new Date().toJSON() + '\n';
  // create write stream
  var stream = fs.createWriteStream("log.txt", { 'flags': 'a'});
  stream.once('open', function(fd) {
    stream.write(data);
    stream.end();
  });
}
// write file in every 2 second
setInterval(writeFile, 2000);

// Emit welcome message on connection
io.on('connection', function(socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });
});

app.listen(3000);
console.log('server is running on port 3000');
