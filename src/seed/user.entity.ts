import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Group } from '../user-types/groups/entities/group.entity';
import { Company } from '../user-types/companies/entities/company.entity';
import { Person } from '../user-types/persons/entities/person.entity';
import { ServicesProfile } from '../profiles/services-profile/entities/services-profile.entity';
import { EmployerProfile } from '../profiles/employer-profile/entities/employer-profile.entity';
import { Testimonial } from '../profiles/testimonials/entities/testimonial.entity';
import { Follower } from '../followers/entities/follower.entity';
import { Certification } from '../certifications/entities/certification.entity';
import { Address } from '../../addresses/entities/address.entity';
import { RecommendedUser } from '../recommended-users/entities/recommended-user.entity';
import { Language } from '../languages/entities/language.entity';
import { SocialNetwork } from '../social-networks/entities/social-network.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { PostLike } from '../../posts/post-likes/entities/post-like.entity';

@Entity({ name: 'user' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'UUID del usuario' })
  id: string;

  @Column({ unique: true })
  @Field(() => String, { description: 'Nombre de usuario' })
  username: string;

  @Column({ unique: true })
  @Field(() => String, { description: 'Correo electrónico' })
  email: string;

  @Column()
  password: string;

  @Column()
  @Field(() => String, { description: 'Tipo de usuario' })
  type: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user'],
  })
  @Field(() => [String], { description: 'Tipo de usuario' })
  roles: string[];

  @Column({ nullable: true })
  @Field(() => String, { description: 'Foto de perfil', nullable: true })
  avatar?: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  @Field(() => Boolean, {
    description: 'Indica si el usuario está recibiendo respuestas',
  })
  isReceivingProposals: boolean = true;

  @Column({ nullable: true })
  @Field(() => String, { description: 'Video de presentación', nullable: true })
  presentationVideo?: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  @Field(() => Boolean, {
    description: 'Indica si el usuario está activo en la base de datos',
  })
  isActive: boolean = true;

  @Column({
    type: 'boolean',
    default: false,
  })
  @Field(() => Boolean, {
    description:
      'Indica si el usuario está registrado a través la API de Google',
  })
  isGoogleUser: boolean = false;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  @Field(() => String, { description: 'Fecha de creación' })
  createdAt: string;

  @Column({ default: false })
  @Field(() => Boolean, { description: 'Indica si el usuario es premium' })
  isPremium: boolean = false;

  //* Relacion de muchos a uno en una misma tabla
  @ManyToOne(() => User, (user) => user.lastUpdateBy, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'lastUpdteBy' })
  @Field(() => User, {
    nullable: true,
    description: 'Último usuario que actualizó el registro',
  })
  lastUpdateBy?: User;

  @OneToOne(() => Person, (person) => person.user, {
    nullable: true,
    eager: true,
  })
  @Field(() => Person, {
    description: 'Información del tipo: persona',
    nullable: true,
  })
  person?: Person;

  @OneToOne(() => Company, (company) => company.user, {
    nullable: true,
    eager: true,
  })
  @Field(() => Company, {
    description: 'Información del tipo: compañía',
    nullable: true,
  })
  company?: Company;

  @OneToOne(() => Group, (group) => group.user, {
    nullable: true,
    eager: true,
  })
  @Field(() => Group, {
    description: 'Información del tipo: grupo',
    nullable: true,
  })
  group?: Group;

  @OneToOne(() => ServicesProfile, (servicesProfile) => servicesProfile.user, {
    nullable: true,
    eager: true,
  })
  @Field(() => ServicesProfile, {
    description: 'Información del perfil de servicios o empleado',
    nullable: true,
  })
  servicesProfile?: ServicesProfile;

  @OneToOne(() => EmployerProfile, (employerProfile) => employerProfile.user, {
    nullable: true,
    eager: true,
  })
  @Field(() => EmployerProfile, {
    description: 'Información del perfil de empleador',
    nullable: true,
  })
  employerProfile?: EmployerProfile;

  @OneToOne(() => Address, (address) => address.user, {
    eager: true,
    nullable: true,
  })
  @Field(() => Address, {
    description: 'Dirección residencial o del trabajo',
    nullable: true,
  })
  address?: Address;

  // @Column({ unique: true, nullable: false })
  // @Field(() => String, { description: 'Foto de perfil' })
  // slug: string;

  @OneToMany(() => Testimonial, (testimonial) => testimonial.createdBy, {
    lazy: true,
  })
  // @Field(() => [Testimonial], {
  //   description: 'Testimoniales que le han dejado al usuario',
  // })
  testimonials: Testimonial[];

  @OneToMany(() => Follower, (follower) => follower.following)
  @Field(() => [Follower], {
    description: 'Seguidores',
  })
  followers: Follower[];

  @OneToMany(() => Follower, (follower) => follower.follower)
  @Field(() => [Follower], {
    description: 'Siguiendo',
  })
  following: Follower[];

  @OneToMany(() => Certification, (certification) => certification.user, {
    lazy: true,
  })
  @Field(() => [Certification], {
    description: 'Certificaciones y/o diplomas',
  })
  certifications: Certification[];

  @OneToMany(
    () => RecommendedUser,
    (recommendUser) => recommendUser.recommended,
  )
  // @Field(() => [RecommendedUser], {
  //   description: 'Usuarios recomendados',
  // })
  recommended: RecommendedUser[];

  @OneToMany(
    () => RecommendedUser,
    (recommendUser) => recommendUser.recommender,
  )
  // @Field(() => [RecommendedUser], {
  //   description: 'Usuarios que recomiendan a este usuario',
  // })
  recommender: RecommendedUser[];

  @OneToMany(() => Language, (lang) => lang.user, {
    lazy: true,
  })
  @Field(() => [Language], {
    description: 'Idiomas dominados por el usuario',
  })
  languages: Language[];

  @OneToMany(() => SocialNetwork, (socialNetwork) => socialNetwork.user, {
    lazy: true,
  })
  @Field(() => [SocialNetwork], {
    description: 'Redes sociales del usuario',
  })
  socialNetworks: SocialNetwork[];

  @OneToMany(() => Post, (post) => post.createdBy, {
    lazy: true,
  })
  @Field(() => [Post], {
    description: 'Posts del usuario',
  })
  posts: Post[];

  @OneToMany(() => PostLike, (postLike) => postLike.likedBy, {
    lazy: true,
    // nullable: true,
  })
  @Field(() => [PostLike], {
    description: 'Posts a los que le ha dado me gusta este usuario',
    // nullable: true,
  })
  postLike: PostLike[];

  @OneToMany(() => Comment, (comment) => comment.createdBy, {
    lazy: true,
    // nullable: true,
  })
  // @Field(() => [Comment], {
  //   description: 'Posts a los que le ha dado me gusta este usuario',
  //   // nullable: true,
  // })
  comments: Comment[];
}
