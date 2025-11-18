const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://Nareenharsha:180705@reforge.dkajwhs.mongodb.net/?retryWrites=true&w=majority&appName=Reforge', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Error:', err));

// Profile Schema
const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  bio: String,
  skills: String,
  experience: String,
  education: String,
  createdAt: { type: Date, default: Date.now }
});

const Profile = mongoose.model('Profile', profileSchema);

// Routes
app.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });
    res.render('index', { profiles });
  } catch (err) {
    res.status(500).send('Error loading profiles');
  }
});


app.get('/create', (req, res) => {
  res.render('create');
});


app.post('/profile', async (req, res) => {
  try {
    const newProfile = new Profile({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      bio: req.body.bio,
      skills: req.body.skills,
      experience: req.body.experience,
      education: req.body.education
    });
    await newProfile.save();
    res.redirect('/');
  } catch (err) {
    res.status(400).send('Error creating profile');
  }
});


app.get('/profile/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    res.render('profile', { profile });
  } catch (err) {
    res.status(404).send('Profile not found');
  }
});


app.get('/edit/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    res.render('edit', { profile });
  } catch (err) {
    res.status(404).send('Profile not found');
  }
});


app.post('/profile/update/:id', async (req, res) => {
  try {
    await Profile.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      bio: req.body.bio,
      skills: req.body.skills,
      experience: req.body.experience,
      education: req.body.education
    });
    res.redirect('/profile/' + req.params.id);
  } catch (err) {
    res.status(400).send('Error updating profile');
  }
});


app.post('/profile/delete/:id', async (req, res) => {
  try {
    await Profile.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    res.status(400).send('Error deleting profile');
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});