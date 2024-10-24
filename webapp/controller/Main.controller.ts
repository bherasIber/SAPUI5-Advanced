import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace logaligroup.employees.controller
 */
export default class Main extends Controller {
    
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

        const oJSONModelLayouts = new JSONModel(); 
        void oJSONModelLayouts.loadData("./localService/mockdata/Layouts.json", false);
        oView?.setModel(oJSONModelLayouts, "jsonLayouts");
                
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

}