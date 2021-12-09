// - // ~~ https://blooming-ridge-82320.herokuapp.com/ ~~ // - //

const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();

const PORT = process.env.PORT || 3001;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    console.log(err);
    console.log(JSON.parse(data));
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();

  // read db
  fs.readFile("./db/db.json", (err, data) => {
    console.log(err);
    console.log(JSON.parse(data));
    // parse data
    let parsedNotes = JSON.parse(data);
    // res.json(JSON.parse(data));
    // add new note to data
    parsedNotes.push(newNote);
    // save stringify db
    fs.writeFile("./db/db.json", JSON.stringify(parsedNotes), (err) => {
      console.log(err);
      res.json(newNote);
    });
  });
  // send db json
});

app.delete("/api/notes/:id", (req, res) => {
  return fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    console.log(JSON.parse(data));

    let userNotes = JSON.parse(data);

    const fileteredNotes = userNotes.filter(
      (note) => note.id !== req.params.id
    );
    fs.writeFile("./db/db.json", JSON.stringify(fileteredNotes), () => {
      res.json({ id: req.params.id });
    });
  });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
