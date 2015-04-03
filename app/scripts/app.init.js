(function() {
    'use strict';

    angular.element(document).ready(function() {
        function addModuleIfPresent(modules, module) {
            try {
                angular.module(module);
                modules.push(module);
            } catch (e) {

            }
        }

        var modules = ['musicServerApp'];
        addModuleIfPresent(modules, 'mock.api');

        angular.bootstrap(document.querySelector('[data-main-app]'), modules, {
            //strictDi: true
        });
    });
})();