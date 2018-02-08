(function() {
    'use strict';

    angular
        .module('hmProjetosApp')
        .controller('ClienteController', ClienteController);

    ClienteController.$inject = ['Cliente','$scope'];

    function ClienteController(Cliente,$scope) {

        var vm = this;

        vm.clientes = [];

        /* function */
         $scope.Filtrar = function(){

            Cliente.query(function(result) {

                var clientesfiltrados = [];

                if(vm.filtro!=null){
                for(var i=0;i<result.length;i++){

                // console.log(result[i].nome + " inclui " + vm.filtro + "?");
                // console.log(result[i].nome.includes(vm.filtro));

                if(result[i].nome.toLowerCase().includes(vm.filtro.toLowerCase())){
                    clientesfiltrados.push(result[i]);
                }
                }
            }

                vm.clientes = clientesfiltrados;
                vm.searchQuery = null;
            });
        }




        loadAll();

        function loadAll() {
            Cliente.query(function(result) {

                


                vm.clientes = result;
                vm.searchQuery = null;
            });
        }
    }
})();