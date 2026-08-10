# VisorDOM v0.4 🔍

> **Inspector universal de DOM con escaneo progresivo en tiempo real.**

**VisorDOM** es una extensión liviana para Chrome diseñada para inspeccionar, rastrear y extraer elementos del DOM de forma dinámica y sin distracciones. Ideal para desarrolladores web, auditores de interfaz y usuarios que trabajan con plataformas de Inteligencia Artificial (IA).

---

## 🚀 ¿Para qué sirve?

A diferencia del Inspector estándar del navegador (F12), **VisorDOM** te permite previsualizar la estructura y el contenido de cualquier bloque de la página con solo pasar el cursor (*hover*). 

Está pensado para:
* **Analizar interfaces dinámicas:** Inspeccionar componentes cargados mediante JavaScript o Web Components sin pausar la ejecución.
* **Extraer respuestas y chats de IA:** Rastrear rápidamente fragmentos de texto, bloques de código o selectores CSS en web apps como **Google Gemini**, **DeepSeek**, **ChatGPT** y **Claude**.
* **Debugging ágil:** Validar jerarquías HTML y verificar estructuras sintácticas al instante.

---

## ✨ Características Principales

* ⚡ **Escaneo Progresivo:** Captura instantánea del nodo activo sobre el que se posa el ratón.
* 🛡️ **Zero Overhead:** No afecta el rendimiento de la pestaña ni inyecta frameworks pesados.
* ⚙️ **Panel de Configuración:** Controlá la activación del visor a través del emergente (*popup*).
* 🎨 **Interfaz Gemini-Inspired:** Diseño oscuro elegante e ícono personalizado.

---

## 📦 Instalación Local (Modo Desarrollador)

1. Descargá o cloná este repositorio en tu equipo.
2. Abrí Chrome y navegá a `chrome://extensions/`.
3. Activá el **Modo de desarrollador** (esquina superior derecha).
4. Hacé clic en **Cargar descomprimida** (*Load unpacked*) y seleccioná la carpeta `visordom_v0.4`.

---

## 🛠️ Tecnologías

* **Manifest V3** (Estándar moderno de extensiones de Chrome).
* **JavaScript Vanilla** (Cero dependencias externas).
* **CSS3** para el maquetado del panel flotante.
