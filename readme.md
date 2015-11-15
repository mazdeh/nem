# How to Create A Simple Webapp using Node, Express, and Mongodb

If you don't know anything about Node, or Express, you should checkout my tutorial on Express.js.

In this tutorial we're going to connect a Node app with an Express server to a NoSQL database (mongodb).

### Setup the Skeleton of Our Webapp
I assume you have `npm` installed on your computer already.


We're going to use the `express-generator` library in this tutorial, to get a simple directory structure for out simple web application.

To get access to the `express` command in our terminal, and also create our directory structure, run the followin commands:

```js
npm install -g express
npm install -g express-generator
```

Now run the following command and you will get a simple directory structure from express-generator. This will be using a templating library called `Jade`. There are of course other templating libraries that you can use, but Jade is pretty simple, so we'll just use it for this tutorial.

```js
express YourProjectName
```

You should now see a new directory called `YourProjectName` in your root directory. This directory contains the skeleton of our web app -- and everything is already set up for us!

### Setup the Database -- MongoDB
If you don't have Mongo installed on your computer, run the following command on your Mac:

```js
brew update
brew install mongodb
```

Now that you have Mongodb installed on your computer, let's start the mongodb server:

```js
mongod
```

Your mongodb server is now running on port 27017, by default.
Now we need to create the database for our app. Open up a new terminal window and enter the mongo client shell by typing `mongo`.
Now let's create our new db, by typing:
```js
use YourDBName
```

#### Include the DB
Let's start clean. Create a folder in `YourProjectName` directory and call it `model`. Inside this folder, create a new file called `db.js`. This is where we will write all of our db connections.

Your `db.js` file should look like this:
```js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/yourprojectname');
```

Don't forget to include our `db.js` file in `app.js`.
```js
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./model/db');
var routes = require('./routes/index');
var users = require('./routes/users');
```

### Install Dependencies
Now that our skeleton looks good with models, views, and routes folders, let's install the dependencies.
`cd` into `YourProjectName` folder and type in `npm install` to install all the dependencies. If you want to know what dependencies have come by default when you created your project directory with `express-generator`, you can look at the `package.json` file. (this should make sense to you, if you've already looked at my previous tutorial on `express.js`).

We need a couple more libraries that we need to install before we can move on. `mongoose` is our connection to  our MongoDB, and `method-override` is simple HTTP library. Let's install these dependancies and also save them to the `package.json` file, by running the follwing commands:
```
npm install mongoose --save
npm install method-override --save
```

This is the end of level 1 of our webapp. Type in `npm start` in your console, and check `localhoset:3000` in your browser to make sure everything is looking right.






