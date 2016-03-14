System.register(['angular2/core', 'md5', 'angular2/router', '../services/api/api.factory'], function(exports_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, md5_1, router_1, api_factory_1;
    var LoginComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (md5_1_1) {
                md5_1 = md5_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (api_factory_1_1) {
                api_factory_1 = api_factory_1_1;
            }],
        execute: function() {
            LoginComponent = (function () {
                function LoginComponent(params) {
                    this.model = { username: '', password: '' };
                    this.loginFail = new core_1.EventEmitter();
                    this.loginSuccess = new core_1.EventEmitter();
                    var auth = params.get('auth');
                    var token = params.get('token');
                    if (auth && token) {
                        this._getSession(auth, token);
                    }
                }
                LoginComponent.prototype.login = function () {
                    var _this = this;
                    api_factory_1.default.session.getToken().then(function (data) {
                        var authString = _this._getAuthString(_this.model.username, _this.model.password, data.Token);
                        _this._getSession(data.Token, authString);
                    }, function () {
                        _this.loginFail.emit('GetToken request failed');
                    });
                };
                LoginComponent.prototype._getAuthString = function (username, password, token) {
                    var pswdHash = md5_1.default(username + ':' + 'com.acm.AMMusicServer' + ':' + password);
                    return md5_1.default(token + ':' + username + ':' + pswdHash + ':' + token);
                };
                LoginComponent.prototype._getSession = function (token, authString) {
                    var _this = this;
                    api_factory_1.default.session.getSession(token, authString).then(function (data) {
                        _this.loginSuccess.emit({ key: data.Session, secret: data.Secret });
                    }, function () {
                        _this.loginFail.emit('GetSession request failed');
                    });
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], LoginComponent.prototype, "loginFail", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], LoginComponent.prototype, "loginSuccess", void 0);
                LoginComponent = __decorate([
                    core_1.Component({
                        selector: 'am-login',
                        templateUrl: 'scripts/login/login.html',
                        directives: [router_1.ROUTER_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [router_1.RouteParams])
                ], LoginComponent);
                return LoginComponent;
            }());
            exports_1("LoginComponent", LoginComponent);
        }
    }
});
//# sourceMappingURL=login.component.js.map