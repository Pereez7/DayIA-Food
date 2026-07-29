# ADR 005 — Stack web, estado, estilos y contratos

## Contexto

El MVP requiere una interfaz táctil autenticada, reglas verificables,
actualización de cocina y contratos compartidos sin convertir el navegador en
autoridad. Debe ser mantenible por agentes y reutilizar el núcleo en futuros
verticales.

## Decisión

Adoptar React 19 + TypeScript + Vite como SPA, React Router, TanStack Query para
estado remoto, React para estado local/derivado y Zustand sólo para borradores
efímeros transversales. Formularios usan React Hook Form y Zod.

Usar CSS Modules, custom properties como tokens, elementos nativos/componentes
accesibles propios, Lucide e `Intl`. No adoptar una librería UI completa ni una
biblioteca de fechas inicialmente.

Zod será esquema runtime compartido en `packages/contracts`; OpenAPI se generará
de la misma fuente para consumidores no TypeScript. Tipos estáticos nunca
sustituyen validación.

## Alternativas

- Next.js: integración full-stack y SSR, pero añade runtime/convenios que una
  herramienta autenticada no necesita.
- Vue/Vite: opción madura y ligera, pero pierde el ecosistema React elegido.
- Redux Toolkit: gobierno fuerte, pero demasiado estado global para el alcance.
- Tailwind/librería UI completa: velocidad inicial, con mayor dependencia de
  convenciones o diseño ajeno antes de conocer la interfaz.
- schemas OpenAPI manuales: lenguaje neutral, pero alto riesgo de duplicación.

## Consecuencias

Las fronteras de estado deben revisarse; ningún store conserva autoridad remota.
Los componentes requieren disciplina accesible y tokens consistentes. La SPA no
ofrece SSR por defecto, decisión aceptable para un producto operativo protegido.
Las versiones exactas se fijan al instalar usando releases estables compatibles.

## Estado

accepted

## Fecha

2026-07-29
