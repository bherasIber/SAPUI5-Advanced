// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "logaligroup/Employees/model/formatter",
    "sap/m/MessageBox"
], function (Controller, formatter, MessageBox) {

    function onInit() {
        this._bus = sap.ui.getCore().getEventBus();
    };

    function onCreateIncidence() {

        var tableIncidence = this.getView().byId("tableIncidence");
        var newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence", this);
        var incidenceModel = this.getView().getModel("incidenceModel");
        var odata = incidenceModel.getData();
        var index = odata.length;
        odata.push({ index: index + 1, _ValidateDate: false, EnabledDate: false });
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index);
        tableIncidence.addContent(newIncidence);

    };

    function onDeleteIncidence(oEvent) {

        var contexjObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();

        MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("confirmDeleteIncience"),{
            onClose : function(oAction) {
                        if(oAction === "OK")
                        this._bus.publish("incidence", "onDeleteIncidence", {
                            IncidenceId: contexjObj.IncidenceId,
                            SapId: contexjObj.SapId,
                            EmployeeId: contexjObj.EmployeeId
                        })
                    }.bind(this)
        })

    };

    function onSaveIncidence(oEvent) {
        var incidence = oEvent.getSource().getParent().getParent();
        var incidenceRow = incidence.getBindingContext("incidenceModel");
        this._bus.publish("incidence", "onSaveIncidence", { incidenceRow: incidenceRow.sPath.replace('/', '') });
    };

    function updateIncidenceCreationDate(oEvent) {
        var context = oEvent.getSource().getBindingContext("incidenceModel");
        var contextObj = context.getObject();
        
        var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

         // Obtiene el valor y lo intenta convertir a fecha
        var dateValue = oEvent.getSource().getValue();
        var partes = dateValue.split("/");
        var dia = partes[0]; 
        var mes = partes[1]; 
        var ano = "20" + partes[2];
        var fechaNueva = ano + "-" + mes + "-" + dia;
        var parsedDate = new Date(fechaNueva);

        // Comprueba si la fecha es válida
        if (parsedDate instanceof Date && !isNaN(parsedDate.getTime())) {
            // Fecha válida
            contextObj.CreationDateX = true;
            contextObj._ValidateDate = true;
            contextObj.CreationDateState = "None";
        } else {
            // Fecha no válida
            contextObj._ValidateDate = false;
            contextObj.CreationDateState = "Error";
            MessageBox.error(oResourceBundle.getText("errorCreationDateValue"), {
                title : "Error",
                onClose : null,
                styleClass : "",
                actions : MessageBox.Action.Close,
                emphasizedAction : null,
                initialFocus: null,
                textDirection : sap.ui.core.TextDirection.Inherit
                
            })
        }

        if(parsedDate instanceof Date && !isNaN(parsedDate.getTime()) && contextObj.Reason){
            contextObj.EnabledSave = true;
        }
        else{
            contextObj.EnabledSave = false;
        }
        context.getModel().refresh();
        
    };

    function updateIncidenceReason(oEvent) {
        var context = oEvent.getSource().getBindingContext("incidenceModel");
        var contextObj = context.getObject();

        if(oEvent.getSource().getValue().length > 0){
            contextObj.ReasonX = true;
            contextObj.ReasonState = "None";
        } else {
            contextObj.ReasonState = "Error";
        };

        if(contextObj._ValidateDate && oEvent.getSource().getValue() ){
            contextObj.EnabledSave = true;
        }
        else{
            contextObj.EnabledSave = false;
        }
        context.getModel().refresh();
    };

    function updateIncidenceType(oEvent) {
        var context = oEvent.getSource().getBindingContext("incidenceModel");
        var contextObj = context.getObject(); 

        if(contextObj._ValidateDate && contextObj.Reason ){
            contextObj.EnabledSave = true;
        }
        else{
            contextObj.EnabledSave = false;
        }

        contextObj.TypeX = true;

        context.getModel().refresh();
    };


    var EmployeeDetails = Controller.extend("logaligroup.Employees.controller.EmployeeDetails", {});

    EmployeeDetails.prototype.onInit = onInit;
    EmployeeDetails.prototype.onCreateIncidence = onCreateIncidence;
    EmployeeDetails.prototype.onDeleteIncidence = onDeleteIncidence;
    EmployeeDetails.prototype.Formatter = formatter;
    EmployeeDetails.prototype.onSaveIncidence = onSaveIncidence;
    EmployeeDetails.prototype.updateIncidenceCreationDate = updateIncidenceCreationDate;
    EmployeeDetails.prototype.updateIncidenceReason = updateIncidenceReason;
    EmployeeDetails.prototype.updateIncidenceType = updateIncidenceType;

    return EmployeeDetails;
}); 