import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'Identificador único' })
  id: string;

  @Column()
  @Field(() => String, { description: 'Nombre del item' })
  name: string;

  // @Column()
  // @Field(() => Float, {
  //   description: 'Cantidad que se tiene en el carrito de compras',
  // })
  // quantity: number;

  @Column({ nullable: true })
  @Field(() => String, {
    description: 'Unidad de medida para la cantidad (g, ml, kg...)',
    nullable: true,
  })
  quantityUnits?: string;

  @ManyToOne(() => User, (user) => user.items, {nullable: false, lazy: true})
  // Maneja un indice para que cuando se haga una consulta, se sepa que se va a 
  // hacer por esta columna y las consultas sean mas rapidas
  @Index('userId-index') 
  @Field(() => User, {
    description: 'Usuario que tiene el item',
  })
  user: User;
}
