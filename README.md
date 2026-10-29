# 🏋️ Ferreira Fitness GYM — Web Comercial & Sistema de Recepción

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-Realtime_DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Ecosistema web completo para **Ferreira Fitness GYM** compuesto por una **Landing Page comercial de alta conversión** y un **Sistema de Recepción y Control de Acceso** sincronizado en tiempo real con una base de datos relacional en la nube (**Supabase / PostgreSQL**).

---

## 📸 Capturas de la Plataforma

<div align="center">
  <img src="assets/img/hero_gym.jpg" alt="Hero Principal Ferreira Fitness" width="85%" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
</div>

<br/>

<div align="center">
  <img src="assets/img/maquinas_nueva.jpg" alt="Área de Máquinas" width="42%" style="border-radius: 6px; margin: 4px;" />
  <img src="assets/img/experiencia_nueva.jpg" alt="Instalaciones del Gimnasio" width="42%" style="border-radius: 6px; margin: 4px;" />
</div>

---

## 🚀 Módulos del Sistema

### 1. Landing Page Comercial (`index.html`)
* **Diseño Responsivo:** Adaptado a dispositivos móviles, tablets y monitores de escritorio.
* **Catálogo Visual de Planes y Suplementos:** Presentación interactiva de membresías, servicios de entrenadores y tienda deportiva.
* **Tracker de Métricas de Progreso (`tracker.js`):** Script para medir la interacción de los usuarios y prospectos con las diferentes secciones del sitio.

### 2. Módulo de Recepción y Control de Socios (`recepcion.html`)
* **Panel Administrativo:** Permite a la recepción del gimnasio registrar el acceso de los miembros, validar planes activos y consultar membresías.
* **Sincronización en Tiempo Real:** Integración con **Supabase Realtime** para actualizar el estatus de socios y rutinas de manera instantánea entre la app móvil de los entrenadores y la pantalla de recepción.
* **Políticas de Seguridad en la Base de Datos:** Scripts SQL con **Row Level Security (RLS)** para control estricto de lectura y escritura de planes y socios (`supabase/create_routines_table.sql`).

---

## 📁 Estructura del Proyecto

```text
Landing Page FITNESS/
├── assets/
│   └── img/                 # Recursos multimedia y fotografías del gimnasio
├── css/
│   ├── styles.css           # Estilos de la landing page comercial
│   └── recepcion.css        # Estilos del panel administrativo de recepción
├── js/
│   ├── config.js            # Configuración de credenciales y Supabase Client
│   ├── main.js              # Lógica de interacción de la landing page
│   ├── recepcion.js         # Lógica del panel de recepción y suscripción a eventos
│   └── tracker.js           # Analítica y seguimiento de eventos
├── supabase/
│   ├── create_routines_table.sql   # Definición de tablas y políticas RLS
│   └── fix_delete_policies.sql     # Correcciones de permisos de eliminación
├── ferreira-fitness.apk     # Build compilada de la aplicación móvil vinculada
├── index.html               # Página web pública del gimnasio
└── recepcion.html           # Interfaz de gestión en recepción
```

---

## 👨‍💻 Autor

Desarrollado por **Eduardo José Contreras Borrero**  
* **LinkedIn:** [linkedin.com/in/eduardo-contreras-dev](https://www.linkedin.com/in/eduardo-contreras-dev/)  
* **GitHub:** [@ejcb11](https://github.com/ejcb11)  
* **Correo:** [ejcb2006@gmail.com](mailto:ejcb2006@gmail.com)
