import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { ApiUrl } from '../Config';
import Select from 'react-select';
import './ClientRegistration.css';
import ClientLocation from './ClientLocation';
import { showErrorsForInput, setUnTouched, ValidateForm } from '.././Validation';
import { MyAjaxForAttachments, MyAjax } from '../MyAjax';
import { validate } from 'validate.js';


class ClientRegistration extends Component {

    constructor(props) {
        super(props);
        var ClientLocations = [];
        this.state = {
            ClientVerticals: [], ClientVertical: '', Countries: [], Country: '', States: [], State: '',
            Cities: [], City: '', TimeZone: null, TimeZones: null, AddClientAddressClick: true, LocationCount: 0,
            ClientLocations: ClientLocations, ClientLocationRefs: [], PaymentType: null, Currency: null,
            ClientType: "", removeSelected: true, IsVendor: false, ClientId: null, Client: [], ClientLoc: [],
            IsActive: true, IsInvoice: true, Organisations: [], gstVisible: false, GST: '', isMaxClient: false,
            Organisation: '', ClientType: '', ContactPersons: [], SaveAndAddClick: false
        }
    }

    componentDidMount() {
        setUnTouched(document);
    }

    componentWillMount() {

        if (this.props.match !== undefined) {

            this.setState({ ClientId: this.props.match.params["id"] }, () => {

                if (this.props.match.params["id"] != null) {
                    $.ajax({
                        url: ApiUrl + "/api/Client/GetClient?ClientId=" + this.props.match.params["id"],
                        type: "get",
                        success: (data) => {
                            this.setState({
                                Client: data["clientModel"], ClientVertical: data["clientModel"]["Verticals"],
                                ClientType: { value: data["clientModel"]["ClientType"], label: data["clientModel"]["ClientType"] },
                                ClientLoc: data["clientModel"]["ClientLocations"],
                                Organisation: { value: data["clientModel"]["OrgId"], label: data["clientModel"]["OrgName"] },
                                ClientStatus: { value: data["clientModel"]["ClientStatus"], label: data["clientModel"]["ClientStatus"] }
                            }, () => {
                                this.renderLocations(data["clientModel"]["ClientLocations"]);
                                if (data["clientModel"]["ClientType"] == "Vendor") {
                                    this.state.IsVendor = true
                                }
                                if (data["clientModel"]["ClientType"] == "Supplier") {
                                    this.setState({ IsSupplier: true, IsVendor: true })

                                }
                                if (data["clientModel"]["GST"] != null) {
                                    this.state.gstVisible = true
                                }
                                if (data["clientModel"]["Currency"] != null) {
                                    this.setState({ Currency: { value: data["clientModel"]["Currency"], label: data["clientModel"]["Currency"] } })
                                }

                                if (data["clientModel"]["PaymentType"] != null) {
                                    this.setState({ PaymentType: { value: data["clientModel"]["PaymentType"], label: data["clientModel"]["PaymentType"] } })
                                }
                            })
                        }
                    })

                    $.ajax({
                        url: ApiUrl + "/api/Client/GetClientEmployees?ClientId=" + this.props.match.params["id"] + "&FirstName=" + '' +
                            "&LastName=" + '' + "&Email=" + '' + "&PrimaryPhone=" + '' + "&Department=" + '' +
                            "&orgId=" + null + "&page=" + 1 + "&count=" + 100,
                        type: "get",
                        success: (data) => { this.setState({ ContactPersons: data["clientEmployees"] }) }
                    })
                }
                else {
                    this.AddClientLocations();
                }

            })
        }
        else {
            this.AddClientLocations();
        }

        if (sessionStorage.getItem("roles").indexOf("SuperAdmin") == -1) {
            this.setState({
                Organisation: { value: sessionStorage.getItem("OrgId"), label: sessionStorage.getItem("OrgName") }
            })
        }
        else {
            $.ajax({
                url: ApiUrl + "/api/MasterData/GetOrganisations",
                type: "get",
                success: (data) => { this.setState({ Organisations: data["organisations"] }) }
            })
        }

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetClientVerticals",
            type: "get",
            success: (data) => { this.setState({ ClientVerticals: data["clientVerticals"] }) }
        })

        // $.ajax({
        //     url: ApiUrl + "/api/MasterData/GetOrganisations",
        //     type: "get",
        //     success: (data) => { this.setState({ Organisations: data["organisations"] }) }
        // })
    }

    renderLocations(locations) {
        var clientLocations = locations.map((item, i) => {
            return <div key={i}>
                <ClientLocation location={item} ref={(i) => this.state.ClientLocationRefs.push(i)}
                    InvoiceChanged={this.removePreviousInvoiceAddress.bind(this)}
                    countryChanged={this.getCountryId.bind(this)}
                    ClientId={this.state.ClientId} />
            </div>
        })
        this.setState({ ClientLocations: clientLocations });
    }

    render() {
        return (
            <div className="container" key={this.state.Client} style={{ marginTop: '0%' }} >
                {
                    this.props.match !== undefined ?
                        <div className="col-md-12" >
                            <h3 className="col-md-11 formheader" style={{ paddingLeft: '10px' }}>General Details</h3>
                            <div className="col-md-1 mybutton">
                                <button type="button" style={{ marginTop: '3%' }} className="btn btn-default pull-left headerbtn" onClick={() => this.props.history.push("/ClientsList")} >
                                    <span className="glyphicon glyphicon-th-list"></span>
                                </button>
                            </div>
                        </div>
                        :
                        <div className="col-md-12" >
                            <h3 className="col-md-12 formheader" style={{ paddingLeft: '10px' }}>General Details</h3>
                        </div>
                }

                <form onSubmit={this.handleSubmit.bind(this)} onChange={this.validate.bind(this)}>
                    <div className="col-xs-12" >
                        <div className="col-md-4">
                            <label> Name </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon" >
                                        <span className="glyphicon glyphicon-user"></span>
                                    </span>
                                    <input className="form-control" type="text" name="ClientName" placeholder="Client Name" autoComplete="off" ref="clientname" defaultValue={this.state.Client["Name"]} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <label> Short Name </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon" >
                                        <span className="glyphicon glyphicon-user"></span>
                                    </span>
                                    <input className="form-control" type="text" name="ShortName" placeholder="Short Name" autoComplete="off" ref="shortname" defaultValue={this.state.Client["ShortName"]} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label> Primary Phone Number </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="	glyphicon glyphicon-phone"></span>
                                    </span>
                                    <input className="form-control" type="text" name="PhoneNumber" placeholder="Primary Phone Number" autoComplete="off" ref="primaryNumber" defaultValue={this.state.Client["PrimaryNum"]} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label> Secondary Phone Number </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-phone"></span>
                                    </span>
                                    <input className="form-control" type="text" name="SecondaryPhoneNumber" placeholder="Secondary Phone Number" autoComplete="off" ref="secondaryNum" defaultValue={this.state.Client["SecondaryNum"]} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12">

                        <div className="col-md-4">
                            <label> Fax </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon" >
                                        <span className="glyphicon glyphicon-hdd "></span>
                                        {/* <i className="fa fa-fax"></i> */}
                                    </span>
                                    <input className="form-control" name="Fax" type="text" placeholder="Fax" autoComplete="off" ref="fax" defaultValue={this.state.Client["Fax"]} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label> Email </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-envelope"></span>
                                    </span>
                                    <input className="form-control" type="text" name="email" placeholder="Email" autoComplete="off" ref="email" defaultValue={this.state.Client["Email"]} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label> Client Type</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-group-chat"></span>
                                    </span>
                                    <Select className="form-control" name="clienttype" ref="clienttype" placeholder="select client type" value={this.state.ClientType}
                                        options={[{ value: 'Direct Client', label: 'Direct Client' }, { value: 'Indirect Client', label: 'Indirect Client' }, { value: 'Vendor', label: 'Vendor' }, { value: 'Supplier', label: 'Supplier' }, { value: 'Manufacturer', label: 'Manufacturer' }]}
                                        onChange={this.ClientTypeChanged.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12">
                        <div>
                            {/* <div className={this.props.match.params["id"] != null ? "col-md-3" : "col-md-4"}  > */}
                            <div className={this.props.match !== undefined ? "col-md-3" : "col-md-4"}  >
                                <label> Organisation </label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <span className="glyphicon glyphicon-user" > </span>
                                        </span>
                                        <Select className="form-control" name="organisation" ref="organisation" placeholder="Select Organisation"
                                            options={this.state.Organisations}
                                            value={this.state.Organisation}
                                            onChange={this.OrganisationChange.bind(this)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* <div className={this.props.match.params["id"] != null ? "col-md-4" : "col-md-5"}> */}
                            <div className={this.props.match !== undefined ? "col-md-4" : "col-md-5"}>
                                <label> Client vertical(s)</label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <span className="glyphicon glyphicon-group-chat"></span>
                                        </span>
                                        <Select className="form-control" name="clientvertical" ref="clientvertical" placeholder="Select Client verticals"
                                            options={this.state.ClientVerticals}
                                            value={this.state.ClientVertical}
                                            onChange={this.ClientVerticalsChange.bind(this)}
                                            multi
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <label> Client Status</label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <span className="glyphicon glyphicon-group-chat"></span>
                                        </span>
                                        <Select className="form-control" name="clientstatus" ref="clientstatus" placeholder="Select Status"
                                            options={[{ value: "Customer", label: "Customer" }, { value: "Lead", label: "Lead" }]}
                                            value={this.state.ClientStatus}
                                            onChange={this.ClientStatusChange.bind(this)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {
                                // this.props.match.params["id"] != null ?
                                this.props.match !== undefined ?
                                    this.props.match.params["id"] != null ?

                                        <div className="col-md-2" style={{ marginTop: '2.5%' }}>
                                            <label className="chkBox">Active
                                    <input type="checkbox" name="isInvoice" name="isActive" ref="isActive" value={this.state.IsActive} onChange={this.isActiveChanged.bind(this)} defaultChecked={this.state.Client["IsActive"]} />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                        :
                                        <div />
                                    :
                                    <div />
                            }



                        </div>
                    </div>

                    <div className="col-xs-12">
                        <h3 className="col-md-11 formheader" style={{ paddingLeft: '10px' }}>Address Details</h3>
                        <div className="col-md-1 mybutton">
                            <button type="button" style={{ marginTop: '3%' }} className="btn btn-default pull-left headerbtn" onClick={this.AddClientLocations.bind(this)} >
                                <span className="glyphicon glyphicon-plus"></span>
                            </button>
                        </div>
                    </div>

                    {
                        this.state.ClientLocations.map((item, i) =>
                            <div>
                                <div key={i}> <h4 className="col-xs-12"> Location {i + 1} </h4> {item}</div>
                            </div>
                        )
                    }
                    <div key={this.state.IsVendor}>
                        {
                            this.state.IsVendor ?
                                <div key={this.state.IsSupplier}>
                                    {
                                        this.state.IsSupplier ?
                                            <div>

                                                <div className="col-xs-12">
                                                    <h3 className="formHeading">Bank Details</h3>
                                                </div>

                                                <div className="col-xs-12">
                                                    <div className="col-md-3">
                                                        <label> Bank Name </label>
                                                        <div className="form-group">
                                                            <div className="input-group">
                                                                <span className="input-group-addon" ></span>
                                                                <input className="form-control" type="text" name="BankName" ref="bankName" placeholder="Bank Name" defaultValue={this.state.Client["BankName"]} autoComplete="off" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-3">
                                                        <label> Branch Name </label>
                                                        <div className="form-group">
                                                            <div className="input-group">
                                                                <span className="input-group-addon" ></span>
                                                                <input className="form-control" type="text" name="BranchName" ref="branchName" placeholder="Branch Name" defaultValue={this.state.Client["BranchName"]} autoComplete="off" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-3">
                                                        <label> Account Name</label>
                                                        <div className="form-group">
                                                            <div className="input-group">
                                                                <span className="input-group-addon" ></span>
                                                                <input className="form-control" type="text" name="AccountName" ref="accountName" placeholder="Account Name" defaultValue={this.state.Client["AccountName"]}  autoComplete="off" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-3">
                                                        <label>Account Number </label>
                                                        <div className="form-group">
                                                            <div className="input-group">
                                                                <span className="input-group-addon" ></span>
                                                                <input className="form-control" type="text" name="AccountNumber" ref="accountNumber" placeholder="Account Number" defaultValue={this.state.Client["AccountNumber"]} autoComplete="off" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="col-xs-12">
                                                    <div className="col-md-3">
                                                        <label>IFSC Code </label>
                                                        <div className="form-group">
                                                            <div className="input-group">
                                                                <span className="input-group-addon" ></span>
                                                                <input className="form-control" type="text" name="IFSCCode" ref="ifscCode" placeholder="IFSC Code" defaultValue={this.state.Client["IFSCCode"]} autoComplete="off" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            ""
                                    }
                                    <div className="col-xs-12">
                                        <h3 className="formHeading">Other Details</h3>
                                    </div>
                                    <div className="col-xs-12">

                                        <div className="col-md-3">
                                            <label> PAN (eg: AAAAA0000A) </label>
                                            <div className="form-group">
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <span className="glyphicon glyphicon-credit-card"></span>
                                                    </span>
                                                    <input className="form-control" type="text" name="PAN" placeholder="Enter PAN" autoComplete="off" ref="pan" defaultValue={this.state.Client["PAN"]} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <label> GSTIN (eg: 22AAAAA0000A1Z5) </label>
                                            <div className="form-group">
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <span className="glyphicon glyphicon-credit-card"></span>
                                                    </span>
                                                    <input className="form-control" type="text" name="GST" placeholder="GST Number" autoComplete="off" ref="gst" defaultValue={this.state.Client["GST"]} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <label> Credit Period (months) </label>
                                            <div className="form-group">
                                                <input className="form-control" type="number" name="CreditPeriod" step="1" placeholder="Credit Period" autoComplete="off" ref="creditPeriod" defaultValue={this.state.Client["CreditPeriod"]} min="0" />
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                :
                                <div >
                                    <div className="col-xs-12">
                                        <h3 className="formHeading">Payment Details</h3>
                                    </div>

                                    <div className="col-xs-12">
                                        <div className="col-md-3">
                                            <label>Payment Type </label>
                                            <div className="form-group">
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <span className="glyphicon glyphicon-credit-card"></span>
                                                    </span>
                                                    <Select className="form-control" ref="paymenttype" name="paymentType" placeholder="Payment Type" value={this.state.PaymentType}
                                                        options={[{ value: 'Fixed', label: 'Fixed' }, { value: 'FTE', label: 'FTE' }, { value: 'Per Unit', label: 'PerUnit' }]}
                                                        onChange={this.PaymentTypeChanged.bind(this)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <label>Currency</label>
                                            <div className="form-group">
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <span className="glyphicon glyphicon-credit-card"></span>
                                                    </span>
                                                    <Select className="form-control" name="Currency" placeholder="Select Currency" ref="currency" value={this.state.Currency}
                                                        options={[{ value: 'INR', label: 'INR' }, { value: 'USD', label: 'USD' }]}
                                                        onChange={this.CurrencyChanged.bind(this)}
                                                    />

                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <label> Payment Amount </label>
                                            <div className="form-group">
                                                <input className="form-control" name="paymentamount" type="number" autoComplete="off" ref="paymentamount" step="0.0001" min="0" defaultValue={this.state.Client["PaymentAmount"]} />
                                            </div>
                                        </div>


                                        {
                                            this.state.gstVisible === true ?
                                                <div className="col-md-3">
                                                    <label> GST Number </label>
                                                    <div className="form-group">
                                                        <input className="form-control" name="gst" type="text" autoComplete="off" ref="gst" defaultValue={this.state.Client["GST"]} />
                                                    </div>
                                                </div>
                                                :
                                                <div />
                                        }

                                    </div>
                                </div>
                            // :
                            // <div />

                        }

                    </div>

                    {
                        // this.props.match.params["id"] != null ?
                        this.props.match !== undefined ?
                            this.props.match.params["id"] != null ?
                                <div className="col-xs-12">

                                    <h3 className="col-md-12 formHeading">Client Contacts</h3>

                                    <table className="table table-condensed table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Client</th>
                                                <th> First Name</th>
                                                <th>Last Name</th>
                                                <th>Email</th>
                                                <th>Phone Number</th>
                                                <th> Department</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.ContactPersons.map((ele, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>  {(ele["Client"])} </td>
                                                            <td> {ele["FirstName"]} </td>
                                                            <td> {ele["LastName"]}</td>
                                                            <td> {ele["Email"]}</td>
                                                            <td> {ele["Phone"]}</td>
                                                            <td> {ele["Department"]}</td>
                                                        </tr>
                                                    )
                                                })
                                            }

                                        </tbody>

                                    </table>
                                </div>
                                : ""
                            :
                            ""
                    }

                    <div className="col-xs-12" style={{ marginLeft: '30%', marginBottom: '2%' }}>
                        <div className="loader " style={{ marginLeft: '20%', marginBottom: '2%' }} ></div>
                        <button className="submit btn btn-success btnsavesuccess" type="button" name="saveandsubmit" onClick={this.saveAndAddClick.bind(this)} > Save and Add New Contact </button>
                        <button className="submit btn btn-success mleft10 btnsavesuccess" type="submit" name="submit" > Save </button>
                    </div>

                </form>

            </div>
        )
    }

    saveAndAddClick() {
        // this.state.SaveAndAddClick = true;
        this.setState({ SaveAndAddClick: true }, () => {
            $("button[name='submit']").click();
        })
    }

    gotoClientEmpRegistration(Id, Name) {
        this.props.history.push({
            state: {
                Id: Id,
                Name: Name
            },
            pathname: "/ClientEmpRegistration/" + true
        })
    }

    removePreviousInvoiceAddress(newInvoiceRef) {
        this.state.ClientLocationRefs.map((ele, i) => {
            if (ele.refs.isInvoice != newInvoiceRef) {
                ele.refs.isInvoice.checked = false;
            }
        })
    }

    getCountryId(gstVisible) {

        var countries = [];

        this.state.ClientLocationRefs.map((ele, i) => {
            if (ele.state.Country != undefined) {
                countries.push(ele.state.Country.label);
            }
        })
        if (countries.find(ele => ele === "India")) {
            this.setState({ gstVisible: true });
        }
        else {
            this.setState({ gstVisible: false })
        }

    }

    ClientStatusChange(val) {
        if (val) {
            this.setState({ ClientStatus: val })
            showErrorsForInput(this.refs.clientstatus.wrapper, [])
        }
        else {
            showErrorsForInput(this.refs.clientstatus.wrapper, ["Select client Status"])
        }
    }

    ClientVerticalsChange(val) {
        this.setState({ ClientVertical: val }, () => {
            if (val.length > 0) {
                showErrorsForInput(this.refs.clientvertical.wrapper, null);
            }
            else {
                showErrorsForInput(this.refs.clientvertical.wrapper, ["Please select Client Vertical"]);
            }
        })
        // http://jedwatson.github.io/react-select/
    }

    OrganisationChange(val) {
        this.setState({ Organisation: val }, () => {
            if (sessionStorage.getItem("roles").indexOf("SuperAdmin") != -1 || sessionStorage.getItem("roles").indexOf("Admin") != -1) {
                if (val) {
                    showErrorsForInput(this.refs.organisation.wrapper, []);
                }
                else {
                    showErrorsForInput(this.refs.organisation.wrapper, ["Please select organisation"])
                }
            }
            else {
                this.setState({ Organisation: { value: sessionStorage.getItem("OrgId"), label: sessionStorage.getItem("OrgName") } })
            }
        })
    }

    CurrencyChanged(val) {
        this.setState({ Currency: val })
        showErrorsForInput(this.refs.currency.wrapper, null)
    }

    ClientTypeChanged(val) {
        if (val) {
            this.setState({ ClientType: val }, () => {
                if (val.value == "Vendor" || val.value == "Supplier") {
                    if (val.value == "Supplier") {
                        this.setState({ IsVendor: true, IsSupplier: true })
                    }
                    else {
                        this.setState({ IsVendor: true, IsSupplier: false })
                    }

                }
                else {
                    this.setState({ IsVendor: false, IsSupplier: false })
                }
            });
            showErrorsForInput(this.refs.clienttype.wrapper, null)
        }

        else {
            this.setState({ ClientType: '', IsVendor: false, IsSupplier: false })
            showErrorsForInput(this.refs.clienttype.wrapper, ["Please select client type"])
        }
    }

    PaymentTypeChanged(val) {
        this.setState({ PaymentType: val })
        showErrorsForInput(this.refs.paymenttype.wrapper, null)
    }

    isActiveChanged(val) {
        this.setState({ IsActive: !this.state.Client["IsActive"] })
    }

    AddClientLocations() {

        var clientLocations = this.state.ClientLocations;
        var clientLocationRefs = this.state.ClientLocationRefs;
        var count = "location" + clientLocations.length;

        var dummyLoc = { dummy: "" }
        clientLocations.push(<ClientLocation location={dummyLoc} ref={(count) => clientLocationRefs.push(count)}
            InvoiceChanged={this.removePreviousInvoiceAddress.bind(this)}
            countryChanged={this.getCountryId.bind(this)}
            ClientId={this.state.ClientId} />)
        this.setState({ ClientLocations: clientLocations, ClientLocationRefs: clientLocationRefs });
    }


    handleSubmit(e) {
        e.preventDefault();

        var clientLocationRefs = this.state.ClientLocationRefs;
        var clientloc = [];
        var url = "";
        this.state.SaveAndAddClick == true ? true : false;

        clientLocationRefs.map((ele, i) => {
            var location = {
                locationId: clientLocationRefs[i].refs.locationId.value,
                addressLine1: clientLocationRefs[i].refs.addressLine1.value.trim(),
                addressLine2: clientLocationRefs[i].refs.addressLine2.value.trim(),
                landMark: clientLocationRefs[i].refs.landmark.value.trim(),
                country: clientLocationRefs[i].state.Country.value,
                state: clientLocationRefs[i].state.State.value,
                city: clientLocationRefs[i].state.City.value,
                zip: clientLocationRefs[i].refs.zip.value,
                timeZone: clientLocationRefs[i].state.TimeZone.value,
                isInvoice: clientLocationRefs[i].refs.isInvoice.checked
            }
            clientloc.push(location);
        })

        $(".loader").show();
        $("button[name='saveandsubmit']").hide();
        $("button[name='submit']").hide();

        $(e.currentTarget.getElementsByClassName('form-control')).map((i, ele) => {
            ele.classList.remove("un-touched");
            return null;
        })


        if (!this.validate(e)) {
            $(".loader").hide();
            $("button[name='saveandsubmit']").show();
            $("button[name='submit']").show();
            return;
        }

        var data = new FormData();

        if (this.props.match !== undefined) {
            data.append("ClientId", this.props.match.params["id"]);
        }

        data.append("Name", this.refs.clientname.value);
        data.append("ShortName", this.refs.shortname.value);
        data.append("Email", this.refs.email.value);
        data.append("Fax", this.refs.fax.value);
        data.append("PrimaryPhone", this.refs.primaryNumber.value);
        data.append("SecondaryPhone", this.refs.secondaryNum.value);
        data.append("ClientVerticals", JSON.stringify(this.state.ClientVertical));
        data.append("Cv", this.state.ClientVertical);
        data.append("ClientType", this.state.ClientType.value);
        data.append("ClientLocations", JSON.stringify(clientloc));
        data.append("Organisation", this.state.Organisation.value);
        data.append("ClientStatus", this.state.ClientStatus.value);

        if (this.state.IsVendor) {
            if (this.refs.gst.value != "") {
                data.append("gst", this.refs.gst.value);
            }
            if (this.refs.pan.value != "") {
                data.append("pan", this.refs.pan.value);
            }
            if (this.refs.creditPeriod != null) {
                data.append("creditPeriod", this.refs.creditPeriod.value);
            }
        }

        if (this.state.IsSupplier) {
            data.append("bankName", this.refs.bankName.value);
            data.append("branchName", this.refs.branchName.value);
            data.append("accountNumber", this.refs.accountNumber.value);
            data.append("accountName", this.refs.accountName.value);
            data.append("ifscCode", this.refs.ifscCode.value);
        }

        //&& this.state.isMaxClient == true

        if (this.state.ClientType.value != "Vendor" && this.state.ClientType.value != "Supplier") {
            if (this.state.PaymentType != null) {
                data.append("PaymentType", this.state.PaymentType.value);
            }
            if (this.state.Currency != null) {
                data.append("Currency", this.state.Currency.value);
            }
            if (this.refs.paymentamount.value != null) {
                data.append("PaymentAmount", this.refs.paymentamount.value);
            }
            if (this.state.gstVisible === true) {
                data.append("GST", this.refs.gst.value);
            }
        }

        if (this.props.match !== undefined) {
            if (this.props.match.params["id"] != null) {
                data.append("OldEmail", this.state.Client["Email"]);
                data.append("IsActive", this.state.IsActive);
                url = ApiUrl + "/api/Client/UpdateClient"
            }
            else {
                url = ApiUrl + "/api/Client/AddClient"
            }
        }
        else {
            url = ApiUrl + "/api/Client/AddClient"
        }

        try {
            MyAjaxForAttachments(
                url,
                (data) => {
                    toast("Client saved successfully!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $(".loader").hide();
                    $("button[name='submit']").show();
                    $("button[name='saveandsubmit']").show();

                    if (this.state.SaveAndAddClick === true) {
                        if (this.props.match !== undefined) {
                            if (this.props.match.params["id"] != null) {
                                var Id = this.state.Client["Id"];
                                var Name = this.state.Client["ShortName"];
                                this.gotoClientEmpRegistration(Id, Name)
                            }
                            else {
                                var Id = data["Id"];
                                var Name = data["Name"];
                                this.gotoClientEmpRegistration(Id, Name)
                            }
                        }
                        else {
                            this.props.closeSupplierModel();
                        }
                    }
                    else {
                        if (this.props.match !== undefined) {
                            this.props.history.push("/ClientsList")
                        }
                        else {
                            this.props.closeSupplierModel();
                        }
                    }

                    // this.state.SaveAndAddClick == false ? this.props.history.push("/ClientsList") : this.gotoClientEmpRegistration(Id, Name);
                    //  $("button[name='submit']").show();

                    return true;
                },
                (error) => {
                    toast(error.responseText, {
                        type: toast.TYPE.ERROR,
                        autoClose: false
                    });
                    $(".loader").hide();
                    $("button[name='submit']").show();
                    $("button[name='saveandsubmit']").show();
                    return false;
                },
                "POST",
                data
            );
        }
        catch (e) {
            toast("An error occoured, please try again!", {
                type: toast.TYPE.ERROR
            });
            $(".loader").hide();
            $("button[name='submit']").show();
            return false;
        }

    }

    validate(e) {

        var clientLocationRefs = this.state.ClientLocationRefs;
        var isMax = this.state.isMaxClient;
        var vendor = this.state.IsVendor;

        if (this.state.Organisation != null) {
            var isMaxClient = this.state.Organisation.value == 1 ? true : false;
            this.state.isMaxClient = isMaxClient;
        }
        else {
            this.state.isMaxClient = false;
        }

        var success = true;
        var isSubmit = e.type === "button" || e.type === "submit";

        var clientName = this.refs.clientname.value;
        var shortname = this.refs.shortname.value;
        var primaryNum = this.refs.primaryNumber.value;
        var secondaryNum = this.refs.secondaryNum.value;


        if (isSubmit) {
            $(e.currentTarget.getElementsByClassName('form-control')).map((i, el) => {
                el.classList.remove("un-touched");
            });
        }

        //validate client name

        var nameConstraints = {
            presence: true,
            format: {
                pattern: "[a-zA-Z0-9_]+.*$",
                message: "is not valid"
            },
            length: {
                minimum: 3,
                maximum: 150,
                tooShort: "is too short",
                tooLong: "is too long"
            }
        }

        if (validate.single(clientName, nameConstraints) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.clientname, ["Please enter valid name"]);
            if (isSubmit) {
                this.refs.clientname.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.clientname, []);
        }

        // short name

        if (validate.single(shortname, nameConstraints) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.shortname, ["Please enter valid short name"]);
            if (isSubmit) {
                this.refs.shortname.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.shortname, []);
        }


        // validation for primary phone

        var phoneConstraints = {
            presence: true,
            format: {
                pattern: /^^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
                flags: "g"
            }
        }
        if (validate.single(primaryNum, phoneConstraints) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.primaryNumber, ["Please enter a valid phone number"]);
            if (isSubmit) {
                this.refs.primaryNumber.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.primaryNumber, []);
        }


        // validation for secondary phone

        var SecondaryPhoneNumber = {
            format: {
                pattern: /^^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?|^$\s*$/,
                flags: "g",
                message: "is not valid"
            }
        }

        if (validate.single(this.refs.secondaryNum.value, SecondaryPhoneNumber) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.secondaryNum, ["Please enter valid secondary number"])
            if (isSubmit) {
                this.refs.secondaryNum.focus();
                success = false;
            }
        }
        else {
            showErrorsForInput(this.refs.secondaryNum, []);
        }


        // validate fax 

        var faxConstraints = {
            format: {
                pattern: /^^(?=(?:\D*\d){10,12}\D*$)[0-9 \-()\\\/]{1,16}|^$\s*$/,
                flags: "g",
                message: "is not valid"
            }
        }

        if (validate.single(this.refs.fax.value, faxConstraints) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.fax, ["Enter valid fax number"])
            if (isSubmit) {
                this.refs.fax.focus();
                success = false;
            }
        }
        else {
            showErrorsForInput(this.refs.fax, []);
        }


        // validate email
        var emailConstraints = {
            presence: true,
            email: true
        }

        if (validate.single(this.refs.email.value, emailConstraints) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.email, ["Please enter a valid mail"]);
            if (isSubmit) {
                this.refs.email.focus();
                success = false;
            }
        }
        else {
            showErrorsForInput(this.refs.email, []);
        }

        if (!this.state.ClientType || !this.state.ClientType.value) {
            success = false;
            showErrorsForInput(this.refs.clienttype.wrapper, ["Please select Client Type"]);
            if (isSubmit) {
                this.refs.clienttype.focus();
                isSubmit = false;
            }
        }

        if (!this.state.Organisation || !this.state.Organisation.value) {
            success = false;
            showErrorsForInput(this.refs.organisation.wrapper, ["Please select Organisation"]);
            if (isSubmit) {
                this.refs.organisation.focus();
                isSubmit = false;
            }
        }

        if (this.state.ClientVertical.length == 0) {
            success = false;
            showErrorsForInput(this.refs.clientvertical.wrapper, ["Please Select Client Verticals"]);
            if (isSubmit) {
                this.refs.clientvertical.focus();
                isSubmit = false;
            }
        }

        if (!this.state.ClientStatus || !this.state.ClientStatus.value) {
            success = false;
            showErrorsForInput(this.refs.clientstatus.wrapper, ["Please select Client Status"]);
            if (isSubmit) {
                this.refs.clientstatus.focus();
                isSubmit = false;
            }
        }

        clientLocationRefs.map((ele, i) => {
            // validate address Line 1
            if (validate.single(clientLocationRefs[i].refs.addressLine1.value, { presence: true }) !== undefined) {
                success = false;
                showErrorsForInput(clientLocationRefs[i].refs.addressLine1, ["Address Line 1 should not be empty"]);
                if (isSubmit) {
                    clientLocationRefs[i].refs.addressLine1.focus();
                    isSubmit = false;
                }
            }
            else {
                showErrorsForInput(clientLocationRefs[i].refs.addressLine1, []);
            }
            // validate country
            if (!clientLocationRefs[i].state.Country || !clientLocationRefs[i].state.Country.value) {
                success = false;
                showErrorsForInput(clientLocationRefs[i].refs.country.wrapper, ["Select a Country"]);
                if (isSubmit) {
                    clientLocationRefs[i].refs.country.focus();
                    isSubmit = false;
                }
            }
            if (!clientLocationRefs[i].state.State || !clientLocationRefs[i].state.State.value) {
                success = false;
                showErrorsForInput(clientLocationRefs[i].refs.state.wrapper, ["Select a valid State"]);
                if (isSubmit) {
                    clientLocationRefs[i].refs.state.focus();
                    isSubmit = false;
                }
            }

            if (!clientLocationRefs[i].state.City || !clientLocationRefs[i].state.City.value) {
                success = false;
                showErrorsForInput(clientLocationRefs[i].refs.city.wrapper, ["Select a valid city"]);
                if (isSubmit) {
                    clientLocationRefs[i].refs.city.focus();
                    isSubmit = false;
                }
            }

            var ZIPConstraints = {
                presence: true,
                length:
                    {
                        maximum: 10,
                        tooLong: "is too long"
                    }
            }

            if (validate.single(clientLocationRefs[i].refs.zip.value, ZIPConstraints) !== undefined) {
                success = false;
                if (clientLocationRefs[i].refs.zip.value.length > 10) {
                    showErrorsForInput(clientLocationRefs[i].refs.zip, ["ZIP is too long"]);
                }
                else {
                    showErrorsForInput(clientLocationRefs[i].refs.zip, ["ZIP should not be empty"]);
                }

                if (isSubmit) {
                    clientLocationRefs[i].refs.zip.focus();
                    isSubmit = false;
                }

            }
            else {
                showErrorsForInput(clientLocationRefs[i].refs.zip, []);
            }

            if (!clientLocationRefs[i].state.TimeZone || !clientLocationRefs[i].state.TimeZone.value) {
                success = false;
                showErrorsForInput(clientLocationRefs[i].refs.timezone.wrapper, ["Select a valid Timezone"]);
                if (isSubmit) {
                    clientLocationRefs[i].refs.timezone.focus();
                    isSubmit = false;
                }
            }
        })

        if (this.state.ClientType.value != "Vendor" && this.state.ClientType.value != "Supplier" && this.state.isMaxClient == true) {

            if (!this.state.PaymentType || !this.state.PaymentType.value) {
                success = false;
                showErrorsForInput(this.refs.paymenttype.wrapper, ["Please select Payment type"]);
                if (isSubmit) {
                    this.refs.paymenttype.focus();
                    isSubmit = false;
                }
            }

            if (!this.state.Currency || !this.state.Currency.value) {
                success = false;
                showErrorsForInput(this.refs.currency.wrapper, ["Please select Currency"]);
                if (isSubmit) {
                    this.refs.currency.focus();
                    isSubmit = false;
                }
            }

            if (validate.single(this.refs.paymentamount.value, { presence: true }) !== undefined) {
                success = false;
                showErrorsForInput(this.refs.paymentamount, ["Enter valid payment amount"])
                if (isSubmit) {
                    this.refs.paymentamount.focus();
                    isSubmit = false;
                }
            }
        }

        if (this.state.isMaxClient == false && this.state.PaymentType != null || this.state.Currency != null) {

            if (!this.state.PaymentType || !this.state.PaymentType.value) {
                success = false;
                showErrorsForInput(this.refs.paymenttype.wrapper, ["Please select Payment type"]);
                if (isSubmit) {
                    this.refs.paymenttype.focus();
                    isSubmit = false;
                }
            }
            if (!this.state.Currency || !this.state.Currency.value) {
                success = false;
                showErrorsForInput(this.refs.currency.wrapper, ["Please select Currency"]);
                if (isSubmit) {
                    this.refs.currency.focus();
                    isSubmit = false;
                }
            }

            if (!this.state.IsVendor) {
                if (validate.single(this.refs.paymentamount.value, { presence: true }) !== undefined) {
                    success = false;
                    showErrorsForInput(this.refs.paymentamount, ["Enter valid payment amount"])
                    if (isSubmit) {
                        this.refs.paymentamount.focus();
                        isSubmit = false;
                    }
                }
                else {
                    showErrorsForInput(this.refs.paymentamount, []);
                }
            }


        }

        if (this.state.IsSupplier == true) {

            if (this.refs.bankName.value.trim() != "" || this.refs.branchName.value.trim() != "" || this.refs.accountName.value.trim() !== "" || this.refs.accountNumber.value.trim() != "" || this.refs.ifscCode.value.trim() != "") {

                var bankNameConstraints = {
                    presence: true,
                    length: {
                        minimum: 3
                    }
                }

                if (validate.single(this.refs.bankName.value, bankNameConstraints) !== undefined) {
                    if (this.refs.bankName.value !== "" && this.refs.bankName.value.length < 3) {
                        showErrorsForInput(this.refs.bankName, ["Please enter a valid bank name"]);
                    }
                    else {
                        showErrorsForInput(this.refs.bankName, ["Please enter bank name"]);
                    }
                    success = false;
                    if (isSubmit) {
                        isSubmit = false;
                        this.refs.bankName.focus();
                    }

                }
                else {
                    showErrorsForInput(this.refs.bankName, []);
                }

                if (validate.single(this.refs.branchName.value, { presence: true }) !== undefined) {
                    showErrorsForInput(this.refs.branchName, ["Please enter branch name"])
                    success = false;
                    if (isSubmit) {
                        isSubmit = false;
                        this.refs.branchName.focus();
                    }
                }
                else {
                    showErrorsForInput(this.refs.branchName, [])
                }

                if (validate.single(this.refs.accountName.value, { presence: true }) !== undefined) {
                    showErrorsForInput(this.refs.accountName, ["Please enter account name"]);
                    success = false;
                    if (isSubmit) {
                        isSubmit = false;
                        this.refs.accountName.focus();
                    }
                }
                else {
                    showErrorsForInput(this.refs.accountName, [])
                }

                var AccountNumberConstraints = {
                    presence: true,
                    length: {
                        maximum: 15,
                        minimum: 8
                    }
                }

                if (validate.single(this.refs.accountNumber.value, AccountNumberConstraints) !== undefined) {
                    showErrorsForInput(this.refs.accountNumber, ["Enter a valid account number"]);
                    success = false;
                    if (isSubmit) {
                        isSubmit = false;
                        this.refs.accountNumber.focus();
                    }
                }
                else {
                    showErrorsForInput(this.refs.accountNumber, [])
                }

                var IFSCCodeConstraints = {
                    presence: true,
                    length: {
                        maximum: 11
                    }
                }

                if (validate.single(this.refs.ifscCode.value, IFSCCodeConstraints) !== undefined) {
                    showErrorsForInput(this.refs.ifscCode, ["please enter a valid IFSC code"]);
                    success = false;
                    if (isSubmit) {
                        isSubmit = false;
                        this.refs.ifscCode.focus();
                    }
                }
                else {
                    showErrorsForInput(this.refs.ifscCode, []);
                }

            }
            else {
                showErrorsForInput(this.refs.branchName, []);
                showErrorsForInput(this.refs.ifscCode, []);
                showErrorsForInput(this.refs.accountName, []);
                showErrorsForInput(this.refs.accountNumber, []);
                showErrorsForInput(this.refs.ifscCode, []);
            }

        }

        if (this.state.IsVendor == true) {

            var PanValidations = {
                format: {
                    pattern: /([A-Za-z]{5}[0-9]{4}[A-Za-z]{1})?|^$\s*$/,
                    flags: "g",
                    message: "is not valid"
                }
            }

            if (validate.single(this.refs.pan.value, PanValidations) !== undefined) {
                success = false;
                showErrorsForInput(this.refs.pan, ["PAN is not valid"])
                if (isSubmit) {
                    this.refs.pan.focus();
                    isSubmit = false;
                }
            }
            else {
                showErrorsForInput(this.refs.pan, null);
            }

            var GstValidations = {
                format: {
                    pattern: /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[0-9]{1}Z[0-9]{1}?|^$\s*$/,
                    flags: "g",
                    message: "is not valid"
                }
            }

            if (validate.single(this.refs.gst.value, GstValidations) !== undefined) {
                success = false;
                showErrorsForInput(this.refs.gst, ["GST is not valid"])
                if (isSubmit) {
                    this.refs.gst.focus();
                    isSubmit = false;
                }
            }
            else {
                showErrorsForInput(this.refs.gst, null)
            }


            var CreditPeriod = {
                format: {
                    pattern: /\d+/,
                    flags: "g",
                    message: "is not valid"
                }
            }

            if (this.refs.creditPeriod.value > 0) {

                if (validate.single(this.refs.creditPeriod.value, CreditPeriod) !== undefined) {
                    success = false;
                    showErrorsForInput(this.refs.creditPeriod, ["Credit period should be number only"]);
                }

                else if (this.refs.creditPeriod.value > 12) {
                    showErrorsForInput(this.refs.creditPeriod, ["Must be less than or equal to 12"])
                    if (isSubmit) {
                        this.refs.creditPeriod.focus();
                        isSubmit = false;
                    }
                }
                else {
                    showErrorsForInput(this.refs.creditPeriod, null)
                }
            }

            else {
                showErrorsForInput(this.refs.creditPeriod, null)
            }


        }

        return success;
    }
}

export default ClientRegistration
