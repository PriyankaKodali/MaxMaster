import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { ApiUrl, remote } from '../Config';
import Select from 'react-select';

var moment = require('moment');
var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;


class DispatchReport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1, sizePerPage: 10, dataTotalSize: 1, DispatchedStock: [], searchClick: false,
            Client: '', Project: null, FromDate: null, ToDate: null, Items: [], GetStockDetails: false,
            ProjectName: '', ItemName: ''

        }
    }

    componentWillMount() {

        var orgId = sessionStorage.getItem("roles").indexOf("SuperAdmin") != -1 ? null : sessionStorage.getItem("OrgId");

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetClientsWithAspNetUserId?orgId=" + orgId,
            type: "get",
            success: (data) => { this.setState({ Clients: data["clients"] }) }
        })

        this.GetDispatchedStock(this.state.currentPage, this.state.sizePerPage);
    }

    GetDispatchedStock(page, count) {
        var url = ApiUrl + "/api/Stock/GetDispatchedStock?clientId=" + this.state.Client +
            "&project=" + this.state.Project + "&fromDate=" + this.state.FromDate + "&toDate=" + this.state.ToDate +
            "&page=" + page + "&count=" + count;

        $.ajax({
            url: url,
            type: "get",
            success: (data) => { this.setState({ DispatchedStock: data["dispatchedStock"] }) }
        })
    }



    render() {
        return (
            <div className="container" style={{ marginTop: '0.5%' }}>

                <div className="col-xs-12">
                    <h3 className="col-md-10 formheader" style={{ paddingLeft: '10px' }}> Dispatched Stock Details </h3>
                    <div className="col-md-2 mybutton">
                        <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => this.setState({ searchClick: !this.state.searchClick })} >
                            <span className="glyphicon glyphicon-chevron-down"></span>
                        </button>
                    </div>
                </div>
                {
                    this.state.searchClick ?
                        <form style={{ paddingLeft: '14px' }}>
                            <div className="col-xs-12 clientSearch">

                                <div className="col-md-2 form-group">
                                    <label> Client </label>
                                    <Select className="form-control" placeholder="Select Client" value={this.state.Client} options={this.state.Clients} onChange={this.ClientChanged.bind(this)} />
                                </div>

                                <div className="col-md-2 form-group" key={this.state.Projects}>
                                    <label> Project </label>
                                    <Select className="form-control" placeholder="Select Project" value={this.state.Project} options={this.state.Projects} onChange={this.ProjectChanged.bind(this)} />
                                </div>

                                <div className="col-md-2 form-group" key={this.state.Projects}>
                                    <label> From Date </label>
                                    <input className="form-control" type="date" ref="fromDate" />
                                </div>
                                <div className="col-md-2 form-group" key={this.state.Projects}>
                                    <label> ToDate Date </label>
                                    <input className="form-control" type="date" ref="toDate" />
                                </div>

                                <div className="col-md-1 button-block text-center" style={{paddingTop: '22px'}}>
                                    <input type="button" className="mleft10 btn btn-default" value="Clear" onClick={this.clearClick.bind(this)} />
                                </div>

                            </div>
                        </form>
                        :
                        <div />
                }


                <div className="col-xs-12" key={this.state.DispatchedStock}>
                    <BootstrapTable striped hover pagination={true} remote={remote}
                        data={this.state.DispatchedStock}
                        fetchInfo={{ dataTotalSize: this.state.dataTotalSize }}
                        options={{
                            sizePerPage: this.state.sizePerPage,
                            onPageChange: this.onPageChange.bind(this),
                            sizePerPageList: [{ text: "10", value: 10 },
                            { text: "25", value: 25 },
                            { text: "ALL", value: this.state.dataTotalSize }],
                            page: this.state.currentPage,
                            onSizePerPageList: this.onSizePerPageList.bind(this),
                            paginationPosition: 'bottom'
                        }}
                    >
                        <TableHeaderColumn dataField="ItemName" isKey={true} dataAlign="left" dataSort="true" width="15" > Item  </TableHeaderColumn>
                        <TableHeaderColumn dataField="Quantity" dataAlign="center" dataSort="true" width="10" dataFormat={this.QuantityFormat.bind(this)}>Quantity</TableHeaderColumn>
                        <TableHeaderColumn dataField="Client" dataAlign="left" dataSort="true" width="25" > Client </TableHeaderColumn>
                        <TableHeaderColumn dataField="OpportunityName" dataAlign="left" dataSort="true" width="25"> Project</TableHeaderColumn>
                    </BootstrapTable>
                </div>


                <div key={this.state.GetStockDetails}>
                    {
                        this.state.GetStockDetails ?
                            <div className="modal fade" id="getProjectStock" role="dialog" data-keyboard="false" data-backdrop="static" key={this.state.AddNewModel}>
                                <div className="modal-dialog modal-lg"  >
                                    <div className="modal-content">

                                        <div className="modal-header " style={{ background: '#f5f3f3', borderBottom: '0px solid', padding: '6px' }}>
                                            <button type="button" className="modelClose btnClose" data-dismiss="modal" id="closeModal"> &times; </button>
                                            <h4 className="col-xs-11  modal-title">
                                                <label>Item : </label> {this.state.ItemName}
                                                <label style={{ paddingLeft: '10px' }}> Project :</label> {this.state.ProjectName}
                                            </h4>
                                        </div>

                                        <div className="modal-body col-xs-12" key={this.state.Items}>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th> Serial Number </th>
                                                        <th> Mac Address </th>
                                                        <th> Manufactured Date </th>
                                                        <th> StockOut date </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.Items.map((ele, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td> {ele["SerialNumber"]}</td>
                                                                    <td> {ele["MacAddress"]}</td>
                                                                    <td> {ele["ManufacturedDate"] != null ? moment(ele["ManufacturedDate"]).format("DD-MM-YYYY") : ""}</td>
                                                                    <td> {moment(ele["StockOutDate"]).format("DD-MM-YYYY")}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }

                                                </tbody>
                                            </table>

                                        </div>

                                        <div className="modal-footer"> </div>

                                    </div>
                                </div>
                            </div>
                            :
                            <div />
                    }
                </div>

            </div>
        )
    }

    ClientChanged(val) {
        if (val) {
            this.setState({ Client: val.value, Project: null, Projects: [] }, () => {
                $.ajax({
                    url: ApiUrl + "/api/Client/GetClientProjects?clientId=" + val.value,
                    type: "get",
                    success: (data) => {
                        this.setState({ Projects: data["clientProjects"] }, () => {
                            //    this.GetStockReport(this.state.currentPage, this.state.sizePerPage);
                        })
                    }
                })
            })
        }
        else {
            this.setState({ Client: '', Project: null, Projects: [] }, () => {
                //  this.GetStockReport(this.state.currentPage, this.state.sizePerPage);
            });
        }
    }

    ProjectChanged(val) {
        if (val) {
            this.setState({ Project: val.value }, () => {
                this.GetDispatchedStock(this.state.currentPage, this.state.sizePerPage);
            })
        }
        else {
            this.setState({ Project: null }, () => {
                this.GetDispatchedStock(this.state.currentPage, this.state.sizePerPage);
            })
        }
    }


    onPageChange(page, size) {
        this.GetDispatchedStock(page, size);
    }

    onSizePerPageList(sizePerPage) {
        this.GetDispatchedStock(this.state.currentPage, sizePerPage);
    }

    clearClick() {
        this.setState({ Client: '', Project: null, FromDate: null, ToDate: null }, () => {
            this.GetDispatchedStock(this.state.currentPage, this.state.sizePerPage);
        })
    }

    QuantityFormat(cell, row) {
        return (
            <a style={{ cursor: 'pointer' }} onClick={() => { this.GetDispatchedStockDetails(row["ProjectId"], row["ItemId"], row["OpportunityName"], row["ItemName"]) }}>
                {row["Quantity"]}
            </a>
        )
    }

    GetDispatchedStockDetails(projectId, itemId, projectName, itemName) {
        $.ajax({
            url: ApiUrl + "/api/Stock/GetDispatchedStockDetails?projectId=" + projectId + "&itemId=" + itemId,
            type: "get",
            success: (data) => {
                this.setState({
                    Items: data["items"], GetStockDetails: true,
                    ProjectName: projectName, ItemName: itemName
                })
            }
        })
        $("#getProjectStock").modal("show");

    }


}

export default DispatchReport;