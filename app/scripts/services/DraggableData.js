'use strict';

angular.module('musicServerApp')
    .service('DraggableData', ['$q', 'ApiRequest', 'Playlist',
        function($q, ApiRequest, Playlist) {
            var currentDeferred = $q.defer();
            currentDeferred.reject();

            this.setTracks = function(tracks) {
                currentDeferred = $q.defer();
                var trackList = [];

                angular.forEach(tracks, function(track) {
                    this.push(track);
                }, trackList);

                currentDeferred.resolve(trackList);
            };

            this.setArtists = function(artists) {
                var promises = [];
                angular.forEach(artists, function(artist) {
                    promises.push(ApiRequest.track.getFromArtist(artist.ID).bound(0, 1000).submit());
                });

                currentDeferred = $q.defer();
                $q.all(promises).then(function(data) {
                    var trackList = [];
                    for (var i = 0; i < data.length; i++) {
                        trackList = trackList.concat(data[i]);
                    }
                    currentDeferred.resolve(trackList);
                }, function() {
                    currentDeferred.reject();
                });
            };

            this.setAlbums = function(albums) {
                var promises = [];
                angular.forEach(albums, function(album) {
                    promises.push(ApiRequest.track.getFromAlbum(album.ID).bound(0, 1000).submit());
                });

                currentDeferred = $q.defer();
                $q.all(promises).then(function(data) {
                    var trackList = [];
                    for (var i = 0; i < data.length; i++) {
                        trackList = trackList.concat(data[i]);
                    }
                    currentDeferred.resolve(trackList);
                }, function() {
                    currentDeferred.reject();
                });
            };

            this.getTracks = function() {
                return currentDeferred.promise;
            };

            /* To ensure that $scope.$apply is called, but to avoid calling $scope.$apply unnecessarily,
             * this function will only call $scope.$apply if changes have been made.
            */
            function changeScopeVariable(scope, dragoverPre, dragoverPost) {
                var changed = false;
                if (scope.dragoverPost !== dragoverPost) {
                    scope.dragoverPost = dragoverPost;
                    changed = true;
                }
                if (scope.dragoverPre !== dragoverPre) {
                    scope.dragoverPre = dragoverPre;
                    changed = true;
                }

                if (changed) {
                    scope.$apply(function() { });
                }
            }

            this.bindDragEvents = function($element, item, itemType, itemListFunction, itemSelectedFunction) {
                var _this = this;
                $element.on('dragstart', function($event) {
                    if (!itemSelectedFunction()) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        return;
                    }

                    var itemList = itemListFunction();
                    if (_this.getDragElement) {
                        $event.dataTransfer.setDragImage(_this.getDragElement(itemList.length, itemType), -10, -10);
                    }

                    switch (itemType) {
                        case 'Track':
                            _this.setTracks(itemList);
                            break;
                        case 'Artist':
                            _this.setArtists(itemList);
                            break;
                        case 'Album':
                            _this.setAlbums(itemList);
                            break;
                    }
                });

                $element.on('dragend', function() {
                    if (_this.currentHoverScope) {
                        changeScopeVariable(_this.currentHoverScope, false, false);
                    }
                });
            };

            this.bindPlaylistDropEvents = function($element) {
                var _this = this;
                this.currentHoverScope = null;

                $element.on('dragover', function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                });

                $element.on('drop', function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    _this.getTracks().then(function(tracks) {
                        Playlist.addTracks(tracks);
                    });
                    Playlist.deselectAll();
                });
            };

            this.bindTrackDropEvents = function($element, scope) {
                var _this = this;
                $element.on('dragover', function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    if (_this.currentHoverScope !== scope) {
                        if (_this.currentHoverScope) {
                            changeScopeVariable(_this.currentHoverScope, false, false);
                        }

                        _this.currentHoverScope = scope;
                    }

                    var dropAfter = ($element[0].clientHeight < $event.offsetY * 2);
                    changeScopeVariable(scope, !dropAfter, dropAfter);
                });

                $element.on('drop', function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    var addAfter = !_this.currentHoverScope.dragoverPre;
                    changeScopeVariable(_this.currentHoverScope, false, false);
                    _this.getTracks().then(function(tracks) {
                        Playlist.addTracks(tracks, _this.currentHoverScope.track, addAfter);
                    });
                });
            };

            this.getDragElement = null;

            this.currentHoverScope = null;
        }]);
