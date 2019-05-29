import React, { Component } from 'react';
import Select from 'react-select';
import $ from 'jquery';
import './Opportunity.css';
import { ApiUrl } from '../Config';
import { toast } from 'react-toastify';
import { MyAjaxForAttachments, MyAjax } from '../MyAjax';
import { showErrorsForInput, setUnTouched, ValidateForm } from '.././Validation';
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

var moment = require('moment');
var validate = require('validate.js');

class EditOpportunity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            OppLogInfo: [], oppContactInfo: [], OppInfo: [], Action: null, CommentHtml: "", createEstimateClick: false,
            Comment: EditorState.createEmpty(), Status: null, Assignee: null, Assignees: [],
            ProjectAccepted: false, OppInfo: [], Description: " ", OpportunityAccepted: false,
            EDOC: moment().add(30, "days").format("YYYY-MM-DD"), IsActive: true, ProjectCompleted: false,
            showCreateEstimate: true,
        }
    }


    componentWillMount() {

        var orgId = sessionStorage.getItem("roles").indexOf("SuperAdmin") != -1 ? null : sessionStorage.getItem("OrgId");


        $.ajax({
            url: ApiUrl + "/api/Opportunity/GetOpportunity?oppId=" + this.props.match.params["id"],
            type: "get",
            success: (data) => {
                this.setState({
                    OppInfo: data["oppInfo"], OppLogInfo: data["oppLogs"],
                    oppContactInfo: data["oppContacts"], Description: data["oppInfo"]["Description"]
                }, () => {
                    if (this.state.OppInfo.Status == "Accepted" || this.state.OppInfo.Status == "InProcess") {
                        this.setState({ OpportunityAccepted: true })
                    }
                })
                //console.log(this.state.Description);
            }
        })

        MyAjax(
            ApiUrl + "/api/MasterData/GetEmployeesForTaskAllocation?creatorId=" + '' + "&OrgId=" + orgId,
            (data) => { this.setState({ Assignees: data["employees"] }) },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        )

        this.setState({ OppId: this.props.match.params["id"] }, () => {
            //   if (this.props.match.params["id"] !== undefined) {
            // $.ajax({
            //     url: ApiUrl + "/api/Opportunity/GetOpportunity?oppId=" + this.props.match.params["id"],
            //     type: "get",
            //     success: (data) => {
            //         this.setState({
            //             OppInfo: data["oppInfo"], OppLogInfo: data["oppLogs"],
            //             oppContactInfo: data["oppContacts"]
            //         })
            //     }
            // })
            //  }

            // MyAjax(
            //     ApiUrl + "/api/MasterData/GetEmployeesForTaskAllocation?creatorId=" + '' + "&OrgId=" + orgId,
            //     (data) => { this.setState({ Assignees: data["employees"] }) },
            //     (error) => toast(error.responseText, {
            //         type: toast.TYPE.ERROR
            //     })
            // )

        })
    }
    componentDidMount() {
        setUnTouched(document);

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
            <div className="container" style={{ marginTop: '0%' }} >


                <div className="col-xs-12">
                    <h3 className="col-md-11 formheader" style={{ paddingLeft: '10px' }}>Opportunity/Project</h3>
                    <div className="col-md-1 mybutton">
                        <button type="button" style={{ marginTop: '3%' }} className="btn btn-default pull-left headerbtn" onClick={() => this.props.history.push("/OpportunitiesList")} >
                            <span className="glyphicon glyphicon-th-list"></span>
                        </button>
                    </div>
                </div>


                <div className="col-md-6 col-xs-12" style={{ marginTop: '0.5%' }} >
                    <table className="table table-condensed table-bordered headertable">
                        <tbody>
                            <tr>
                                <th>Created By</th>
                                <td>{this.state.OppInfo["CreatedBy"]}</td>
                            </tr>
                            <tr>
                                <th>Created On</th>
                                <td>{moment(this.state.OppInfo["CreatedDate"]).format("DD-MMM-YYYY hh:mm A")}</td>
                            </tr>
                            <tr>
                                <th>Assigned To </th>
                                <td>{this.state.OppInfo["TaskOwner"]}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="col-md-6 col-xs-12" style={{ marginTop: '0.5%' }} >
                    <table className="table table-condensed table-bordered headertable">
                        <tbody>
                            <tr>
                                <th> Client </th>
                                <td>{this.state.OppInfo["Name"]} </td>
                            </tr>
                            <tr>
                                <th> Status </th>
                                <td>{this.state.OppInfo["Status"]} </td>
                            </tr>
                            <tr>
                                <th> Assigned Date </th>
                                <td> {moment(this.state.OppInfo["CreatedDate"]).format("DD-MMM-YYYY hh:mm A")} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="col-md-12">
                    <table className="table table-condensed table-bordered headertable" key={this.state.OppInfo}>
                        <tbody>
                            <tr>
                                <th style={{ width: '20px' }} >Comments</th>
                                <td >
                                    <Editor name="actionResponse" readonly={true} id="actionResponse"
                                        editorState={this.gotoChangeContent(this.state.OppInfo["Description"])} toolbarClassName="hide-toolbar"
                                        wrapperClassName="response-editor-wrapper" editorClassName="draft-editor-inner"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* <div className="col-xs-12" key={this.state.OppInfo}>
                    <div className="col-md-2" >
                        <label className="chkBox">Active
                            <input type="checkbox" name="isActive" name="isActive" ref="isActive" value={this.state.IsActive} onChange={this.isActiveChanged.bind(this)} defaultChecked={this.state.OppInfo["IsActive"]} />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                </div> */}

                <div className="col-xs-12">
                    <h3 className="col-md-12 Empheading" style={{ paddingLeft: '10px' }}>Contact Information  </h3>
                </div>

                <div className="col-md-12">
                    <table className="table table-condensed table-bordered headertable">
                        <tbody>
                            <tr>
                                <th> First Name </th>
                                <th> Last Name </th>
                                <th> Email</th>
                                <th> Phone Number </th>
                                <th> Department</th>
                            </tr>
                            {
                                this.state.oppContactInfo.map((ele, i) => {
                                    return (
                                        <tr key={i}>
                                            <td > {(ele["FirstName"])} </td>
                                            <td> {ele["LastName"]} </td>
                                            <td> {ele["Email"]} </td>
                                            <td> {ele["PrimaryPhone"]} </td>
                                            <td> {ele["Department"]} </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>

                <div className="col-xs-12">
                    <h3 className="col-md-12 Empheading" style={{ paddingLeft: '10px' }}>Previous Actions  </h3>
                </div>

                <div className="col-md-12">
                    <table className="table table-condensed table-bordered headertable">
                        <tbody>
                            <tr>
                                <th style={{ width: '15%' }} > Created Date</th>
                                <th>CreatedBy</th>
                                <th ></th>
                                <th colspan={2} style={{ width: '50%' }}> Action/ Response</th>
                                <th className="width12"> Assigned To</th>
                                <th className="width12"> Status </th>
                            </tr>
                            {
                                this.state.OppLogInfo.map((ele, i) => {
                                    return (
                                        <tr key={i}>
                                            <td style={{ width: '15%' }}> {ele["CreatedDate"]}</td>
                                            <td> {ele["CreatedBy"]}</td>
                                            <td>  {
                                                ele["Attachments"] != null ?
                                                    ele["Attachments"].map((el) => {
                                                        return (
                                                            <a href={el} target="blank"> <i className='fa fa-paperclip' style={{ fontSize: '18px', cursor: 'pointer' }}  ></i> </a>
                                                        )
                                                    })
                                                    :
                                                    ""
                                            }
                                            </td>
                                            <td colspan={2}>
                                                <Editor name="actionResponse" readonly={true} id="actionResponse" addLineBreaks={false}
                                                    editorState={this.gotoChangeContent(ele["Comments"])} toolbarClassName="hide-toolbar"
                                                    wrapperClassName="response-editor-wrapper" editorClassName="draft-editor-inner"
                                                />
                                            </td>
                                            <td className="width12"> {ele["AssignedTo"]}</td>
                                            <td className="width12"> {ele["Status"]}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>

                {
                    this.state.OppInfo["Status"] !== "Completed" && this.state.OppInfo["Status"] !== "Declined" ?
                        this.state.OpportunityAccepted == false ?
                            <div >
                                <div className="panel-body pver10 p0">
                                    <form onSubmit={this.handleSubmit.bind(this)} onChange={this.validate.bind(this)} >

                                        <div className="col-md-3">
                                            <label> Status </label>
                                            <div className="form-group">
                                                <div className="input-group">
                                                    <span className="input-group-addon" >
                                                        <span className="glyphicon glyphicon-user"></span>
                                                    </span>
                                                    <Select className="form-control" name="status" ref="status" placeholder="Status" value={this.state.Status}
                                                        options={[{ value: "ShowingInterest", label: "Showing Interest" }, { value: "Accepted", label: "Accepted" },
                                                        { value: "Declined", label: "Declined" }]}
                                                        onChange={this.StatusChanged.bind(this)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <label> Assign To </label>
                                            <div className="form-group">
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <span className="glyphicon glyphicon-user"> </span>
                                                    </span>
                                                    <Select className="form-control" name="assignTo" ref="assignee" placeholder="Select Assignee" options={this.state.Assignees} value={this.state.Assignee} onChange={this.AssigneeChanged.bind(this)} />
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
                                        <div>
                                            <label className="col-xs-12">Comments</label>
                                            <div className="col-xs-12  form-group" style={{ paddingTop: '5px', height: "auto" }}>
                                                <Editor name="comment" id="comment" key="comment" ref="comment"
                                                    editorState={this.state.Comment} toolbarClassName="toolbarClassName"
                                                    wrapperClassName="draft-editor-wrapper" editorClassName="draft-editor-inner"
                                                    onEditorStateChange={this.commentBoxChange.bind(this)}
                                                />
                                                <input hidden ref="description" name="forErrorShowing" />
                                            </div>
                                            <div className="col-xs-12" >
                                                <input className="file form-group" name="file[]" id="input-id" type="file" ref="Upldfiles" data-preview-file-type="any" showUpload="false" multiple />
                                            </div>
                                        </div>

                                        <div className="col-xs-12 text-center form-group" key={this.state.Status}>
                                            <div className="loader" style={{ marginLeft: '50%', marginBottom: '2%' }}></div>
                                            <button type="submit" name="submit" className="btn btn-success btnsavesuccess" style={{ marginTop: '1%', marginLeft: '0.5%' }}>Submit</button>
                                            {
                                                this.state.showCreateEstimate ?
                                                    <button type="button" name="saveAndCreateEstimate" className="btn btn-success btnsavesuccess" style={{ marginTop: '1%', marginLeft: '0.5%' }} onClick={this.saveAndCreateEstimateClick.bind(this)} > Save & Create Estimate </button>
                                                    :
                                                    ""
                                            }

                                        </div>

                                    </form>
                                </div>

                            </div>
                            :
                            <form onSubmit={this.handleSubmit.bind(this)} onChange={this.validate.bind(this)} >
                                <div className="col-xs-12">
                                    <div className="col-md-3">
                                        <label> Status </label>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <span className="glyphicon glyphicon-user" />
                                                </span>
                                                <Select className="form-control" ref="status" value={this.state.Status} placeholder="Select Status"
                                                    options={[{ label: "In Process", value: "InProcess" }, { label: "Completed", value: "Completed" }]}
                                                    onChange={this.StatusChanged.bind(this)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        this.state.ProjectCompleted ?
                                            <div className="col-md-3">
                                                <label> Completed Date</label>
                                                <div className="form-group">
                                                    <div className="input-group">
                                                        <span className="input-group-addon">
                                                            <span classNBame="glyphicon glyphicon-calendar"></span>
                                                        </span>
                                                        <input className="form-control" type="date" style={{ lineHeight: '19px' }} ref="completedDate" name="completedDate" />
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            ""
                                    }

                                    <div className="col-xs-12 text-center form-group" key={this.state.Status}>
                                        <div className="loader" style={{ marginLeft: '50%', marginBottom: '2%' }}></div>
                                        <button type="submit" name="submit" className="btn btn-success btnsavesuccess" style={{ marginTop: '1%', marginLeft: '0.5%' }}>Submit</button>
                                        {
                                            this.state.showCreateEstimate ?
                                                <button type="button" name="saveAndCreateEstimate" className="btn btn-success btnsavesuccess" style={{ marginTop: '1%', marginLeft: '0.5%' }} onClick={this.saveAndCreateEstimateClick.bind(this)} > Save & Create Estimate </button>
                                                :
                                                ""
                                        }

                                    </div>
                                </div>
                            </form>

                        :
                        ""
                }
            </div>
        )
    }

    gotoChangeContent(content) {
        if (this.state.OppInfo.Description !== undefined) {
            const contentBlock = convertFromHTML(this.state.OppInfo["Description"]);
            if (contentBlock.contentBlocks != null) {
                const contentState = ContentState.createFromBlockArray(contentBlock);
                const editorState = EditorState.createWithContent(contentState);
                return editorState;
            }
            else {
                const editor = EditorState.createEmpty();
                return editor;
            }
        }
        else {
            const editor = EditorState.createEmpty();
            return editor;
        }

    }

    isActiveChanged(val) {
        this.setState({ IsActive: !this.state.OppInfo["IsActive"] })
    }

    AssigneeChanged(val) {
        if (val) {
            this.setState({ Assignee: val });
            showErrorsForInput(this.refs.assignee.wrapper, []);
        }
        else {
            this.setState({ Assignee: '' })
            showErrorsForInput(this.refs.assignee.wrapper, ["Please select Assignee"]);
        }

    }

    StatusChanged(val) {
        if (val) {
            this.setState({ Status: val }, () => {
                if (val.value == "Accepted") {
                    this.setState({ ProjectAccepted: true, showCreateEstimate: true })

                }
                else if (val.value == "Completed") {
                    this.setState({ ProjectCompleted: true, showCreateEstimate: false })
                }
                else {
                    this.setState({ ProjectAccepted: false, ProjectCompleted: false, showCreateEstimate: true })
                }
            })
            showErrorsForInput(this.refs.status.wrapper, [])
        }
        else {
            this.setState({ Status: '', ProjectAccepted: false, ProjectCompleted: false });
            showErrorsForInput(this.refs.status.wrapper, ["Please select Status"]);
        }
    }

    commentBoxChange(val) {
        this.setState({ Comment: val, CommentHtml: draftToHtml(convertToRaw(val.getCurrentContent())) });
    }

    saveAndCreateEstimateClick() {
        this.setState({ createEstimateClick: true }, () => {
            $("button[name='submit']").click();

        })
    }

    gotoEstimate() {
        this.props.history.push({
            state: {
                Client: this.state.OppInfo["Client_Id"],
                ClientName: this.state.OppInfo["Name"],
                LoctionId: this.state.OppInfo["Location_Id"],
                Location: this.state.OppInfo["Location"]
            },
            pathname: "/Estimate"
        })
    }

    handleSubmit(e) {

        e.preventDefault();

        $(".loader").show();
        $("button[name='submit']").hide();
        $("button[name='saveAndCreateEstimate']").hide();

        if (!this.validate(e)) {

            $(".loader").hide();
            $("button[name='submit']").show();
            $("button[name='saveAndCreateEstimate']").show();
            return;
        }

        var data = new FormData();

        data.append("status", this.state.Status.value);
        data.append("comments", this.state.CommentHtml);
        data.append("oppId", this.props.match.params["id"]);

        if (this.state.ProjectAccepted) {
            data.append("assignee", this.state.Assignee.value);
            data.append("edos", this.refs.edos.value);
            data.append("edoc", this.refs.edoc.value);
        }

        if (this.state.ProjectCompleted) {
            data.append("completedDate", this.refs.completedDate.value);
        }
        data.append("isActive", this.state.IsActive);

        var files = $("#input-id").fileinput("getFileStack");

        for (var i = 0; i < files.length; i++) {
            if (files[i] != undefined) {
                data.append(files[i].filename, files[i]);
            }
        }

        let url = ApiUrl + "/api/Opportunity/EditOpportunity?oppId=" + this.props.match.params["id"]

        try {
            MyAjaxForAttachments(
                url,
                (data) => {
                    toast("Opportunity saved successfully!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $("button[name='submit']").show();
                    $("button[name='saveAndCreateEstimate']").show();

                    if (this.state.OpportunityAccepted !== true) {
                        this.props.history.push("/OpportunitiesList");
                    }
                    else {
                        if (this.state.createEstimateClick == true) {
                            this.gotoEstimate();
                        }
                        else {
                            this.props.history.push("/OpportunitiesList");
                        }
                    }

                    return true;
                },
                (error) => {
                    toast(error.responseText, {
                        type: toast.TYPE.ERROR,
                        autoClose: false
                    });
                    $(".loader").hide();
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
        }

    }

    validate(e) {

        var success = true;
        var isSubmit = e.type === "submit";

        if (isSubmit) {
            $(e.currentTarget.getElementsByClassName('form-control')).map((i, el) => {
                el.classList.remove("un-touched");
            });
        }

        if (!this.state.Status || !this.state.Status.value) {
            success = false;
            showErrorsForInput(this.refs.status.wrapper, ["Please select action type"])
            if (isSubmit) {
                this.refs.status.focus();
                isSubmit = false;
            }
        }

        if (this.state.Status != null) {
            if (this.state.Status.value !== "InProcess" && this.state.Status.value !== "Completed") {
                if (!this.state.Assignee || !this.state.Assignee.value) {
                    if (isSubmit) {
                        this.refs.assignee.focus();
                        isSubmit = false;
                    }
                    success = false;
                    showErrorsForInput(this.refs.assignee.wrapper, ["Please select assignee"]);
                }
            }
        }

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

        if (this.state.ProjectCompleted) {
            if (this.state.Status.value == "Completed" && this.refs.completedDate.value == "") {
                showErrorsForInput(this.refs.completedDate, ["Completed date is required"]);
                success = false;
                if (isSubmit) {
                    this.refs.completedDate.focus();
                    isSubmit = false;
                }
            }
            else {
                showErrorsForInput(this.refs.completedDate, []);
            }

        }

        if (this.state.Status !== null) {
            if (this.state.Status.value !== "Completed" && this.state.Status.value !== "InProcess") {
                if (!this.state.Comment.getCurrentContent().hasText()) {
                    showErrorsForInput(this.refs.description, ["Please enter comments"]);
                    success = false;
                    if (isSubmit) {
                        this.refs.comment.focusEditor();
                        isSubmit = false;
                    }
                }
                else {
                    showErrorsForInput(this.refs.description, []);
                }
            }
        }

        return success;

    }
}

export default EditOpportunity;