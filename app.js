const express = require('express');
const path = require('path');
const flash = require('express-flash');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

const frontendRouter = require('./routes/frontend');
const backendRouter = require('./routes/backend');
const apiRouter = require('./routes/api');

const app = express();
const port = process.env.PORT || 5050;
const host = process.env.HOST || '192.168.1.214';

// Middleware
app.use(express.json());
app.use(express.static('assets'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: false}));

// Template Engine
app.use(expressLayouts);
app.set('layout', './layouts/frontend');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Session and Flash
app.use(session({
    cookie: {maxAge: 60000},
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: 'true',
    secret: process.env.SESSION_SECRET || 'secret'
}));
app.use(flash());

// Routes
app.use('/', frontendRouter);
app.use('/backend', backendRouter);
app.use('/api', apiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});