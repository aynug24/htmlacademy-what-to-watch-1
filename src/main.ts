import {initContainer} from './container.js';
import Application from './app/application.js';
import {Component} from './types/component.types.js';

const app = initContainer().get<Application>(Component.Application);
await app.init();
