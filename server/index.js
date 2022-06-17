/* eslint consistent-return:0 import/order:0 */
const express = require('express');
const logger = require('./logger');

const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
    ? require('ngrok')
    : false;
const { resolve } = require('path');
var bodyParser = require('body-parser')
const app = express();

const fnames = ['Alize', 'Quinn', 'Harvey', 'Kyndal', 'Braeden', 'Paloma', 'Sheyla', 'Amberly', 'Larry', 'Thea'];
const lnnames = ['Slone', 'Mehta', 'Byrd', 'Wenger', 'Hilliard', 'Stubbs', 'Helms', 'Mott', 'Ibarra', 'Brumfield'];
let students = [];

function ordinal_suffix_of(i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}

for (let i = 0; i < 20; i++) {
  let grade = Math.floor(Math.random() * 12) + 1;
  students.push({
    fname: fnames[Math.floor(Math.random() * 10)],
    lname: lnnames[Math.floor(Math.random() * 10)],
    email: `test${i}@school.com`,
    age: grade + 6,
    grade: ordinal_suffix_of(grade)
  })
}

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

app.use(express.json());

app.get('/api/students', async (req, res) => {
  res.status(200).send(students);
});

app.get('/api/student/:studentId', async (req, res) => {
  if (req.params.studentId >= 0)
    res.status(200).send(students[req.params.studentId]);
  else
    res.status(400).send();
});

app.delete('/api/student/:studentId', async (req, res) => {
  if (req.params.studentId >= 0) {
    students.splice(req.params.studentId, 1);
    res.status(200).send();
  }
  else
    res.status(400).send();
});

app.post('/api/student', async (req, res) => {
  try {
    students.push({
      fname: req.body.student.fname,
      lname: req.body.student.lname,
      email: req.body.student.email,
      age: req.body.student.age,
      grade: req.body.student.grade
    });
    res.status(200).send();
  } catch {
    res.status(400).send();
  }
});

app.put('/api/student/:studentId', async (req, res) => {
  try {
    students[req.params.studentId] = {
      fname: req.body.student.fname,
      lname: req.body.student.lname,
      email: req.body.student.email,
      age: req.body.student.age,
      grade: req.body.student.grade
    };
    res.status(200).send();
  } catch {
    res.status(400).send();
  }
});

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// use the gzipped bundle
app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz'; // eslint-disable-line
  res.set('Content-Encoding', 'gzip');
  next();
});

// Start your app.
app.listen(port, host, async err => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    let url;
    try {
      url = await ngrok.connect(port);
    } catch (e) {
      return logger.error(e);
    }
    logger.appStarted(port, prettyHost, url);
  } else {
    logger.appStarted(port, prettyHost);
  }
});
