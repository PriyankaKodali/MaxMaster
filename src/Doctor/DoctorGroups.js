import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { ApiUrl } from '../Config';
import { MyAjaxForAttachments, MyAjax } from '../MyAjax'
import { showErrorsForInput, setUnTouched, ValidateForm } from '.././Validation';

var moment = require('moment');
var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;
var validate = require('validate.js');

class DoctorGroups extends Component {

    constructor(props) {
        super(props);
        this.state = {
            DoctorGroups: [],
            DoctorGroup: ''
        }
    }

    componentWillMount() {

       this.getDoctorsGroupList();

    }

    getDoctorsGroupList() {
        $.ajax({
            url: ApiUrl + "/api/MasterData/GetDoctorGroups",
            type: "get",
            success: (data) => { this.setState({ DoctorGroups: data["doctorGroups"] }) }

        })
    }

    render() {
      return (
              <div className="container" >
            <div className="headercon">
                    <form onSubmit={this.handleSubmit.bind(this)} onChange={this.validate.bind(this)} >
                        <div className="headercon">
                            <div className="row">
                                <div className="col-md-12">
                                    <h3 className="col-md-11 formheader" style={{ paddingLeft: '20px', marginTop: '1%' }}> Doctor Groups</h3>
                                    <div className="col-md-1 mybutton" style={{ marginTop: '1%' }}  >
                                        <button type="button" className="btn btn-default pull-left headerbtn" data-toggle="modal" data-target="#myModal">
                                            <span className="glyphicon glyphicon-plus"></span>
                                        </button>
                                    </div>
                                </div>

                                <div className="modal fade" id="myModal" role="dialog">
                                    <div className="modal-dialog modal-lg">
                                        <div className="modal-content">
                                            <div className="modal-header formheader" style={{ paddingLeft: '20px' }}>
                                                <button type="button" className="close btnClose" id="closeModal" data-dismiss="modal"> &times; </button>
                                                <h4 className="modal-title">Doctor Group</h4>
                                            </div>
                                            <div>
                                                <div className="modal-body col-xs-12">
                                                    <div className="col-md-12 form-group">
                                                        <label> Group Name</label>
                                                        <input className="form-control" type="text" name="DoctorGroup" ref="groupName" autoComplete="off" />
                                                    </div>
                                                </div>

                                                <div className="col-xs-12">
                                                    <button type="submit" style={{ marginLeft: '50%' }} name="submit" className="btn btn-md btn-success" > Create </button>
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                {/* <button type="button" className="btn btn-default" data-dismiss="modal">Close</button> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div className="col-xs-12">
                        {this.state.DoctorGroups.map((ele, i) => {
                            return (<li style={{ fontSize: '16px', marginTop: '1%' }} key={i}>  {ele["label"]} </li>)
                        })}
                    </div>
                </div>
            </div>

        )
    }

    Success() {
        this.refs.groupName.value="";
        $("#closeModal").click();
        this.getDoctorsGroupList();
    }


    handleSubmit(e) {
        e.preventDefault();

        $(e.currentTarget.getElementsByClassName('form-control')).map((i, ele) => {
            ele.classList.remove("un-touched");
            return null;
        })

        if (!this.validate(e)) {
            return;
        }


        var data = new FormData();

        data.append("GroupName", this.refs.groupName.value);

        var url = ApiUrl + "/api/Doctors/AddDoctorGroup"

        try {
            MyAjaxForAttachments(
                url,
                (data) => {
                    toast("Doctor group saved successfully!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $("button[name='submit']").show();
                    this.Success();
                    return true;
                },
                (error) => {
                    toast("An error occoured, please try again!", {
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


export default DoctorGroups