var myApp = angular.module('myApp', []);

//connect to index
//$scope: glue btwn application controller and view (index.html)
//$http talk to server
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    // console.log("Hello World from controller");

    $http.get('/bookList').success(function(response){
        console.log("CONTROLLER: data received")

        $scope.bookList = response;
        // $scope.book = "";
    });

    var refresh = function() {
        $http.get('/bookList').success(function(response){
            console.log("CONTROLLER: data received")
            //book list = the whole json list
            //book = each book
            $scope.bookList = response;
            $scope.book = "";
        });
    }    
    //scope: community with front end

    //add book
    $scope.addBook = function() {
        console.log($scope.book);
        $http.post('/bookList', $scope.book).success(function(response) {
            console.log(response);
        });
        refresh();
    }

    $scope.remove = function(id) {
        console.log(id);
        $http.delete('/bookList/' + id).success(function(response){
            refresh();
        });
    }

    $scope.edit = function(id) {
        console.log(id);
        $http.get('/bookList/' + id).success(function(response){
            //put response into index list
            $scope.book = response;
        });
    }

    $scope.update = function(id) {
        console.log(id);
        $http.put('/bookList/' + $scope.contact_id).success(function (response) {
            refresh();
        });
    }

    $scope.deselect = function() {
        $scope.book = "";
    }
    
}]);