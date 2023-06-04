import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
    default: ['user'],
  })
  @Field(() => [String], { description: 'Roles de usuario' })
  roles: string[];

  @Column({
    type: 'boolean',
    default: true,
  })
  @Field(() => Boolean, {
    description: 'Indica si el usuario está activo o no en la aplicación',
  })
  isActive: boolean;

  //TODO: relaciones
  // eager me permite cargar las relacions automaticamente, pero solo funciona en una sola via,
  // es decir, de una tabla a otra. El lazy me permite esto mismo pero en una sola tabla
  // lo cual es lo que necesito en este caso
  @ManyToOne(() => User, (user) => user.lastUpdateBy, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'lastUpdateBy' }) // name: nombre de la columna en postgres
  @Field(() => User, {
    nullable: true,
    description: 'ID del último usuario que editó a un usuario específico',
  })
  lastUpdateBy?: User;

  @OneToMany(() => Item, (item) => item.user, { lazy: true })
  @Field(() => [Item], {
    description: 'Items que posee el usuario',
  })
  items: Item[];
}
