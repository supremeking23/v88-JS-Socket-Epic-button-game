const EXPRESS = require("express");
const APP = EXPRESS();
const PORT = 8080;
const SERVER = APP.listen(PORT);
const IO = require("socket.io")(SERVER);
let session = require("express-session");
// for image/js/css
APP.use(EXPRESS.static(__dirname + "/static"));
// This sets the location where express will look for the ejs views
APP.set("views", __dirname + "/views");
// Now lets set the view engine itself so that express knows that we are using ejs as opposed to another templating engine like jade
APP.set("view engine", "ejs");
// use app.get method and pass it the base route '/' and a callback

APP.use(
	session({
		secret: "secret",
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 600000 },
	})
);

APP.get("/", (req, res) => {
	// req.session.numClick = 0;
	// var counter = 0;
	IO.on("connection", function (socket) {
		socket.on("epic-button", function (data) {
			socket.emit("counter", { counter: parseInt(data.counter) + 1 });
			socket.broadcast.emit("counter", { counter: parseInt(data.counter) + 1 });
		});

		socket.on("reset-count", function (data) {
			socket.emit("counter", { counter: 0 });
			socket.broadcast.emit("counter", { counter: 0 });
		});
	});

	res.render("index");
});

// APP.listen(PORT, (req, res) => {
// 	console.log(`Server is listening to ${PORT}`);
// });
