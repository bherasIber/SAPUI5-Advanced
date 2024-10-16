import Input from "sap/m/Input";
import Label from "sap/m/Label";
import Select from "sap/m/Select";
import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel"; // Asegúrate de importar ResourceModel
import FilterOperator from "sap/ui/model/FilterOperator";
import Filter from "sap/ui/model/Filter";


interface ICustomResourceBundle {
    getText(key: string, args?: unknown[]): string;  // Definir el método getText
}

/**
 * @namespace logaligroup.employees.controller
 */
export default class MainView extends Controller {
    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
        const oJSONModel = new JSONModel(); 
        const oView = this.getView();
        
        // Castea el modelo de i18n a ResourceModel para acceder a getResourceBundle
        const i18nModel = oView?.getModel("i18n") as ResourceModel; 
        const i18nBundle = i18nModel?.getResourceBundle() as ICustomResourceBundle; // Ahora esto debería funcionar

        // const oJSON = {
        //     employeeId: "12345",
        //     countryKey: "UK",
        //     listCountry: [
        //         {
        //             key: "US",
        //             text: i18nBundle ? i18nBundle.getText("countryUS") : "United States" // Valor por defecto
        //         },
        //         {
        //             key: "UK",
        //             text: i18nBundle ? i18nBundle.getText("countryUK") : "United Kingdom" // Valor por defecto
        //         },
        //         {
        //             key: "ES",
        //             text: i18nBundle ? i18nBundle.getText("countryES") : "Spain" // Valor por defecto
        //         }
        //     ]
        // }; 
        
        // oJSONModel.setData(oJSON);

        void oJSONModel.loadData("./localService/mockdata/Employees.json");
        // oJSONModel.attachRequestCompleted(function (oEventModel){
        //     console.log(JSON.stringify(oJSONModel.getData()));
        // });
        oView?.setModel(oJSONModel);
    }

    public onFilter(): void { 
        const oJSON = this.getView()?.getModel()?.getData();
        var filters = [];

        if(oJSON.EmployeeId !== ""){
            filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSON.EmployeeId));
        }

        if(oJSON.CountryKey !== ""){
            filters.push(new Filter("Country", FilterOperator.EQ, oJSON.CountryKey));
        }

        var oList = this.getView()?.byId("tableEmployee");
        var oBinding = oList?.getBinding("items");
        oBinding?.filter(filters);

    }

    public onClearFilter(): void {
        var oModel = this.getView()?.getModel();
        oModel?.setProperty("/EmployeeId", "");
        oModel?.setProperty("/CountryKey", "");
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
