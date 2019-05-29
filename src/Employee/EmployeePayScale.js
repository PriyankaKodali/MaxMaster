import React, { Component } from 'react';
import $ from 'jquery';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { showErrorsForInput, setUnTouched, ValidateForm } from '.././Validation';
import { ApiUrl } from '../Config';
import { toast } from 'react-toastify';
import { MyAjaxForAttachments, MyAjax } from '../MyAjax';


var validate = require('validate.js');
var moment = require('moment');
var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

class EmployeePayScale extends Component {

    constructor(props) {
        super(props);
        this.state = {
            EmployeeId: null, EmployeePayScale: []
        }
    }

    componentWillMount() {

        this.setState({ EmployeeId: this.props.match.params["id"] }, () => {
            if (this.props.match.params["id"] != null) {
                $.ajax({
                    url: ApiUrl + "/api/Employee/GetEmpPayScale?EmpId=" + this.props.match.params["id"],
                    type: "get",
                    success: (data) => { this.setState({ EmployeePayScale: data["empPayScale"] }) }
                })
            }
        })
    }

    componentDidMount() {
        setUnTouched(document);
    }
    componentDidUpdate() {
        setUnTouched(document);
    }

    render() {
        return (
            <div className="headerCon" key={this.state.EmployeePayScale}>
                <button className="col-md-3 btn btn-default btn-circle" style={{ marginTop: '0.5%', marginLeft: '10%' }} onClick={() => this.props.history.push("/EmployeeRegistration/" + this.props.match.params["id"])} title="General Details" > 1</button>
                <hr className="col-md-4" />
                <button className="col-md-3 btn btn-default btn-circle" onClick={() => this.props.history.push("/EmployeeDocuments/" + this.props.match.params["id"])} title="Documents" > 2</button>
                <hr className="col-md-4" />
                <button className="col-md-3 btn btn-default btn-circle" onClick={() => this.props.history.push("/EmployeePayScale/" + this.props.match.params["id"])} title="PayScales" > 3</button>


                <div className="container">
                    <div className="col-xs-12">
                        <h3 className="Empheading">Payscale Details</h3>
                    </div>

                    <form onSubmit={this.handleSubmit.bind(this)} onChange={this.validate.bind(this)}  >

                        <div className="col-xs-12">
                            <div className="col-md-4 form-group">
                                <label> CTC </label>
                                <input className="form-control" type="text" name="CTC" placeholder="Current CTC" autoComplete="off" ref="ctc" autoFocus defaultValue={this.state.EmployeePayScale["CTC"]} />
                            </div>
                            <div className="col-md-4 form-group">
                                <label> Bank Name </label>
                                <input className="form-control" type="text" name="BankName" placeholder="Bank Name" autoComplete="off" ref="bankName" defaultValue={this.state.EmployeePayScale["BankName"]} />
                            </div>

                            <div className="col-md-4 form-group">
                                <label> Branch Name </label>
                                <input className="form-control" type="text" name="BranchName" placeholder="Branch Name" ref="branchName" autoComplete="off" defaultValue={this.state.EmployeePayScale["BranchName"]} />
                            </div>
                        </div>
                        <div className="col-xs-12">

                            <div className="col-md-5 form-group">
                                <label> Branch Account Number </label>
                                <input className="form-control" type="text" name="AccountNumber" placeholder="Bank Account Number" ref="accNumber" autoComplete="off" defaultValue={this.state.EmployeePayScale["AccountNumber"]} />
                            </div>

                            <div className="col-md-5 form-group">
                                <label>Account Name</label>
                                <input className="form-control" type="text" name="AccountName" placeholder="Account Name" autoComplete="off" ref="accName" autoComplete="off" defaultValue={this.state.EmployeePayScale["AccountName"]} />
                            </div>
                        </div>

                        <div className="col-xs-12">
                            <div className="loader loaderActivity" style={{ marginLeft: '45%', marginBottom: '8px' }}></div>
                            <button className="btn btn-success btnPayscaleSubmit" type="submit" name="submit" >Save</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    handleSubmit(e) {
        e.preventDefault();

        $(".loaderActivity").show();
        $("button[name='submit']").hide();


        $(e.currentTarget.getElementsByClassName('form-control')).map((i, ele) => {
            ele.classList.remove("un-touched");
            return null;
        })

        if (!this.validate(e)) {
            $(".loaderActivity").hide();
            $("button[name='submit']").show();
            return;
        }
        var data = new FormData();
        data.append("CTC", this.refs.ctc.value);
        data.append("BankName", this.refs.bankName.value);
        data.append("BranchName", this.refs.branchName.value);
        data.append("AccountNumber", this.refs.accNumber.value);
        data.append("AccountName", this.refs.accName.value);
        data.append("EmployeeId", this.state.EmployeeId);

        var url = ApiUrl + "/api/Employee/AddEmpPayScale?EmpId=" + this.state.EmployeeId

        try {
            MyAjaxForAttachments(
                url,
                (data) => {
                    toast(" Employee Payscale details saved successfully!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $("button[name='submit']").show();
                    this.props.history.push("/EmployeesList");
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
            toast("An error occoured, please try again!", {
                type: toast.TYPE.ERROR
            });
            $(".loader").hide();
            $("button[name='submit']").show();
            return false;
        }

    }

    validate(e) {
        var success = ValidateForm(e);
        return success;
    }
}

export default EmployeePayScale;