import express from "express";

export const buildCrudRouter = (controller, middlewares = []) => {
  const router = express.Router();
  router.route('/').get(...middlewares, controller.getAll).post(...middlewares, controller.create);
  router.route('/:id').get(...middlewares, controller.getOne).put(...middlewares, controller.update).delete(...middlewares, controller.remove);
  return router;
};
