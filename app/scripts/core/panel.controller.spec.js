/* jshint -W117, -W030 */
describe('app.core.PanelController', function() {

  var controller,
    mockTracks,
    mockSelectableTracksFactory;

  beforeEach(module('app.core'));

  beforeEach(inject(function($controller, $rootScope) {
    mockTracks = {};
    mockSelectableTracksFactory = {};
    var $scope = $rootScope.$new();
    $scope.tracks = mockTracks;

    window.SelectableTracksFactory = jasmine.createSpy('SelectableTracksFactorySpy').and.returnValue(mockSelectableTracksFactory);
    window.$scope = $scope;
    window.$rootScope = $rootScope;

    controller = $controller('PanelController', {
      $rootScope: $rootScope,
      $scope: $scope,
      SelectableTracksFactory: SelectableTracksFactory
    });
  }));

  it('should show artists, albums and tracks when in desktop mode and nothing selected', function() {
    $scope.isDesktop = true;
    $scope.isPhone = false;

    controller.selectedAlbum = null;
    controller.selectedArtist = null;
    expect(controller.isArtistsShown()).toBeTruthy();
    expect(controller.isAlbumsShown()).toBeTruthy();
    expect(controller.isTracksShown()).toBeTruthy();
  });
  it('should show artists, albums and tracks when in desktop mode and an album selected', function() {
    $scope.isDesktop = true;
    $scope.isPhone = false;

    controller.selectedAlbum = {};
    controller.selectedArtist = null;
    expect(controller.isArtistsShown()).toBeTruthy();
    expect(controller.isAlbumsShown()).toBeTruthy();
    expect(controller.isTracksShown()).toBeTruthy();
  });
  it('should show artists, albums and tracks when in desktop mode and an album and artist selected', function() {
    $scope.isDesktop = true;
    $scope.isPhone = false;


    controller.selectedAlbum = {};
    controller.selectedArtist = {};
    expect(controller.isArtistsShown()).toBeTruthy();
    expect(controller.isAlbumsShown()).toBeTruthy();
    expect(controller.isTracksShown()).toBeTruthy();
  });
  it('should show artists, albums and tracks when in desktop mode and an artist selected', function() {
    $scope.isDesktop = true;
    $scope.isPhone = false;


    controller.selectedAlbum = null;
    controller.selectedArtist = {};
    expect(controller.isArtistsShown()).toBeTruthy();
    expect(controller.isAlbumsShown()).toBeTruthy();
    expect(controller.isTracksShown()).toBeTruthy();
  });

  it('should only show artists and albums when in tablet mode and nothing selected', function() {
    $scope.isDesktop = false;
    $scope.isPhone = false;

    controller.selectedAlbum = null;
    controller.selectedArtist = null;
    expect(controller.isArtistsShown()).toBeTruthy();
    expect(controller.isAlbumsShown()).toBeTruthy();
    expect(controller.isTracksShown()).toBeFalsy();
  });
  it('should only show artists and albums when in tablet mode and an album selected', function() {
    $scope.isDesktop = false;
    $scope.isPhone = false;


    controller.selectedAlbum = {};
    controller.selectedArtist = null;
    expect(controller.isArtistsShown()).toBeTruthy();
    expect(controller.isAlbumsShown()).toBeTruthy();
    expect(controller.isTracksShown()).toBeFalsy();
  });
  it('should only show tracks and albums when in tablet mode and an album and artist selected', function() {
    $scope.isDesktop = false;
    $scope.isPhone = false;


    controller.selectedAlbum = {};
    controller.selectedArtist = {};
    expect(controller.isArtistsShown()).toBeFalsy();
    expect(controller.isAlbumsShown()).toBeTruthy();
    expect(controller.isTracksShown()).toBeTruthy();
  });
  it('should only show artists and albums when in tablet mode and an artist but no album selected', function() {
    $scope.isDesktop = false;
    $scope.isPhone = false;


    controller.selectedAlbum = null;
    controller.selectedArtist = {};
    expect(controller.isArtistsShown()).toBeTruthy();
    expect(controller.isAlbumsShown()).toBeTruthy();
    expect(controller.isTracksShown()).toBeFalsy();
  });

  it('should only show artists when in phone mode and no artists or albums selected', function() {
    $scope.isDesktop = false;
    $scope.isPhone = true;

    controller.selectedAlbum = null;
    controller.selectedArtist = null;
    expect(controller.isArtistsShown()).toBeTruthy();
    expect(controller.isAlbumsShown()).toBeFalsy();
    expect(controller.isTracksShown()).toBeFalsy();
  });
  it('should only show artists when in phone mode and an album but no artist selected', function() {
    $scope.isDesktop = false;
    $scope.isPhone = true;


    controller.selectedAlbum = {};
    controller.selectedArtist = null;
    expect(controller.isArtistsShown()).toBeTruthy();
    expect(controller.isAlbumsShown()).toBeFalsy();
    expect(controller.isTracksShown()).toBeFalsy();
  });
  it('should only show tracks when in phone mode and an album and artist selected', function() {
    $scope.isDesktop = false;
    $scope.isPhone = true;


    controller.selectedAlbum = {};
    controller.selectedArtist = {};
    expect(controller.isArtistsShown()).toBeFalsy();
    expect(controller.isAlbumsShown()).toBeFalsy();
    expect(controller.isTracksShown()).toBeTruthy();
  });
  it('should only show albums when in phone mode and an artist but no album selected', function() {
    $scope.isDesktop = false;
    $scope.isPhone = true;


    controller.selectedAlbum = null;
    controller.selectedArtist = {};
    expect(controller.isArtistsShown()).toBeFalsy();
    expect(controller.isAlbumsShown()).toBeTruthy();
    expect(controller.isTracksShown()).toBeFalsy();
  });

  it('should stop propagation and call the clearSelection function on the trackArea when deselectTracks is called', function() {
    var mockEvent = {
      stopPropagation: function() { }
    };
    spyOn(mockEvent, 'stopPropagation');
    var mockTrackArea = {
      clearSelection: function() { }
    };
    spyOn(mockTrackArea, 'clearSelection');
    $scope.trackArea = mockTrackArea;

    controller.deselectTracks(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalledWith();
    expect(mockEvent.stopPropagation.calls.count()).toBe(1);
    expect(mockTrackArea.clearSelection).toHaveBeenCalledWith();
    expect(mockTrackArea.clearSelection.calls.count()).toBe(1);
  });

  it('should clear the selected album when deselectAlbum is called', function() {
    controller.selectedAlbum = {};
    controller.selectedArtist = {};

    controller.deselectAlbum();

    expect(controller.selectedAlbum).toBeNull();
    expect(controller.selectedArtist).not.toBeNull();
  });

  it('should clear the selected artist and album when deselectArtist is called', function() {
    controller.selectedAlbum = {};
    controller.selectedArtist = {};

    controller.deselectArtist();

    expect(controller.selectedAlbum).toBeNull();
    expect(controller.selectedArtist).toBeNull();
  });

  it('should set the selectedAlbum on receiving the selectAlbum event', function() {
    var mockAlbum = {};
    controller.selectedAlbum = null;

    $rootScope.$emit('selectAlbum', mockAlbum);

    expect(controller.selectedAlbum).toBe(mockAlbum);
  });

  it('should set the selectedArtist and clear the selectedAlbum on receiving the selectArtist event', function() {
    var mockArtist = { };
    controller.selectedAlbum = { };
    controller.selectedArtist = { };

    $rootScope.$emit('selectArtist', mockArtist);

    expect(controller.selectedArtist).toBe(mockArtist);
    expect(controller.selectedAlbum).toBeNull();
  });

  it('should create a new SelectableTracksFactory object', function() {
    expect(SelectableTracksFactory).toHaveBeenCalledWith();
    expect(SelectableTracksFactory.calls.count()).toBe(1);

    expect($scope.trackArea).toBe(mockSelectableTracksFactory);
    expect($scope.trackArea.allTracks).toBe(mockTracks);
  });
});
