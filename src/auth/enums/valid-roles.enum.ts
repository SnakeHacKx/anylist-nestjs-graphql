import { registerEnumType } from "@nestjs/graphql";

export enum ValidRoles {
  admin = 'admin',
  user = 'user',
  superUser = 'superUser'
}

// Esto es necesario para que GraphQL conozca este enum y se pueda asignar como tipo de dato
registerEnumType(ValidRoles, {name: 'ValidRoles'});