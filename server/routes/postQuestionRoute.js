import express from 'express';
import postQuestion from '../controller/postQuestionController.js'

const postQuestionRouter = express.Router();

postQuestionRouter.post("/questions", postQuestion);


export default postQuestionRouter;