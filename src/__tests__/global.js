import { JSDOM } from 'jsdom';

global.window = new JSDOM('<!doctype html><html><body></body></html>').window;
