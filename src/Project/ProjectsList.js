import React, { Component } from 'react';
import $ from 'jquery';
import { ApiUrl } from '../Config';

var validate = require('validate.js');
var moment = require('moment');
var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

function trClassFormat(row, rowIdx) {
    return "pointer";
}

class ProjectsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1, sizePerPage: 10, dataTotalSize: 0, ProjectsList: [], IsDataAvailable: false,
            sortCol: 'Client', sortDir: 'asc', searchClick: false, Email: '', ProjectHolder: '', Client: '',
            ProjectName: '', PhoneNumber: ''
        }
    }

    componentWillMount() {
        this.getProjectsList(this.state.currentPage, this.state.sizePerPage);
    }

    getProjectsList(page, count) {

        var url = ApiUrl + "/api/Project/GetProjects?projectName=" + this.state.ProjectName +
            "&client=" + this.state.Client +
            "&email=" + this.state.Email +
            "&projectHolder=" + this.state.ProjectHolder +
            "&phoneNum=" + this.state.PhoneNumber +
            "&page=" + page + "&count=" + count +
            "&sortCol=" + this.state.sortCol +
            "&sortDir=" + this.state.sortDir

        $.ajax({
            url: url,
            type: "get",
            success: (data) => {
                this.setState({
                    ProjectsList: data["projectsList"], IsDataAvailable: true,
                    dataTotalSize: data["totalCount"]
                })
            }
        })

    }

    render() {
        return (
            <div className="container">
                <div className="headercon" >
                    <div className="headercon">
                        <div className="row">
                            <div className="col-md-12">
                                <h3 className="col-md-10 formheader" style={{ paddingLeft: '10px' }}> Projects </h3>
                                <div className="col-md-2 mybutton">
                                    <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => this.setState({ searchClick: !this.state.searchClick })} >
                                        <span className="glyphicon glyphicon-chevron-down"></span>
                                    </button>
                                    <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => this.props.history.push("/Project")} >
                                        <span className="glyphicon glyphicon-plus"></span>
                                    </button>

                                </div>
                            </div>
                        </div>

                        {
                            this.state.searchClick ?

                                <form className="formSearch" id="searchform">
                                    <div className="col-md-2 form-group">
                                        <input className="col-md-3 form-control" type="text" name="client " placeholder="Client" autoComplete="off" ref="client" onChange={this.SearchClick.bind(this)} />
                                    </div>

                                    <div className="col-md-2 form-group">
                                        <input className="col-md-3 form-control" type="text" name="projectName" placeholder="ProjectName" autoComplete="off" ref="project" onChange={this.SearchClick.bind(this)} />
                                    </div>

                                    <div className="col-md-2 form-group">
                                        <input className="col-md-3 form-control" type="text" name="projectHolderName" placeholder="Project Holder Name" autoComplete="off" ref="projectHolder" onChange={this.SearchClick.bind(this)} />
                                    </div>

                                    <div className="col-md-2 form-group">
                                        <input className="col-md-3 form-control" type="text" name="email" placeholder="Email" autoComplete="off" ref="email" onChange={this.SearchClick.bind(this)} />
                                    </div>

                                    <div className="col-md-2 form-group">
                                        <input className="col-md-3 form-control" type="text" name="PhonenUm" placeholder="PhoneNumber" autoComplete="off" ref="phoneNum" onChange={this.SearchClick.bind(this)} />
                                    </div>

                                    <div className="col-md-2 button-block text-center">
                                        <input type="button" className="mleft10 btn btn-default" value="Clear" onClick={this.clearClick.bind(this)} />
                                    </div>
                                </form>
                                : <div />
                        }
                    </div>

                    {
                        !this.state.IsDataAvailable
                            ?
                            < div className="loader visible" style={{ marginTop: '5%' }} ></div >
                            :
                            <div style={{ marginTop: '1%' }}>
                                <BootstrapTable striped hover remote={true} pagination={true}
                                    data={this.state.ProjectsList} trClassName={trClassFormat}
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
                                    <TableHeaderColumn dataField="ProjectName" dataAlign="left" isKey={true} dataSort={true} width="25" > Project Name </TableHeaderColumn>
                                    <TableHeaderColumn dataField="Client" dataAlign="left" dataSort={true} width="25" > Client</TableHeaderColumn>
                                    <TableHeaderColumn dataField="ProjectHolder" dataAlign="left" dataSort={true} width="20" >Contact Person</TableHeaderColumn>
                                    <TableHeaderColumn dataField="EmailId" dataAlign="left" dataSort={true} width="20" > Email</TableHeaderColumn>
                                    <TableHeaderColumn dataField="PhoneNumber" dataAlign="left" dataSort={true} width="20" >Phone Number</TableHeaderColumn>
                                    <TableHeaderColumn columnClassName="" dataField="Edit" dataAlign="center" width="10" dataFormat={this.editFormatter.bind(this)} ></TableHeaderColumn>
                                </BootstrapTable>
                            </div>
                    }

                </div>
            </div>
        )
    }

    rowClicked(row) {

    }

    editFormatter(cell, row) {
        return (
            <a> <i className="glyphicon glyphicon-edit"></i></a>
        )
    }

    SearchClick() {
        this.setState({
            Client: this.refs.client.value, Email: this.refs.email.value,
            ProjectName: this.refs.project.value,
            ProjectHolder: this.refs.projectHolder.value, PhoneNumber: this.refs.phoneNum.value
        }, () => {
            this.getProjectsList(this.state.currentPage, this.state.sizePerPage);
        })
    }

    clearClick() {
        this.refs.email.value = '';
        this.refs.client.value = '';
        this.refs.phoneNum.value = '';
        this.refs.projectHolder.value = '';
        this.refs.project.value = '';

        this.setState({
            Email: this.refs.email.value, PhoneNumber: this.refs.phoneNum.value,
            ProjectHolder: this.refs.projectHolder.value, Client: this.refs.client.value,
            ProjectName: this.refs.project.value
        }, () => {
            this.getProjectsList(this.state.currentPage, this.state.sizePerPage);
        })
    }

    onSortChange(sortCol, sortDir) {
        sortDir = this.state.sortCol === sortCol && this.state.sortDir === "asc" ? "desc" : "asc";
        this.setState({
            sortCol: sortCol,
            sortDir: sortDir
        }, () => {
            this.getProjectsList(this.state.currentPage, this.state.sizePerPage);
        });
    }

    onPageChange(page, sizePerPage) {
        this.getProjectsList(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.getProjectsList(this.state.currentPage, sizePerPage);
    }

}

export default ProjectsList;