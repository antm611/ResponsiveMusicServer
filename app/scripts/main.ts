import {bootstrap} from 'angular2/platform/browser'
import AppComponent from './app.component'
import {HTTP_PROVIDERS} from 'angular2/http'
import ApiService from './services/api/api.service'
import SessionService from './services/session/session.service'

bootstrap(AppComponent, [HTTP_PROVIDERS, ApiService, SessionService]);
