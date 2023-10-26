import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsDefined, IsEmail, IsString } from "class-validator";
import bcrypt from "bcryptjs";

/**
* @openapi
* components:
*   schemas:
*     User:
*       type: object
*       properties:
*         id:
*           type: string
*           format: uuid
*           description: The unique identifier for the user.
*         email:
*           type: string
*           format: email
*           description: The user's email address.
*         password:
*           type: string
*           description: The user's password.
*       required:
*         - email
*         - password
*/
@Entity("users")
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @IsDefined()
  @IsEmail()
  @IsString()
  email: string;

  @Column()
  @IsDefined()
  @IsString()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }
}
