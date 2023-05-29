import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";

@ObjectType() // El ObjectType se usa para saber que info responder a una petición
export class AuthResponse {

  @Field(() => String)
  token: string;
  
  @Field(() => User) // esto se puede hacer ya que User es un ObjectType
  user: User;
}