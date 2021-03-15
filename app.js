const express               = require('express'),
      path                  = require('path'),
      bodyParser            = require('body-parser'),
      passport              = require('passport'),
      mongoose              = require('mongoose'),
      config                = require('./config/database'),
      app                   = express(),
      // Routes
      user                  = require('./routes/user'),
      admin                 = require('./routes/admin'),
      instructor            = require('./routes/instructor'),
      courses               = require('./routes/courses'),
      chapters              = require('./routes/chapters'),
      lectures              = require('./routes/lectures'),
      questions             = require('./routes/questions'),
      responses             = require('./routes/responses'),
      announcements         = require('./routes/announcements'),
      comments              = require('./routes/comments'),
      reports               = require('./routes/reports'),
      images                = require('./routes/images');

// TODO : implement angular universal
// TODO : find out why the public folder keep getting Deleted
// TODO : find out how to refresh JWT

// TODO: add the video preview path for course
// TODO: upgrade badge schema
// TODO: check whether the required and index feilds are necessary for email in user schema
// TODO: should categories be deletable?
// TODO: Send better errors
// TODO: Select which data to be sent on all routes
// TODO: when course is deleted, delete all related lectures.
// TODO: add safety check so that I do not delete course by accident
// TODO: when chapter is deleted relocate all lectures inside to a new chapter
// TODO: store all attempts (successful and failed) to login as instructor or admin
// TODO: store errors in db
// TODO: add comments and responses routes to show individual responses or comments (useful for reporting)

// Connect To Database
mongoose.connect(config.database, {
  useMongoClient: true,
});

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+ config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+ err);
});

// Remove depreciation warning
// TODO: find out what this does really
mongoose.Promise = Promise;

// TODO: I have removed CORS middleware.. do I need it? is the following function enough? read more on cors!
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// This is to allow pasting images into question/answer
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '5mb'}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/user', user);
app.use('/admin', admin);
app.use('/instructor', instructor);
app.use('/courses', courses);
app.use('/chapters', chapters);
app.use('/lectures', lectures);
app.use('/questions', questions);
app.use('/responses', responses);
app.use('/announcements', announcements);
app.use('/comments', comments);
app.use('/reports', reports);
app.use('/images', images);

// TODO: what is this?
// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

// TODO: which to use?
// app.get('*', (req, res) => {
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

module.exports = app;
