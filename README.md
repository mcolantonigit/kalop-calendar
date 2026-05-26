# Kalop - Sistema de Gestión de Comedor Corporativo

Aplicación web desarrollada para la gestión y visualización del cronograma mensual de comidas del comedor corporativo de Kalop.

El sistema permite a los empleados consultar el calendario de comidas de forma dinámica, mientras que los administradores cuentan con un panel de gestión completo para administrar usuarios, comidas, cronogramas y personalización visual del sistema.

---

## Características

- Calendario dinámico de comidas
- Sistema de autenticación de usuarios
- Registro e inicio de sesión
- Recuperación y blanqueo de contraseñas
- Panel administrativo protegido
- Gestión de tipos de comidas
- Carga y edición de cronogramas mensuales
- Configuración de fondos personalizados
- Personalización de colores temáticos por mes
- Backend desarrollado con Node.js y Express.js

---

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- Cookie Parser
- Middleware de autenticación/autorización

---

## Estructura del proyecto

```bash
project/
│
├── controllers/
├── middlewares/
├── pages/
├── public/
├── resources/
└── index.js
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/USUARIO/REPOSITORIO.git
```

### 2. Ingresar al proyecto

```bash
cd REPOSITORIO
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Iniciar el servidor

```bash
npm start
```

El servidor se ejecutará en:

```txt
http://localhost:4000
```

---

## Rutas principales

| Ruta | Descripción |
|---|---|
| `/` | Calendario principal |
| `/login` | Inicio de sesión |
| `/register` | Registro de usuarios |
| `/admin` | Panel administrativo |
| `/cronograma` | Gestión de cronograma |
| `/comidas` | Gestión de comidas |
| `/fondos` | Configuración visual |

---

## Objetivo del proyecto

Centralizar la gestión del comedor corporativo mediante una plataforma web intuitiva, configurable y accesible desde distintos dispositivos dentro de la red de la empresa.

---

## Autor

Desarrollado por Matías Colantoni.
