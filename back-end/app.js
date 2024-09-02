  var createError = require('http-errors');
  var express = require('express');
  var path = require('path');
  var cookieParser = require('cookie-parser');
  var logger = require('morgan');

  var indexRouter = require('./routes/index');
  var customerRouter = require('./routes/customer');
  var categoryRouter = require('./routes/category')
  var materialRouter = require('./routes/material')
  var productRouter = require('./routes/product')
  var adminUserRouter = require('./routes/adminUser')
  var roleRouter = require('./routes/role')

  var app = express();

  const cors = require('cors');

  const corsOptions = {
    origin: 'http://localhost:3000', // Thay đổi thành URL của frontend của bạn
    methods: 'GET,POST,PUT,DELETE', // Các phương thức HTTP được phép
    allowedHeaders: 'Content-Type,Authorization', // Các tiêu đề HTTP được phép
  };
  
  app.use(cors(corsOptions));
  



  // khai báo thư viênj
  const mongoose = require('mongoose');
  require('./models/categoryModel')  

  mongoose.connect('mongodb://localhost:27017/jewelry')
  .then(()=>console.log('================ DB connect !!!!!! ================'))
  .catch(error =>console.log('================ DB errors !!!!!! ================', error))

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'hbs');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', indexRouter);
  app.use('/customer', customerRouter);
  app.use('/category', categoryRouter);
  app.use('/material', materialRouter);
  app.use('/product', productRouter);
  app.use('/adminUser', adminUserRouter);
  app.use('/role', roleRouter);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  module.exports = app;
