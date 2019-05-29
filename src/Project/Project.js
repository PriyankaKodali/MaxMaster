import React, { Component } from 'react';
import { toast } from 'react-toastify';
import $ from 'jquery';
import Select from 'react-select';
import './Project.css';
import { MyAjaxForAttachments, MyAjax } from '../MyAjax';
import { ApiUrl } from '../Config';
import { ValidateForm, showErrorsForInput, setUnTouched, showErrors } from '../Validation';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { validate } from 'validate.js';

var moment = require('moment');


class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Country: null, Countries: [], State: null, States: [], City: null, Citites: [], Zip: null,
            Client: null, Clients: [], Status: null, Description: EditorState.createEmpty(),
            DescriptionHtml: "", EDOC: moment().add(30, "days").format("YYYY-MM-DD"),
            EDOS: moment().format("mm/dd/yyyy")
        }
    }

    componentWillMount() {

        var orgId = sessionStorage.getItem("roles").indexOf("SuperAdmin") != -1 ? null : sessionStorage.getItem("OrgId")

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetClients?orgId=" + orgId,
            type: "get",
            success: (data) => { this.setState({ Clients: data["clients"] }) }

        })

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetCountries",
            type: "get",
            success: (data) => { this.setState({ Countries: data["countries"] }) }
        });
    }

    componentDidMount() {

        setUnTouched(document);

        $("#input-id").fileinput({
            theme: "explorer",
            hideThumbnailContent: true,
            uploadUrl: ApiUrl + "/api/Task",
            uploadAsync: true,
            overwriteInitial: false,
            initialPreviewAsData: true,
            showCancel: false,
            showRemove: false,
            showUpload: false,
            minFileCount: 1,
            fileActionSettings: {
                showUpload: false,
                showRemove: true
            }
        })

        $("#quotation-id").fileinput({
            theme: "explorer",
            hideThumbnailContent: true,
            uploadUrl: ApiUrl + "/api/Task",
            uploadAsync: true,
            overwriteInitial: false,
            initialPreviewAsData: true,
            showCancel: false,
            showRemove: false,
            showUpload: false,
            minFileCount: 1,
            fileActionSettings: {
                showUpload: false,
                showRemove: true
            }
        })
    }

    render() {
        return (
            <div className="container">
                <div className="col-xs-12">
                    <h3 className="myContainerHeading" style={{ marginTop: '5%' }} > Project Details</h3>
                </div>


                <form onSubmit={this.handleSubmit.bind(this)} onChange={this.validate.bind(this)}  >

                    <div className="col-xs-12">

                        <div className="col-md-3">
                            <label> Client </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon" >
                                        <span className="glyphicon glyphicon-user"></span>
                                    </span>
                                    <Select className="form-control" placeholder="Select Client" ref="client" value={this.state.Client} options={this.state.Clients} onChange={this.ClientChanged.bind(this)} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label>Project Name</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-user"></span>
                                    </span>
                                    <input className="form-control" name="ProjectName" ref="projectName" type="text" placeholder="Project Name" autoComplete="off" />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <label>Status</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-user"></span>
                                    </span>
                                    <Select className="form-control" ref="status" type="text" placeholder="Status" value={this.state.Status}
                                        options={[{ value: 'Open', label: 'Open' }, { value: 'Discussion', label: 'Discussion' }, { value: 'InProgress', label: 'In Progress' }, { value: 'Completed', label: 'Completed' }, { value: 'NotYetStarted', label: 'Not Yet Started' }]}
                                        onChange={this.StatusChanged.bind(this)} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label>First Name</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-user"></span>
                                    </span>
                                    <input className="form-control" name="FirstName" ref="firstName" type="text" placeholder="Project Holder First Name" autoComplete="off" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12">

                        <div className="col-md-3">
                            <label>Last Name</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-user"></span>
                                    </span>
                                    <input className="form-control" name="LastName" ref="lastName" type="text" placeholder="Project Holder Last Name" autoComplete="off" />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label> Primary Phone </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-phone"> </span>
                                    </span>
                                    <input className="form-control" name="PhoneNumber" ref="primaryPhone" type="text" placeholder="Primary Phone" autoComplete="off" />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label> Secondary Phone </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-phone"> </span>
                                    </span>
                                    <input className="form-control" nam="secondaryNum" ref="secondaryPhone" type="text" placeholder="Secondary Phone" autoComplete="off" />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label> Email </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-envelope"> </span>
                                    </span>
                                    <input className="form-control" name="email" ref="email" type="text" placeholder="Enter Email" autoComplete="off" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12">

                        <div className="col-md-3">
                            <label> Expected/Start Date </label>
                            <div className="form-group">
                                <div className="input-group" >
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-calendar"></span>
                                    </span>
                                    <input className="form-control" name="StartDate" style={{ lineHeight: '19px' }} type="date" ref="startDate" min={moment().format("YYYY-MM-DD")} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label> Expected/End Date </label>
                            <div className="form-group">
                                <div className="input-group" >
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-calendar"></span>
                                    </span>
                                    <input className="form-control" name="EndDate" style={{ lineHeight: '19px' }} type="date" ref="endDate" defaultValue= {this.state.EDOC} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12">
                        <h4 className="col-xs-12" style={{ color: '#31708f' }}>Address Details</h4>
                    </div>

                    <div className="col-xs-12">
                        <div className="col-md-6">
                            <label> Address Line 1</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-map-marker"> </span>
                                    </span>
                                    <input className="form-control" name="AddressLine1" type="text" ref="addressLine1" placeholder="Address Line 1" autoComplete="off" />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label> Address Line 2</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-map-marker"> </span>
                                    </span>
                                    <input className="form-control" type="text" ref="addressLine2" placeholder="Address Line 2" autoComplete="off" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12">

                        <div className="col-md-3">
                            <label> Country </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-map-marker"></span>
                                    </span>
                                    <Select className="form-control" ref="country" placeholder="Select Country" value={this.state.Country} options={this.state.Countries} onChange={this.CountryChanged.bind(this)} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label> State </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-map-marker"></span>
                                    </span>
                                    <Select className="form-control" ref="state" placeholder="Select State" value={this.state.State} options={this.state.States} onChange={this.StateChanged.bind(this)} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label>City </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-map-marker"></span>
                                    </span>
                                    <Select className="form-control" ref="city" placeholder="Select City" value={this.state.City} options={this.state.Cities} onChange={this.CityChanged.bind(this)} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label> Zip </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-home"></span>
                                    </span>
                                    <input className="form-control" type="text" name="zip" ref="zip" placeholder="Postal code" autoComplete="off" />
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="col-xs-12">
                        <h4 className="col-md-12" style={{ color: '#31708F' }}> Project Description </h4>
                    </div>
                    <div className="col-xs-12">
                        <div className="col-md-12" style={{ paddingTop: '12px' }}>
                            <div className="form-group" style={{ height: "auto" }}>
                                <Editor name="actionResponse" id="actionResponse" key="actionResponse"
                                    ref="ProjectDesc" editorState={this.state.Description} toolbarClassName="toolbarClassName" wrapperClassName="draft-editor-wrapper" editorClassName="draft-editor-inner" onEditorStateChange={this.descriptionBoxChange.bind(this)} />
                                <input hidden ref="description" name="forErrorShowing" />
                            </div>
                        </div>

                    </div>

                    <div className="col-xs-12">
                        <div className="loader loaderActivity" ></div>
                        <button className="btn btn-md btn-primary docSubmit" type="submit" name="submit"  > Submit </button>
                    </div>

                </form>

            </div>
        )
    }

    descriptionBoxChange(val) {
        this.setState({ Description: val, DescriptionHtml: draftToHtml(convertToRaw(val.getCurrentContent())) });
    }

    ClientChanged(val) {
        if (val) {
            this.setState({ Client: val });
            showErrorsForInput(this.refs.client.wrapper, []);
        }
        else {
            this.setState({ Client: '' });
            showErrorsForInput(this.refs.client.wrapper, ["Please select Client"])
        }
    }

    StatusChanged(val) {
        if (val) {
            this.setState({ Status: val });
            showErrorsForInput(this.refs.status.wrapper, null)
        }
        else {
            this.setState({ Status: '' });
            showErrorsForInput(this.refs.status.wrapper, ["Please select Status"]);
        }
    }

    CountryChanged(val) {
        if (val) {
            this.setState({ Country: val }, () => {
                if (this.state.Country && this.state.Country.value) {
                    $.ajax({
                        url: ApiUrl + "/api/MasterData/GetStates?countryId=" + this.state.Country.value,
                        success: (data) => { this.setState({ States: data["states"] }) }
                    })
                    showErrorsForInput(this.refs.country.wrapper, null);
                }
                else {
                    this.setState({ States: [], State: null });
                    showErrorsForInput(this.refs.country.wrapper, ["Please select a valid country"]);
                    showErrorsForInput(this.refs.state.wrapper, ["Please select a valid state"]);
                    showErrorsForInput(this.refs.city.wrapper, ["Please select a valid city"]);
                }
            });

        }
        else {
            this.setState({ Country: '' });
            showErrorsForInput(this.refs.country.wrapper, ["Please select country"]);
        }
    }

    StateChanged(val) {
        this.setState({ State: val }, () => {
            if (this.state.State && this.state.State.value) {
                $.ajax({
                    url: ApiUrl + "/api/MasterData/GetCities?stateId=" + this.state.State.value,
                    success: (data) => { this.setState({ Cities: data["cities"] }) }
                })
                showErrorsForInput(this.refs.state.wrapper, null);
            }
            else {
                this.setState({ Cities: [], City: null });
                showErrorsForInput(this.refs.state.wrapper, ["Please select a valid state"]);
                showErrorsForInput(this.refs.city.wrapper, ["Please select a valid city"]);
            }
        });
    }

    CityChanged(val) {
        if (val) {
            this.setState({ City: val });
            showErrorsForInput(this.refs.city.wrapper, [])
        }
        else {
            this.setState({ City: '' });
            showErrorsForInput(this.refs.city.wrapper, ["Please select City"])
        }
    }

    handleSubmit(e) {
        e.preventDefault();


        $(".loaderActivity").show();
        $("button[name='submit']").hide();

        if (!this.validate(e)) {
            $(".loaderActivity").hide();
            $("button[name='submit']").show();
            return;
        }

        var data = new FormData();
        data.append("clientId", this.state.Client.value);
        data.append("projectName", this.refs.projectName.value);
        data.append("status", this.state.Status.value);
        data.append("firstName", this.refs.firstName.value);
        // data.append("middleName", this.refs.middleName.value);
        data.append("lastName", this.refs.lastName.value);
        data.append("primaryPhone", this.refs.primaryPhone.value);
        data.append("secondaryPhone", this.refs.secondaryPhone.value);
        data.append("email", this.refs.email.value);
        data.append("edos", this.refs.startDate.value);
        data.append("edoc", this.refs.endDate.value);
        data.append("addressLine1", this.refs.addressLine1.value);
        data.append("addressLine2", this.refs.addressLine2.value);
        data.append("countryId", this.state.Country.value);
        data.append("stateId", this.state.State.value);
        data.append("cityId", this.state.City.value);
        //  data.append("landMark", this.refs.landMark.value);
        data.append("zip", this.refs.zip.value);

        // var files = $("#input-id").fileinput("getFileStack");
        // for (var i = 0; i < files.length; i++) {
        //     if (files[i] != undefined) {
        //         data.append("po-" + i, files[i]);
        //     }
        // }

        // var quotations = $("#quotation-id").fileinput("getFileStack");
        // for (var i = 0; i < quotations.length; i++) {
        //     if (quotations[i] != undefined) {
        //         data.append("quotations-" + i, quotations[i]);
        //     }
        // }

        data.append("description", this.state.DescriptionHtml);

        var url = ApiUrl + "/api/Project/AddProject"
        try {

            MyAjaxForAttachments(
                url,
                (data) => {
                    toast("Project added successfully!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $("button[name='submit']").show();
                    this.props.history.push("/ProjectsList");
                    return true;
                },
                (error) => {
                    toast(error.responseText, {
                        type: toast.TYPE.ERROR,
                        autoClose: false
                    });
                    $(".loader").hide();
                    $("button[name='submit']").show();
                    return false;
                },
                "POST",
                data
            );
        }
        catch (e) {
            toast("An error occured, please try again later", {
                type: toast.TYPE.ERROR
            });
            $(".loader").hide();
            $("button[name='submit']").show();
            return false;
        }
    }

    validate(e) {
        let errors = {};
        var success = true;
        var isSubmit = e.type === "submit";
        var firstName = this.refs.firstName.value.trim();
        var lastName = this.refs.lastName.value.trim();
        var email = this.refs.email.value.trim();

        var firstNameConstraints = {
            presence: true,
            format: {
                pattern: "[a-zA-Z ]+",
                message: "should contain only alphabets"
            }
        }

        var phoneConstraints = {
            presence: true,
            format: {
                pattern: /^^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
                message: "is not valid"
            }
        }


        if (isSubmit) {
            $(e.currentTarget.getElementsByClassName('form-control')).map((i, el) => {
                el.classList.remove("un-touched");
            });
        }

        if (!this.state.Client || !this.state.Client.value) {
            success = false;
            showErrorsForInput(this.refs.client.wrapper, ["Please select client"]);
            if (isSubmit) {
                this.refs.client.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.client.wrapper, []);
        }

        if (validate.single(this.refs.projectName.value, { presence: true }) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.projectName, ["Enter project Name"])
            if (isSubmit) {
                this.refs.projectName.focus();
                isSubmit = false;
            }
        }

        else {
            showErrorsForInput(this.refs.projectName, []);
        }

        if (!this.state.Status || !this.state.Status.value) {
            success = false;
            showErrorsForInput(this.refs.status.wrapper, ["Please select Status"]);
            if (isSubmit) {
                this.refs.status.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.status.wrapper, []);
        }


        if (validate.single(firstName, firstNameConstraints) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.firstName, ["First name is required"]);
            if (isSubmit) {
                this.refs.lastName.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.firstName, []);
        }



        if (validate.single(lastName, firstNameConstraints) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.lastName, ["Please enter valid last name"]);
            if (isSubmit) {
                this.refs.lastName.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.lastName, []);
        }


        if (validate.single(this.refs.primaryPhone.value, phoneConstraints) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.primaryPhone, ["Enter Primary Phone Number"]);
            if (isSubmit) {
                this.refs.primaryPhone.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.primaryPhone, []);
        }



        var SecondaryPhoneNumber = {
            format: {
                pattern: /^^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?|^$\s*$/,
                flags: "g",
                message: "is not valid"
            }
        }

        if (validate.single(this.refs.secondaryPhone.value, SecondaryPhoneNumber) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.secondaryPhone, ["Please enter valid secondary number"])
            if (isSubmit) {
                this.refs.secondaryPhone.focus();
                success = false;
            }
        }
        else {
            showErrorsForInput(this.refs.secondaryPhone, []);
        }


        if (validate.single(this.refs.email.value, { presence: true, email: true }) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.email, ["Email is required"]);
            if (isSubmit) {
                this.refs.email.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.email, []);
        }


        if (validate.single(this.refs.startDate.value, { presence: true }) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.startDate, ["Select expected date of beginning"]);
            if (isSubmit) {
                this.refs.startDate.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.startDate, []);
        }

        if (validate.single(this.refs.endDate.value, { presence: true }) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.endDate, ["Select expected end date "]);
            if (isSubmit) {
                this.refs.endDate.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.endDate, []);
        }


        if (validate.single(this.refs.addressLine1.value, { presence: true }) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.addressLine1, ["AddressLine 1 required"]);
            if (isSubmit) {
                this.refs.addressLine1.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.addressLine1, []);
        }


        if (!this.state.Country || !this.state.Country.value) {
            success = false;
            showErrorsForInput(this.refs.country.wrapper, ["Please select country"]);
            if (isSubmit) {
                this.refs.country.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.country.wrapper, [])
        }

        if (!this.state.State || !this.state.State.value) {
            success = false;
            showErrorsForInput(this.refs.state.wrapper, ["Please select state"]);
            if (isSubmit) {
                this.refs.state.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.state.wrapper, [])
        }

        if (!this.state.City || !this.state.City.value) {
            success = false;
            showErrorsForInput(this.refs.city.wrapper, ["Please select city"]);
            if (isSubmit) {
                this.refs.city.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.city.wrapper, [])
        }

        var ZIPConstraints = {
            presence: true,
            length:
                {
                    maximum: 10,
                    tooLong: "is too long"
                }
        }


        if (validate.single(this.refs.zip.value, ZIPConstraints) !== undefined) {
            success = false;
            if (this.refs.zip.value.length > 10) {
                showErrorsForInput(this.refs.zip, ["Enter valid ZIP"])
            }
            else {
                showErrorsForInput(this.refs.zip, ["ZIP should not be empty"])
            }

            if (isSubmit) {
                this.refs.zip.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.zip, []);
        }


        if (!this.state.Description.getCurrentContent().hasText()) {
            showErrorsForInput(this.refs.description, ["Please enter project description"]);
            success = false;
            if (isSubmit) {
                this.refs.description.focusEditor();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.description, null);
        }



        return success;
    }
}

export default Project;



{/* <div className="col-md-3">
 <label>Middle Name</label>
 <div className="form-group">
    <div className="input-group">
        <span className="input-group-addon">
            <span className="glyphicon glyphicon-user"></span>
        </span>
        <input className="form-control" ref="middleName" type="text" placeholder="Project Holder Middle Name" />
    </div>
 </div>
</div> */}



{/* <div className="col-xs-12">
<h4 className="col-xs-12" style={{ color: '#31708f' }}>Purchase Order Details</h4>
    <div className="col-xs-12">
                        <div className="col-md-12 form-group">
                            <input className="file" name="file[]" id="quotation-id" type="file" ref="Upldfiles" data-preview-file-type="any" showUpload="false" multiple />
                        </div>
                    </div>
</div>
<div className="col-xs-12">
<div className="col-md-12 form-group">
    <input className="file" name="file[]" id="input-id" type="file" ref="Upldfiles" data-preview-file-type="any" showUpload="false" multiple />
</div>
</div>
<div className="col-xs-12">
<h4 className="col-xs-12" style={{ color: '#31708f' }}>Quotation Details</h4>
</div>

*/}