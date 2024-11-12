import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageToast from "sap/m/MessageToast";
import ResourceBundle from "sap/base/i18n/ResourceBundle";

interface IncidenceData {
    IncidenceId?: string;
    CreationDate: Date;
    Type: string;
    Reason: string;
}
/**
 * @namespace logaligroup.employees.controller
 */
export default class Main extends Controller {
    
    private _bus: import("sap/ui/core/EventBus").default;
    
    private _detailEmployeeView: sap.ui.core.Control | undefined;

    public onBeforeRendering(): void {
        this._detailEmployeeView = this.getView()?.byId("detailEmployeeView") as sap.ui.core.Control;
    }

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

        this._bus = sap.ui.getCore().getEventBus();
        this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);
        this._bus.subscribe("incidence", "onSaveIncidence", this.onSaveODataIncidence, this);
    }

    public showEmployeeDetails(category, nameEvent, path): void {
        var detailView = this.getView()?.byId("detailEmployeeView");
        detailView?.bindElement("odataNorthwind>" + path);
        this.getView()?.getModel("jsonLayouts")?.setProperty("/ActiveKey", "TwoColumnsMidExpanded");

        var incidenceModel = new sap.ui.model.json.JSONModel([]);
        detailView?.setModel(incidenceModel, "incidenceModel");

        detailView?.byId("tableIncidence").removeAllContent();
    }

    public onSaveODataIncidence(channelId: string, eventId: string, data: { incidenceRow: number }): void {
        const oResourceBundle: ResourceBundle | undefined = this.getView()?.getModel("i18n")?.getResourceBundle();
        const employeeId: string | undefined = this._detailEmployeeView?.getBindingContext("odataNorthwind")?.getObject()?.EmployeeID;
        const incidenceModel = this._detailEmployeeView?.getModel("incidenceModel") as JSONModel;
        const incidenceData = incidenceModel.getData() as IncidenceData[];

        if (typeof incidenceData[data.incidenceRow].IncidenceId === 'undefined') {
            const body = {
                SapId: this.getOwnerComponent()?.SapId,
                EmployeeId: employeeId?.toString() || "",
                CreationDate: incidenceData[data.incidenceRow].CreationDate,
                Type: incidenceData[data.incidenceRow].Type,
                Reason: incidenceData[data.incidenceRow].Reason
            };

            this.getView()?.getModel("incidenceModel")?.create("/IncidentsSet", body, {
                success: function () {
                    if (oResourceBundle) {
                        MessageToast.show(oResourceBundle.getText("odataSaveOK"));
                    }
                },
                error: function (e: any) {
                    if (oResourceBundle) {
                        MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                    }
                }
            });
        } else {
            if (oResourceBundle) {
                MessageToast.show(oResourceBundle.getText("odataNoChanges"));
            }
        }
    }

}