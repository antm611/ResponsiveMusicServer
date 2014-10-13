'use strict';

angular.module('musicServerApp')
    .directive('album', ['DraggableData',
        function(DraggableData) {
            return {
                scope: {
                    'album': '='
                },
                restrict: 'A',
                replace: true,
                templateUrl: 'views/album.partial.html',
                controller: 'AlbumController',
                controllerAs: 'albumCtrl',
                bindToController: true,
                link: function(scope, element) {
                    var ctrl = scope.albumCtrl;

                    DraggableData.bindDragEvents(element, ctrl.album, 'Album', function() {
                        return [ctrl.album];
                    }, function() {
                        return true;
                    });
                }
            };
        }]);
