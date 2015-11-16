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


### Models and Schemas
Now we need to define our schema. Before we do that, I'm going to have to explain the application that I'll be working on. The model and schema will look different for your application.

NOW is a website, where you input whatever you're doing at the moment, in the form of a hashtag, and it will tell you how many others around the world, are doing the same thing as you.

We are going to use the model forlder that we created earlier to form out objects. Create a new file and call it the plural of whatever your object is going to be called. In my case it will be `activities.js`.

Each `activity` is going to have a `tag`, `created`, `expires`, `isOn`, `count` field. Add the following code to the `activities.js` file.
```js
var mongoose = require('mongoose');
var activitySchema = new mongoose.Schema({
	tag: String,
	created: Date,
	expires: Date,
	count: Number,
	isOn: Boolean
});
```

Make sure to add this file to your `app.js` right after the db variable.

### Add the Contoller
We will put all of our controller file under the routes folder of our directory, by convention.

So create a file called `activities.js` under routes. In it we wiill define the dependecy packages first:
```js
var express = require('express'),
	router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST
```

Next we will have to make sure every request goes through our method-override library. This code copied from method-override (read more about it online, if you wish).
```js
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))
```

Now we have to start building our Creat, Read, Update, and Delete (CRUD) functionalities. Let's start with writing a `GET`ter that gets all the activities from the database and displays it.

Include this code after the method-override in activity.js:
```js
router.route('/')
	// GET all activities
	.get(function(req, res, next) {
		//retrieve the activities from mongo
		mongoose.model('Activity').find({}, function (err, activities) {
			if (err) {
				return console.error(err);
			} else {
				res.format({
					// html format response
					html: function() {
						res.render('activities/index', {
							title: 'All activities',
							"activities": activities
						});
					},
					// json format response
					json: function() {
						res.json(infophotos);
					}
				})
			}
		})
	})
```

So that's the getter. Now we need a way to create new entires in the db. So we need a POST function in the same router function. So add the following code after the end of the `get` function abve.
```js
// POST a new activity
	.post(function (reg, res) {
		 // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
		 var tag = req.body.tag;
		 var created = req.body.created;
		 // 30 mins after created -- this doesn't come form forms
		 // so we calculate the value here
		 var expires = new Date(created.getTime() + diff*60000);
		 // if the form is submitted jsut now, it is on!
		 var isOn = true;
		 var count = count + 1;

		 // create an entry in the db
		 mongoose.model('Activity').create({
		 	tag: tag,
		 	created: created,
		 	expires: expires,
		 	isOn: isOn,
		 	count: count
		 }, function (err, activity) {
		 	if (err) {
		 		res.send("There was a problem adding the entry to the DB!")
		 	} else {
		 		// Activity is created in the DB
		 		console.log('POST creating new Activity: ', activity);
		 		res.format({
		 			//HTML response will set the location and redirect back to 
		 			//the home page.
		 			html: function () {
		 				// set the header
		 				res.location('activities');
		 				// forward to success page
		 				res.redirect('/activities');
		 			},
		 			// json res will show the newly added Activity
		 			json: function () {
		 				res.json(activity);
		 			}
		 		});
		 	}
		 })
	});
```








