
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const port = 5000;

const app = express();
//middleware

app.use(cors());
app.use(express.json());

//
let DB = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'postbook2'
});

DB.connect((err) => {
  if (err) {
    console.log("Something went wrong to connecting server...", err);
  }
  else {
    console.log("Server connect successfully...");
  }
})

//getting  user data from server

app.post('/getUserInfo', (req, res) => {

  const { userId, password } = req.body;

  const getUserInfosql = `SELECT userId, userName, userImage FROM users WHERE users.userId = ? AND users.userPassword = ?`;

  let query = DB.query(getUserInfosql, [userId, password], (err, result) => {
    if (err) {
      console.log("Error getting user info from server: ", err);
      throw err;
    }
    else {
      res.send(result);
    }
  });
});

app.get('/getAllPost', (req, res) => {
  const sqlForAllPost = `SELECT users.userName AS postedUserName, users.userImage AS postedUserImage, posts.postId, posts.postedTime, posts.postedText, posts.postedImageUrl FROM posts INNER JOIN users ON posts.postedUserId=users.userId ORDER BY posts.postedTime DESC`;

  let query = DB.query(sqlForAllPost, (err, result) => {
    if (err) {
      console.log("Error loaading all posts from database: ", err);
      throw err;
    }
    else {
      console.log(result);
      res.send(result);
    }
  });
});

//getting comments of a single post
app.get('/getAllComments/:postId', (req, res) => {
  let id = req.params.postId;
  let sqlForAllComments = `SELECT users.userName AS commentedUserName, users.userImage AS commentedUserImage, comments.commentId, comments.commentOfPostId, 
comments.commentText, comments.commentedTime FROM comments INNER JOIN users on comments.commentedUserId=users.userId 
WHERE comments.commentOfPostId = ${id}`;

  let query = DB.query(sqlForAllComments, (err, result) => {
    if (err) {
      console.log("Error fetching from the database: ", err);
      throw err;
    }
    else {
      res.send(result);
    }
  });
});

//adding a new comment to a post
app.post("/postComment", (req, res) => {
  const { commentOfPostId, commentedUserId, commentedTime, commentText } = req.body;

  let sqlForAddingNewComments = `INSERT INTO comments (commentId, commentOfPostId, commentedUserId, commentedTime, commentText) VALUES (NULL, ?, ?, ?, ?);`;

  let query = DB.query(
    sqlForAddingNewComments,
    [commentOfPostId, commentedUserId, commentedTime, commentText],
    (err, result) => {
      if (err) {
        console.log("Error adding comment to the database: ", err);
      }
      else {
        res.send(result);
      }
    });
});


//adding a new post to the server
app.post("/addNewPost", (req, res) => {

  // Destructure the req.body object
  const { postedUserId, postedTime, postedText, postedImageUrl } = req.body;

  //sql query
  let sqlForAddingNewPost = `INSERT INTO posts (postId, postedUserId, postedTime, postedText, postedImageUrl) VALUES (NULL, ?, ?, ?, ?);`;

  let query = DB.query(sqlForAddingNewPost, [postedUserId, postedTime, postedText, postedImageUrl], (err, result) => {
    if (err) {
      console.log("Error adding new post: ", err);
      throw err;
    }
    else {
      res.send(result);
    }
  });
});

app.put("/updatePost/:postId", (res, req) => {
  const { postId, postedText, postedImageUrl } = req.body;

  let sqlForEditPost = `UPDATE posts SET postedText= ?,postedImageUrl= ? WHERE postId=?;`;

  let query = DB.query(sqlForEditPost, [postId, postedText, postedImageUrl], (err, result) => {
    if (err) {
      console.log("Error editing post: ", err);
      throw err;
    }
    else {
      res.send(result);
    }
  });
});

app.delete("/deletePost/:postId", (req, res) => {
  const postId = req.params.postId;

  let sqlForDeletePost = `DELETE FROM posts WHERE postId = ?;`;

  let query = DB.query(sqlForDeletePost, [postId], (err, result) => {
    if (err) {
      console.log("Error fetching while delete post: ", err);
      throw err;
    }
    else {
      res.send(result);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
