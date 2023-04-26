// global settings
const express = require('express');
const morgan = require('morgan');
const app = express();
const fs = require('fs');

// middleware
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello, your middleware is working!');
  // don't forget to add next()
  next();
});

// since we are using dummy json data for this project
// this allows you to read the file containing that data
const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`));

// CRUD functions
// Get all Users
const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
};

// get specific user
const getUser = (req, res) => {
  console.log(req.params);
  // allows us to convert params from string to a number value
  const id = req.params.id * 1;
  const user = users.find((el) => el.id === id);

  if (!user) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid User ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};

// create a user
const createUser = (req, res) => {
  const newId = users[users.length - 1].id + 1;
  const newUser = Object.assign({ id: newId }, req.body);
  users.push(newUser);
  // this will save the new user to our dummy data file
  fs.writeFile(`${__dirname}/data/users.json`, JSON.stringify(users), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  });
};

// update a user's information
const updateUser = (req, res) => {
  // Reminder: We're doing this in a testing environment and would never do this in production
  if (req.params.id * 1 > users.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalif User ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      user: 'User data has been updated',
    },
  });
};

// detele a user
const deleteUser = (req, res) => {
  // Reminder: We're doing this in a testing environment and would never do this in production
  if (req.params.id * 1 > users.length) {
    // by the way, you could outsorce this if() statement to prevent DRY, but this is only a demo.
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid User ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// routes
// CREATE new user
app.route('/api/v1/users').get(getAllUsers).post(createUser);
app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// server
const port = 3000;
app.listen(port, () => {
  console.log(`Running on port ${port}!`);
});
