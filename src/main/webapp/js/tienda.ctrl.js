(function(){
    var app = angular.module('tienda-admin');
    var domain = 'http://127.0.0.1:8080/';
    
    app.config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.useXDomain=true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);

    app.factory('showProductoServicio', ['$http', function($http){
        var rest = function(){};
        rest.base_url = domain + 'TiendasAdmin/rest/producto';
        rest.tienda;
        rest.productos = [];
        rest.openListProducto = function(tienda){
            rest.tienda = tienda;

            $http({
                method: 'GET',
                url: rest.base_url+'/findbytienda/' + rest.tienda.id
            }).then(function successCallback(response) {
                console.log(response.status + " " + response.data.length)
                rest.productos = response.data;
            }, function errorCallback(response) {
            });

        };

        return rest;
    }]);

    app.controller('SlideNavCtrl', ['$scope', function($scope){
        $scope.myClass = '';
        $scope.checkClass = function($event) {
            var state = true;
            if($scope.myClass.indexOf('toggled') === -1) {
                state = false;
            } 
            
            $event.preventDefault();

            if(state===false) {
                $scope.myClass = 'toggled';
            } else {
                $scope.myClass = '';
            }
        }

        
    }])

    app.controller('tiendaCtrl', ['$scope', '$http', 'showProductoServicio', function($scope, $http,  
        showProductoServicio){
        $scope.showProductoServicio = showProductoServicio;
        $scope.base_url = domain + 'TiendasAdmin/rest/tienda';
        $scope.tiendas = [];
        $scope.tienda = null;

        $http({
            method: 'GET',
            url: $scope.base_url+'/findall'
        }).then(function successCallback(response) {
            $scope.tiendas = response.data;
        }, function errorCallback(response) {
        });

        $scope.deleteTienda = function(id) {
            var result = confirm("¿Esta seguro de eliminar esta Tienda? ");
            if(result === true) {
                $http({
                    method: 'DELETE',
                    url: $scope.base_url+'/delete/' + id
                }).then(function successCallback(response) {
                    
                    console.log("info " + response.status + " data " + response.data);

                    $http({
                        method: 'GET',
                        url: $scope.base_url+'/findall'
                    }).then(function successCallback(response) {                        
                        $scope.tiendas = response.data;
                        $scope.showProductoServicio.productos = [];
                        $scope.showProductoServicio.tienda = null;
                    }, function errorCallback(response) {
                    });

                }, function errorCallback(response) {
                     console.log("error " + response.status + " data " + response.data);
                });
            }
        }

        $scope.addTienda = function() {
            console.log("info " + $scope.newTienda + " data " +$scope.newTienda.nombre);
            $scope.newTienda.id ="";
            $scope.newTienda.productos = [];
             $http({
                    method: 'POST',
                    url: $scope.base_url+'/create',
                    data: $scope.newTienda
               }).then(function successCallback(response) {
                    
                    console.log("info " + response.status + " data " + response.data);

                    $http({
                        method: 'GET',
                        url: $scope.base_url+'/findall'
                    }).then(function successCallback(response) {                        
                        $scope.tiendas = response.data;
                    }, function errorCallback(response) {
                    });

                }, function errorCallback(response) {
                     console.log("error " + response.status + " data " + response.data);
                });
        }
      
    }]);

     app.controller('productoCtrl', ['$scope', '$http','$routeParams','$location', 'showProductoServicio', function($scope, $http, 
        $routeParams, $location, showProductoServicio){
       
        $scope.showProductoServicio = showProductoServicio;
        $scope.base_url = domain + 'TiendasAdmin/rest/producto';    
       

        /*$scope.tiendas = [];

        $http({
            method: 'GET',
            url: $scope.base_url_two+'/findall'
        }).then(function successCallback(response) {
            $scope.tiendas = response.data;
        }, function errorCallback(response) {
        });*/

        $scope.addProducto = function(){
            
            $scope.tienda = {'id': $routeParams.tienda_id, 'nombre':''}
            $scope.newProducto.tienda =  $scope.tienda;
            
            $http({
                method: 'POST',
                url: $scope.base_url+'/create',
                data: $scope.newProducto
            }).then(function successCallback(response) {                
                console.log(response.data);
                $scope.showProductoServicio.productos = [];
                $scope.showProductoServicio.tienda = null;

                $location.path("/");
            }, function errorCallback(response) {
                console.log(response.data);
                alert(response.data);
            });

               
        }

        $scope.deleteProducto = function(id) {
            var result = confirm("¿Esta seguro de eliminar este Producto? ");
            if(result === true) {
            $http({
                method: 'DELETE',
                url: $scope.base_url+'/delete/' + id
            }).then(function successCallback(response) {
                
                console.log("info " + response.status + " data " + response.data);

                $http({
                    method: 'GET',
                    url: $scope.base_url +'/findbytienda/' + $scope.showProductoServicio.tienda.id
                }).then(function successCallback(response) {
                    console.log(response.status + " " + response.data.length)
                    $scope.showProductoServicio.productos = response.data;
                }, function errorCallback(response) {
                });

            }, function errorCallback(response) {
                    console.log("error " + response.status + " data " + response.data);
            });
        }
    }

     }]);

    app.controller('verProductoCtrl', ['$scope', '$http','$routeParams','$location', 'showProductoServicio', function($scope, $http, 
            $routeParams, $location, showProductoServicio){ 
        $scope.showProductoServicio = showProductoServicio;
        $scope.base_url = domain + 'TiendasAdmin/rest/producto';    
        $scope.base_url_two = domain + 'TiendasAdmin/rest/tienda'; 

        $http({
            method: 'GET',
            url: $scope.base_url+'/findbyid/' +  $routeParams.producto_id
        }).then(function successCallback(response) {
            $scope.producto = response.data;

            $http({
                method: 'GET',
                url: $scope.base_url_two+'/findall'
            }).then(function successCallback(response) {
                $scope.tiendas = response.data;

                $scope.data = {
                    availableOptions: $scope.tiendas,
                    selectedOption: $scope.producto.tienda
                };

            }, function errorCallback(response) {
            });

        }, function errorCallback(response) {
        });

        $scope.tiendas = [];

        $scope.updateProducto = function() {
           // alert($scope.data.selectedOption.nombre); 
            
            $scope.producto.tienda = $scope.data.selectedOption;
            
            $http({
                method: 'PUT',
                url: $scope.base_url+'/edit',
                data: $scope.producto
            }).then(function successCallback(response) {                
                console.log(response.data);  
                $scope.showProductoServicio.productos = [];
                $scope.showProductoServicio.tienda = null;                      
            }, function errorCallback(response) {
                console.log(response.data);
                alert(response.data);
            });
            

        }

    }]);
})();