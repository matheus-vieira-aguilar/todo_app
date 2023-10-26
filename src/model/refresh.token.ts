import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
* @openapi
* components:
*   schemas:
*     RefreshToken:
*       type: object
*       properties:
*         id:
*           type: string
*           format: uuid
*           description: The unique identifier for the refresh token.
*         expiresIn:
*           type: string
*           default: "1d"
*           description: token experied period.
*         userId:
*           type: string
*           description: The user identifier related to the refresh token.
*       required:
*         - id
*         - userId
*/
@Entity("refresh_tokens")
export default class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  expiresIn: string = "1d";

  @Column()
  userId: string;
}
