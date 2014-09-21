'use strict';

describe('Directive: album', function() {

    var element,
        controller,
        $rootScope,
        $scope,
        $q,
        $compile;

    beforeEach(function() {
        module('musicServerApp', 'musicServerViews');

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            $q = $injector.get('$q');
            $compile = $injector.get('$compile');

            element = angular.element(
                '<li album="album"></li>'
            );

            $scope.album = {
                'ID' : 1,
                'Name' : 'Album 1'
            };

            $compile(element)($scope);
            $scope.$digest();

            controller = element.controller('album');
        });
    });

    describe('Initialisation', function() {
        it('should display the album Name property', function() {
            expect(element.find('.content').find('.desc').text()).toBe('Album 1');
        });

        it('should call AlbumController.select when clicked', function() {
            spyOn(controller, 'select');

            element.trigger('click');

            expect(controller.select).toHaveBeenCalled();
        });

        it('should call AlbumController.add when the add button is clicked', function() {
            spyOn(controller, 'add');

            element.find('button.control-add').trigger('click');

            expect(controller.add).toHaveBeenCalled();
        });

        it('should call AlbumController.play when the play button is clicked', function() {
            spyOn(controller, 'play');

            element.find('button.control-play').trigger('click');

            expect(controller.play).toHaveBeenCalled();
        });
    });
});
