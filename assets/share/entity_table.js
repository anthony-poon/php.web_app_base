import 'datatables.net/js/jquery.dataTables'
import 'datatables.net-bs4';
import 'datatables.net-buttons-bs4/js/buttons.bootstrap4';
import 'datatables.net-select-bs4/js/select.bootstrap4';
import 'datatables.net-responsive-bs4/js/responsive.bootstrap4';
import URI from "urijs";
import 'urijs/src/URITemplate';
import _ from "underscore";

export default class EntityTable {
    constructor(options) {
        this.el = options.el;
        this.column = $(this.el).data("column");
        this.btns = $(this.el).data("btn");
    }

    init() {
        let arr = [];
        this.btns.forEach((btn) => {
            let re = /{([\w_\-])+}/;
            let haveParam = re.test(btn.path) || !_.isEmpty(btn.param);
            let className = "table-btn";
            if (haveParam) {
                className += " have-param";
            }
            arr.push({
                "text": btn.name,
                className: className,
                action: (e, dt, node, config) => {
                    let id = parseInt(dt.rows(".selected").ids().toArray()[0]);
                    let rowParam = dt.rows(".selected").nodes().to$().data("param");
                    let path = btn.path;
                    if (!_.isEmpty(btn.param)) {
                        let queryStr = [];
                        btn.param.forEach((key) => {
                            queryStr.push(key + "=" + rowParam[key]);
                        });
                        queryStr = encodeURI(queryStr.join("&"));
                        path = path + "?" + queryStr;
                    }
                    location.href = URI.expand(path, {
                        id: id
                    });
                },
            })
        });
        this.table = $(this.el).DataTable({
            "select": {
                "style": "single"
            },
            "column": this.column,
            "responsive": true,
            "dom":  "<'row table_btn_grp'<'col d-flex align-items-center'B><'col-auto'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col'i><'col-auto'p>>",
            "buttons": arr,
        });
        this.table.buttons(".table-btn.have-param").disable();
        this.table.on('select', (e, dt, type, indexes) => {
            if (this.table.rows(".selected")[0].length === 0) {
                this.table.buttons(".table-btn.have-param").disable();
            } else if (this.table.rows(".selected")[0].length === 1) {
                this.table.buttons(".table-btn.have-param").enable();
            }
        });
        this.table.on('deselect', (e, dt, type, indexes) => {
            if (this.table.rows(".selected")[0].length === 0) {
                this.table.buttons(".table-btn.have-param").disable();
            } else if (this.table.rows(".selected")[0].length === 1) {
                this.table.buttons(".table-btn.have-param").enable();
            }
        });
    }
}