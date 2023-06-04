<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Dev

1. Clonar el proyecto.
2. Copiar el ```env.template``` y renombrar a ```.env```
3. Ejecutar
```
yarn install
```
4. Levantar la imagen (Docker Desktop debe estar en ejecución)
```
docker-compose up -d
```
5. Levantar el backend de NestJS
```
yarn start:dev
```
6. Visitar el sitio
```
localhost:3000/graphql
```

7. Ejecutar la mutación ```executeSeed``` para llenar la base de datos con información
