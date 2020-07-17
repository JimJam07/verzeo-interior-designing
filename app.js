const http = require("http");
const fs = require("fs");
const url = require("url");
const lookUp = require("mime-types").lookup;
const parse = require("querystring").parse;
const mysql = require("mysql");
const port = 3000;
var connection = mysql.createConnection({
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "Shanaa1020",
  database: "design",
});
connection.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("connected");
  }
});
//when page is not found
const error404 = `<style>* {
  transition: all 0.6s;
}

html {
  height: 100%;
}

body {
  font-family: "Lato", sans-serif;
  color: #888;
  margin: 0;
}

#main {
  display: table;
  width: 100%;
  height: 100vh;
  text-align: center;
}

.fof {
  display: table-cell;
  vertical-align: middle;
}

.fof h1 {
  font-size: 50px;
  display: inline-block;
  padding-right: 12px;
  animation: type 0.5s alternate infinite;
}

@keyframes type {
  from {
    box-shadow: inset -3px 0px 0px #888;
  }
  to {
    box-shadow: inset -3px 0px 0px transparent;
  }
}</style>
<div id="main">
<div class="fof">
  <h1>Error 404</h1>
</div>
</div>`;
//////////////////////////////////////
//create new sql connection and table
///////////////////////////////////////

const server = http.createServer(function (req, res) {
  if (req.method == "GET") {
    var parsedUrl = url.parse(req.url, true);
    var path = parsedUrl.path.replace(/^\/+|\/+$/g, "");
    if (path == "") {
      path = "index.html";
    }
    let file = __dirname + "/public/" + path;
    console.log(file);
    fs.readFile(file, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.write(error404);
        res.end();
      } else {
        console.log(`Returning ${path}`);
        res.setHeader("X-Content-Type-Options", "nosniff");
        let mime = lookUp(path);
        res.writeHead(200, { "content-type": mime });
        res.end(data);
      }
      res.end();
    });
  } else if (req.method == "POST") {
    req.on("data", (chunk) => {
      let data = parse(chunk.toString()); // convert Buffer to json object
      if (req.url == "/feedback.html") {
        console.log(data);
        var sqlData = `INSERT INTO review (firstname, lastname,email,country,feedback) VALUES ('${data.firstname}', '${data.lastname}','${data.mailid}','${data.county}','${data.subject}')`;
        connection.query(sqlData, function (err, result) {
          if (err) throw err;
          console.log(result);
        });
        res.writeHead(301, { Location: "http://localhost:3000/feedback.html" });
        res.end();
      } else if (req.url == "/") {
        let search = data.search.toLowerCase();
        if (search.includes("living")) {
          res.writeHead(301, { Location: "http://localhost:3000/living.html" });
          res.end();
        } else if (search.includes("bedroom")) {
          res.writeHead(301, {
            Location: "http://localhost:3000/bedroom.html",
          });
          res.end();
        } else if (search.includes("kitchen")) {
          res.writeHead(301, {
            Location: "http://localhost:3000/kitchen.html",
          });
          res.end();
        } else if (search.includes("office")) {
          res.writeHead(301, { Location: "http://localhost:3000/office.html" });
          res.end();
        } else if (search.includes("service") || search.includes("services")) {
          res.writeHead(301, { Location: "http://localhost:3000/#services" });
          res.end();
        } else if (search.includes("gallery") || search.includes("work")) {
          res.writeHead(301, { Location: "http://localhost:3000/#gallery" });
          res.end();
        } else if (search.includes("contact") || search.includes("phone")) {
          res.writeHead(301, { Location: "http://localhost:3000/#contact" });
          res.end();
        } else {
          res.writeHead(404);
          res.write(error404);
          res.end();
        }
      }
    });
  }
});
server.listen(port, function (error) {
  if (error) {
    console.log("something went wrong");
  } else {
    console.log("status:on");
  }
});
// fs.readFile("./public/feedback.html", function (err, data) {
//   if (err) {
//     res.writeHead(404);
//     res.write(error404);
//     res.end();
//   } else {
//     console.log(`Returning feedback`);
//     res.writeHead(200, { "content-type": "text/html" });
//     res.end(data);
//   }
//   res.end();
// });
