import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'ID único del usuario' })
  id: string;

  @Column()
  @Field(() => String, { description: 'Nombre completo' })
  fullName: string;

  @Column({ unique: true })
  @Field(() => String, { description: 'Correo electrónico' })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  @Field(() => [String], { description: 'Roles de usuario' })
  roles: string[];

  @Column({
    type: 'boolean',
    default: true
  })
  @Field(() => Boolean, { description: 'Indica si el usuario está activo o no en la aplicación' })
  isActive: boolean;

  //TODO: relaciones y otras propiedades
}
