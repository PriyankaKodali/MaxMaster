import React, { Component } from "react";
import $ from 'jquery';
import { toast } from 'react-toastify';
import { MyAjax } from '../MyAjax';
import { ApiUrl, remote } from '../Config';
import Select from 'react-select';
import './Bill.css';

var moment = require('moment');
var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

function trClassFormat(row, rowIdx) {
    if (row["QuantityUpdated"] !== row["TotalQuantity"]) {
        return "QuanityToBeUpdated pointer";
    }
    else {
        return "QuantityUpdated pointer";
    }

}

class BillsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            BillsList: [], searchClick: false, Supplier: '', BillDate: '', DueDate: '', BillNumber: '',
            Suppliers: [], dataTotalSize: 1, sizePerPage: 25, currentPage: 1
        }
    }

    componentWillMount() {
        $.ajax({
            url: ApiUrl + "/api/MasterData/GetSuppliers",
            type: "get",
            success: (data) => {
                this.setState({ Suppliers: data["suppliers"] })
            }
        })
        this.GetBills(this.state.currentPage, this.state.sizePerPage);
    }

    GetBills(page, count) {
        var url = ApiUrl + "/api/Items/GetBills?supplierId=" + this.state.Supplier +
            "&billNumber=" + this.state.BillNumber + "&billDate=" + this.state.BillDate +
            "&dueDate=" + this.state.DueDate + "&page=" + page + "&count=" + count;

        $.ajax({
            url: url,
            type: "get",
            success: (data) => {
                this.setState({
                    BillsList: data["bills"], dataTotalSize: data["totalCount"],
                    currentPage: page, sizePerPage: count
                })
            }
        })
    }


    render() {
        return (
            <div className="container" style={{ marginTop: '0%' }}>

                <div className="col-xs-12">
                    <h3 className="col-md-10 formheader" style={{ paddingLeft: '10px' }}>Bills  </h3>
                    <div className="col-md-2 mybutton">
                        <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => this.setState({ searchClick: !this.state.searchClick })} >
                            <span className="glyphicon glyphicon-chevron-down"></span>
                        </button>
                        <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => this.props.history.push("/Bill")} >
                            <span className="glyphicon glyphicon-plus"></span>
                        </button>
                    </div>
                </div>

                {
                    this.state.searchClick ?
                        <form style={{ paddingLeft: '14px' }}>
                            <div className="col-xs-12 clientSearch">

                                <div className="col-md-3 form-group">
                                    <label> Supplier</label>
                                    <Select className="form-control" placeholder="Supplier" value={this.state.Supplier} options={this.state.Suppliers} onChange={this.supplierChanged.bind(this)} />
                                </div>

                                <div className="col-md-2 form-group" >
                                    <label> Bill Number</label>
                                    <input className="form-control" type="text" ref="billNum" name="billNum" placeholder="Bill Number" autoComplete="off" onChange={this.handleSearch.bind(this)} />
                                </div>

                                <div className="col-md-2 form-group">
                                    <label> Bill Date</label>
                                    <input className="form-control" type="date" ref="billDate" onChange={this.handleSearch.bind(this)} />
                                </div>

                                <div className="col-md-2 form-group">
                                    <label> Due Date</label>
                                    <input className="form-control" type="date" ref="dueDate" onChange={this.handleSearch.bind(this)} />
                                </div>

                                <div className="col-md-1 button-block text-center" style={{ marginTop: '2%' }}>
                                    <input type="button" className="mleft10 btn btn-default" value="Clear" onClick={this.clearClick.bind(this)} />
                                </div>

                            </div>
                        </form>
                        :
                        ""
                }

                <div className="col-xs-12">
                    <BootstrapTable striped hover pagination={true} remote={remote}
                        data={this.state.BillsList} pagination={true}
                        trClassName={trClassFormat}
                        fetchInfo={{ dataTotalSize: this.state.dataTotalSize }}
                        options={{
                            sizePerPage: this.state.sizePerPage,
                            onPageChange: this.onPageChange.bind(this),
                            sizePerPageList: [{ text: '25', value: 25 },
                            { text: '50', value: 50 },
                            { text: '100', value: 100 }, { text: '200', value: 200 }],
                            page: this.state.currentPage,
                            onSizePerPageList: this.onSizePerPageList.bind(this),
                            paginationPosition: 'bottom',
                            onRowClick: this.rowClicked.bind(this)
                        }}
                    >

                        <TableHeaderColumn dataField="BillDate" dataSort={true} isKey={true} dataAlign="left" width="10" dataFormat={this.billDateFormat.bind(this)}> Bill Date </TableHeaderColumn>
                        <TableHeaderColumn dataField="BillNumber" dataSort={true} dataAlign="left" width="15"> Bill Number </TableHeaderColumn>
                        <TableHeaderColumn dataField="Supplier" dataSort={true} dataAlign="left" width="20">Vendor </TableHeaderColumn>
                        <TableHeaderColumn dataField="BillAmount" dataSort={true} dataAlign="left" width="15"  > Bill Amount </TableHeaderColumn>
                        <TableHeaderColumn dataField="Items" dataSort={true} dataAlign="left" width="45">Items</TableHeaderColumn>
                        <TableHeaderColumn width="5" dataAlign="center" dataFormat={this.editFormatter.bind(this)}></TableHeaderColumn>
                    </BootstrapTable>
                </div>

            </div>
        )
    }


    billDateFormat(cell, row) {
        return (
            <p> {moment(row["BillDate"]).format("DD/MM/YYYY")} </p>
        )
    }

    dueDateFormat(cell, row) {
        return (
            <p> {row["DueDate"] != null ? moment(row["DueDate"]).format("DD/MM/YYYY") : ""}</p>
        )
    }

    statusFormat(cell, row) {
        if (row["Status"] !== "Paid") {
            return (<p style={{ color: 'rgb(234, 39, 39)' }}  > {row["Status"]}</p>)
        }
        else {
            return (<p style={{ color: 'rgb(95, 235, 95)' }}> {row["Status"]}</p>)
        }
    }

    rowClicked(row) {
        this.props.history.push("/Bill/" + row["BillId"]);
    }

    editFormatter(cell, row) {
        return (
            <a>
                <i className="glyphicon glyphicon-edit" style={{ fontSize: '14px', cursor: 'pointer' }} onClick={() => this.props.history.push("/Bill/" + row["BillNumber"])}></i>
            </a>
        )
    }

    supplierChanged(val) {
        this.setState({ Supplier: val || '' }, () => {
            this.handleSearch();
        })
    }

    handleSearch() {
        this.setState({
            BillNumber: this.refs.billNum.value,
            BillDate: this.refs.billDate.value,
            DueDate: this.refs.dueDate.value,
            Supplier: this.state.Supplier.value
        }, () => {
            if (this.state.Supplier != undefined) {
                this.GetBills(this.state.currentPage, this.state.sizePerPage);
            }
            else {
                this.state.Supplier = "";
                this.GetBills(this.state.currentPage, this.state.sizePerPage);
            }
        })
    }

    clearClick() {
        this.refs.billNum.value = "";
        this.refs.billDate.value = "";
        this.refs.dueDate.value = "";

        this.setState({ Supplier: '', BillNumber: '', BillDate: '', DueDate: '' }, () => {
            this.GetBills(this.state.currentPage, this.state.sizePerPage);
        })
    }

    onPageChange(page, sizePerPage) {
        this.GetBills(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.GetBills(this.state.currentPage, sizePerPage);
    }
}

export default BillsList;

