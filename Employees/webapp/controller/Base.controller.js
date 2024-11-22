// @ts-nocheck
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("logaligroup.Employees.controller.Base", {

        /**
         * @override
         */
        onInit: function() {
            Controller.prototype.onInit.apply(this, arguments);
            
        
        },

        toOrderDetails: function (oEvent) {
            var orderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteOrderDetails",{
                OrderID : orderID
            });
        }

	});
});