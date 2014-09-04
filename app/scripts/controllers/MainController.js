'use strict';

angular.module('musicServerApp')
    .controller('MainController', ['$scope', '$rootScope', 'DataLoader', 'Playlist', 'HttpRequest',
        function($scope, $rootScope, DataLoader, Playlist, HttpRequest) {
            function loadArtists() {
                $scope.artists = [];
                $scope.artistRequest = DataLoader.init(HttpRequest.artist.getAll(), $scope.artists);
            }

            function loadAlbums(artist) {
                $scope.albums = [];
                if (artist) {
                    $scope.albumRequest = DataLoader.init(HttpRequest.album.getFromArtist(artist.ID), $scope.albums);
                } else {
                    $scope.albumRequest = {
                        fetch: $.noop
                    };
                }
            }

            function loadTracks(album) {
                $scope.tracks = [];
                if (album) {
                    $scope.trackRequest = DataLoader.init(HttpRequest.track.getFromAlbum(album.ID), $scope.tracks);
                } else {
                    $scope.trackRequest = {
                        fetch: $.noop
                    };
                }
            }

            $rootScope.$on('addArtist', function(e, artist) {
                e.stopPropagation();
                Playlist.addTracksByArtist(artist.ID);
            });

            $rootScope.$on('playArtist', function(e, artist) {
                e.stopPropagation();
                Playlist.clear();
                Playlist.addTracksByArtist(artist.ID).then(function() {
                    $scope.$emit('StartPlaying');
                });
            });

            $rootScope.$on('addAlbum', function(e, album) {
                e.stopPropagation();
                Playlist.addTracksByAlbum(album.ID);
            });

            $rootScope.$on('playAlbum', function(e, album) {
                e.stopPropagation();
                Playlist.clear();
                Playlist.addTracksByAlbum(album.ID).then(function() {
                    $scope.$emit('StartPlaying');
                });
            });

            $rootScope.$on('addTrack', function(e, track) {
                e.stopPropagation();
                Playlist.addTracks([track]);
            });

            $rootScope.$on('removeTrack', function(e, track) {
                e.stopPropagation();
                Playlist.removeTrack(track);
            });

            $rootScope.$on('playTrack', function(e, track) {
                e.stopPropagation();
                Playlist.clear();
                Playlist.addTracks([track]);
                $scope.$emit('StartPlaying');
            });

            $rootScope.$on('selectArtist', function(e, artist) {
                loadAlbums(artist);
                loadTracks(null);
                $scope.albumRequest.fetch();
            });

            $rootScope.$on('selectAlbum', function(e, album) {
                loadTracks(album);
                $scope.trackRequest.fetch();
            });

            loadArtists();
        }
    ]);