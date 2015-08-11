angular.module('starter.controllers', [])

    .controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    //    $scope.loginData = {};
    //
    //    // Create the login modal that we will use later
    //    $ionicModal.fromTemplateUrl('templates/login.html', {
    //        scope: $scope
    //    }).then(function(modal) {
    //        $scope.modal = modal;
    //    });
    //
    //    // Triggered in the login modal to close it
    //    $scope.closeLogin = function() {
    //        $scope.modal.hide();
    //    };
    //
    //    // Open the login modal
    //    $scope.login = function() {
    //        $scope.modal.show();
    //    };
    //
    //    // Perform the login action when the user submits the login form
    //    $scope.doLogin = function() {
    //        console.log('Doing login', $scope.loginData);
    //
    //        // Simulate a login delay. Remove this and replace with your login
    //        // code if using a login system
    //        $timeout(function() {
    //            $scope.closeLogin();
    //        }, 1000);
    //    };
    })

    //.controller('routesCtrl', function($scope, $http, $stateParams, $window) {
    //    $scope.busRoute = $stateParams.route;
    //    $scope.direction = $stateParams.routeDir;
    //
    //    var url = 'http://localhost:8081/route/' + $scope.busRoute + '/' + $scope.direction;
    //
    //    $http.get(url)
    //        .success(function(data) {
    //            //console.log(data);
    //            $scope.stops = data;
    //        });
    //    $scope.submit = function () {
    //        $window.location.href = '#/stopNr/'+$scope.text+'/';
    //
    //    };
    //})
    .controller('busCtrl', function($scope, $window, $http) {

        $scope.stop = {};

        $scope.submit = function () {
            $window.location.href = '#/app/stopNr/'+$scope.stop.no+'/';
        };

    })
    .controller('timeCtrl', function($scope, $http, $stateParams, $window, $timeout) {
        $scope.loading = false;
        $scope.busNrs = $stateParams.busNr;
        var url = 'http://104.131.89.50:8081/bus/' + $scope.busNrs;
        //first load
        $http.get(url)
            .success(function (data) {
                $scope.busesRTPI = data;
                $scope.loading = false;
                $scope.timeOut = 30;
            });


        //reloads ..
        $scope.scheduleReload = function() {
            $timeout(function() {
                $http.get(url)
                    .success(function (data) {
                        //  console.log(data);
                        $scope.busesRTPI = data;
                        $scope.loading = false;
                        console.log('reload');
                        $scope.timeOut = 30;

                    });
                $scope.scheduleReload();
            }, 30000);
        };
        $scope.timeOutFunction = function() {
            $timeout(function() {
                $scope.timeOut = $scope.timeOut -1;
                $scope.timeOutFunction();
            }, 1000)
        };
        $scope.timeOutFunction();
        $scope.scheduleReload();
        $scope.changeBus = false;
        $scope.faves = {
            fav: []
        };
        if(window.localStorage['faves'] === 'undefined') {
            $scope.faves = {
                fav: []
            };
            console.log('empty');
        }
        else {
            $scope.faves = JSON.parse(window.localStorage['faves']);
            console.log('local');
        }


        $scope.addFav = function() {

            var count = $scope.faves.fav.length;

            var added = false;

            for(var i=0; i<count; i++) {
                if ($scope.faves.fav[i] === $scope.busNrs) {
                    added = true;
                }
            }
            if(added === false) {
                $scope.faves.fav.push($scope.busNrs);
                window.localStorage['faves'] = JSON.stringify($scope.faves);
                console.log(window.localStorage['faves']);
                console.log($scope.faves);
            }


        };
        console.log($scope.faves);
        $scope.text = $scope.busNrs;
        if ($scope.text === 'undefined') {
            $scope.text = 'Enter valid stop nr.'
        }
        //$scope.stopNr = $scope.
        $scope.submit = function () {
            $window.location.href = '#/stopNr/'+$scope.text+'/';
            $scope.changeBus = false;

        };
    })
    //.controller('stopsCtrl', function($scope, $http){
    //    $scope.loading = true;
    //    var url = '/files/buses.json';
    //    $http.get(url)
    //        .success(function(data) {
    //            //console.log(data);
    //            $scope.stops = data;
    //            $scope.loading = false;
    //
    //        })
    //})
    .controller('favesCtrl', function($scope){
        $scope.faves = {
            fav: []
        };
        if(window.localStorage['faves'] === 'undefined') {
            $scope.faves = {
                fav: 'Sorry, you need to add some favorites first!'
            };
            console.log('empty');
        }
        else {
            $scope.faves = JSON.parse(window.localStorage['faves']);
            console.log('local');
        }
    });