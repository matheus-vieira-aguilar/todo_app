import { IsOptional, IsBoolean, IsDate, IsString, IsDefined } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
* @openapi
* components:
*   schemas:
*     Task:
*       type: object
*       properties:
*         id:
*           type: string
*           format: uuid
*           description: The unique identifier for the task.
*         title:
*           type: string
*           description: The title of the task.
*         description:
*           type: string
*           description: The description of the task.
*         created_at:
*           type: string
*           format: date-time
*           description: The date and time when the task was created.
*         done:
*           type: boolean
*           default: false
*           description: Indicates whether the task is marked as done.
*       required:
*         - title
*         - description
*/
@Entity("tasks")
export default class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @IsString()
  @IsDefined()
  title: string;
  
  @Column()
  @IsString()
  @IsDefined()
  description: string;

  @Column()
  @IsOptional()
  @IsDate()
  created_at: Date = new Date();

  @Column()
  @IsOptional()
  @IsBoolean()
  done: boolean = false;
}
