sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "logaligroup/employees/model/formatter"
], function (Controller, Fragment, formatter) {
    "use strict";

    return Controller.extend("logaligroup.employees.controller.EmployeeDetails",  {
        formatter: formatter, 
        onInit: function () {
            this.oEventBus = sap.ui.getCore().getEventBus();
              // Variable para almacenar el fragmento
            this._bus = sap.ui.getCore().getEventBus();
        },

        onCreteIncidence: function () {
            const oTableIncidence = this.getView().byId("tableIncidence");
            const oIncidenceModel = this.getView().getModel("incidenceModel");
            const aData = oIncidenceModel.getData();
            const iIndex = aData.length;

            // Agregar una nueva entrada al modelo
            aData.push({ 
                number: iIndex + 1,
                status: ""
             });
            oIncidenceModel.refresh();

            // Crear una nueva instancia del fragmento cada vez que se llama a onCreteIncidence
            Fragment.load({
                id: this.getView().createId("newIncidenceFragment_" + iIndex),  // Usa un id único para cada instancia
                name: "logaligroup.employees.fragment.NewIncidence",
                controller: this
            }).then(function (oFragment) {
                
                // Hacer el binding al control dentro del fragmento
                oFragment.bindElement("incidenceModel>/" + iIndex);
                
                // Añadir el fragmento a la tabla
                oTableIncidence.addContent(oFragment);
            }.bind(this));
        },

        onDeleteIncidence: function (oEvent){
            var tableIncidence = this.getView().byId("tableIncidence");
            var rowIncidence = oEvent.getSource().getParent();
            var incidenceModel = this.getView().getModel("incidenceModel");
            var odata = incidenceModel.getData();
            var contextObj = rowIncidence.getBindingContext("incidenceModel");

            odata.splice(contextObj.number-1,1);
            for(var i in odata){
                odata[i].number = parseInt(i)+1;
            }

            incidenceModel.refresh();
            tableIncidence.removeContent(rowIncidence);

            for(var j in tableIncidence.getContent()){
                tableIncidence.getContent()[j].bindElement("incidenceModel>/"+j);
            }
            
        },

        onStatusChange: function (oEvent) {
            const oSelectedItem = oEvent.getSource();
            const sNewStatus = oSelectedItem.getSelectedKey();
        
            // Obtiene el contexto de binding para actualizar el modelo
            const oBindingContext = oSelectedItem.getBindingContext("incidenceModel");
            if (oBindingContext) {
                // Actualiza el status en el modelo de datos
                oBindingContext.getModel().setProperty(oBindingContext.getPath() + "/status", sNewStatus);
            }
        },

        onSaveIncidence: function (oEvent) {
            var incidence = oEvent.getSource().getParent();
            var incidenceRow = incidence.getBindingContext("incidenceModel");
            this._bus.publish("incidence", "onSaveIncidence", { incidenceRow : incidenceRow.sPath.replace('/','') });         
        }

    });
});