import React, { Component } from 'react';
import $ from 'jquery';
import { ApiUrl, remote } from '../Config';

var moment = require('moment');
var ReactBSTable = require("react-bootstrap-table");
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;
var BootstrapTable = ReactBSTable.BootstrapTable;

class Items extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Items: this.props.Items, dataTotalSize: 1, sizePerPage: 25, currentPage: 1, SearchClick: false,
            SerialNum: '', BatchNum: '', MacAddress: '', ModelId: ''
        }
    }

    componentWillMount() {
         if (this.props.match.params["id"] != null) {
        this.GetItems(this.state.currentPage, this.state.sizePerPage);
         }
     //   $("#myItemModel").modal("show");
    }

    GetItems(page, count) {
        var url = ApiUrl + "/api/Items/GetItems?modelId=" + this.props.match.params["id"]+
            "&serialNum=" + this.state.SerialNum + "&batchNum=" + this.state.BatchNum +
            "&macAddress=" + this.state.MacAddress + "&page=" + page + "&count=" + count;

        $.ajax({
            url: url,
            type: "get",
            success: (data) => {
                this.setState({
                    Items: data["items"], dataTotalSize: data["totalCount"],
                    currentPage: page,
                    sizePerPage: count
                })
            }
        })
    }

    render() {
        return (
            <div className="container" style={{ marginTop: '0px' }} key={this.state.Items}>
                <div className="col-xs-12">
                    <h3 className="col-md-10 formheader" style={{ paddingLeft: '10px' }}> Items </h3>
                    <div className="col-md-2 mybutton">
                        <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => { this.props.history.push("/StockReport") }} >
                            <span className="glyphicon glyphicon-list"></span>
                        </button>
                        <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => { this.setState({ SearchClick: !this.state.SearchClick }) }} >
                            <span className="glyphicon glyphicon-chevron-down"></span>
                        </button>
                    </div>
                </div>

                {
                    this.state.SearchClick ?
                        <form style={{ paddingLeft: '14px' }} >
                            <div className="col-xs-12 clientSearch">
                                <div className="col-md-2">
                                    <input className="form-control" type="text" placeholder="serialNo" ref="serialNo" autoComplete="off" onChange={this.handleSearchClick.bind(this)} />
                                </div>

                                <div className="col-md-2">
                                    <input className="form-control" type="text" placeholder="Batch Number" ref="batchNumber" autoComplete="off" onChange={this.handleSearchClick.bind(this)} />
                                </div>

                                <div className="col-md-2">
                                    <input className="form-control" type="text" placeholder="MAC Address" ref="macAddress" autoComplete="off" onChange={this.handleSearchClick.bind(this)} />
                                </div>

                                <div className="col-md-1 button-block text-center">
                                    <input type="button" className="mleft10 btn btn-default" value="Clear" onClick={this.clearClick.bind(this)} />
                                </div>

                            </div>
                        </form>


                        :
                        <div />
                }

                <div className="col-xs-12">
                    <BootstrapTable striped hover  remote={remote}
                        data={this.state.Items} pagination={true}
                        fetchInfo={{ dataTotalSize: this.state.dataTotalSize }}
                        options={{
                            sizePerPage: this.state.sizePerPage,
                            onPageChange: this.onPageChange.bind(this),
                            sizePerPageList: [{ text: '25', value: 25 },
                            { text: '50', value: 50 },
                            { text: '100', value: 100 },
                            { text: '200', value: 200 }],
                            page: this.state.currentPage,
                            onSizePerPageList: this.onSizePerPageList.bind(this),
                            paginationPosition: 'bottom'
                        }}
                    >
                        <TableHeaderColumn dataField="SerialNumber" isKey={true} dataAlign="left" dataSort={true}> SerialNo </TableHeaderColumn>
                        <TableHeaderColumn dataField="BatchNumber" dataAlign="left" dataSort={true}> Batch Number</TableHeaderColumn>
                        <TableHeaderColumn dataField="MACAddress" dataAlign="left" dataSort={true} > MAC Address</TableHeaderColumn>
                        <TableHeaderColumn dataField="CostPrice" dataAlign="right" dataSort={true}>Cost Price</TableHeaderColumn>
                        <TableHeaderColumn dataField="SellingPrice" dataAlign="right" dataSort={true} > Selling Price</TableHeaderColumn>
                        <TableHeaderColumn dataField="ManufacturedDate" dataAlign="left" dataSort={true} dataFormat={this.ManufacturedDateFormat.bind(this)}> ManufcturedDate </TableHeaderColumn>

                    </BootstrapTable>
                </div>

            </div>

        )
    }

    handleSearchClick() {
        this.setState({
            SerialNum: this.refs.serialNo.value, BatchNum: this.refs.batchNumber.value,
            MacAddress: this.refs.macAddress.value
        }, () => {
            this.GetItems(this.state.currentPage, this.state.sizePerPage);
        })
    }

    clearClick() {
        this.refs.serialNo.value = "";
        this.refs.batchNumber.value = "";
        this.refs.macAddress.value = "";
        this.setState({
            SerialNum: this.refs.serialNo.value, BatchNum: this.refs.batchNumber.value,
            MacAddress: this.refs.macAddress.value
        }, () => {
            this.GetItems(this.state.currentPage, this.state.sizePerPage);
        })
    }

    ManufacturedDateFormat(cell, row) {
        return (
            <p> {row["ManufacturedDate"]!=null ? moment(row["ManufacturedDate"]).format("MM-DD-YYYY") :""}</p>
        )
    }

    onPageChange(page, sizePerPage) {
        this.GetItems(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.GetItems(this.state.currentPage, sizePerPage);
    }

}

export default Items;
