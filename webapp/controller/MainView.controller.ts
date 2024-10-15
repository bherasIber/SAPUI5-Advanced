import Input from "sap/m/Input";
import Label from "sap/m/Label";
import Select from "sap/m/Select";
import Controller from "sap/ui/core/mvc/Controller";

/**
 * @namespace logaligroup.employees.controller
 */
export default class MainView extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
        // Aquí puedes inicializar cualquier lógica si es necesario
    }

    public onValidate(): void {
        const inputEmployee = this.byId("inputEmployee") as Input;

        // Verificar que inputEmployee no sea undefined antes de continuar
        if (inputEmployee) {
            const valueEmployee = inputEmployee.getValue();

            const labelCountry = this.getView()?.byId("labelCountry") as Label;
            const slCountry = this.getView()?.byId("slCountry") as Select;

            if (valueEmployee.length === 6) {
                labelCountry?.setVisible(true);
                slCountry?.setVisible(true);
            } else {
                labelCountry?.setVisible(false);
                slCountry?.setVisible(false);
            }
        }
    }
    
}