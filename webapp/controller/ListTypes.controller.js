sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],

/**
 * 
 * @param {typeof sap.ui.core.mvc.Controller} Controller 
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
 * @returns 
 */

function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("logaligroup.listtypes.controller.ListTypes", {
        onInit: function () {
            var oJSONModel = new JSONModel();
            oJSONModel.loadData("./localServices/mockdata/ListData.json");
            this.getView().setModel(oJSONModel);
        },

        getGroupHeader: function (oGroup) {
            var groupHeaderListItem = new sap.m.GroupHeaderListItem({
                title : oGroup.key,
                upperCase : true
            });

            return groupHeaderListItem;
        },

        onShowSelectedRow: function () {
            var standarList = this.getView().byId("standarList");
            var selectedItems = standarList.getSelectedItems();

            var i18nModel = this.getView().getModel("i18n").getResourceBundle();

            if (selectedItems.length === 0){
                sap.m.MessageToast.show(i18nModel.getText("noSelection"));
            } else {
                
                var textMessage = i18nModel.getText("selection");

                for(var item in selectedItems){
                    var context = selectedItems[item].getBindingContext();
                    var oContext = context.getObject();
                    textMessage = textMessage + " - " + oContext.Material;
                }

                sap.m.MessageToast.show(textMessage);
            }
        }, 

        onDeleteSelectedRow: function () {
            var standarList = this.getView().byId("standarList");
            var selectedItems = standarList.getSelectedItems();

            var i18nModel = this.getView().getModel("i18n").getResourceBundle();

            if (selectedItems.length === 0){
                sap.m.MessageToast.show(i18nModel.getText("noSelection"));
            } else {
                
                var textMessage = i18nModel.getText("selection");
                var model = this.getView().getModel();
                var products = model.getProperty("/Products");
                
                var arrayId = [];

                for( var i in selectedItems) {
                    var context = selectedItems[i].getBindingContext();
                    var oContext = context.getObject();

                    arrayId.push(oContext.Id);
                    textMessage = textMessage + " - " + oContext.Material;
                }

                products = products.filter(function(p){
                    return !arrayId.includes(p.Id);
                });

                model.setProperty("/Products", products);
                standarList.removeSelections();
                sap.m.MessageToast.show(textMessage);
            }
        }
    });
});
