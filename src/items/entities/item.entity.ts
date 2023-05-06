import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'Identificador unico' })
  id: string;

  @Column()
  @Field(() => String, { description: 'Nombre del item' })
  name: string;

  @Column()
  @Field(() => Float, {
    description: 'Cantidad que se tiene en el carrito de compras',
  })
  quantity: number;

  @Column({ nullable: true })
  @Field(() => String, {
    description: 'Unidad de medida para la cantidad (g, ml, kg...)',
    nullable: true,
  })
  quantityUnits?: string;
}
