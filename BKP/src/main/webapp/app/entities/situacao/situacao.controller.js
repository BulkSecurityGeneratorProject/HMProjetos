(function() {
    'use strict';

    angular
        .module('hmProjetosApp')
        .controller('SituacaoController', SituacaoController);

    SituacaoController.$inject = ['ExtendUser','$scope','TipoSituacao','Situacao', 'ParseLinks', 'AlertService', 'paginationConstants'];

    function SituacaoController(ExtendUser, $scope, TipoSituacao, Situacao, ParseLinks, AlertService, paginationConstants) {

        var vm = this;

        vm.situacaos = [];
        vm.tipoSituacaos = [];
        vm.loadPage = loadPage;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.page = 0;
        vm.links = {
            last: 0
        };
        vm.predicate = 'id';
        vm.reset = reset;
        vm.reverse = true;

        // loadAll();

        loadFiltros();
        loadAll();

        $scope.printToCart = function(printSectionId) {
        var innerContents = document.getElementById(printSectionId).outerHTML;
        var popupWinindow = window.open('', '_blank', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        popupWinindow.document.open();
        popupWinindow.document.write("<html><head><link rel='stylesheet' href='content/css/main.css'><link rel='stylesheet' href='bower_components/bootstrap/dist/css/bootstrap.css'><link rel='stylesheet' href='bower_components/angular-loading-bar/build/loading-bar.css'></head><body onload='window.print()'>" + innerContents + '</html>');
        popupWinindow.document.close();
        // window.print();
      }


        $scope.gerarRelatorio = function(){

            vm.situacaos = [];

            console.log(vm.tipo);
            console.log(vm.responsavel);

            if(vm.tipo && !vm.responsavel){

                Situacao.queryByTipo({
                    Tid:vm.tipo.id,
                    sort: sort()
                }, function(data){
                    console.log(data);
                    vm.situacaos = data;
                }, function(){
                    // console.log("Erro");
                });
                // console.log("Busca por tipo só");

                function sort() {
                var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
                if (vm.predicate !== 'id') {
                    result.push('id');
                }
                return result;
                }

            }
            if(!vm.tipo && vm.responsavel){
                // console.log("Busca por responsavel só");

                Situacao.queryByResponsavel({
                    Rid:vm.responsavel.id,
                    sort: sort()
                }, function(data){
                    console.log(data);
                    vm.situacaos = data;
                }, function(){
                    // console.log("Erro");
                });

                function sort() {
                var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
                if (vm.predicate !== 'id') {
                    result.push('id');
                }
                return result;
                }

            }
            if(vm.tipo && vm.responsavel){
                // console.log("Busca pelos dois");

                Situacao.queryByTipoResponsavel({
                    Rid:vm.responsavel.id,
                    Tid:vm.tipo.id,
                    sort: sort()
                }, function(data){
                    console.log(data);
                    vm.situacaos = data;
                }, function(){
                    // console.log("Erro");
                });

                function sort() {
                var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
                if (vm.predicate !== 'id') {
                    result.push('id');
                }
                return result;
                }

            }


            if(!vm.tipo && !vm.responsavel){
                loadAll();
            }



        }

        function loadFiltros(){

            TipoSituacao.query(function(result) {
                vm.tipoSituacaos = result;
                vm.searchQuery = null;
            });
            ExtendUser.query(function(result) {
                vm.extendUsers = result;
                vm.searchQuery = null;
            });
        }

        function loadAll () {

            Situacao.query({
                page: vm.page,
                size: vm.itemsPerPage,
                sort: sort()
            }, onSuccess, onError);

            function sort() {
                var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
                if (vm.predicate !== 'id') {
                    result.push('id');
                }
                return result;
            }

            function onSuccess(data, headers) {
                vm.links = ParseLinks.parse(headers('link'));
                vm.totalItems = headers('X-Total-Count');
                for (var i = 0; i < data.length; i++) {
                    vm.situacaos.push(data[i]);
                }
            }

            function onError(error) {
                AlertService.error(error.data.message);
            }
        }

        function reset () {
            vm.page = 0;
            vm.situacaos = [];
            // loadAll();
            $scope.gerarRelatorio();
        }

        function loadPage(page) {
            vm.page = page;
            // loadAll();
            $scope.gerarRelatorio();
        }
    }
})();
