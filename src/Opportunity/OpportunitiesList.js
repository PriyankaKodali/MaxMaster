import React, { Component } from 'react';
import Select from 'react-select';
import Moment from 'react-moment';
import { ApiUrl, remote } from '../Config';
import $ from 'jquery';
import { MyAjax } from '../MyAjax';
import { toast } from 'react-toastify';

var moment = require('moment');
var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;


function trClassFormat() {
    return "pointer";
}


class OpportunitiesList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Opportunities: [], currentPage: 1, dataTotalSize: 1, sizePerPage: 10, searchClick: false,
            isDataAvailable: false, Opportunity: '', Client: '', AssignTo: '', Status: ''
        }
    }

    componentWillMount() {

        var orgId = sessionStorage.getItem("roles").indexOf("Admin") !== -1 ? null : sessionStorage.getItem("OrgId")

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetClientsWithAspNetUserId?orgId=" + orgId,
            type: "get",
            success: (data) => { this.setState({ Clients: data["clients"] }) }
        })



        this.getOpportunitiesList(this.state.currentPage, this.state.sizePerPage);
    }

    getOpportunitiesList(page, count) {

        var orgId = sessionStorage.getItem("roles").indexOf("SuperAdmin") != -1 ? null : sessionStorage.getItem("OrgId")
        
        MyAjax(
            ApiUrl + "/api/Opportunity/GetOpportunitiesList?opportunity=" + this.state.Opportunity +
            "&client=" + this.state.Client + "&assignTo=" + this.state.AssignTo + "&status=" + this.state.Status +
            "&orgId=" + orgId + "&page=" + page + "&count=" + count,
            (data) => this.setState({
                Opportunities: data["opportunities"],
                dataTotalSize: data["totalCount"], isDataAvailable: true
            }),
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }), "GET", null
        )
    }

    render() {
        return (
            <div className="container" style={{ marginTop: '0%' }} >

                <div className="col-xs-12" >
                    <h3 className="col-md-10 formheader"> Opportunities  </h3>
                    <div className="col-md-2 mybutton" style={{ height: '45px' }}>
                        <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => this.setState({ searchClick: !this.state.searchClick })} >
                            <span className="glyphicon glyphicon-chevron-down"></span>
                        </button>
                        <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => this.props.history.push("/Opportunity")} >
                            <span className="glyphicon glyphicon-plus"></span>
                        </button>
                    </div>
                </div>

                {
                    this.state.searchClick ?
                        <form >
                            <div className="col-xs-12">
                                <div className="col-xs-12 clientSearch">

                                    <div className="col-md-2 form-group">
                                        <input type="text" className="form-control" placeholder="Opportunity" ref="opportunity" onChange={this.SearchClick.bind(this)} />
                                    </div>

                                    <div className="col-md-3 form-group">
                                        <Select className="form-control" placeholder="select Client" ref="client" value={this.state.Client} options={this.state.Clients} onChange={this.clientChanged.bind(this)} />
                                    </div>

                                    <div className="col-md-2 form-group">
                                        <input type="text" className="form-control" placeholder="Assigned To" ref="assignedTo" onChange={this.SearchClick.bind(this)} />
                                    </div>

                                    <div className="col-md-2 form-group">
                                        <input type="text" className="form-control" placeholder="Status" ref="status" onChange={this.SearchClick.bind(this)} />
                                    </div>

                                    <div className="col-md-2 button-block">
                                        <input type="button" className="mleft10 btn btn-default" value="Clear" onClick={this.clearClick.bind(this)} />
                                    </div>

                                </div>
                            </div>
                        </form>
                        :
                        <div />
                }

                <div className="col-xs-12">
                    <BootstrapTable striped hover data={this.state.Opportunities}
                        selectRow={this.state.selectRowProp} pagination={true}
                        trClassName={trClassFormat} remote={remote}
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
                            onRowClick: this.rowClicked.bind(this)

                        }}
                    >
                        <TableHeaderColumn dataField="CreatedDate" dataSort={true} dataAlign="left" dataFormat={this.dateFormat.bind(this)} width="18" > Created Date  </TableHeaderColumn>
                        <TableHeaderColumn dataField="OpportunityName" isKey={true} dataSort={true} width="25"> Opportunity   </TableHeaderColumn>
                        <TableHeaderColumn dataField="Client" dataSort={true} dataAlign="left" width="35" > Client  </TableHeaderColumn>
                        <TableHeaderColumn dataField="AssignedTo" dataSort={true} dataAlign="left" width="30" > Assigned To  </TableHeaderColumn>
                        <TableHeaderColumn dataField="Status" dataSort={true} dataAlign="left" width="30" > Status </TableHeaderColumn>
                        <TableHeaderColumn dataField="edit" dataAlign="center" width="5" dataFormat={this.editDataFormatter.bind(this)}  ></TableHeaderColumn>

                    </BootstrapTable>
                </div>

            </div>
        )
    }

    rowClicked(row) {
        this.props.history.push("/EditOpportunity/" + row["Id"]);
    }

    clientChanged(val) {
        if (val) {
            this.setState({ Client: val }, () => {
                this.SearchClick();
            })
        }
        else {
            this.setState({ Client: '' }, () => {
                this.SearchClick();
            })
        }
    }

    SearchClick() {
        this.setState({
            Opportunity: this.refs.opportunity.value,
            AssignTo: this.refs.assignedTo.value,
            Status: this.refs.status.value
        }, () => {
            if (this.state.Client !== '') {
                this.setState({ Client: this.state.Client.value }, () => {
                    this.getOpportunitiesList(this.state.currentPage, this.state.sizePerPage);
                })
            }
            else {
                this.getOpportunitiesList(this.state.currentPage, this.state.sizePerPage);
            }
        })

    }

    clearClick() {
        this.refs.opportunity.value = '';
        this.refs.assignedTo.value = '';
        this.refs.status.value = '';
        this.state.Client = null;

        this.setState({
            Opportunity: this.refs.opportunity.value,
            AssignTo: this.refs.assignedTo.value,
            Status: this.refs.status.value,
            Client: ''
        }, () => {
            this.getOpportunitiesList(this.state.currentPage, this.state.sizePerPage);
        })
    }


    editDataFormatter(cell, row) {
        return (
            <a>
                <i className="glyphicon glyphicon-edit" style={{ cursor: 'pointer', fontSize: '16px' }} onClick={() => this.props.history.push("/EditOpportunity/" + row["Id"])} > </i>
            </a>
        )
    }

    dateFormat(cell, row) {
        return (
            <p> {moment(row["CreatedDate"]).format("DD-MM-YYYY")} </p>
        )
    }

    onPageChange(page, sizePerPage) {
        this.getOpportunitiesList(page, sizePerPage)
    }

    onSizePerPageList(sizePerPage) {
        this.getOpportunitiesList(this.state.currentPage, sizePerPage)
    }


}
export default OpportunitiesList;