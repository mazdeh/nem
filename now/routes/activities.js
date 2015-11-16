var express = require('express'),
	router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

router.route('/')
	// GET all activities
	.get(function (req, res, next) {
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
	// POST a new activity
	.post(function (req, res) {
		 // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
		 var tag = req.body.tag;
		 var created = new Date();
		 // 30 mins after created -- this doesn't come form forms
		 // so we calculate the value here
		 // var expires = new Date(created.getTime() + diff*60000);
		 // if the form is submitted jsut now, it is on!
		 var isOn = true;
		 var count = 1;

		 // create an entry in the db
		 mongoose.model('Activity').create({
		 	tag: tag,
		 	created: created,
		 	// expires: expires,
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

/* GET New Activity page */
router.get('/new', function (req, res) {
	res.render('activities/new', {title: 'Add New Activity'});
});

router.param('id', function (req, res, next, id) {
	console.log('validating ', id);
	// find the id in the db
	mongoose.model('Activity').findById(id, function (err, activity) {
		if (err) {
			console.log(id, 'wasn not fount');
			res.status(400);
			var err = new Error('Not Found');
			err.status = 404;
			res.format({
				html: function () {
					next(err);
				},
				json: function () {
					res.json({message: err.status + ' ' + err});
				}
			});
		} else {
			req.id = id;
			next();
		}
	})
});

// get an entry by id from the db
router.route('/:id')
	.get(function (req, res) {
		mongoose.model('Activity').findById(req.id, function (err, activity) {
			if (err) {
				console.log("GET Eroor: There was a problem retrieving: ", err);
			} else {
				console.log('GET Retreiving ID: ', activity._id);
				var activityTag = activity.tag;
				res.format({
					html: function() {
						res.render('activities/show', {
							"activitytag": activitytag,
							"activity": activity
						})
					},
					json: function() {
						res.json(activity);
					}
				})
			}
		})
	});

module.exports = router;