# 🌍 Flag Quiz Mobile - Adivina Banderas y Capitales

Aplicación móvil interactiva desarrollada con **React Native** y **Expo**, diseñada para poner a prueba y expandir tus conocimientos sobre geografía mundial. El juego desafía al usuario a identificar banderas nacionales y capitales bajo presión de tiempo, con retroalimentación inmediata, pistas progresivas y una tabla de posiciones persistente.

---

## 🚀 Características Principales

### 1. 🏳️ Modo Principal: Adivinar Banderas
- Presentación de banderas obtenidas en tiempo real de la API pública [CountriesNow](https://countriesnow.space/).
- Entrada de texto para que el usuario ingrese el nombre del país.
- Comparación normalizada (insensible a mayúsculas, minúsculas, espacios y tildes/acentos diacríticos).
- Sistema de pistas: revela letras aleatorias no descubiertas reduciendo 2 segundos del tiempo de la ronda.

### 2. 🏛️ Modo Alternativo: Modo Capitales (Plus 4)
- Muestra la bandera y el nombre del país para que el jugador elija la capital correspondiente entre 3 opciones generadas dinámicamente (1 correcta y 2 distractores de otros países).
- **Pistas automáticas**: cada 5 segundos de cuenta regresiva (en los segundos 10 y 5), se descarta una opción errónea automáticamente.
- **Pistas manuales**: el jugador puede solicitar una pista voluntaria que elimina una opción incorrecta con una penalización de 2 segundos.
- La respuesta correcta nunca es descartada; al quedar una sola opción o finalizar el tiempo, se bloquean nuevas eliminaciones.

### 3. ⏱️ Temporizador Dinámico y Sistema de Puntuación (Plus 1)
- **15 segundos** por bandera o pregunta.
- **Acierto**: otorga `+10 puntos` fijos más una **bonificación igual a los segundos restantes** en el temporizador (`+10 + timer`).
- **Error**: penaliza con `-1 punto` (sin caer por debajo de 0).
- **Penalización por pista**: reduce `2 segundos` del reloj por cada uso.
- **Tiempo agotado (Game Over)**: si el reloj llega a 0, la partida finaliza automáticamente y se muestra el puntaje final.

### 4. 🏆 Ranking Local Persistente con AsyncStorage (Plus 2)
- Almacenamiento local mediante `@react-native-async-storage/async-storage`.
- Registra el nombre del jugador y su mejor puntuación histórica sin duplicar jugadores.
- Tabla de posiciones ordenada descendentemente con medallas para los primeros puestos (🥇, 🥈, 🥉).
- Pantalla dedicada para consultar el podio en cualquier momento.

### 5. 🎨 Diseño Móvil Responsive y Moderno
- Interfaz temática oscura (*dark theme*) con paleta azul marino y acentos en dorado.
- Tipografía clara, botones táctiles con estados deshabilitados y retroalimentación visual (`¡Correcto!`, `Incorrecto`, `¡Tiempo agotado!`).
- Contenedores adaptables con `SafeAreaView`, `ScrollView` y `KeyboardAvoidingView` para soporte fluido en pantallas de diversos tamaños.

---

## 📂 Estructura del Proyecto

```text
Tp13Efsi_Turquie/
├── index.js                    # Punto de entrada de Expo (registra el componente raíz con registerRootComponent)
├── App.js                      # Componente raíz; monta GameProvider y Navigation
├── app.json                    # Configuración general de Expo (nombre, slug, orientación, etc.)
├── package.json                # Configuración de scripts, dependencias y main apuntando a index.js
├── context/
│   └── GameContext.js          # Estado global único (GameProvider y hook useGame)
├── screens/
│   ├── HomeScreen.js           # Pantalla de bienvenida, selección de modo y registro de jugador
│   ├── GameScreen.js           # Pantalla interactiva del juego con bandera, timer y opciones
│   ├── GameOverScreen.js       # Pantalla de resultado final con opción de revancha y podio
│   └── LeaderboardScreen.js    # Pantalla completa de la tabla de posiciones histórica
└── components/
    ├── Navigation.js           # Enrutador condicional basado en el estado del Context
    ├── Flag.js                 # Renderizado de la bandera con feedback de carga, error y fallback PNG
    ├── ScoreBoard.js           # Marcador de puntaje y nombre del jugador activo
    ├── Timer.js                # Contador de 15s con cambio cromático de alerta
    ├── GuessForm.js            # Formulario de texto (Banderas) o botones de opciones (Capitales)
    ├── HintButton.js           # Botón de solicitud de pista (con costo en segundos)
    ├── HintDisplay.js          # Visualizador de letras descubiertas tipo ahorcado
    ├── Feedback.js             # Banner animado para acierto, error y tiempo agotado
    └── Leaderboard.js          # Componente reutilizable con FlatList de mejores puntajes
```

---

## 🧠 Arquitectura: `GameContext` como Fuente Única de la Verdad

En estricto cumplimiento de la consigna:
> *"Ningún dato del juego debe pasarse mediante props entre componentes. Todos los componentes deben consumir directamente el Context mediante `useContext(GameContext)`."*

1. **Sin Prop Drilling**: Ningún componente hijo recibe datos ni funciones mediante props.
2. **Hook de Acceso Seguro (`useGame`)**:
   ```javascript
   import { useGame } from '../context/GameContext';

   const { score, timer, guess, useHint } = useGame();
   ```
3. **Manejo de Referencias Seguras contra Stale Closures**:
   - `timerValueRef`: sincronizado en tiempo real con el temporizador para calcular bonificaciones exactas en `guess` y `guessCapital`.
   - `feedbackRef`: bloquea clics repetidos o simultáneos mientras se exhibe la retroalimentación.
   - `timeoutRef` y `feedbackTimeoutRef`: permiten cancelar temporizadores pendientes al reiniciar o abandonar la partida de forma limpia.

---

## 📱 Requisitos e Instrucciones de Ejecución

### Prerrequisitos
- **Node.js** (versión 18 o superior recomendada).
- **npm** (incluido con Node.js).
- **Dispositivo móvil físico** (Android o iOS) con la app **Expo Go** actualizada instalada desde Google Play Store o Apple App Store, o un emulador/simulador configurado.

### Pasos de Puesta en Marcha

1. **Abrir una terminal en la carpeta del proyecto**:
   ```bash
   cd c:\Users\49551134\Downloads\Tp13Efsi_Turquie
   ```

2. **Iniciar el servidor de desarrollo de Expo**:
   ```bash
   npx expo start
   ```

   > **Tip**: Si cambiaste la configuración de entrada o dependencias, inicia limpiando la caché de Metro:
   > ```bash
   > npx expo start -c
   > ```

3. **Conectar el dispositivo móvil**:
   - Asegúrate de que tu celular y tu computadora estén conectados a la **misma red Wi-Fi**.
   - En **Android**: Abrí la app **Expo Go**, seleccioná *"Scan QR code"* y escaneá el código QR mostrado en la terminal.
   - En **iOS**: Abrí la app de la **Cámara nativa**, apuntá al código QR y presioná la notificación para abrir en **Expo Go**.

### 🌐 Conexión mediante Tunnel (Recomendada si hay problemas de red o firewall)
Si la red Wi-Fi tiene aislamiento de clientes (*Client Isolation*) o el firewall bloquea la conexión LAN:
```bash
npx expo start --tunnel
```

---

## 🛠️ Diagnóstico y Resolución de Problemas Frecuentes

| Problema | Causa probable | Solución sugerida |
| :--- | :--- | :--- |
| **"The app entry point named 'main' not registered"** | El archivo `package.json` apuntaba a `App.js` en lugar de `index.js`. | Configurar `"main": "index.js"` en `package.json`. En `index.js` se invoca `registerRootComponent(App)`. |
| **"Could not connect to development server"** | Celular y PC en redes distintas o firewall bloqueando el puerto 8081. | 1. Ejecutar con `npx expo start --tunnel`.<br>2. Comprobar que ambos equipos estén en la misma red Wi-Fi.<br>3. Permitir Node.js en el Firewall de Windows. |
| **Banderas no cargan o pantalla de error** | Formato SVG de la API incompatible con Image de React Native. | `Flag.js` implementa resolución mediante código ISO2 a PNG de alta velocidad (FlagCDN) con fallback a la API original. |
| **Cambios de código no se reflejan** | Caché del empaquetador Metro acumulada. | Detener el servidor con `Ctrl + C` e iniciar limpiando caché: `npx expo start -c`. |

---

## 🧪 Guía de Prueba Paso a Paso

### Prueba del Modo Adivinar Banderas
1. Iniciar la aplicación y aguardar la carga de datos (debe mostrar el total de países cargados, ~250).
2. Ingresar un nombre en el campo de texto (ejemplo: `Tester1`).
3. Seleccionar **"Adivinar Banderas"**.
4. Observar la bandera y escribir el nombre del país en el campo de texto.
5. Presionar **"💡 Pista (-2s)"**: verificar que se descuenten 2 segundos y se revele una letra aleatoria en los casilleros de abajo.
6. Responder correctamente para comprobar la suma de `10 puntos + segundos restantes` del timer.
7. Dejar correr el reloj hasta 0 para verificar la transición a la pantalla de **Fin del juego**.

### Prueba del Modo Capitales
1. Desde la pantalla principal o fin de partida, seleccionar **"Modo Capitales"**.
2. Observar la bandera, el nombre del país y las 3 opciones de capitales.
3. Aguardar a que el reloj descienda a 10s y a 5s: comprobar cómo **se tacha y deshabilita automáticamente una opción incorrecta**.
4. Seleccionar la capital correcta para sumar los puntos correspondientes y avanzar de ronda.

### Prueba del Ranking
1. Al finalizar una partida, verificar que el puntaje final aparezca registrado en la tabla de posiciones.
2. Jugar una segunda partida con el mismo nombre obteniendo un puntaje diferente y confirmar que se mantenga únicamente el récord más alto.
3. Cerrar por completo Expo Go y reabrir la app: confirmar que los puntajes continúan almacenados en el dispositivo gracias a `AsyncStorage`.

---

## ✅ Matriz de Cumplimiento de Requisitos

| # | Requisito de la Consigna | Estado | Detalle de Implementación |
| :-: | :--- | :-: | :--- |
| **1** | Consumo de API REST CountriesNow (banderas y capitales) | **CUMPLIDO** | `useEffect` en `GameContext.js` para carga paralela y manejo de errores. |
| **2** | Pantalla principal con input de nombre y validación | **CUMPLIDO** | `HomeScreen.js` con validación de campo requerido y longitud máxima. |
| **3** | Modo Adivinar Banderas interactivo | **CUMPLIDO** | Renderizado en `Flag.js` con input y normalización en `GuessForm.js`. |
| **4** | Arquitectura con Context API (sin prop drilling) | **CUMPLIDO** | `GameContext.js` expone estado y métodos a través de `useGame()`. Cero props pasadas para datos de juego. |
| **5** | Temporizador de 15 segundos con fin de partida | **CUMPLIDO** | `Timer.js` y cuenta regresiva con trigger a `handleTimeout()` y `endGame()`. |
| **6** | Manejo de puntaje con aciertos y errores | **CUMPLIDO** | +10 base por acierto, -1 por error (con piso en 0). |
| **7** | Pantalla de Game Over con resumen | **CUMPLIDO** | `GameOverScreen.js` con puntaje obtenido, nombre del jugador y podio. |
| **8** | Navegación entre vistas sin dependencias rotas | **CUMPLIDO** | `Navigation.js` con ruteo condicional rápido y ligero. |
| **+1** | **Plus 1: Bonificación de velocidad en el puntaje** | **CUMPLIDO** | El puntaje por acierto suma `10 + timer` segundos restantes en `GameContext.js`. |
| **+2** | **Plus 2: Multijugador y ranking persistente (AsyncStorage)** | **CUMPLIDO** | `AsyncStorage` almacena el mejor puntaje por jugador con medallas 🥇, 🥈, 🥉 en `Leaderboard.js`. |
| **+3** | **Plus 3: Sistema de pistas progresivas (-2s por pista)** | **CUMPLIDO** | `HintDisplay.js` revela letras con penalización de -2s por pista. |
| **+4** | **Plus 4: Segundo modo de juego (Modo Capitales)** | **CUMPLIDO** | 3 opciones, auto-eliminación cada 5s y pista manual protegida de eliminar la respuesta correcta. |

Corregi los errores de inicializacion de este proyecto, error: App entry not found The app entry point named "main" not registered...

El error App entry not found The app entry point named "main" not registered ha sido corregido.

🔍 Causa del Problema

  
En package.json, la propiedad "main" estaba configurada como:
  
json
"main": "App.js"

  

  
Al iniciar, el empaquetador Metro tomaba directamente App.js, el cual solo exporta el componente React, pero nunca ejecuta registerRootComponent(App) (que es la función de Expo encargada de llamar internamente a AppRegistry.registerComponent('main', ...)).

  
React Native buscaba el punto de entrada registrado con el nombre "main" y, al no encontrarlo, arrojaba el error de inicialización.

  
El archivo index.js ya existía en la raíz con la llamada correcta:
  
javascript
import { registerRootComponent } from 'expo';
import App from './App';
registerRootComponent(App);

  pero Metro lo ignoraba por completo porque el package.json apuntaba a App.js.

  
🛠️ Solución Aplicada

  

  

Configuración del Entry Point en package.json:
Se corrigió la propiedad "main" para que apunte a index.js:


  
json
"main": "index.js",

  

  

  

Mejora en Flag.js:
La API de CountriesNow devuelve banderas en formato .svg (Wikimedia), el cual no es soportado de forma nativa por el componente <Image> de React Native sin librerías adicionales. Se configuró la resolución a PNG mediante el código iso2 (FlagCDN) con fallback automático para asegurar que las banderas carguen de forma fluida.


  

  
🚀 Cómo iniciar el proyecto

En tu terminal, ejecuta limpiando la caché de Metro para asegurar que tome el nuevo punto de entrada:

bash
npx expo start -c