angular.module('starter.controllers', [])

    .controller('AppCtrl', function($scope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function() {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function() {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function() {
                $scope.closeLogin();
            }, 1000);
        };
    })

    .controller('routesCtrl', function($scope, $http, $stateParams, $window) {
        $scope.busRoute = $stateParams.route;
        $scope.direction = $stateParams.routeDir;

        var url = 'http://localhost:8081/route/' + $scope.busRoute + '/' + $scope.direction;

        $http.get(url)
            .success(function(data) {
                //console.log(data);
                $scope.stops = data;
            });
        $scope.submit = function () {
            $window.location.href = '#/stopNr/'+$scope.text+'/';

        };
    })
    .controller('busCtrl', function($scope, $window, $http) {
        //$scope.showHistory = false;
        //
        //$scope.changeHistory = function() {
        //    if($scope.showHistory === false) {
        //        $scope.showHistory = true;
        //    }
        //    else {
        //        $scope.showHistory = false;
        //    }
        //};



        $scope.buses = JSON.parse(window.localStorage['name'] || '{}');
        $scope.stop = {};

        $scope.submit = function () {

            console.log($scope.stop.no);
            $window.location.href = '#/app/stopNr/'+$scope.stop.no+'/';
        };

        $scope.clearHistory = function () {
            $scope.buses = {
                bus: []
            };
            $scope.showHistory = false;
            window.localStorage['name'] = JSON.stringify($scope.buses);
        }

    })
    .controller('timeCtrl', function($scope, $http, $stateParams, $window, $timeout) {
        $scope.loading = true;
        $scope.busNrs = $stateParams.busNr;
        var url = 'http://localhost:8081/bus/' + $scope.busNrs;
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
        $scope.changeBusBtn = function() {
            if($scope.changeBus === false) {
                $scope.changeBus = true;
            }
            else {
                $scope.changeBus = false;
            }
            //console.log('test');
        };
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
    .controller('stopsCtrl', function($scope, $http){
        $scope.loading = true;
        var url = '/files/buses.json';
        $http.get(url)
            .success(function(data) {
                //console.log(data);
                $scope.stops = data;
                $scope.loading = false;

            })
    });