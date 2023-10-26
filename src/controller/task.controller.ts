import { plainToInstance } from "class-transformer";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { Repository } from "typeorm";
import { AppDataSource } from "../data.source";
import Task from "../model/task";

@injectable()
export class ListController {
  private repository: Repository<Task>;

  constructor() {
    this.repository = AppDataSource.getRepository(Task);
  }

  /**
   * @openapi
   * '/task':
   *  get:
   *     tags:
   *     - Task
   *     summary: List All tasks
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *                $ref: '#/components/schemas/Task'
   *      401:
   *        description: Return when the token is invalid or expired
   */
  async list(req: Request, res: Response) {
    const result = await this.repository.find();

    return res.status(200).json(result);
  }

  /**
   * @openapi
   * '/task':
   *  post:
   *     tags:
   *     - Task
   *     summary: Add a new task
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/Task'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *             schema:
   *                $ref: '#/components/schemas/Task'
   *      400:
   *        description: Bad Request - Invalid Payload
   *      401:
   *        description: Return when the token is invalid or expired
   */
  async add(req: Request, res: Response) {
    const task = plainToInstance(Task, req.body);

    const newTask = this.repository.create(task);

    await this.repository.save(newTask);

    return res.status(200).json(newTask);
  }

  /**
   * @openapi
   * '/task/{id}':
   *  put:
   *     tags:
   *     - Task
   *     summary: Update a task
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The id of the task
   *        required: true
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/Task'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *             schema:
   *                $ref: '#/components/schemas/Task'
   *      400:
   *        description: Bad Request - Invalid Payload
   *      404:
   *        description: Not Found - Task not found
   *      401:
   *        description: Return when the token is invalid or expired
   */
  async update(req: Request, res: Response) {
    const task = plainToInstance(Task, req.body);
    const { id } = req.params;

    await this.repository.update(id, task);

    const result = await this.repository.findOne({ where: { id } });

    if (!result) {
      res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(result);
  }

  /**
   * @openapi
   * '/task/{id}/done':
   *  patch:
   *     tags:
   *     - Task
   *     summary: Mark a task as done
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The id of the task
   *        required: true
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              properties:
   *                id:
   *                  type: string
   *                  description: The task identifier
   *                message:
   *                  type: string
   *                  default: Task doned successfully
   *      400:
   *        description: Bad Request - Invalid Payload
   *      404:
   *        description: Not Found - Task not found
   *      401:
   *        description: Return when the token is invalid or expired
   */
  async done(req: Request, res: Response) {
    const { id } = req.params;

    const task = await this.repository.findOne({ where: { id } });

    if (!task) {
      return res.status(404).send({ message: `Task ${id} was not found` });
    }

    task.done = true;

    await this.repository.save(task);

    return res.status(200).send({
      id,
      message: "Task doned successfully",
    });
  }

  /**
   * @openapi
   * '/task/{id}':
   *  delete:
   *     tags:
   *     - Task
   *     summary: Delete a task
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The id of the task
   *        required: true
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              properties:
   *                deleted:
   *                  type: boolean
   *      400:
   *        description: Bad Request - Invalid Payload
   *      401:
   *        description: Return when the token is invalid or expired
   */
  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const deleted = await this.repository.delete(id);

    return res.status(200).send({ deleted: deleted.affected });
  }
}
