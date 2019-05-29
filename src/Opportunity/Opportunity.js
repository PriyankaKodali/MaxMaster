import React, { Component } from 'react';
import Select from 'react-select';
import $ from 'jquery';
import { ApiUrl } from '../Config';
import './Opportunity.css'
import { toast } from 'react-toastify';
import { MyAjaxForAttachments, MyAjax } from '../MyAjax';
import { showErrorsForInput, setUnTouched, ValidateForm } from '.././Validation';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

var validate = require('validate.js');
var moment = require('moment');
var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

function trClassFormat(row, rowIdx) {
    return "pointer"
}

class Opportunity extends Component {

    constructor(props) {
        super(props);

        var selectRowProp = {
            mode: 'checkbox',
            clickToSelect: true,
            bgColor: (row, isSelect) => {
                if (isSelect) {
                    return '#D4EFDF';
                }
                return null;
            },

            onSelectAll: (row, isSelect, e) => {
                this.setState({ Contacts: row });
            }
        };
        var froalaConfig = {
            heightMin: 210
        }

        this.state = {
            Clients: [], Client: null, Category: [], Categories: [], ContactPerson: null,
            ContactPersons: [], Status: null, TaskLog: [], Assignees: [], Assignee: null,
            checkedContactPersons: [], Contacts: [], selectRowProp: selectRowProp, checkedContacts: [],
            edoc: moment().format("DD/MM/YYYY"), ProjectAccepted: false, ClientModal: [],
            EDOC: moment().add(30, "days").format("YYYY-MM-DD"), Comment: EditorState.createEmpty(),
            CommentHtml: "", Organisations: [], Organisation: null, Page: 1, Count: 100, ContactPersons: [],
            Location: null, Locations: [], createEstimateClick: false,disableClient: false,
        }
    }

    componentWillMount() {
        var orgId = sessionStorage.getItem("roles").indexOf("SuperAdmin") !== -1 ? null : sessionStorage.getItem("OrgId")

        if (orgId != null) {
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

        if (this.props.match.params["id"] != null) {
            $.ajax({
                url: ApiUrl + "/api/Client/GetClient?ClientId=" + this.props.match.params["id"],
                type: "get",
                success: (data) => {
                    this.setState({ Client: { value:data["clientModel"]["AspNetUserId"], label: data["clientModel"]["ShortName"], Id: data["clientModal"]["Id"] }, ClientModal: data["clientModel"] , disableClient: true})
                }
            })
            $.ajax({
                url: ApiUrl + "/api/Client/GetClientEmployees?clientId=" + this.props.match.params["id"] + "&firstName=" + '' +
                    "&lastName=" + "" + "&email=" + "" + "&primaryPhone=" + "" + "&department=" + "" +
                    "&orgId=" + orgId + "&page=" + this.state.Page + "&count=" + this.state.Count,
                type: "get",
                success: (data) => { this.setState({ ContactPersons: data["clientEmployees"] }) }
            })
            $.ajax({
                url: ApiUrl + "/api/Client/GetClientLocations?clientId=" + this.props.match.params["id"],
                type: "get",
                success: (data) => { this.setState({ Locations: data["locations"] }) }
            })
        }

        else {

            // $.ajax({
            //     url: ApiUrl + "/api/MasterData/GetClients?orgId=" + orgId,
            //     type: "get",
            //     success: (data) => { this.setState({ Clients: data["clients"] }) }
            // })

            $.ajax({
                url: ApiUrl + "/api/MasterData/GetClientsWithAspNetUserId?orgId=" + orgId,
                type: "get",
                success: (data) => { this.setState({ Clients: data["clients"] }) }
            })
        }

        MyAjax(
            ApiUrl + "/api/MasterData/GetEmployeesForTaskAllocation?creatorId=" + '' + "&OrgId=" + orgId,
            (data) => { this.setState({ Assignees: data["employees"] }) },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        )

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetOpportunityCategories",
            type: "get",
            success: (data) => { this.setState({ Categories: data["categories"] }) }
        })
    }

    componentDidMount() {
        setUnTouched(document);
    }

    componentDidUpdate() {

        $("#input-id").fileinput({
            theme: "explorer",
            hideThumbnailContent: true,
            uploadUrl: ApiUrl + "/api/Task/UploadFiles",
            uploadAsync: true,
            overwriteInitial: false,
            initialPreviewAsData: true,
            showCancel: false,
            showRemove: false,
            showUpload: false,
            minFileCount: 1,
            fileActionSettings: {
                showUpload: false,
                showRemove: true,
            }
        })
    }

    render() {

        return (
            <div className="container" style={{ marginTop: '0%' }}>

                <form onSubmit={this.handleSubmit.bind(this)} onChange={this.validate.bind(this)}>

                    <div className="col-xs-12">
                        <h3 className="col-md-11 formheader" style={{ paddingLeft: '10px' }}>Opportunity/Project</h3>
                        <div className="col-md-1 mybutton">
                            <button type="button" style={{ marginTop: '3%' }} className="btn btn-default pull-left headerbtn" onClick={() => this.props.history.push("/OpportunitiesList")} >
                                <span className="glyphicon glyphicon-th-list"></span>
                            </button>
                        </div>
                    </div>

                    <div className="col-xs-12">
                        <div className="col-md-3">
                            <label> Opportunity/Project Name</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon" >
                                        <span className="glyphicon glyphicon-user"></span>
                                    </span>
                                    <input className="form-control" type="text" name="Opportunity" ref="opportunity" autoComplete="off" placeholder="Opportunity or Project Name" />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label> Client</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon" >
                                        <span className="glyphicon glyphicon-user"></span>
                                    </span>
                                    <Select className="form-control" ref="client" disabled={this.state.disableClient} placeholder="Select Client" value={this.state.Client} options={this.state.Clients} onChange={this.ClientChanged.bind(this)} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label> Categories</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon" >
                                        <span className="glyphicon glyphicon-user"></span>
                                    </span>
                                    <Select className="form-control" placeholder="Select Categories" ref="categories" value={this.state.Category} options={this.state.Categories} onChange={this.CategoriesChanged.bind(this)} multi />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12">

                        <div className="col-md-3">
                            <label> Reffered By </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon" >
                                        <span className="glyphicon glyphicon-user"></span>
                                    </span>
                                    <input className="form-control" type="text" name="referedBy" placeholder="Reffered By" ref="refferedBy" />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label> Organisation </label>
                            <div className="form-group">
                                <Select className="form-control" placeholder="Select Organisation" ref="organisation" value={this.state.Organisation}
                                    options={this.state.Organisations} onChange={this.OrganisationChanged.bind(this)} />
                            </div>
                        </div>

                        <div className="col-md-5">
                            <label> Location </label>
                            <div className="form-group">
                                <Select className="form-control" placeholder="Select Location" ref="location" value={this.state.Location}
                                    options={this.state.Locations} onChange={this.LocationChanged.bind(this)} />
                            </div>
                        </div>

                    </div>

                    <div className="col-xs-12" />

                    <div className="col-xs-12" key={this.state.ContactPersons} >
                        <BootstrapTable striped hover ref="contactsList" data={this.state.ContactPersons} selectRow={this.state.selectRowProp} trClassName={trClassFormat} >
                            <TableHeaderColumn dataField="Id" isKey={true} dataSort={true} dataFormat={this.ContactNameFormatter.bind(this)}> Contact Person Name   </TableHeaderColumn>
                            <TableHeaderColumn dataField="Phone" dataSort={true} dataAlign="left" > Contact Number   </TableHeaderColumn>
                            <TableHeaderColumn dataField="Email" dataSort={true} dataAlign="left" > Email </TableHeaderColumn>
                            <TableHeaderColumn dataField="Department" dataSort={true} dataAlign="left"> Department </TableHeaderColumn>
                        </BootstrapTable>
                        {/* <input className="form-control" type="hidden" name="forShowingError" ref="contactList" /> */}
                    </div>

                    <div className="ContainerStyle mTop10">
                        <div className="col-xs-12">
                            <div className="col-md-3">
                                <label> Status </label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon" >
                                            <span className="glyphicon glyphicon-user"></span>
                                        </span>
                                        <Select className="form-control" name="status" ref="status" placeholder="Status" value={this.state.Status}
                                            options={[{ value: "ShowingInterest", label: "Showing Interest" }, { value: "Accepted", label: "Accepted" },
                                            { value: "InProcess", label: "In Process" }, { value: "Declined", label: "Declined" }]}
                                            onChange={this.StatusChanged.bind(this)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <label> Assign To  </label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <span className="glyphicon glyphicon-user"></span>
                                        </span>
                                        <Select className="form-control" name="assignTo" ref="assignee" placeholder="Select Assignee" value={this.state.Assignee} options={this.state.Assignees} onChange={this.AssigneeChanged.bind(this)} />
                                    </div>
                                </div>
                            </div>
                            {

                                this.state.ProjectAccepted ?

                                    <div key={this.state.ProjectAccepted}>
                                        <div className="col-md-3">
                                            <label> Expected Date of Start</label>
                                            <div className="form-group">
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <span classNBame="glyphicon glyphicon-calendar"></span>
                                                    </span>
                                                    <input className="form-control" name="StartDate" style={{ lineHeight: '19px' }} type="date" ref="edos" min={moment().format("YYYY-MM-DD")} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <label> Expected Date of Closure </label>
                                            <div className="form-group">
                                                <div className="input-group" >
                                                    <span className="input-group-addon">
                                                        <span className="glyphicon glyphicon-calendar"></span>
                                                    </span>
                                                    <input className="form-control" name="EndDate" style={{ lineHeight: '19px' }} type="date" ref="edoc" defaultValue={this.state.EDOC} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div />
                            }

                        </div>
                    </div>

                    <div className="col-xs-12">
                        <label className="col-xs-12">Comments</label>
                        <div className="col-xs-12 form-group" style={{ paddingTop: '5px' }}>
                            <Editor name="comment" id="comment" style={{ minHeight: '210px' }} key="comment" config={this.state.froalaConfig} ref="comment" editorState={this.state.Comment} toolbarClassName="toolbarClassName" wrapperClassName="draft-editor-wrapper" editorClassName="draft-editor-inner" onEditorStateChange={this.commentBoxChange.bind(this)} />
                            <input hidden ref="description" name="forErrorShowing" />
                        </div>
                        <div className="col-xs-12" >
                            <input className="file form-group" name="file[]" id="input-id" type="file" ref="Upldfiles" data-preview-file-type="any" showUpload="false" multiple />
                        </div>
                        <div className="col-xs-12 text-center form-group">
                            <div className="loader" style={{ marginLeft: '50%', marginBottom: '2%' }}></div>
                            {
                                this.state.Status != null && this.state.Status.value === "Accepted" ?
                                    <button type="button" name="saveAndCreateEstimate" className="btn btn-success btnsavesuccess" style={{ marginTop: '1%' }} onClick={this.createEstimateClick.bind(this)} > Save & Create Estimate </button>
                                    :
                                    ""
                            }
                            <button type="submit" name="submit" className="btn btn-success btnsavesuccess" style={{ marginTop: '1%', marginLeft: '0.5%' }}>Submit</button>
                        </div>
                    </div>

                </form>
            </div>
        )
    }

    createEstimateClick() {
        this.setState({ createEstimateClick: true }, () => {
            $("button[name='submit']").click();
        })
    }

    gotoEstimate() {
        this.props.history.push({
            state: {
                Client: this.state.Client.value,
                ClientName: this.state.Client.label,
                Project: this.refs.opportunity.value,
                Location: this.state.Location.label,
                LocationId: this.state.Location.value
            },
            pathname: "/Estimate"
        })
    }

    LocationChanged(val) {
        if (val) {
            this.setState({ Location: val });
            showErrorsForInput(this.refs.location.wrapper, []);
        }
        else {
            this.setState({ Location: '' })
            showErrorsForInput(this.refs.location.wrapper, ["Please select Opportunity location"]);
        }
    }

    uploadCallback(file) {
        var formData = new FormData();
        formData.append("file", file);

        var url = ApiUrl + "/api/Opportunity/UploadImage"
        return new Promise(
            (resolve, reject) => {
                MyAjaxForAttachments(
                    url,
                    (data1) => {
                        resolve({ data: { link: data1["link"] } });
                    },
                    (error) => {
                        toast(error.responseText, {
                            type: toast.TYPE.ERROR
                        });
                        reject(error.responseText);
                    },
                    "POST", formData
                );
            });
    }

    OrganisationChanged(val) {
        if (val) {
            this.setState({ Organisation: val })
            showErrorsForInput(this.refs.organisation.wrapper, null);
        }
        else {
            sessionStorage.getItem("roles").indexOf("SuperAdmin") != -1 ?
                this.setState({ Organisation: '' }, () => {
                    showErrorsForInput(this.refs.organisation.wrapper, ["Please select Organisation"]);
                })
                :
                this.setState({ Organisation: { value: sessionStorage.getItem("OrgId"), label: sessionStorage.getItem("OrgName") } })
        }
    }

   
    commentBoxChange(val) {
        this.setState({ Comment: val, CommentHtml: draftToHtml(convertToRaw(val.getCurrentContent())) });
    }

    ContactNameFormatter(cell, row) {
        return (
            <p> {row["FirstName"]}  {row["LastName"]} </p>
        )
    }

    ClientChanged(val) {
        if (this.props.match.params["id"] !== undefined) {
            this.setState({ Client: { value: this.props.match.params["id"], label: this.state.ClientModal["ShortName"] } })
        }
        else {
            if (val) {
                var orgId = sessionStorage.getItem("roles").indexOf("SuperAdmin") != -1 ? null : sessionStorage.getItem("OrgId")

                this.setState({ Client: val, ContactPersons: [], Location: '', Locations: [] }, () => {
                    if (this.state.Client && this.state.Client.value) {
                        var clientId= this.state.Client.Id;
                        $.ajax({
                            url: ApiUrl + "/api/Client/GetClientEmployees?clientId=" + this.state.Client.Id + "&firstName=" + " " +
                                "&lastName=" + " " + "&email=" + " " + "&primaryPhone=" + " " + "&department=" + " " +
                                "&orgId=" + orgId + "&page=" + this.state.Page + "&count=" + this.state.Count,
                            type: "get",
                            success: (data) => { this.setState({ ContactPersons: data["clientEmployees"] }) }
                        })

                        $.ajax({
                            url: ApiUrl + "/api/Client/GetClientLocations?clientId=" + this.state.Client.Id,
                            type: "get",
                            success: (data) => { this.setState({ Locations: data["locations"] }) }
                        })

                    }
                })

                showErrorsForInput(this.refs.client.wrapper, []);
            }
            else {
                this.setState({ Client: '', ContactPersons: [] })
                showErrorsForInput(this.refs.client.wrapper, ["Please select a valid client"]);
            }
        }
    }

    CategoriesChanged(val) {
        if (val) {
            this.setState({ Category: val })
            showErrorsForInput(this.refs.categories.wrapper, [])
        }
        else {
            this.setState({ Category: '' })
            if (this.state.Category.length == 0) {
                showErrorsForInput(this.refs.categories.wrapper, ["Please select Categories"])
            }
        }
    }

    StatusChanged(val) {
        if (val) {
            this.setState({ Status: val }, () => {
                if (val.value == "Accepted") {
                    this.setState({ ProjectAccepted: true })

                }
                else {
                    this.setState({ ProjectAccepted: false })
                }
            })
            showErrorsForInput(this.refs.status.wrapper, [])
        }
        else {
            this.setState({ Status: '' })
        }
    }

    AssigneeChanged(val) {
        if (val) {
            this.setState({ Assignee: val });
            showErrorsForInput(this.refs.assignee.wrapper, []);
        }
        else {
            this.setState({ Assignee: '' })
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        $(".loaderActivity").show();
        $("button[name='submit']").hide();
        $("button[name='saveAndCreateEstimate']").hide();

        if (!this.validate(e)) {
            $(".loaderActivity").hide();
            $("button[name='saveAndCreateEstimate']").show();
            $("button[name='submit']").show();
            return;
        }

        if (this.refs.contactsList.state.selectedRowKeys.length == 0) {
            toast("Select atleast one contact person",
                {
                    type: toast.TYPE.INFO,
                    autoClose: false
                }
            )
            $(".loaderActivity").hide();
            $("button[name='submit']").show();
            $("button[name='saveAndCreateEstimate']").show();
            return;
        }

        var data = new FormData();

        var comment= this.state.CommentHtml;

        data.append("opportunity", this.refs.opportunity.value);
        data.append("client", this.state.Client.value);
        data.append("Categories", JSON.stringify(this.state.Category));

        data.append("orgId", this.state.Organisation.value);
        data.append("status", this.state.Status.value);
        if(this.state.Assignee !=null){
            data.append("assignTo", this.state.Assignee.value);
        }
        data.append("contactPersons", JSON.stringify(this.refs.contactsList.state.selectedRowKeys));
        data.append("comments", comment);
        data.append("location", this.state.Location.value);

        if (this.state.ProjectAccepted) {
            data.append("edos", this.refs.edos.value);
            data.append("edoc", this.refs.edoc.value);
        }

        // Gets the list of file selected for upload
        var files = $("#input-id").fileinput("getFileStack");

        for (var i = 0; i < files.length; i++) {
            if (files[i] != undefined) {
                data.append(files[i].filename, files[i]);
            }
        }

        let url = ApiUrl + "/api/Opportunity/AddOpportunity"

        try {
            MyAjaxForAttachments(
                url,
                (data) => {
                    toast("Opportunity saved successfully!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $("button[name='submit']").show();
                    $("button[name='saveAndCreateEstimate']").show();
                    if (!this.state.createEstimateClick) {
                        this.props.history.push("/OpportunitiesList");
                    }
                    else {
                        this.gotoEstimate();
                    }

                    return true;
                },
                (error) => {
                    toast(error.responseText, {
                        type: toast.TYPE.ERROR,
                        autoClose: false
                    });
                    $(".loaderActivity").hide();
                    $("button[name='submit']").show();
                    $("button[name='saveAndCreateEstimate']").show();
                    return false;
                },
                "POST",
                data
            )
        }

        catch (e) {
            toast("An error occured, please try again later!",
                { type: toast.TYPE.error }
            )
            $(".loaderActivity").hide();
            $("button[name='saveAndCreateEstimate']").show();
            $("button[name='submit']").show();
        }

    }

    validate(e) {
        var errors = {};
        var success = true;
        var isSubmit = e.type === "submit";
        var opportunityName = this.refs.opportunity.value.trim();
        //     var doc = this.refs.edoc.value;
        // var comments = this.refs.comments.value.trim();

        if (isSubmit) {
            $(e.currentTarget.getElementsByClassName('form-control')).map((i, el) => {
                el.classList.remove("un-touched");
            });
        }

        if (validate.single(opportunityName, { presence: true }) !== undefined) {
            if (isSubmit) {
                this.refs.opportunity.focus();
                isSubmit = false;
            }
            success = false;
            showErrorsForInput(this.refs.opportunity, ["Please enter opportunity name "]);
        }
        else {
            showErrorsForInput(this.refs.opportunity, []);
        }

        if (!this.state.Client || !this.state.Client.value) {
            success = false;
            showErrorsForInput(this.refs.client.wrapper, ["Please select Client"]);

            if (isSubmit) {
                this.refs.client.focus();
                isSubmit = false;
            }
        }

        if (this.state.Category.length == 0) {
            success = false;
            showErrorsForInput(this.refs.categories.wrapper, ["Please select Categories"])

            if (isSubmit) {
                this.refs.categories.focus();
                isSubmit = false;
            }
        }

        if (!this.state.Organisation || !this.state.Organisation.value) {
            success = false;
            showErrorsForInput(this.refs.organisation.wrapper, ["Please select Organisation"])
            if (isSubmit) {
                this.refs.organisation.focus();
                isSubmit = false;
            }
        }

        if (!this.state.Location || !this.state.Location.value) {
            success = false;
            showErrorsForInput(this.refs.location.wrapper, ["Please select location"])
            if (isSubmit) {
                this.refs.location.focus();
                isSubmit = false;
            }
        }

        if (!this.state.Status || !this.state.Status.value) {
            success = false;
            showErrorsForInput(this.refs.status.wrapper, ["Please select Status"])
            if (isSubmit) {
                this.refs.status.focus();
                isSubmit = false;
            }
        }

        // if (!this.state.Assignee || !this.state.Assignee.value) {
        //     success = false;
        //     showErrorsForInput(this.refs.assignee.wrapper, ["Please select assignee"]);
        //     if (isSubmit) {
        //         this.refs.assignee.focus();
        //         isSubmit = false;
        //     }
        // }

        if (this.state.ProjectAccepted) {
            if (validate.single(this.refs.edos.value, { presence: true }) !== undefined) {
                if (isSubmit) {
                    this.refs.edos.focus();
                    isSubmit = false;
                }
                success = false;
                showErrorsForInput(this.refs.edos, ["Select expected date of start"])
            }
            else {
                showErrorsForInput(this.refs.edos, []);
            }


            if (validate.single(this.refs.edoc.value, { presence: true }) !== undefined) {
                if (isSubmit) {
                    this.refs.edoc.focus();
                    isSubmit = false;
                }
                success = false;
                showErrorsForInput(this.refs.edoc, ["Select expected date of closure"]);
            }
            else {
                showErrorsForInput(this.refs.edoc, []);
            }
        }

        if (!this.state.Comment.getCurrentContent().hasText()) {
            showErrorsForInput(this.refs.description, ["Please enter comments"]);
            success = false;
            if (isSubmit) {
                this.refs.comment.focusEditor();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.description, null);
        }
        return success;

    }
}

export default Opportunity;

