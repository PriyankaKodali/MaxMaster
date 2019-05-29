import React, { Component } from 'react';
import $ from 'jquery';
import { ApiUrl } from '../Config';

var validate = require('validate.js');
var moment = require('moment');
var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

class OrganisationsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            sizePerPage: 10,
            dataTotalSize: 0,
            OrganisationsList: [],
            IsDataAvailable: false,
            sortCol: 'OrgName',
            sortDir: 'asc',
            searchClick: false, orgName: '', email: '', webSite: '', phoneNum: ''
        }
    }

    componentWillMount() {
        this.getOrganisations(this.state.currentPage, this.state.sizePerPage);
    }

    getOrganisations(page, count) {

        var url = ApiUrl + "/api/Organisation/GetOrganisations?orgName=" + this.state.orgName +
            "&email=" + this.state.email + "&website=" + this.state.webSite +
            "&phoneNum=" + this.state.phoneNum +
            "&page=" + page +
            "&count=" + count +
            "&sortCol=" + this.state.sortCol +
            "&sortDir=" + this.state.sortDir

        $.ajax({
            url: url,
            type: "get",
            success: (data) => {
                this.setState({
                    Organisations: data["organisations"], IsDataAvailable: true,
                    dataTotalSize: data["TotalCount"], currentPage: page, sizePerPage: count
                });
            }
        })

    }

    render() {
        return (
            <div className="container" style={{ marginTop: '0%' }}>

                <div className="col-xs-12">
                    <h3 className="col-md-10 formheader" style={{ paddingLeft: '10px' }}> Organisations </h3>
                    <div className="col-md-2 mybutton">
                        <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => this.setState({ searchClick: !this.state.searchClick })} >
                            <span className="glyphicon glyphicon-chevron-down"></span>
                        </button>
                        <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => this.props.history.push("/Organisation")} >
                            <span className="glyphicon glyphicon-plus"></span>
                        </button>

                    </div>
                </div>


                {
                    this.state.searchClick ?

                        <form style={{ paddingLeft: '14px' }}>
                            <div className="col-xs-12 clientSearch">
                                <div className="col-md-2 form-group">
                                    <input className="col-md-3 form-control" type="text" name="Organisation " placeholder="Organisation" autoComplete="off" ref="orgName" onChange={this.SearchClick.bind(this)} />
                                </div>

                                <div className="col-md-2 form-group">
                                    <input className="col-md-3 form-control" type="text" name="email" placeholder="Email" autoComplete="off" ref="email" onChange={this.SearchClick.bind(this)} />
                                </div>

                                <div className="col-md-2 form-group">
                                    <input className="col-md-3 form-control" type="text" name="website" placeholder="WebSite" autoComplete="off" ref="website" onChange={this.SearchClick.bind(this)} />
                                </div>

                                <div className="col-md-2 form-group">
                                    <input className="col-md-3 form-control" type="text" name="PhonenUm" placeholder="PhoneNumber" autoComplete="off" ref="phoneNum" onChange={this.SearchClick.bind(this)} />
                                </div>

                                <div className="col-md-2 button-block text-center">
                                    <input type="button" className="mleft10 btn btn-default" value="Clear" onClick={this.clearClick.bind(this)} />
                                </div>
                            </div>

                        </form>
                        : <div />
                }

                {
                    this.state.IsDataAvailable
                        ?
                        <div className="col-xs-12">
                            <BootstrapTable striped hover remote={true} pagination={true}
                                data={this.state.Organisations} trClassName="pointer"
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
                                <TableHeaderColumn dataField="OrgName" isKey={true} dataAlign="left" dataSort={true} width="25" > Name</TableHeaderColumn>
                                <TableHeaderColumn dataField="Email" dataAlign="left" dataSort={true} width="25" > Email </TableHeaderColumn>
                                <TableHeaderColumn dataField="WebSite" dataAlign="left" dataSort={true} width="20" >WebSite</TableHeaderColumn>
                                <TableHeaderColumn dataField="PrimaryPhone" dataAlign="left" dataSort={true} width="20" >Phone Number</TableHeaderColumn>
                                <TableHeaderColumn columnClassName="edit" dataField="Edit" dataAlign="center" width="10" dataFormat={this.editDataFormatter.bind(this)} ></TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                        :
                        < div className="loader visible" style={{ marginTop: '5%' }} ></div >
                }
            </div>

        )
    }

    rowClicked(row) {
        this.props.history.push("/Organisation/" + row["Id"])
    }

    editDataFormatter(cell, row) {
        return (
            <a>
                <i className='glyphicon glyphicon-edit' style={{ fontSize: '18px', cursor: 'pointer' }} onClick={() => this.props.history.push("/Organisation/" + row["Id"])}  ></i>
            </a>
        )
    }

    SearchClick() {

        this.setState({
            orgName: this.refs.orgName.value, email: this.refs.email.value,
            webSite: this.refs.website.value, phoneNum: this.refs.phoneNum.value
        }, () => {
            this.getOrganisations(this.state.currentPage, this.state.sizePerPage);
        })

    }

    clearClick() {
        this.refs.orgName.value = "", this.refs.email.value = "",
            this.refs.website.value = "", this.refs.phoneNum.value = ""

        this.setState({
            orgName: "", email: "",
            webSite: "", phoneNum: ""
        }, () => {
            this.getOrganisations(this.state.currentPage, this.state.sizePerPage);
        })
    }


    onSortChange(sortCol, sortDir) {
        sortDir = this.state.sortCol === sortCol && this.state.sortDir === "asc" ? "desc" : "asc";
        this.setState({
            sortCol: sortCol,
            sortDir: sortDir
        }, () => {
            this.getOrganisations(this.state.currentPage, this.state.sizePerPage);
        });
    }

    onPageChange(page, sizePerPage) {
        this.getOrganisations(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.getOrganisations(this.state.currentPage, sizePerPage);
    }
}

export default OrganisationsList;
