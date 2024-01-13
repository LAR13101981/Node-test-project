// Routes imports
import express from 'express';
import userRouter from './routes/userRoutes';
import postRouter from './routes/postsRoutes';
import commentRouter from './routes/commentsRoutes';

import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));

app.use(express.json());

// app.use((req, res, next) => {
//   res.header('Acces-Control-Allow-Origin', '*');
//   next();
// });

// Routes for collections that should handle requests
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

// Catching errors that are not catch by collections
app.use((req, res, next) => {
  const error = new Error('Not Found');
  res.status(404);
  next(error);
});

app.use((error: any, req: any, res: any, next: any) => {
  res.status(500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

export default app;
