import Input from "sap/m/Input";
import Label from "sap/m/Label";
import Select from "sap/m/Select";
import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel"; // Asegúrate de importar ResourceModel
import FilterOperator from "sap/ui/model/FilterOperator";
import Filter from "sap/ui/model/Filter";
import MessageToast from "sap/m/MessageToast";
import ColumnListItem from "sap/m/ColumnListItem";
import Table from "sap/m/Table";
import Column from "sap/m/Column";


interface ICustomResourceBundle {
    getText(key: string, args?: unknown[]): string;  // Definir el método getText
}

/**
 * @param {typeof sap.ui.core.mvd.Controller} Controller
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 * @param {typeof sap.ui.model.resource.ResourceModel} ResourceModel
 * @param {typeof sap.ui.model.Filter} Filter
 * @param {typeof sap.ui.model.FilterOperator} FilterOperator
 * @param {typeof sap.m.MessageToast} MessageToast
 */

/**
 * @namespace logaligroup.employees.controller
 */
export default class MainView extends Controller {
    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
        const oView = this.getView();
        
        // Castea el modelo de i18n a ResourceModel para acceder a getResourceBundle
        //const i18nModel = oView?.getModel("i18n") as ResourceModel; 
        //const i18nBundle = i18nModel?.getResourceBundle() as ICustomResourceBundle; // Ahora esto debería funcionar

        const oJSONModelEmpl = new JSONModel(); 
        void oJSONModelEmpl.loadData("./localService/mockdata/Employees.json", false);
        oView?.setModel(oJSONModelEmpl, "jsonEmployees");

        const oJSONModelCountries = new JSONModel(); 
        void oJSONModelCountries.loadData("./localService/mockdata/Countries.json", false);
        oView?.setModel(oJSONModelCountries, "jsonCountries");
                
        const oJSONModelConfig = new JSONModel({
            visibleID: true,
            visibleName: true,
            visibleCountry: true,
            visibleCity: false,
            visibleBtnShowCity: true,
            visibleBtnHideCity: false
        }); 
        oView?.setModel(oJSONModelConfig, "jsonModelConfig");


    }

    public onFilter(): void { 
        const oJSONCountries = this.getView()?.getModel("jsonCountries")?.getData();
        var filters = [];

        if(oJSONCountries.EmployeeId !== ""){
            filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCountries.EmployeeId));
        }

        if(oJSONCountries.CountryKey !== ""){
            filters.push(new Filter("Country", FilterOperator.EQ, oJSONCountries.CountryKey));
        }

        var oList = this.getView()?.byId("tableEmployee");
        var oBinding = oList?.getBinding("items");
        oBinding?.filter(filters);

    }

    public onClearFilter(): void {
        var oModel = this.getView()?.getModel("jsonCountries");
        oModel?.setProperty("/EmployeeId", "");
        oModel?.setProperty("/CountryKey", "");
    }

    public showPostalCode(oEvent: any): void {
        const itemPressed = oEvent.getSource();
        const oContext = itemPressed.getBindingContext("jsonEmployees");
        const objectContext = oContext.getObject();

        MessageToast.show(objectContext.PostalCode);
    }

    public onShowCity(): void {
        var oJSONModelConfig = this.getView()?.getModel("jsonModelConfig");
        oJSONModelConfig?.setProperty("/visibleCity", true);
        oJSONModelConfig?.setProperty("/visibleBtnShowCity", false);
        oJSONModelConfig?.setProperty("/visibleBtnHideCity", true);
    }

    public onHideCity(): void {
        var oJSONModelConfig = this.getView()?.getModel("jsonModelConfig");
        oJSONModelConfig?.setProperty("/visibleCity", false);
        oJSONModelConfig?.setProperty("/visibleBtnShowCity", true);
        oJSONModelConfig?.setProperty("/visibleBtnHideCity", false);
    }

    public showOrders(oEvent): void {
        var ordersTable = this.getView()?.byId("ordersTable");
        ordersTable?.destroyItems();

        var itemPressed = oEvent.getSource();
        var oContext = itemPressed.getBindingContext("jsonEmployees");

        var objectContext = oContext.getObject();
        var orders = objectContext.Orders;

        var ordersItems = [];

        for (var i in orders) {
            ordersItems.push(new ColumnListItem({
                cells: [
                    new Label({ text: orders[i].OrderID}),
                    new Label({ text: orders[i].Freight}),
                    new Label({ text: orders[i].ShipAddress})
                ]
            }));
        }

        var newTable = new Table({
            width: "auto",
            columns: [
                new Column({header: new Label({text: "{i18n>orderID}"})}),
                new Column({header: new Label({text: "{i18n>freight}"})}),
                new Column({header: new Label({text: "{i18n>shipAddress}"})})
            ],
            items: ordersItems
        }).addStyleClass("sapUiSmallMargin");

        ordersTable?.addItem(newTable);


        var newTableJSON = new Table();
        newTableJSON.setWidth("auto");
        newTableJSON.addStyleClass("sapUiSmallMargin");

        var columnOrderID = new Column();
        var labelOrderID = new Label();
        labelOrderID.bindProperty("text","i18n>orderID");
        columnOrderID.setHeader(labelOrderID);
        newTableJSON.addColumn(columnOrderID);
        
        var columnFreight = new Column();
        var labelFreight = new Label();
        labelFreight.bindProperty("text","i18n>freight");
        columnFreight.setHeader(labelFreight);
        newTableJSON.addColumn(columnFreight);

        var columnShipAddress = new Column();
        var labelShipAddress = new Label();
        labelShipAddress.bindProperty("text","i18n>shipAddress");
        columnShipAddress.setHeader(labelShipAddress);
        newTableJSON.addColumn(columnShipAddress);

        var columnListItem = new ColumnListItem();

        var cellOrderID = new Label();
        cellOrderID.bindProperty("text","jsonEmployees>OrderID");
        columnListItem.addCell(cellOrderID);

        var cellFreight = new Label();
        cellFreight.bindProperty("text","jsonEmployees>Freight");
        columnListItem.addCell(cellFreight);

        var cellShipAddress = new Label();
        cellShipAddress.bindProperty("text","jsonEmployees>ShipAddress");
        columnListItem.addCell(cellShipAddress);

        var oBindingInfo = {
            model: "jsonEmployees",
            path: "Orders",
            template: columnListItem
        };

        newTableJSON.bindAggregation("items", oBindingInfo);
        newTableJSON.bindElement("jsonEmployees>" + oContext.getPath());

        ordersTable?.addItem(newTableJSON);

    }
    
    public onValidate(): void {
        const inputEmployee = this.byId("inputEmployee") as Input;

        // Verificar que inputEmployee no sea undefined antes de continuar
        if (inputEmployee) {
            const valueEmployee = inputEmployee.getValue();

            const labelCountry = this.getView()?.byId("labelCountry") as Label;
            const slCountry = this.getView()?.byId("slCountry") as Select;

            // Asegúrate de que 'valueEmployee' sea una cadena antes de comprobar su longitud
            if (typeof valueEmployee === "string" && valueEmployee.length === 6) {
                labelCountry?.setVisible(true);
                slCountry?.setVisible(true);
            } else {
                labelCountry?.setVisible(false);
                slCountry?.setVisible(false);
            }
        }
    }
}
