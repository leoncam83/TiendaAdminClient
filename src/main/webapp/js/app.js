(function(){
   angular.module('tienda-admin',["ngRoute"]).config(['$routeProvider', function($routeProvider){
        $routeProvider.when("/",{
            controller: "SlideNavCtrl",
            templateUrl: "template/home.html"
        }).when("/newProducto/:tienda_id",{
            controller: "productoCtrl",
            templateUrl: "template/newproducto.html"
        }).when("/verProducto/:producto_id",{
            controller: "verProductoCtrl",
            templateUrl: "template/verproducto.html"
        }).otherwise({redirectTo: '/'});
    }]);
})();