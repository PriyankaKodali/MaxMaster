import React, { Component } from 'react';
import Select from 'react-select';
import $ from 'jquery';
import { ApiUrl } from '../Config';
import './Bill.css';
import { Items } from './Items';
import Item from './Item';
import { showErrorsForInput, setUnTouched, ValidateForm } from '.././Validation';
import validate from 'validate.js';
import { toast } from 'react-toastify';
import { MyAjaxForAttachments } from '../MyAjax';
import Model from '../Stock/Model';
import ClientRegistration from '../Client/ClientRegistration';
import ClientLocation from '../Client/ClientLocation';

import Creatable from 'react-select/lib/Creatable';


var moment = require('moment');


class Bill extends Component {

    constructor(props) {
        super(props);

        var item = [{ Item: null, Description: "", Quantity: '', Rate: "", Tax: null, Amount: "", Model: '', UPC: '', TaxRate: "", SerialNumExists: '', Id: null, Units: "" }];
        var itemDetails = [];
        this.state = {
            ItemsList: item, Items: [], Item: null, SubTotal: "0.00", Adjustment: "0.00", Total: "0.00",
            Suppliers: [], Supplier: null, ItemSelected: false, Model: '', UPC: '', Quantity: '',
            ItemDetails: itemDetails, ItemRefs: [], ModelId: '', TDS: [], tds: null, StockLocations: [],
            StockLocation: null, TdsAmount: "0.00", WarrentyDuration: null, modelDetails: [],
            AddItemInformation: false, DiscountAmount: "0.00", TaxPreferences: [],
            viewTaxPreference: false, viewItemTax: false, TotalTaxAmount: "0.00", DiscountType: null,
            AddNewModel: false, AddNewSupplier: false, CourierCharges: "0.00", BilledItems: [], Bill: [],
            DisableChanges: false, UpdateBill: true, RoundOffNumber: "0.00", SupplierBankDetails: [],
            ViewSupplierDetails: false, ModelInfo: []
        }
    }

    componentWillMount() {

        if (this.props.match !== undefined) {

            if (this.props.match.params["id"] !== undefined) {
                var items = [];
                var taxpreferences = [];
                var amount = 0.0;
                var discount = 0.0;
                var tax = 0.0;
                var taxAmount = 0.0;
                var discountAmount = 0.0;
                var previousTaxAmount = 0.0;

                $.ajax({
                    url: ApiUrl + "/api/Items/GetBilledItems?billId=" + this.props.match.params["id"],
                    type: "get",
                    success: (data) => {
                        this.setState({
                            Bill: data["billModel"], BilledItems: data["billedItems"],
                            Supplier: { value: data["billModel"]["SupplierId"], label: data["billModel"]["Supplier"] },
                            SubTotal: (data["billModel"]["SubTotal"]).toFixed(2),
                            Total: (data["billModel"]["Total"]).toFixed(2),
                            DisableChanges: true, RoundOffNumber: (data["billModel"]["RoundOffNumber"]).toFixed(2)

                        }, () => {
                            if (data["billModel"]["TDSId"] != null) {
                                this.setState({
                                    tds: {
                                        value: data["billModel"]["TDSId"],
                                        label: data["billModel"]["TDSLabel"],
                                        rate: data["billModel"]["TDSRate"]
                                    }, TdsAmount: (data["billModel"]["TDSAmount"]).toFixed(2)
                                })
                            }

                            if (data["billModel"]["PaymentTerms"] !== null) {
                                this.setState({ PaymentTerm: { value: data["billModel"]["PaymentTerms"], label: data["billModel"]["PaymentTerms"] } })
                            }

                            if (data["billModel"]["DiscountType"] != null) {
                                this.setState({
                                    Discount: data["billModel"]["Discount"],
                                    DiscountType: {
                                        value: data["billModel"]["DiscountType"],
                                        label: data["billModel"]["DiscountType"] == "Rupee" ? <i className="fa fa-rupee"></i> : "%"
                                    },
                                    DiscountAmount: (data["billModel"]["DiscountAmount"]).toFixed(2)
                                })
                            }

                            if (data["billModel"]["DueDate"] !== null) {
                                this.setState({ DueDate: moment(data["billModel"]["DueDate"]).format("YYYY-MM-DD") })
                            }
                            else {
                                this.setState({ DueDate: "" })
                            }

                            data["billedItems"].map((ele, i) => {
                                var item = {
                                    Item: { value: ele["ModelId"], label: ele["ItemName"], SerialNumExists: ele["SrlNoExists"] },
                                    Description: ele["Description"],
                                    Units: ele["Units"],
                                    Quantity: ele["Quantity"],
                                    Amount: (ele["Amount"]).toFixed(2),
                                    Rate: ele["PricePerUnit"],
                                    Tax: { value: ele["GstId"], label: ele["GSTLabel"] },
                                    TaxRate: ele["GSTRate"], Model: ele["Model"], UPC: ele["UPC"],
                                    SerialNumExists: ele["SrlNoExists"],
                                    //    ModelId: ele["ModelId"],
                                    Id: ele["Id"]
                                }
                                items.push(item);

                                if (taxpreferences.length == 0) {
                                    if (data["billModel"]["DiscountType"] != null) {

                                        amount = ele["Quantity"] * ele["PricePerUnit"];
                                        discount = data["billModel"]["Discount"];
                                        tax = ele["GST"];

                                        if (data["billModel"]["DiscountType"] == "Percent") {
                                            discountAmount = parseFloat(parseFloat(amount) * parseFloat(discount / 100)).toFixed(2);
                                        }
                                        else {
                                            discountAmount = parseFloat(parseFloat(amount) - data["billModel"]["Discount"]).toFixed(2);
                                        }
                                        taxAmount = parseFloat(((parseFloat(amount) - parseFloat(discountAmount)) * parseFloat(tax)) / 100).toFixed(2)
                                        taxpreferences.push({ GST: "GST [" + parseFloat(tax).toFixed(2) + "%]", TaxAmount: taxAmount, CGST: "CGST [" + parseFloat(tax).toFixed(2) + "%]" });
                                    }
                                    else {
                                        amount = ele["Quantity"] * ele["PricePerUnit"];
                                        tax = ele["GST"];
                                        taxAmount = parseFloat((parseFloat(amount) * parseFloat(tax)) / 100).toFixed(2);
                                        taxpreferences.push({ GST: "GST [" + parseFloat(tax).toFixed(2) + "%]", TaxAmount: taxAmount, CGST: "CGST [" + parseFloat(tax).toFixed(2) + "%]" });
                                    }
                                }

                                else {
                                    tax = ele["GST"];
                                    var exist = taxpreferences.findIndex((j) => j.GST === "GST [" + parseFloat(tax).toFixed(2) + "%]");
                                    amount = ele["Quantity"] * ele["PricePerUnit"];
                                    taxAmount = 0.0;
                                    if (exist !== -1) {
                                        previousTaxAmount = taxpreferences[exist]["TaxAmount"];
                                    }

                                    if (data["billModel"]["DiscountType"] != null) {
                                        if (data["billModel"]["DiscountType"] == "Percent") {
                                            discountAmount = parseFloat(parseFloat(amount) * parseFloat(discount / 100)).toFixed(2);
                                        }
                                        else {
                                            discountAmount = parseFloat(parseFloat(amount) - data["billModel"]["Discount"]).toFixed(2);
                                        }
                                    }

                                    taxAmount = parseFloat(previousTaxAmount) + (((parseFloat(amount) - parseFloat(discountAmount)) * parseFloat(tax)) / 100);

                                    if (exist == -1) {
                                        taxpreferences.push({ GST: "GST [" + parseFloat(tax).toFixed(2) + "%]", TaxAmount: parseFloat(taxAmount).toFixed(2), CGST: "CGST [" + parseFloat(tax).toFixed(2) + "%]" });
                                    }
                                    else {
                                        taxpreferences[exist]["TaxAmount"] = parseFloat(taxAmount).toFixed(2);
                                    }
                                }
                            })

                            if (data["billModel"]["CourierCharges"] != null) {
                                this.setState({
                                    CourierCharges: (data["billModel"]["CourierCharges"]).toFixed(2)
                                })
                            }

                            if (data["billModel"]["Total"] !== data["billModel"]["DueAmount"]) {
                                this.setState({ UpdateBill: false })
                            }
                            else {
                                this.setState({ UpdateBill: true })
                            }

                            this.setState({ ItemsList: items, TaxPreferences: taxpreferences, viewTaxPreference: true })
                        });
                    }
                })

            }
        }

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetSuppliers",
            type: "get",
            success: (data) => {
                this.setState({ Suppliers: data["suppliers"] }, () => {
                    this.state.Suppliers.push({ label: " + Add new supplier", value: "addnew", className: 'optionstyle' })
                })
            }
        })

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetItems",
            type: "get",
            success: (data) => {
                this.setState({ Items: data["items"] }, () => {
                    this.state.Items.push({ label: "+ Add new item", value: "addnew", className: 'itemoptionstyle' })
                })
            }
        })

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetTDS",
            type: "get",
            success: (data) => { this.setState({ TDS: data["tds"] }) }
        })

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetOrganisationLocations?orgId=" + sessionStorage.getItem("OrgId"),
            type: "get",
            success: (data) => { this.setState({ StockLocations: data["orgLocations"] }) }
        })

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetGST",
            type: "get",
            success: (data) => { this.setState({ GST: data["gst"] }) }
        })
    }

    componentDidMount() {
        setUnTouched(document);
    }

    render() {
        return (
            <div className="container" style={{ marginTop: '15px' }} >

                <form onSubmit={this.handleBillSubmit.bind(this)} onChange={this.validate.bind(this)} key={this.state.Bill} >

                    <div className="ContainerStyle formstyle">
                        <div className="col-xs-12">
                            <div className="col-md-2" > <label className="mTop10">Supplier </label> </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <span className="glyphicon glyphicon-user"></span>
                                        </span>
                                        <Select className="form-control" key={this.state.Suppliers} value={this.state.Supplier} options={this.state.Suppliers} ref="supplier" placeholder="Select Supplier" onChange={this.SupplierChanged.bind(this)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="formstyle">

                        <div className="col-xs-12">
                            <div className="col-md-2 mTop10" > <label> Bill # </label> </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon"></span>
                                        <input className="form-control" type="text" name="billNUmber" ref="billNumber" placeholder="Bill number" autoComplete="off" disabled={this.state.DisableChanges} defaultValue={this.state.Bill["BillNumber"]} onBlur={this.CheckIfBillNumberExists.bind(this)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-12">
                            <div className="col-md-2 mTop10" > <label> Purchase Order Number </label> </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon"></span>
                                        <input className="form-control" type="text" name="poNumber" ref="poNum" autoComplete="off" placeholder="Puchase order number" defaultValue={this.state.Bill["PONumber"]} />
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="col-xs-12">

                            <div className="col-md-2 mTop10" > <label> Bill Date</label> </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <span className="glyphicon glyphicon-calendar"></span>
                                        </span>
                                        <input className="form-control" style={{ lineHeight: '1.6' }} type="date" name="billdate" ref="billDate" defaultValue={moment(this.state.Bill["BillDate"]).format("YYYY-MM-DD")} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-2 mTop10" > <label>Due Date</label> </div>
                            <div className="col-md-3" key={this.state.DueDate}>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <span className="glyphicon glyphicon-calendar"></span>
                                        </span>
                                        <input className="form-control" style={{ lineHeight: '1.6' }} type="date" name="duedate" ref="dueDate" defaultValue={this.state.DueDate} disabled={this.state.DisableChanges} />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="col-xs-12">
                            <div className="col-md-2 mTop10" > <label> Payment Terms</label> </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <span className="glyphicon glyphicon-calendar"></span>
                                        </span>
                                        <Select className="form-control" name="paymentterms" placeholder="Select payment terms" value={this.state.PaymentTerm}
                                            options={[{ value: "NET 15", label: "NET 15" }, { value: "NET 30", label: "NET 30" },
                                            { value: "NET 45", label: "NET 45" }, { value: "", label: "" }
                                            ]}
                                            onChange={this.PaymentTermChanged.bind(this)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="col-xs-10" />

                    </div>

                    <div className="col-xs-12 itemsBlock" >
                        <table className="table table-bordered itemsTable" style={{ width: '100%' }} key={this.state.ItemsList } >
                            <thead className="itemsHeader" >
                                <tr>
                                    <th style={{ paddingTop: '6px', width: '20%' }}> Item details</th>
                                    <th> Units</th>
                                    <th style={{ width: '2%', textAlign: 'right' }}>Quantity</th>
                                    <th style={{ width: '2%', textAlign: 'right' }}> Rate</th>
                                    <th style={{ width: '7%' }} > Tax</th>
                                    <th style={{ width: '5%' }} className="txtRight"> Amount </th>
                                </tr>
                            </thead>
                            <tbody className="itemList" >
                                {
                                    this.state.ItemsList.map((ele, i) => {
                                        return (
                                            <tr key={i} className="itemstable" >
                                                <td className="col-md-3 form-group tdItem" >
                                                    <Select className="form-control removeItemSelectBorder itemSelect" placeholder="Select item" key={this.state.Items} value={ele["Item"]} options={this.state.Items} onChange={this.ItemChanged.bind(this, i)} />
                                                    {
                                                        ele["Item"] != null && ele["Item"] != '' ?
                                                            < input key={this.state.ItemSelected} type="text" className="form-control un-touched removeBorder" onChange={this.descriptionChange.bind(this, i)} value={ele.Description} name="description" placeholder="Description" autoComplete="off" />
                                                            :
                                                            ""
                                                    }
                                                </td>
                                                <td className="col-md-1 form-group colxs3"> {ele.Units}  </td>
                                                <td className="col-md-1 form-group tdItem colxs1"><input type="number" className="form-control un-touched removeBorder txtRight itemRate" onChange={this.quantityChange.bind(this, i)} value={ele.Quantity} name="units" placeholder="Quantity" autoComplete="off" step="1" min="1" /></td>
                                                <td className="col-md-1 form-group tdItem "><input type="number" className="form-control un-touched removeBorder txtRight itemRate" onChange={this.rateChange.bind(this, i)} value={ele.Rate} name="rate" placeholder="Rate" autoComplete="off" step="0.01" min="1" /></td>
                                                <td className="col-md-1 form-group colxs1 tdItem">
                                                    <Select className="form-control removeItemSelectBorder" placeholder="Select Tax" name="tax" value={ele.Tax} options={this.state.GST} onChange={this.taxChanged.bind(this, i)} />
                                                </td>
                                                <td className="col-md-1 form-group colxs1 tdItem"><input type="text" className="form-control un-touched removeBorder txtRight" value={ele.Amount} name="amount" placeholder="Amount" disabled={true} autoComplete="off" /></td>
                                                <td className="itemoptions" style={{ width: '2%' }} >
                                                    <span style={{ width: '0.5%' }} title="Remove" className={"buttonStyle closebtnStyle fa fa-times  btn-danger "} value="close" onClick={this.removeItem.bind(this, i)}></span>
                                                    <span style={{ width: '0.5%', marginLeft: '5%' }} title="Add item(s) info" className={"buttonStyle infobtnStyle fa fa-ellipsis-h  btn-info "} value="Add item details" onClick={this.AddItemInformationClick.bind(this, i)} ></span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>

                    <div className="col-xs-12" key={this.state.UpdateBill}>
                        {
                            this.state.UpdateBill == true ?

                                <div className="col-md-6">
                                    <button className="btn btn-outline-secondary btnAddItem" style={{ textAlign: 'left' }} type="button" onClick={this.addAnotherItem.bind(this)} > + Add Another line</button>
                                </div>
                                :
                                <div className="col-md-6">
                                </div>
                        }

                    <div className="total-section col-md-6">
                            <div className="total-row" >
                                <div className="total-label" style={{ borderTop: '1px solid #fffefe' }}>
                                    <p> Sub Total</p>
                                </div>
                                <div className="total-amount" style={{ borderTop: '1px solid #fffefe' }}>
                                    {this.state.SubTotal}
                                </div>
                            </div>

                            <div className="total-row">
                                <div className="total-label ">
                                    <div className="row">
                                        <div className="col-md-5 col-xs-5">
                                            <div className="form-control-static">
                                                Discount
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-xs-5">
                                            <div>
                                                <input className="col-md-2 discount form-control txtRight" type="number" min="0" step="0.01" id="discount-value" ref="discountValue" autoComplete="off" style={{ paddingRight: '6px' }} onChange={this.discountAmountChanged.bind(this)} defaultValue={this.state.Bill["Discount"]} />
                                                <Select className="col-md-1 discountTypeCode form-control" placeholder="" clearble={false} id="discount-code" name="discountCode" options={[{ label: <label>%</label>, value: 'Percent' }, { label: <i className="fa fa-rupee"></i>, value: 'Rupee' }]} ref="discount" value={this.state.DiscountType} onChange={this.DiscountTypeChanged.bind(this)}
                                                    optionRenderer={(option) => {
                                                        return (<span className="Select-menu-option" >{option.label}</span>)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="total-amount">
                                    -  {this.state.DiscountAmount}
                                </div>
                            </div>
                            <div key={this.state.TaxPreferences}>
                                {
                                    this.state.viewTaxPreference ?

                                        this.state.TaxPreferences.map((ele, i) => {

                                            if (ele["GST"] != "GST [0]") {
                                                return (
                                                    <div>
                                                        <div className="total-row">
                                                            <div className="total-label ">
                                                                <p>{ele["CGST"]} </p>
                                                            </div>
                                                            <div className="total-amount">
                                                                {ele["TaxAmount"]}
                                                            </div>
                                                        </div>

                                                        <div className="total-row">
                                                            <div className="total-label ">
                                                                <p>{ele["GST"]} </p>
                                                            </div>
                                                            <div className="total-amount">
                                                                {ele["TaxAmount"]}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })
                                        :
                                        ""

                                }
                            </div>

                            <div className="total-row">
                                <div className="total-label">
                                    <div className="row">
                                        <div className="col-md-5 col-xs-5">
                                            <div className="form-control-static">
                                                TDS
                                     </div>
                                        </div>
                                        <div className="col-md-6 col-xs-6" >
                                            <Select className="form-control " placeholder="Select TDS" value={this.state.tds} options={this.state.TDS} ref="tds" onChange={this.TdsChanged.bind(this)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="total-amount">
                                    -  {this.state.TdsAmount}
                                </div>
                            </div>

                            <div className="total-row">
                                <div className="total-label">
                                    <div className="row">
                                        <div className="col-md-5 col-xs-5">
                                            <div className="form-control-static">
                                                Courier Charges
                                        </div>
                                        </div>
                                        <div className="col-md-6 col-xs-6">
                                            <input className="form-control txtRight" type="number" placeholder="charges if any" ref="courierCharges" min="0" onChange={this.courierChargesChaned.bind(this)} defaultValue={this.state.Bill["CourierCharges"]} />
                                        </div>
                                    </div>

                                </div>

                                <div className="total-amount">
                                    {this.state.CourierCharges}
                                </div>
                            </div>

                            <div className="total-row">
                                <div className="total-label">
                                    <div className="row">
                                        <div className="col-md-5 col-xs-5">
                                            <div className="form-control-static">
                                                Round off Number
                                             </div>
                                        </div>
                                        <div className="col-md-6 col-xs-6">
                                            <input className="form-control txtRight" type="number" placeholder="Round Off Number" ref="roundOffNum" step="0.01" onChange={this.roundOffChanged.bind(this)} defaultValue={parseFloat(this.state.Bill["RoundOffNumber"]).toFixed(2)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="total-amount">
                                    {this.state.RoundOffNumber}
                                </div>
                            </div>

                            <div className="total-row">
                                <div className="total-label ">
                                    <p> Total</p>
                                </div>
                                <div className="total-amount">
                                    {this.state.Total}
                                </div>
                            </div>

                        </div>

                    </div>


                    <div className="ContainerStyle formstyle">
                        <div className="col-xs-12" >
                            <div className="col-md-4 mTop10"> <label> Attach Files </label>
                                <input className="col-md-4 form-control" type="file" name="files" ref="file" multiple />
                            </div>
                            <div className="col-md-8 mTop10">
                                <label>Customer Notes </label>
                                <textarea className="col-md-8 form-control formtextArea" ref="notes" type="text" defaultValue={this.state.Bill["Notes"]} />
                            </div>
                        </div>

                    </div>

                    <div className="col-xs-12" key={this.state.ViewSupplierDetails}>
                        {
                            this.state.ViewSupplierDetails ?

                                <div className="col-xs-12 supplierBankDetails" key={this.state.SupplierBankDetails}>
                                    <div className="col-md-3">
                                        <label>Account Name :  </label>  {this.state.SupplierBankDetails["AccountName"]}
                                    </div>
                                    <div className="col-md-3">
                                        <b>Account Number : </b>   {this.state.SupplierBankDetails["AccountNumber"]}
                                    </div>
                                    <div className="col-md-3">
                                        <p>  <label>Bank Name :  </label>  {this.state.SupplierBankDetails["BankName"]}  </p>
                                    </div>
                                    <div className="col-md-3">
                                        <p>  <label>Branch Name :  </label> {this.state.SupplierBankDetails["BranchName"]}  </p>
                                    </div>
                                    <div className="col-md-3">
                                        <label>IFSC Code :  </label> {this.state.SupplierBankDetails["IFSCCode"]}
                                    </div>
                                </div>

                                : ""
                        }
                    </div>

                    <div className="col-xs-12 text-center form-group" style={{ marginTop: '1%' }}>
                        <button className="loader loaderActivity" style={{ marginLeft: '9%', marginBottom: '8px' }} ></button>
                        <button className="btn btn-success mLeft5" name="saveAndSend" type="submit" >Save and Send</button>
                        <button className="btn btn-default mLeft5" type="reset" name="clear" onClick={this.clearClick.bind(this)}  > Clear </button>
                        <div className="loader"></div>
                    </div>
                </form>

                {
                    this.state.AddItemInformation ?
                        <div key={this.state.modelDetails}>
                            <div key={this.state.ModelInfo} >
                                <Items ref={"Count" + this.state.modelDetails.Quantity} key={this.state.modelDetails} ItemDetails={this.state.ItemDetails} ModelDetails={this.state.modelDetails} ItemRefs={this.state.ItemRefs} AddItemInformation={true} ModelInfo={this.state.ModelInfo} />
                            </div>
                        </div>
                        :
                        <div> </div>
                }

                {
                    this.state.AddNewModel === true ?
                        <div className="modal fade"  id="addModel" role="dialog" data-keyboard="false" data-backdrop="static" key={this.state.AddNewModel}>
                            <div className="modal-dialog modal-lg" style={{ width: '1080px' }} >
                                <div className="modal-content">
                                    <div className="modal-header " style={{ background: '#f5f3f3', borderBottom: '0px solid' }}>
                                        <button type="button" className="modelClose btnClose" data-dismiss="modal" id="closeModal"> &times; </button>
                                        <h4 className="modal-title">
                                            <p className="modalHeading"> Add New Model </p>
                                        </h4>
                                    </div>

                                    <div className="modal-body col-xs-12" key={this.state.AddNewModel}>
                                        <Model closeItemModal={this.CloseItemModel.bind(this)} ref={(ref) => "addnewModel"} />
                                    </div>

                                    <div className="modal-footer"> </div>

                                </div>
                            </div>
                        </div>
                        :
                        ""
                }

                {
                    this.state.AddSupplier === true ?

                        <div className="modal fade" id="addNewSupplier" role="dialog" data-keyboard="false" data-backdrop="static" key={this.state.AddNewModel}>
                            <div className="modal-dialog modal-lg" style={{ width: '90%' }} >
                                <div className="modal-content">
                                    <div className="modal-header " style={{ background: '#f5f3f3', borderBottom: '0px solid' }}>
                                        <button type="button" className="modelClose btnClose" data-dismiss="modal" id="closeSuppModal"> &times; </button>
                                        <h4 className="modal-title">
                                            <p className="modalHeading"> Add New Client </p>
                                        </h4>
                                    </div>

                                    <div className="modal-body col-xs-12" style={{ width: '100%', alignContent: 'center' }} key={this.state.AddSupplier}>
                                        <ClientRegistration closeSupplierModel={this.CloseSupplierModel.bind(this)} />
                                    </div>

                                    <div className="modal-footer"> </div>

                                </div>
                            </div>
                        </div>
                        :
                        ""
                }

            </div>

        )
    }


    CheckIfBillNumberExists(e) {
        var input = e.target;
        var billNumber = input.value;

        if (this.state.Supplier !== null) {
            var url = ApiUrl + "/api/Items/CheckIfBillNumberExists?billNum=" + this.refs.billNumber.value + "&supplierId=" + this.state.Supplier.value;

            $.get(url).then((data) => {
                if (data["Result"] == true) {
                    showErrorsForInput(this.refs.billNumber, ["Bill Number already exists"]);
                    $("button[name='saveAndSend']").attr("disabled", "true");
                }
                else {
                    $("button[name='saveAndSend']").removeAttr("disabled");
                    showErrorsForInput(this.refs.billNumber, null);
                }
            });
        }
        else{
            showErrorsForInput(this.refs.supplier.wrapper, ["Please select supplier"]);
        }

    }

    CloseItemModel() {
        $("#closeModal").click();
        $.ajax({
            url: ApiUrl + "/api/MasterData/GetItems",
            type: "get",
            success: (data) => {
                this.setState({ Items: data["items"] }, () => {
                    this.state.Items.push({ label: " + Add new item", value: "addnew", className: 'itemoptionstyle' })
                })
            }

        })

    }

    CloseSupplierModel() {
        $("#closeSuppModal").click();
        $.ajax({
            url: ApiUrl + "/api/MasterData/GetSuppliers",
            type: "get",
            success: (data) => {
                this.setState({ Suppliers: data["suppliers"] }, () => {
                    this.state.Suppliers.push({ label: " + Add new supplier", value: "addnew", className: 'optionstyle' })
                })
            }
        })
    }

    courierChargesChaned(val) {
        if (this.refs.courierCharges.value != "") {
            this.setState({ CourierCharges: parseFloat(this.refs.courierCharges.value).toFixed(2) }, () => {
                this.calculateGSTAmount();
            })
        }
        else {
            this.setState({ CourierCharges: '0.00' }, () => {
                this.calculateGSTAmount();
            })
        }
    }

    roundOffChanged() {
        if (this.refs.roundOffNum.value !== "") {
            this.setState({ RoundOffNumber: parseFloat(this.refs.roundOffNum.value).toFixed(2) }, () => {
                this.calculateGSTAmount();
            })
        }
        else {
            this.setState({ RoundOffNumber: '0.00' }, () => {
                this.calculateGSTAmount();
            })
        }
    }

    calculateGSTAmount() {

        var items = this.state.ItemsList;
        var gst = 0;
        var cgst = 0;
        var subTotal = 0.0;
        var taxPreferences = [];
        var taxAmount = 0.0;
        var discount = 0.0;
        var tdsAmount = 0.0;
        var total = 0.0;
        var courierCharges = 0.0;
        var roundOffNumber = 0.0;


        items.map((ele, i) => {
            var taxPercent = parseFloat(ele["TaxRate"] / 2).toFixed(2)
            if (ele["Rate"] != "" && ele["Tax"] !== null) {

                if (taxPreferences.length == 0) {
                    taxPreferences.push({ GST: "GST [" + taxPercent + "%]", TaxAmount: "0.0", CGST: "CGST [" + taxPercent + "%]" });
                }
                else {
                    var exists = false;
                    taxPreferences.map((el, j) => {
                        var gst = "GST [" + taxPercent + "%]";
                        var exists = taxPreferences.findIndex((tax) => tax.GST === gst);
                        if (exists == -1) {
                            taxPreferences.push({ GST: "GST [" + taxPercent + "%]", TaxAmount: "0.0", CGST: "CGST [" + taxPercent + "%]" });
                        }
                    })
                }
            }

            taxPreferences.map((tax, i) => {
                var gst = parseFloat((ele["TaxRate"] / 2)).toFixed(2)
                if (tax["GST"] == "GST [" + gst + "%]") {
                    var amt = 0.0;
                    var previousTaxAmount = 0.0;
                    var currentTaxAmount = 0.0;

                    if (this.state.DiscountType != null && this.refs.discountValue.value != "") {
                        if (this.state.DiscountType.value == "Percent") {
                            discount = parseFloat(((ele["Amount"]) * (this.refs.discountValue.value)) / 100).toFixed(2);
                        }
                        else {
                            discount = parseFloat(((ele["Amount"]) - (this.refs.discountValue.value)) / 100).toFixed(2);
                        }
                    }
                    previousTaxAmount = tax["TaxAmount"];
                    amt = parseFloat(((ele["Amount"] - (parseFloat(discount).toFixed(2))) * gst) / 100).toFixed(2);

                    currentTaxAmount = parseFloat(previousTaxAmount) + parseFloat(amt);

                    //  tax["TaxAmount"] = parseFloat(parseFloat(tax["TaxAmount"]) + parseFloat((ele["Amount"] * (ele["TaxRate"] / 2)) / 100)).toFixed(2);
                    //  tax["TaxAmount"] = parseFloat(parseFloat(tax["TaxAmount"]) + (parseFloat(((ele["Amount"] - (parseFloat(discount).toFixed(2))) * gst) / 100).toFixed(2))).toFixed(2);
                    tax["TaxAmount"] = parseFloat(currentTaxAmount).toFixed(2);
                    //console.log("previousTaxAmount : " + previousTaxAmount, "currentTaxAmount =" + currentTaxAmount);
                }
            })

            if (ele["Quanity"] != "" && ele["Rate"] != "") {
                subTotal = parseFloat(parseFloat(subTotal) + parseFloat(ele["Amount"])).toFixed(2);
            }

        })

        if (this.state.DiscountType != null && this.refs.discountValue.value != "") {

            if (this.state.DiscountType.value == "Percent") {
                discount = parseFloat(((subTotal) * (this.refs.discountValue.value)) / 100).toFixed(2);
            }
            else {
                discount = parseFloat(this.refs.discountValue.value).toFixed(2);
            }

        }
        else {
            discount = parseFloat(discount).toFixed(2);
        }



        if (this.state.tds !== null && this.state.tds != '') {
            tdsAmount = parseFloat(((this.state.SubTotal) * (this.state.tds.rate)) / 100).toFixed(2);
        }

        if (this.refs.courierCharges.value !== "") {
            courierCharges = (courierCharges + parseFloat(this.refs.courierCharges.value)).toFixed(2);
        }

        taxPreferences.map((tax, i) => {
            taxAmount = parseFloat(parseFloat(taxAmount) + (tax["TaxAmount"]) * 2).toFixed(2);
        })

        if (this.refs.roundOffNum.value != "") {
            roundOffNumber = (parseFloat(this.refs.roundOffNum.value)).toFixed(2);
        }


        //  total = Math.round(subTotal - taxAmount - discount - tdsAmount);
        total = ((subTotal - discount - tdsAmount + parseFloat(courierCharges) + parseFloat(taxAmount) + parseFloat(roundOffNumber))).toFixed(2);

        this.setState({
            SubTotal: subTotal, TaxPreferences: taxPreferences, TotalTaxAmount: taxAmount,
            viewTaxPreference: true, Total: total, DiscountAmount: discount
        });

    }

    TdsChanged(val) {
        var amount = 0;
        var totalAmount = 0;
        var subTotal = this.state.SubTotal;

        if (val) {
            if (this.state.SubTotal != "") {
                var tdsPercentage = val.rate;
                amount = parseFloat((this.state.SubTotal * tdsPercentage) / 100).toFixed(2);
                totalAmount = this.state.SubTotal - this.state.DiscountAmount - amount
            }
            this.setState({ tds: val, TdsAmount: amount, Total: totalAmount, AddItemInformation: false }, () => { this.calculateGSTAmount() });
        }
        else {
            this.setState({ tds: '', TdsAmount: amount, Total: subTotal, AddItemInformation: false }, () => { this.calculateGSTAmount() })
        }
    }

    AddItemInformationClick(e, ele) {
        var items = this.state.ItemsList;
        var quantity = items[e]["Quantity"]
        var model = items[e]["Model"]
        var upc = items[e]["UPC"];
        var itemDetails = [];
        var itemRefs = [];
        var gst = items[e]["TaxRate"];
        var modelId = "";
        var modelInfo = [];
        var cp = items[e]["Rate"];
        var units = items[e]["Units"].toUpperCase();
        var serialNoExists = items[e]["SerialNumExists"];


        if (items[e]["TaxRate"] == null) {
            toast("Select tax of item", {
                type: toast.TYPE.INFO
            })
            return;
        }

        if (this.refs.billNumber.value == "" || this.refs.billNumber.value.length > 30) {
            if (this.refs.billNumber.value == "") {
                showErrorsForInput(this.refs.billNumber, ["Bill number is required"]);
                this.refs.billNumber.focus();
            }

            else if (this.refs.billNumber.value.length > 30) {
                showErrorsForInput(this.refs.billNumber, ["Bill number is not valid"])
                this.refs.billNumber.focus();
            }
            return;
        }

        if (!this.state.Supplier || !this.state.Supplier.value) {
            showErrorsForInput(this.refs.supplier.wrapper, ["Please select supplier"]);
            this.refs.supplier.focus();
            return
        }

        if (this.props.match !== undefined && this.props.match.params["id"] !== undefined) {
            modelId = items[e]["Item"].value;
        }

        else {
            modelId = items[e]["Item"];
        }

        var url = ApiUrl + "/api/Items/GetBilledModelInfo?modelId=" + modelId + "&billNumber=" + this.refs.billNumber.value
            + "&supplier=" + this.state.Supplier.value
        $.ajax({
            url: url,
            type: "get",
            success: (data) => {
                this.setState({ ModelInfo: data["itemInfo"] }, () => {
                    if (data["itemInfo"] != null) {
                        this.setState({
                            ModelInfo: data["itemInfo"],
                            StockLocation: {}
                        }, () => {

                            if (data["itemInfo"]["Items"] != null) {
                                var u = data["itemInfo"]["Items"]["Units"]

                                units = (data["itemInfo"]["Units"]).toUpperCase();
                                var extraItems = 0;

                                if (units == "NUMBER") {
                                    if (quantity > data["itemInfo"]["Items"].length) {

                                        extraItems = parseFloat(quantity - data["itemInfo"]["Items"].length);

                                        data["itemInfo"]["Items"].map((ele, i) => {

                                            var item = {
                                                id: ele["Id"],
                                                serialNo: ele["SerialNumber"],
                                                macAddress: ele["MacAddress"],
                                                manufacturedDate: ele["ManufacturedDate"] != null ? moment(ele["ManufacturedDate"]).format("YYYY-MM-DD") : ""
                                            }
                                            itemDetails.push(<Item ItemDetails={item} ref={(count) => itemRefs.push(count)} />)
                                        })

                                        for (var i = 0; i < extraItems; i++) {
                                            var count = "item" + i;
                                            itemDetails.push(<Item ref={(count) => itemRefs.push(count)} />)
                                        }
                                    }

                                    else {
                                        data["itemInfo"]["Items"].map((ele, i) => {

                                            var item = {
                                                id: ele["Id"],
                                                serialNo: ele["SerialNumber"],
                                                macAddress: ele["MacAddress"],
                                                manufacturedDate: ele["ManufacturedDate"] != null ? moment(ele["ManufacturedDate"]).format("YYYY-MM-DD") : ""
                                            }
                                            itemDetails.push(<Item ItemDetails={item} ref={(count) => itemRefs.push(count)} />)
                                        })
                                    }

                                }

                                else {
                                    data["itemInfo"]["Items"].map((ele, i) => {

                                        var item = {
                                            id: ele["Id"],
                                            serialNo: ele["SerialNumber"],
                                            macAddress: ele["MacAddress"],
                                            manufacturedDate: ele["ManufacturedDate"] != null ? moment(ele["ManufacturedDate"]).format("YYYY-MM-DD") : ""
                                        }
                                        itemDetails.push(<Item ItemDetails={item} ref={(count) => itemRefs.push(count)} />)
                                    })
                                }

                            }
                            else {
                                if (units == "NUMBER") {
                                    for (var i = 0; i < quantity; i++) {
                                        var count = "item" + i;
                                        itemDetails.push(<Item ref={(count) => itemRefs.push(count)} />)
                                    }
                                }
                                else {
                                    var count = "item" + i;
                                    itemDetails.push(<Item ref={(count) => itemRefs.push(count)} />)
                                }

                            }
                            this.setState({ ItemDetails: itemDetails })
                        })
                    }
                    else {
                        for (var i = 0; i < quantity; i++) {
                            var count = "item" + i;
                            itemDetails.push(<Item ref={(count) => itemRefs.push(count)} />)
                        }
                    }

                    this.setState({ ItemDetails: itemDetails })

                    var modelDetails = {
                        Model: model, UPC: upc, Quantity: quantity, ModelId: modelId, SerialNumExists: items[e]["SerialNumExists"],
                        PONum: this.refs.poNum.value, BillNum: this.refs.billNumber.value, GST: items[e]["TaxRate"],
                        ItemRate: items[e]["Rate"], Supplier: this.state.Supplier.value
                    }

                    this.setState({ Model: model, UPC: upc, Quantity: quantity, ModelId: modelId }, () => {
                        if (quantity !== "") {
                            this.setState({
                                ItemDetails: itemDetails, ItemRefs: itemRefs, modelDetails: modelDetails,
                                ModelInfo: data["itemInfo"], AddItemInformation: true
                            });
                        }
                        else {
                            this.setState({ AddItemInformation: false });
                        }
                    })

                })

            }
        })

    }

    PaymentTermChanged(val) {
        if (val) {
            this.setState({ PaymentTerm: val, AddItemInformation: false })
        }
        else {
            this.setState({ PaymentTerm: '', AddItemInformation: false })
        }
    }

    SupplierChanged(val) {
        if (val) {
            if (val.value == "addnew") {
                this.setState({ AddSupplier: true, AddItemInformation: false }, () => {
                    $("#addNewSupplier").modal('show');
                });
                return;
            }
            else {
                this.setState({ Supplier: val, AddItemInformation: false }, () => {
                    var url = ApiUrl + "/api/Client/GetSuppliersBankDetails?supplierId=" + val.value
                    $.get(url).then((data) => {
                        this.setState({ SupplierBankDetails: data["supplier"], ViewSupplierDetails: true })
                    })
                });
            }

            if (this.refs.billNumber.value != "") {
                var url = ApiUrl + "/api/Items/CheckIfBillNumberExists?billNum=" + this.refs.billNumber.value + "&supplierId=" + val.value;

                $.get(url).then((data) => {
                    if (data["Result"] == true) {
                        showErrorsForInput(this.refs.billNumber, ["Bill Number already exists"]);
                        $("button[name='saveAndSend']").attr("disabled", "true");
                    }
                    else {
                        $("button[name='saveAndSend']").removeAttr("disabled");
                        showErrorsForInput(this.refs.billNumber, null);
                    }
                });
            }

            showErrorsForInput(this.refs.supplier.wrapper, []);
        }
        else {
            this.setState({ Supplier: '', AddItemInformation: false });
            showErrorsForInput(this.refs.supplier.wrapper, ["Please select supplier"]);
        }
    }

    addAnotherItem() {
        var items = this.state.ItemsList;
        items.push({ Item: null, Description: "", Quantity: '', Rate: '', Tax: null, Amount: "", Model: '', UPC: '', TaxRate: '', SerialNumExists: '', Id: null });
        this.setState({ ItemsList: items, AddItemInformation: false });
    }

    removeItem(e, ele) {
        if (this.state.ItemsList.length > 1) {
            if (!window.confirm("Do you wish to remove item from the list?")) {
                return;
            }
            var items = this.state.ItemsList
            items.splice(e, 1);
            this.setState({ ItemsList: items, AddItemInformation: false }, () => {
                this.calculateGSTAmount()
            });
        }
    }

    ItemChanged(e, ele) {
        var items = this.state.ItemsList;
        if (ele != null) {

            if (ele.value == "addnew") {
                this.setState({ AddNewModel: true, AddItemInformation: false }, () => {
                    $("#addModel").modal('show');
                });
                return;
            }

            else {
                if (this.state.UpdateBill == true) {
                    items[e]["Item"] = ele.value
                    items[e]["Description"] = ele.description;
                    items[e]["Units"] = ele.units
                    items[e]["Model"] = ele.model;
                    items[e]["UPC"] = ele.upc;
                    items[e]["SerialNumExists"] = ele.serialNoExists;

                    $.ajax({
                        url: ApiUrl + "/api/Items/GetItemModel?Id=" + ele.value,
                        type: "get",
                        success: (data) => {
                            this.setState({
                                item: data["itemModel"], ItemSelected: true,
                            }, () => {
                                items[e]["Quantity"] = 1;
                                if (data["itemModel"]["CostPrice"] !== null) {
                                    items[e]["Rate"] = parseFloat(data["itemModel"]["CostPrice"]).toFixed(2);
                                    items[e]["Amount"] = parseFloat(data["itemModel"]["CostPrice"] * items[e]["Quantity"]).toFixed(2);
                                }
                                else {
                                    items[e]["Rate"] = "";
                                    items[e]["Amount"] = "";
                                }
                                items[e]["TaxRate"] = data["itemModel"]["GSTRate"]
                                items[e]["Tax"] = { value: data["itemModel"]["GSTID"], label: data["itemModel"]["GST"] }
                            })
                            this.setState({ ItemsList: items, calculateAmount: true }, () => {
                                this.calculateGSTAmount();
                            })
                        }
                    });
                }
            }

        }
        else {

            if (this.state.UpdateBill == true) {

                items[e]["Item"] = ''; items[e]["Description"] = "";
                items[e]["Model"] = ''; items[e]["UPC"] = '';
                items[e]["Rate"] = ''; items[e]["Quantity"] = '';
                items[e]["Tax"] = ''; items[e]["Amount"] = '';
                items[e]["Units"] = ''
                this.setState({ ItemSelected: false, ItemsList: items, AddItemInformation: false },
                    () => {
                        this.calculateGSTAmount();
                    })
            }
        }
        this.setState({ ItemsList: items, AddItemInformation: false }, () => {
            this.calculateGSTAmount();
        })

    }

    quantityChange(e, ele) {
        var items = this.state.ItemsList
        if (ele.target.value != "" && this.state.UpdateBill == true) {
            items[e]["Quantity"] = ele.target.value
        }
        else {
            if (this.state.UpdateBill == true) {
                items[e]["Quantity"] = "1";
            }
        }

        if (items[e]["Quantity"] != "" && items[e]["Rate"] != "") {
            items[e]["Amount"] = parseFloat(items[e]["Quantity"] * items[e]["Rate"]).toFixed(2);
        }
        this.setState({ ItemsList: items, AddItemInformation: false }, () => {
            this.calculateGSTAmount()
        });
    }

    rateChange(e, ele) {
        var items = this.state.ItemsList;

        if (this.state.UpdateBill == true) {
            items[e]["Rate"] = (ele.target.value);
        }

        if (items[e]["Rate"] != "" && items[e]["Quantity"] != "") {
            var amount = items[e]["Quantity"] * items[e]["Rate"]
            items[e]["Amount"] = parseFloat(amount).toFixed(2);
        }
        else {
            if (this.state.UpdateBill == true) {
                items[e]["Amount"] = "";
            }
        }
        this.setState({ ItemsList: items, AddItemInformation: false }, () => {
            this.calculateGSTAmount()
        })
    }

    taxChanged(e, ele) {
        var items = this.state.ItemsList;
        if (ele != null && this.state.UpdateBill == true) {
            items[e]["Tax"] = ele.value;
            items[e]["TaxRate"] = ele.rate
        }
        else {
            if (this.state.UpdateBill == true) {
                items[e]["Tax"] = null;
                items[e]["TaxRate"] = null;
                this.calculateGSTAmount()
            }
        }
        this.setState({ ItemsList: items, AddItemInformation: false }, () => {
            this.calculateGSTAmount()
        });
    }

    descriptionChange(e, ele) {
        var items = this.state.ItemsList;
        items[e]["Description"] = ele.target.value;
        this.setState({ ItemsList: items, AddItemInformation: false })
    }

    DiscountTypeChanged(val) {
        if (val) {
            this.setState({ DiscountType: val });
            var discountAmount = 0;
            if (this.refs.discountValue.value != "") {
                this.setState({ DiscountType: val, DiscountAmount: this.refs.discountValue.value }, () => {
                    this.calculateGSTAmount()
                });
            }
        }
        else {
            if (this.refs.discountValue.value == "") {
                this.setState({ DiscountType: '', DiscountAmount: 0 }, () => {
                    this.calculateGSTAmount()
                })
            }
        }

    }

    discountAmountChanged(val) {
        var discountAmount = 0.0;
        if (this.refs.discountValue.value != "" && this.state.SubTotal != "0.0" && this.state.DiscountType != null) {
            if (this.state.DiscountType.value == "Percent") {
                discountAmount = parseFloat((this.state.SubTotal * this.refs.discountValue.value) / 100).toFixed(2);
                this.setState({ DiscountAmount: discountAmount }, () => { this.calculateGSTAmount() });
            }
            else {
                discountAmount = parseFloat(this.refs.discountValue.value).toFixed(2);
                this.setState({ DiscountAmount: discountAmount }, () => { this.calculateGSTAmount(); });
            }
        }
    }

    clearClick() {
        var item = [{ Item: null, Description: "", Quantity: '', Rate: "", Tax: null, Amount: "", Model: '', UPC: '', TaxRate: "" }];
        this.refs.poNum.value = "";
        this.refs.billNumber.value = "";
        this.refs.notes.value = "";
        this.refs.dueDate.value = "";
        this.refs.billDate.value = "";
        this.state.ItemsList = item
        this.setState({ Supplier: '', ItemsList: item, PaymentTerms: '', SubTotal: 0.0, Total: 0.0, TaxPreferences: [], AddItemInformation: false })
    }

    handleBillSubmit(e) {
        e.preventDefault();


        $("button[name='saveAndSend']").hide();
        $("button[name='clear']").hide();
        $(".loaderActivity").show();

        if (!this.validate(e)) {
            $("button[name='saveAndSend']").show();
            $("button[name='clear']").show();
            $(".loaderActivity").hide();

            return;
        }

        var items = this.state.ItemsList;
        var exists = items.findIndex((i) => i.TaxRate == null || i.Quanity == "" || i.Rate == "" || i.Item== null);
        if (exists != -1) {
            toast("Please enter complete item details", {
                type: toast.TYPE.INFO
            })
            $("button[name='saveAndSend']").show();
            $("button[name='clear']").show();
            $(".loaderActivity").hide();
            return;
        }
        else if (this.state.Total <= "0") {
            toast("Not a valid bill", {
                type: toast.TYPE.INFO
            })

            $("button[name='saveAndSend']").show();
            $("button[name='clear']").show();
            $(".loaderActivity").hide();
            return;
        }


        var selectedItems = [];
        items.map((ele, i) => {

            var ModelId = "";
            var BilledItemId = "";

            if (ele["Id"] != null) {
                if (ele["Item"]["value"] !== undefined) {
                    ModelId = ele["Item"]["value"]
                }
                else {
                    ModelId = ele["Item"];
                }

                BilledItemId = ele["Id"]
            }
            else {
                ModelId = ele["Item"]
                BilledItemId = null
            }

            var item = {
                ModelId: ModelId,
                Id: BilledItemId,
                Tax: ele["TaxRate"],
                Quantity: ele["Quantity"],
                Price: ele["Rate"],
                Description: ele["Description"]
            }
            selectedItems.push(item);
        })

        if (this.state.SubTotal == "0.0") {
            toast("select items with price to create bill", {
                type: toast.TYPE.INFO
            })

            $("button[name='saveAndSend']").show();
            $("button[name='clear']").show();
            $(".loaderActivity").hide();
            return;
        }

        var data = new FormData();

        data.append("items", JSON.stringify(selectedItems));
        data.append("poNum", this.refs.poNum.value);
        data.append("billNum", this.refs.billNumber.value);
        data.append("billDate", this.refs.billDate.value);
        data.append("dueDate", this.refs.dueDate.value);
        data.append("supplierId", this.state.Supplier.value);
        if (this.state.PaymentTerm !== undefined) {
            data.append("paymentTerms", this.state.PaymentTerm.value);
        }
        data.append("notes", this.refs.notes.value.trim());
        if (this.state.tds != undefined && this.state.tds.value !== undefined) {
            data.append("tdsId", this.state.tds.value);
            data.append("tdsAmount", this.state.TdsAmount);
        }
        data.append("subtotal", this.state.SubTotal);
        data.append("total", this.state.Total);
        data.append("taxAmount", this.state.TotalTaxAmount);

        if (this.state.DiscountType !== null && this.state.DiscountType.value !== undefined) {
            data.append("discountType", this.state.DiscountType.value);
        }
        data.append("discountAmount", this.refs.discountValue.value);

        if (this.refs.courierCharges.value != "") {
            data.append("courierCharges", this.refs.courierCharges.value);
        }

        if (this.refs.roundOffNum.value != "") {
            data.append("roundOffNumber", this.refs.roundOffNum.value);
        }

        var files = this.refs.file.files;
        for (var i = 0; i < files.length; i++) {
            data.append(files[i].name, files[i])
        }

        var url = "";
        if (this.props.match.params["id"] !== undefined) {
            url = ApiUrl + "/api/Items/UpdateBill?billId=" + this.props.match.params["id"]
        }
        else {
            url = ApiUrl + "/api/Items/AddBill"
        }

        try {
            MyAjaxForAttachments(
                url,
                (data) => {
                    $("button[name='saveAndSend']").show();
                    $("button[name='clear']").show();
                    $(".loaderActivity").hide();

                    if (this.props.match.params["id"] !== undefined) {
                        toast("Bill updated successfully!", {
                            type: toast.TYPE.SUCCESS
                        });
                    }
                    else {
                        toast("Bill added successfully!", {
                            type: toast.TYPE.SUCCESS
                        });
                    }
                    this.props.history.push("/BillsList");
                    // this.clearClick();

                },
                (error) => {
                    $("button[name='saveAndSend']").show();
                    $("button[name='clear']").show();
                    $(".loaderActivity").hide();

                    toast("An error occured, please try again later!", {
                        type: toast.TYPE.ERROR
                    })
                },
                "POST",
                data
            )
        }

        catch (e) {
            toast("An error occured, please try again later", {
                type: toast.TYPE.ERROR
            });
            $("button[name='saveAndSend']").show();
            $("button[name='clear']").show();
            $(".loaderActivity").hide();

            return false;
        }

    }

    validate(e) {
        e.preventDefault();
        var success = true;
        var submit = e.type === "submit";

        if (submit) {
            $(e.currentTarget.getElementsByClassName('form-control')).map((i, el) => {
                el.classList.remove("un-touched");
            });
        }

        if (!this.state.Supplier || !this.state.Supplier.value) {
            success = false;
            if (submit) {
                this.refs.supplier.focus();
                submit = false;
            }
            showErrorsForInput(this.refs.supplier.wrapper, ["Please select supplier"]);
        }

        var billNumCons = {
            presence: true,
            length: {
                maximum: 25,
                tooLong: " is too long"
            }
        }

        if (validate.single(this.refs.billNumber.value, billNumCons) !== undefined) {
            success = false;
            if (this.refs.billNumber.value.length > 30) {
                showErrorsForInput(this.refs.billNumber, ["Enter a valid bill number"])
            }
            else {
                showErrorsForInput(this.refs.billNumber, ["Enter bill number"])
            }
            if (submit) {
                submit = false;
                this.refs.billNumber.focus();
            }
        }
        else {
            showErrorsForInput(this.refs.billNumber, []);
        }


        if (validate.single(this.refs.billDate.value, { presence: true }) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.billDate, ["Bill date is required"]);
            if (submit) {
                this.refs.billDate.focus();
                submit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.billDate, []);
        }

        return success;
    }

}

export default Bill;
