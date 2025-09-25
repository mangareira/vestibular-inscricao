/* eslint-disable @typescript-eslint/no-unused-vars */
import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import profile from './profile'

export const runtime = 'edge';

const app = new Hono().basePath('/api');

const routes = app
  .route('/profile', profile)

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
