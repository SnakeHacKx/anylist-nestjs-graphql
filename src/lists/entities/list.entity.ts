import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Index } from 'typeorm';

@ObjectType()
export class List {
  @Field(() => ID, { description: 'Identificador único de la lista' })
  id: string;
  
  @Field(() => String, { description: 'Nombre de la lista' })
  name: string;

  // @ManyToOne(() => User, (user) => user.items, {nullable: false, lazy: true})
  // Maneja un indice para que cuando se haga una consulta, se sepa que se va a 
  // hacer por esta columna y las consultas sean mas rapidas
  @Index('userId-index') 
  @Field(() => User, {
    description: 'Usuario que tiene la lista',
  })
  user: User;
}
