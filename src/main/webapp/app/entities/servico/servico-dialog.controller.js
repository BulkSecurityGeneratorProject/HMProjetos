(function() {
    'use strict';

    angular
        .module('hmProjetosApp')
        .controller('ServicoDialogController', ServicoDialogController);

    ServicoDialogController.$inject = ['Codigos','$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Servico', 'Situacao', 'Transacao', 'Orcamento', 'Cliente'];

    function ServicoDialogController (Codigos, $timeout, $scope, $stateParams, $uibModalInstance, entity, Servico, Situacao, Transacao, Orcamento, Cliente) {
        var vm = this;

        vm.servico = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.situacaos = Situacao.query();
        vm.transacaos = Transacao.query();
        vm.orcamentos = Orcamento.query();
        vm.clientes = Cliente.query();
        vm.codigos = [];

        vm.cepinvalido = false;

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        $scope.GerarCodigo = function(){

            Codigos.query(function(result) {

                for(var i = 0; i < result.length; i++){

                    if(vm.servico.tipo == result[i].tipo){

                        vm.servico.codigo = vm.servico.tipo + "-" + result[i].ano + "." + result[i].numero

                    }

                }

                vm.codigos = result;
                vm.searchQuery = null;
            });

        }

        var limpa_formulario_cep = function(){
            vm.servico.endereco = "";
            vm.servico.bairro = "";
            vm.servico.cidade = "";
            vm.servico.estado = "";
        }

        $scope.buscaCEP = function(){
                //Nova variável "cep" somente com dígitos.
                var cep = vm.servico.cep;

                //Verifica se campo cep possui valor informado.
                if (cep != "") {

                    //Expressão regular para validar o CEP.
                    var validacep = /^[0-9]{8}$/;

                    //Valida o formato do CEP.
                    if(validacep.test(cep)) {

                        //Preenche os campos com "..." enquanto consulta webservice.
                        vm.servico.endereco = "...";
                        vm.servico.bairro = "...";
                        vm.servico.cidade = "...";
                        vm.servico.estado = "..";

                        //Consulta o webservice viacep.com.br/
                        $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {

                            console.log(dados);

                            if (!("erro" in dados)) {
                                //Atualiza os campos com os valores da consulta.
                                vm.cepinvalido = false;
                                vm.servico.endereco = dados.logradouro;
                                vm.servico.bairro = dados.bairro;
                                vm.servico.cidade = dados.localidade;
                                vm.servico.estado = dados.uf;
                                $scope.$apply();

                            } //end if.
                            else {
                                //CEP pesquisado não foi encontrado.
                                limpa_formulario_cep();
                                //alert("CEP não encontrado.");
                                vm.cepinvalido = true;
                                $scope.$apply();
                            }
                        });
                    } //end if.
                    else {
                        //cep é inválido.
                        limpa_formulario_cep();
                        vm.cepinvalido = true;
                        $scope.$apply();
                        //alert("Formato de CEP inválido.");
                    }
                } //end if.
                else {
                    //cep sem valor, limpa formulário.
                    limpa_formulario_cep();
                    $scope.$apply();
                }

            }


        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.servico.id !== null) {
                Servico.update(vm.servico, onSaveSuccess, onSaveError);
            } else {

                Codigos.query(function(result) {

                for(var i = 0; i < result.length; i++){

                    if(vm.servico.tipo == result[i].tipo){

                        result[i].numero++;
                        Codigos.update(result[i]);

                    }

                }

                vm.codigos = result;
                vm.searchQuery = null;
            });


                Servico.save(vm.servico, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('hmProjetosApp:servicoUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.inicio = false;
        vm.datePickerOpenStatus.fim = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }
    }
})();