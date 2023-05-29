import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, MinLength } from "class-validator";

@InputType() // El InputType se usa para saber dejar claro que tiene que ingresar el usuario
export class LoginInput {

  @Field(() => String)
  @IsEmail()
  email: string;
  
  @Field(() => String)
  @MinLength(6)
  password: string;
}