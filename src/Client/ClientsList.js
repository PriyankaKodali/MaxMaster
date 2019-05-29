import React, { Component } from 'react';
import $ from 'jquery';
import { ApiUrl, remote } from '../Config';
import Select from 'react-select';

var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

function trClassFormat(row, rowIdx) {
    return "pointer";
}

class ClientsList extends Component {

    constructor(props) {

        var orgId = sessionStorage.getItem("roles").indexOf("SuperAdmin") != -1 ? null : sessionStorage.getItem("OrgId")
        super(props);
        this.state = {
            currentPage: 1,
            sizePerPage: 10,
            dataTotalSize: 0,
            searchClick: false,
            clientsList: [],
            name: '',
            email: "",
            fax: '',
            phone: '',
            ClientType: "",
            // sortCol: 'Name',
            // sortDir: 'asc'
            sortCol: '',
            sortDir: '',
            Organisation: orgId

        }
    }

    componentWillMount() {

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetOrganisations",
            type: "get",
            success: (data) => { this.setState({ Organisations: data["organisations"] }) }
        })
        this.getClientsList(this.state.currentPage, this.state.sizePerPage);
    }

    getClientsList(page, count) {
        this.setState({ IsDataAvailable: false });

        // var orgId = sessionStorage.getItem("roles").indexOf("SuperAdmin") != -1 ? null : sessionStorage.getItem("OrgId")

        var url = ApiUrl + "/api/Client/GetAllClients?name=" + this.state.name +
            "&phone=" + this.state.phone +
            "&email=" + this.state.email +
            "&clientType=" + this.state.ClientType +
            "&fax=" + this.state.fax +
            "&orgId=" + this.state.Organisation +
            "&page=" + page +
            "&count=" + count;

        $.ajax({
            url: url,
            type: "get",
            success: (data) => {
                this.setState({
                    clientsList: data["Clients"], dataTotalSize: data["totalCount"],
                    currentPage: page, sizePerPage: count, IsDataAvailable: true
                })
            }
        })
    }

    render() {
        return (
            <div className="container" style={{ marginTop: '0%' }}>

                <div className="col-xs-12">
                    <h3 className="col-md-10 formheader" style={{ paddingLeft: '10px' }}> Clients </h3>
                    <div className="col-md-2 mybutton">
                        <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => this.setState({ searchClick: !this.state.searchClick })} >
                            <span className="glyphicon glyphicon-chevron-down"></span>
                        </button>
                        <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => this.props.history.push("/ClientRegistration")} >
                            <span className="glyphicon glyphicon-plus"></span>
                        </button>
                    </div>
                </div>

                {
                    this.state.searchClick ?

                        <form>
                            <div className="col-xs-12" style={{ marginLeft: '0.3%' }}>
                                <div className="col-xs-12 clientSearch" style={{ paddingLeft: '14px' }} >
                                    <div className="col-md-2 form-group">
                                        <input className="col-md-3 form-control" type="text" name="ClientName" placeholder="Client Name" autoComplete="off" ref="clientName" onChange={this.SearchClick.bind(this)} />
                                    </div>

                                    <div className="col-md-2 form-group">
                                        <input className="col-md-3 form-control" type="text" name="Email" placeholder="Email" autoComplete="off" ref="email" onChange={this.SearchClick.bind(this)} />
                                    </div>

                                    <div className="col-md-2 form-group">
                                        <input className="col-md-3 form-control" type="text" name="PhoneNum" placeholder="Phone Number" autoComplete="off" ref="phoneNum" onChange={this.SearchClick.bind(this)} />
                                    </div>

                                    <div className="col-md-2 form-group">
                                        {/* <input className="col-md-3 form-control" type="text" name="clientType" placeholder="Client Type" autoComplete="off" ref="clienttype" onChange={this.SearchClick.bind(this)} />  */}
                                        <Select className="col-md-3 form-control" name="ClientType" placeholder="Client Type" value={this.state.ClientType}
                                            options={[{ value: 'Direct Client', label: 'Direct Client' },
                                            { value: 'Indirect Client', label: 'Indirect Client' },
                                            { value: 'Vendor', label: 'Vendor' }, { value: 'Supplier', label: 'Supplier' }]}
                                            onChange={this.clientTypeChanged.bind(this)}
                                        />
                                    </div>

                                    {
                                        sessionStorage.getItem("roles").indexOf("SuperAdmin") != -1 ?
                                            <div className="col-md-3 form-group">
                                                <Select className="col-md-3 form-control" options={this.state.Organisations} value={this.state.Organisation} placeholder="Organisation" onChange={this.OrganisationChanged.bind(this)} />
                                            </div>
                                            :
                                            <div />
                                    }

                                    <div className="col-md-1">
                                        <input type="button" className="btn btn-default" value="Clear" onClick={this.ClearClick.bind(this)} />
                                    </div>
                                </div>
                            </div>
                        </form>

                        : <div />
                }

                {
                    this.state.IsDataAvailable ?
                        <div className="col-xs-12">
                            <BootstrapTable striped hover remote={remote} pagination={true}
                                data={this.state.clientsList} trClassName={trClassFormat}
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
                                    // onRowClick: this.rowClicked.bind(this)
                                }}
                            >
                                <TableHeaderColumn dataField="Name" isKey={true} dataAlign="left" dataSort={true} width="55" dataFormat={this.clientNameFormatter.bind(this)} > Name</TableHeaderColumn>
                                <TableHeaderColumn dataField="Email" dataAlign="left" dataSort={true} width="45" >Email </TableHeaderColumn>
                                <TableHeaderColumn dataField="Phone" dataAlign="left" dataSort={true} width="30" >Phone</TableHeaderColumn>
                                <TableHeaderColumn dataField="Fax" dataAlign="left" dataSort={true} width="20" >Fax</TableHeaderColumn>
                                <TableHeaderColumn columnClassName="addOpportunity" dataField="add" width="20" dataAlign="center" dataFormat={this.createOpportunity.bind(this)} > </TableHeaderColumn>
                                <TableHeaderColumn columnClassName="edit" dataField="Edit" dataAlign="center" width="10" dataFormat={this.editDataFormatter.bind(this)} ></TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                        :
                        <div className="loader visible" style={{ marginTop: '5%' }} ></div>
                }

            </div>
        )
    }

    rowClicked(row) {
        this.props.history.push("/ClientRegistration/" + row["Id"]);
    }

    clientTypeChanged(val) {
        this.setState({ ClientType: val || '' }, () => {
            this.SearchClick();
        })
    }

    OrganisationChanged(val) {
        if (val) {
            this.setState({ Organisation: val }, () => {
                this.setState({ Organisation: val.value }, () => {
                    this.getClientsList(this.state.currentPage, this.state.sizePerPage);
                })
            })
        }
        else {
            this.setState({ Organisation: '' }, () => {
                this.getClientsList(this.state.currentPage, this.state.sizePerPage);
            })
        }

    }


    SearchClick() {
        this.setState({
            name: this.refs.clientName.value,
            email: this.refs.email.value,
            phone: this.refs.phoneNum.value,
            // fax: this.refs.fax.value,
            ClientType: this.state.ClientType.value
        }, () => {
            if (this.state.ClientType != undefined) {
                this.getClientsList(this.state.currentPage, this.state.sizePerPage);
            }
            else {
                this.state.ClientType = "";
                this.getClientsList(this.state.currentPage, this.state.sizePerPage);
            }
        })
    }

    ClearClick() {
        this.refs.clientName.value = "";
        this.refs.email.value = "";
        this.refs.phoneNum.value = "";
        // this.refs.fax.value = "";
        this.state.ClientType = "";
        this.state.Organisation = "";

        this.setState({
            name: this.refs.clientName.value,
            email: this.refs.email.value,
            phone: this.refs.phoneNum.value,
            //  fax: this.refs.fax.value,
            clientType: this.state.ClientType,
            organisation: this.state.Organisation
        }, () => {
            this.getClientsList(this.state.currentPage, this.state.sizePerPage);
        })
    }

    ClientChanged(val) {
        this.setState({ Client: val || '' })
        this.SearchClick.bind(this);
    }

    editDataFormatter(cell, row) {
        return (
            <a>
                <i className='glyphicon glyphicon-edit linkStyle' onClick={() => this.props.history.push("/ClientRegistration/" + row["Id"])} ></i>
            </a>
        )
    }

    clientNameFormatter(cell, row) {
        return (
            <p> {row["Name"]}  {row["Vendor_Id"]} </p>
        )
    }

    createOpportunity(cell, row) {
        return (
            <a className="linkStyle" onClick={() => this.props.history.push("/Opportunity/" + row["Id"])}> Opportunity  </a>
        )
    }

    onPageChange(page, sizePerPage) {
        this.getClientsList(page, sizePerPage)
    }

    onSizePerPageList(sizePerPage) {
        this.getClientsList(this.state.currentPage, sizePerPage)
    }

}

export default ClientsList;