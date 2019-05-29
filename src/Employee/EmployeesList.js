import React, { Component } from 'react';
import $ from 'jquery';
import { ApiUrl, remote } from '../Config';
import Select from 'react-select';
var validate = require('validate.js');
var moment = require('moment');
var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

function trClassFormat(row, rowIdx) {
    return "pointer";
}


class EmployeesList extends Component {
    constructor(props) {
        super(props);
        var orgId = sessionStorage.getItem("roles").indexOf("SuperAdmin") != -1 ? null : sessionStorage.getItem("OrgId")

        this.state = {
            currentPage: 1,
            sizePerPage: 10,
            dataTotalSize: 0,
            EmployeesList: [],
            name: '',
            email: '',
            phone: '',
            designation: '',
            department: '',
            empNum: '',
            IsDataAvailable: false,
            sortCol: 'Name',
            sortDir: 'asc',
            searchClick: false,
            manager: '',
            Organisation: orgId
        }
    }

    componentWillMount() {
        this.getEmployeesList(this.state.currentPage, this.state.sizePerPage);

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetOrganisations",
            type: "get",
            success: (data) => { this.setState({ Organisations: data["organisations"] }) }
        })
    }

    getEmployeesList(page, count) {
        this.setState({ IsDataAvailable: false });

        var url = ApiUrl + "/api/Employee/GetAllEmployees?empNum=" + this.state.empNum +
            "&name=" + this.state.name +
            "&email=" + this.state.email +
            "&phoneNum=" + this.state.phone +
            "&department=" + this.state.department +
            "&designation=" + this.state.designation +
            "&manager=" + this.state.manager +
            "&orgId=" + this.state.Organisation +
            "&page=" + page +
            "&count=" + count +
            "&sortCol=" + this.state.sortCol +
            "&sorDir=" + this.state.sortDir


        $.ajax({
            url: url,
            type: "get",
            success: (data) => {
                this.setState({
                    EmployeesList: data["employees"], dataTotalSize: data["totalCount"],
                    IsDataAvailable: true, currentPage: page, sizePerPage: count
                })
            }
        })

    }

    render() {
        return (
            <div className="container" style={{ marginTop: '0%' }}>

                <div className="col-xs-12">
                    <h3 className="col-md-10 formheader" style={{ paddingLeft: '10px' }}> Employees </h3>
                    <div className="col-md-2 mybutton">
                        <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => this.setState({ searchClick: !this.state.searchClick })} >
                            <span className="glyphicon glyphicon-chevron-down"></span>
                        </button>
                        <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => this.props.history.push("/EmployeeRegistration")} >
                            <span className="glyphicon glyphicon-plus"></span>
                        </button>

                    </div>
                </div>

                {
                    this.state.searchClick ?

                        <form style={{ paddingLeft: '14px' }}>
                            <div className="col-xs-12 clientSearch">
                                <div className="col-md-2 form-group">
                                    <input className="col-md-2 form-control" type="text" name="FirstName" placeholder="Name" autoComplete="off" ref="name" onChange={this.SearchClick.bind(this)} />
                                </div>

                                <div className="col-md-2 form-group">
                                    <input className="col-md-2 form-control" type="text" name="PhoneNum" placeholder="Phone Number" autoComplete="off" ref="phoneNum" onChange={this.SearchClick.bind(this)} />
                                </div>

                                <div className="col-md-2 form-group">
                                    <input className="col-md-1 form-control" type="text" name="Designation" placeholder="Designation" autoComplete="off" ref="designation" onChange={this.SearchClick.bind(this)} />
                                </div>

                                <div className="col-md-2 form-group">
                                    <input className="col-md-1 form-control" type="text" name="Manager" placeholder="Manager" autoComplete="off" ref="manager" onChange={this.SearchClick.bind(this)} />
                                </div>
                                {
                                    sessionStorage.getItem("roles").indexOf("SuperAdmin") != -1 ?
                                        <div className="col-md-2">
                                            <Select className="form-control" options={this.state.Organisations} value={this.state.Organisation} placeholder="Organisation" onChange={this.OrganisationChanged.bind(this)} />
                                        </div>
                                        :
                                        <div />
                                }

                                <div className="col-md-1 button-block text-center">
                                    <input type="button" className="mleft10 btn btn-default" value="Clear" onClick={this.clearClick.bind(this)} />
                                </div>
                            </div>
                        </form>

                        : <div />
                }


                {
                    this.state.IsDataAvailable ?

                        <div className="col-xs-12" style={{ marginTop: '1%' }}>
                            <BootstrapTable striped hover remote={remote} pagination={true}
                                data={this.state.EmployeesList} trClassName={trClassFormat}
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
                                    onSortChange: this.onSortChange.bind(this),
                                    onRowClick: this.rowClicked.bind(this)
                                }}
                            >
                                <TableHeaderColumn dataField="EmpNum" isKey={true} dataAlign="left" dataSort={true} width="15" > EmpNum</TableHeaderColumn>
                                <TableHeaderColumn dataField="Name" dataAlign="left" dataSort={true} width="25" > Name </TableHeaderColumn>
                                <TableHeaderColumn dataField="PrimaryPhone" dataAlign="left" dataSort={true} width="20" >Phone Num</TableHeaderColumn>
                                <TableHeaderColumn dataField="Email" dataAlign="left" dataSort={true} width="30" >Email </TableHeaderColumn>
                                <TableHeaderColumn dataField="Department" dataAlign="center" dataSort={true} width="15" >Department</TableHeaderColumn>
                                <TableHeaderColumn dataField="Designation" dataAlign="left" dataSort={true} width="20" >Designation </TableHeaderColumn>
                                <TableHeaderColumn dataField="Manager" dataAlign="left" dataSort={true} width="15" >Manager </TableHeaderColumn>
                                <TableHeaderColumn columnClassName="edit" dataField="Edit" dataAlign="center" width="10" dataFormat={this.editDataFormatter.bind(this)} ></TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                        :
                        < div className="loader visible"  style={{ marginTop: '5%' }} ></div >
                }

            </div>

        )
    }

    OrganisationChanged(val) {
        if (val) {
            this.setState({ Organisation: val }, () => {
                this.setState({ Organisation: val.value }, () => {
                    this.getEmployeesList(this.state.currentPage, this.state.sizePerPage);
                })
            })
        }
        else {
            this.setState({ Organisation: '' }, () => {
                this.getEmployeesList(this.state.currentPage, this.state.sizePerPage);
            })
        }

    }

    SearchClick() {
        this.setState({
            //  empNum: this.refs.empNum.value,
            name: this.refs.name.value,
            //   email: this.refs.email.value,
            phone: this.refs.phoneNum.value,
            designation: this.refs.designation.value,
            manager: this.refs.manager.value
        }, () => {
            this.getEmployeesList(this.state.currentPage, this.state.sizePerPage);
        })
    }

    clearClick() {
        this.refs.name.value = "";
        //  this.refs.empNum.value = "";
        //   this.refs.email.value = "";
        this.refs.phoneNum.value = "";
        this.refs.designation.value = "";
        this.refs.manager.value = "";
        this.state.Organisation = '';
        this.setState({
            //   empNum: this.refs.empNum.value,
            name: this.refs.name.value,
            //    email: this.refs.email.value,
            phone: this.refs.phoneNum.value,
            designation: this.refs.designation.value,
            manager: this.refs.manager.value,
            Organisation: this.state.Organisation

        }, () => {
            this.getEmployeesList(this.state.currentPage, this.state.sizePerPage);
        })
    }

    rowClicked(row) {
        this.props.history.push("/EmployeeRegistration/" + row["Id"]);
    }


    editDataFormatter(cell, row) {
        return (
            <a>
                <i className='glyphicon glyphicon-edit' style={{ fontSize: '18px', cursor: 'pointer' }} onClick={() => this.props.history.push("/EmployeeRegistration/" + row["Id"])}  ></i>
            </a>
        )
    }

    onSortChange(sortCol, sortDir) {
        sortDir = this.state.sortCol === sortCol && this.state.sortDir === "asc" ? "desc" : "asc";
        this.setState({
            sortCol: sortCol,
            sortDir: sortDir
        }, () => {
            this.getEmployeesList(this.state.currentPage, this.state.sizePerPage)
        });
    }

    onPageChange(page, sizePerPage) {
        this.getEmployeesList(page, sizePerPage)
    }

    onSizePerPageList(sizePerPage) {
        this.getEmployeesList(this.state.currentPage, sizePerPage)
    }
}

export default EmployeesList;