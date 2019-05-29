import React, { Component } from 'react';
import $ from 'jquery';
import { ApiUrl } from '../Config';
import { showErrorsForInput, setUnTouched, ValidateForm } from '.././Validation';
import { MyAjaxForAttachments, MyAjax } from '../MyAjax';
import { toast } from 'react-toastify';

var validate = require('validate.js');
var moment = require('moment');
var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

class EmployeeDocuments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Documents: [], notes: '', keywords: '', uploadDate: '', category: '',
            documentDate: '', sortCol: 'Category', sortDir: 'asc', currentPage: 1,
            sizePerPage: 10, dataTotalSize: 0, EmpName: null, EmpNumber: null, EmployeeId: null
        }
    }

    componentWillMount() {
        this.setState({ EmployeeId: this.props.match.params["id"] }, () => {
            if (this.props.match.params["id"] != null) {
                this.getEmployeeDocuments(this.state.currentPage, this.state.sizePerPage);
            }
        })
    }

    componentDidMount() {
        setUnTouched(document);
    }

    componentDidUpdate() {
        setUnTouched(document);
    }

    getEmployeeDocuments(page, count) {
        var url = ApiUrl + "/api/Employee/GetEmpDocuments?EmpId=" + this.state.EmployeeId +
            "&category=" + this.state.category +
            "&uploadDate=" + this.state.uploadDate +
            "&documentDate=" + this.state.documentDate +
            "&notes=" + this.state.notes +
            "&keyWords=" + this.state.keywords +
            "&page=" + page +
            "&count=" + count +
            "&sortCol=" + this.state.sortCol +
            "&sortDir=" + this.state.sortDir

        $.ajax({
            url: url,
            type: "get",
            success: (data) => {
                this.setState({
                    Documents: data["employeeDocumnets"], EmpName: data["EmployeeName"],
                    EmpNumber: data["EmpNumber"], dataTotalSize: data["totalCount"]
                })
            }
        })
    }

    render() {
        return (
            <div className="headerCon" key={this.state.EmpName}>
                <button className="col-md-3 btn btn-default btn-circle" style={{ marginLeft: '8%' }} onClick={() => this.props.history.push("/EmployeeRegistration/" + this.props.match.params["id"])} title="General Details" > 1</button>
                <hr className="col-md-4" />
                <button className="col-md-3 btn btn-default btn-circle" onClick={() => this.props.history.push("/EmployeeDocuments/" + this.props.match.params["id"])} title="Documents" > 2</button>
                <hr className="col-md-4" />
                <button className="col-md-3 btn btn-default btn-circle" onClick={() => this.props.history.push("/EmployeePayScale/" + this.props.match.params["id"])} title="PayScales" > 3</button>

                <div className="container" id="myDocView">

                    <div className="col-xs-12">
                        <h3 className="col-md-11 formheader" > Documents</h3>
                        <div className="col-md-1 mybutton"   >
                            <button type="button" className="btn btn-default pull-left headerbtn" style={{ marginTop: '3%' }} data-toggle="modal" data-target="#documentModal" onClick={this.openModel.bind(this)}>
                                <span className="glyphicon glyphicon-plus"></span>
                            </button>
                        </div>

                            <div className="col-xs-12 clientSearch">
                                <div className="col-md-4 form-group">
                                    <label>Name:</label> {this.state.EmpName} <span /> | <span /> <label> EmpNumber: </label> {this.state.EmpNumber}
                                </div>
                                <div className="col-md-3 form-group">
                                    <input className="col-md-3 form-control" type="text" name="Category" placeholder="Category" autoComplete="off" ref="catg" onChange={this.SearchClick.bind(this)} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <input className="col-md-3 form-control" type="date" name="DocumentDate" placeholder="Documnet Date" autoComplete="off" ref="documentDate" onChange={this.SearchClick.bind(this)} />
                                </div>

                                <div className="col-md-3 form-group">
                                    <input className="col-md-3 form-control" type="date" name="UploadDate" placeholder="Upload Date" autoComplete="off" ref="uploadDate" onChange={this.SearchClick.bind(this)} />
                                </div>

                                <div className="col-md-3 form-group">
                                    <input className="col-md-3 form-control" type="text" name="Notes" placeholder="Notes" autoComplete="off" ref="notessearch" onChange={this.SearchClick.bind(this)} />
                                </div>

                                <div className="col-md-3 form-group">
                                    <input className="col-md-2 form-control" type="text" name="Keywords" placeholder="Keywords" autoComplete="off" ref="keywordssearch" onChange={this.SearchClick.bind(this)} />
                                </div>
                                <div className="col-md-2 form-group">
                                    <input type="button" className="btn btn-default" value="Clear" onClick={this.clearClick.bind(this)} />
                                </div>
                            </div>
                       
                    </div>

                    <div className="col-xs-12">
                        <BootstrapTable striped hover remote={true} pagination={true}
                            data={this.state.Documents}
                            fetchInfo={{ dataTotalSize: this.state.dataTotalSize }}
                            options={{
                                sizePerPage: this.state.sizePerPage,
                                onPageChange: this.onPageChange.bind(this),
                                sizePerPageList: [{ text: '10', value: 10 },
                                { text: '25', value: 25 },
                                { text: 'ALL', value: this.state.dataTotalSize }],
                                page: this.state.currentPage,
                                onSizePerPageList: this.onSizePerPageList.bind(this),
                                paginationPosition: 'bottom',
                                onSortChange: this.onSortChange.bind(this)
                            }}
                        >
                            <TableHeaderColumn dataField="Category" isKey={true} dataAlign="left" dataSort={true} width="20" > Category</TableHeaderColumn>
                            <TableHeaderColumn dataField="DocumentDate" dataAlign="left" dataSort={true} width="30" dataFormat={this.DocDateFormatter.bind(this)} > DocumentDate </TableHeaderColumn>
                            <TableHeaderColumn dataField="UploadDate" dataAlign="left" dataSort={true} width="30" dataFormat={this.UploadDateFormatter.bind(this)} >Upload Date</TableHeaderColumn>
                            <TableHeaderColumn dataField="Notes" dataAlign="left" dataSort={true} width="30" >Notes </TableHeaderColumn>
                            <TableHeaderColumn dataField="Keywords" dataAlign="left" dataSort={true} width="15" >KeyWords</TableHeaderColumn>

                        </BootstrapTable>
                    </div>

                    <div className="col-xs-12">
                        <button type="submit" style={{ marginLeft: '96%', marginTop: '2%' }} className="btn  btn-default" onClick={() => this.props.history.push("/EmployeePayScale/" + this.props.match.params["id"])} > Next </button>
                    </div>

                </div>

                <form onSubmit={this.handleSubmit.bind(this)} onChange={this.validate.bind(this)}  >

                    <div className="modal fade" id="documentModal" role="dialog">
                        <div className="modal-dialog modal-lg" style={{ width: '780px' }}>
                            <div className="modal-content">
                                <div className="modal-header formheader" style={{ paddingLeft: '20px' }}>
                                    <button type="button" className="close btnClose" data-dismiss="modal" id="closeModal"> &times; </button>
                                    <h4 className="modal-title">Add New Document</h4>
                                </div>
                                <div>
                                    <div className="modal-body col-xs-12">
                                        <div className="col-md-4 form-group">
                                            <label> Document</label>
                                            <input className="form-control" type="file" name="files" ref="document" autoComplete="off" />
                                        </div>

                                        <div className="col-md-4 form-group">
                                            <label> Category </label>
                                            <input className="form-control" type="text" name="Category" ref="category" autoComplete="off" />
                                        </div>

                                        <div className="col-md-4 form-group">
                                            <label> Document Date</label>
                                            <input className="form-control" type="date" name="documentdate" ref="documentdate" autoComplete="off" />
                                        </div>

                                        <div className="col-xs-12">
                                            <div className="col-md-3 form-group">
                                                <label> Key Words </label>
                                                <input className="form-control" type="text" name="keywords" ref="keywords" autoComplete="off" />
                                            </div>

                                            <div className="col-md-8 form-group">
                                                <label>Notes</label>
                                                <input className="form-control" type="text" name="nptes" ref="notes" autoComplete="off" />
                                            </div>
                                        </div>

                                    </div>

                                    <div className="col-xs-12">
                                        <div className="loader loaderActivity" style={{ marginLeft: '45%', marginBottom: '8px' }}></div>
                                        <button className="btn btn-success btnSave" type="submit" name="submit" > Save </button>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    {/* <button type="button" className="btn btn-default" data-dismiss="modal">Close</button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

            </div>

        )
    }


    DocDateFormatter(cell, row) {
        return <p > {moment(row["DocumentDate"]).format("DD-MM-YYYY")} </p>
    }

    UploadDateFormatter(cell, row) {
        return <p> {moment(row["UploadDate"]).format("DD-MM-YYYY")}</p>
    }

    openModel() {
        $("#documentModal").modal("show");
    }

    RemoveInputs() {
        this.refs.category.value = "";
        this.refs.notes.value = "";
        this.refs.keywords.value = "";
        this.refs.documentdate.value = "";

        $("#closeModal").click();
        this.getEmployeeDocuments(this.state.currentPage, this.state.sizePerPage);
    }

    handleSubmit(e) {

        e.preventDefault();

        $(e.currentTarget.getElementsByClassName('form-control')).map((i, ele) => {
            ele.classList.remove("un-touched");
            return null;
        })

        if (!this.validate(e)) {

            $(".loaderActivity").hide();
            $("button[name='submit']").hide();
            return;
        }


        $(".loaderActivity").show();
        $("button[name='submit']").hide();

        var data = new FormData();

        data.append("Documents", this.refs.document.files[0]);
        data.append("EmployeeId", this.props.match.params["id"]);
        data.append("Category", this.refs.category.value);
        data.append("DocDate", this.refs.documentdate.value);
        data.append("Keywords", this.refs.keywords.value);
        data.append("Notes", this.refs.notes.value);

        var url = ApiUrl + "/api/Employee/AddDocument";

        try {
            MyAjaxForAttachments(
                url,
                (data) => {
                    toast(" Employee documents uploaded successfully!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $(".loaderActivity").hide();
                    $("button[name='submit']").show();
                    this.RemoveInputs();
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

    SearchClick() {
        this.setState({
            category: this.refs.catg.value,
            documentDate: this.refs.documentDate.value,
            uploadDate: this.refs.uploadDate.value,
            notes: this.refs.notessearch.value,
            keywords: this.refs.keywordssearch.value
        }, () => {
            this.getEmployeeDocuments(this.state.currentPage, this.state.sizePerPage);
        })
    }

    clearClick() {
        this.refs.catg.value = "";
        this.refs.documentDate.value = "";
        this.refs.uploadDate.value = "";
        this.refs.notessearch.value = "";
        this.refs.keywordssearch.value = "";
        this.setState({
            category: this.refs.catg.value,
            documentDate: this.refs.documentDate.value,
            uploadDate: this.refs.uploadDate.value,
            notes: this.refs.notessearch.value,
            keywords: this.refs.keywordssearch.value
        }, () => {
            this.getEmployeeDocuments(this.state.currentPage, this.state.sizePerPage);
        })
    }

    onSortChange(sortCol, sortDir) {
        sortDir = this.state.sortCol === sortCol && this.state.sortDir === "asc" ? "desc" : "asc";
        this.setState({
            sortCol: sortCol,
            sortDir: sortDir
        }, () => {
            this.getEmployeeDocuments(this.state.currentPage, this.state.sizePerPage)
        });
    }

    onPageChange(page, sizePerPage) {
        this.getEmployeeDocuments(page, sizePerPage)
    }

    onSizePerPageList(sizePerPage) {
        this.getEmployeeDocuments(this.state.currentPage, sizePerPage)
    }

}

export default EmployeeDocuments;