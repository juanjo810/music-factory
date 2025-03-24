# music-factory

## Instalación del proyecto
Para instalar el proyecto, se deben instalar todas las dependencias necesarias para que funcione correctamente. Para ello se debe ejecutar en un entorno de node.js la siguiente orden con el gestor de paquetes NPM:
```
npm install
```

Esto instalará todas las dependencias necesarias

### Compilación y despliegue local del proyecto
Una vez instalada todas las dependencias, se debe desplegar el proyecto. Para realizar una prueba rápida, con un despliegue local es suficiente. Para ello se debe ejecutar el siguiente comando:
```
npm run serve
```

### Despliegue en producción
En caso de querer desplegar el proyecto en un entorno de producción, se debe construir el proyecto, para posteriormente subirlo a un servidor web. Para poder construir la web y generar los archivos para el entorno de producción se debe ejectuar:
```
npm run build
```
Posteriormente se deberán subir los ficheros generados según el servidor web utilizado.
