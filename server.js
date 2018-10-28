const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

const PORT = process.env.PORT || 8080;

const app = express();

app.disable('x-powered-by');
app.use(compression());
app.use(morgan('common'));

console.log(__dirname);


app.use(express.static(path.resolve(__dirname, 'build')));

// app.use('/christmas', express.static(path.resolve(__dirname, 'build')));

app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build'));
});

app.get('/christmas',function(req,res){
  // console.log("hello");
  // res.sendFile(path.resolve(__dirname, 'build'));
  res.redirect('http://christmas.th-m-val.appspot.com/');
});


app.listen(PORT, () => console.log(`Listening on port ${PORT}`))