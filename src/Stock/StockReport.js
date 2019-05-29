import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { MyAjax } from '../MyAjax';
import { ApiUrl, remote } from '../Config';
import { Items } from './Items';
import Select from 'react-select';


var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;


function trClassFormat(row, rowIdx) {
    if (row.Quantity < row.ThresholdQuantity) {
        return "lowAvailability";
    }
}


class StockReport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ItemModelsList: [], currentPage: 1, dataTotalSize: 1, sizePerPage: 25, searchClick: true,
            itemName: '', modelNumber: '', brand: '', manufacturer: '', hsnCode: '', showItemsLists: false,
            Items: [], ModelId: '', QuantitySymbol: '', ThresholdSymbol: '', quantity: '', threshold: ''
        }

    }

    componentWillMount() {
        this.GetItemModels(this.state.currentPage, this.state.sizePerPage);
    }

    GetItemModels(page, count) {
        var url = ApiUrl + "/api/Items/GetItemModels?itemName=" + this.state.itemName +
            "&modelNumber=" + this.state.modelNumber + "&brand=" + this.state.brand +
            "&quantity=" + this.state.quantity + "&quanitySymbol=" + this.state.QuantitySymbol +
            "&threshold=" + this.state.threshold + "&thresholdSymbol=" + this.state.ThresholdSymbol +
            "&page=" + page + "&count=" + count;

        $.ajax({
            url: url,
            type: "get",
            success: (data) => {
                this.setState({
                    ItemModelsList: data["itemModels"], dataTotalSize: data["totalCount"], currentPage: page, sizePerPage: count
                })
            }
        })
    }

    render() {
        return (
            <div className="container" style={{ marginTop: '0%' }} >
                <div className="col-xs-12">
                    <h3 className="col-md-10 formheader" style={{ paddingLeft: '10px' }}> Stock Report </h3>
                    <div className="col-md-2 mybutton">
                        <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => this.setState({ searchClick: !this.state.searchClick })} >
                            <span className="glyphicon glyphicon-chevron-down"></span>
                        </button>
                        <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => this.props.history.push("/Model")} >
                            <span className="glyphicon glyphicon-plus"></span>
                        </button>

                    </div>
                </div>
                {
                    this.state.searchClick ?
                        <form style={{ paddingLeft: '14px' }}>
                            <div className="col-xs-12 clientSearch">

                                <div className="col-md-2 form-group" >
                                    <input className="form-control" type="text" ref="itemName" name="ItemName" placeholder="Item Name" autoComplete="off" onChange={this.handleSearch.bind(this)} />
                                </div>

                                <div className="col-md-2 form-group" >
                                    <input className="form-control" type="text" ref="modelNumber" name="ModelNumber" placeholder="Model Number" autoComplete="off" onChange={this.handleSearch.bind(this)} />
                                </div>

                                <div className="col-md-2 form-group" >
                                    <input className="form-control" type="text" ref="brand" name="Brand" placeholder="Brand" autoComplete="off" onChange={this.handleSearch.bind(this)} />
                                </div>

                                <div className="col-md-2 form-group" style={{ paddingLeft: '1%' }} >
                                    <div className="input-group">
                                        <Select className="symbol form-control" ref="quantitySymbol" id="warrenty" value={this.state.QuantitySymbol}
                                            options={[{ value: '>', label: '>' }, { value: '<', label: '<' }, { value: '=', label: '=' }]}
                                            onChange={this.QuantitySymbolChanged.bind(this)}
                                        />
                                        <input className="col-md-1 form-control" id="quantity" placeholder="Quantity" type="number" ref="quantity" name="quantity" onChange={this.QuantityChanged.bind(this)} />
                                    </div>
                                </div>

                                <div className="col-md-2 form-group" style={{ paddingLeft: '1%' }}>
                                    <div className="input-group">

                                        <Select className="symbol form-control" ref="warrentyduration" value={this.state.ThresholdSymbol}
                                            options={[{ value: '>', label: '>' }, { value: '<', label: '<' }, { value: '=', label: '=' }]}
                                            onChange={this.ThresholdSymbolChanged.bind(this)} />

                                        <input className="col-md-1 form-control" id="quantity" placeholder="Threshold" type="number" ref="threshold" name="threshold" onChange={this.ThresholdChanged.bind(this)} />
                                    </div>
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
                    <BootstrapTable striped hover remote={remote} trClassName={trClassFormat}
                        pagination={true} data={this.state.ItemModelsList}
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
                        <TableHeaderColumn dataField="ItemName" isKey={true} dataAlign="left" width="30" dataSort={true} > Item Name</TableHeaderColumn>
                        <TableHeaderColumn dataField="ModelNumber" dataAlign="left" width="15" dataSort={true} > Model Number</TableHeaderColumn>
                        <TableHeaderColumn dataField="Brand" dataAlign="left" width="10" dataSort={true}> Brand </TableHeaderColumn>
                        <TableHeaderColumn dataField="Quantity" dataAlign="center" width="6" dataSort={true}> Quantity </TableHeaderColumn>
                        <TableHeaderColumn dataField="ThresholdQuantity" dataAlign="center" width="5" headerText="Threshold quantity" dataSort={true} > TQuantity </TableHeaderColumn>
                        <TableHeaderColumn dataAlign="left" width="3" dataFormat={this.EditItem.bind(this)}></TableHeaderColumn>
                        <TableHeaderColumn dataAlign="left" width="3" dataFormat={this.ViewItems.bind(this)}></TableHeaderColumn>
                    </BootstrapTable>
                </div>

            </div>

        )
    }


    QuantityChanged() {
        this.setState({ quantity: this.refs.quantity.value }, () => {
            if (this.refs.quantity.value != "") {
                if (this.state.QuantitySymbol != "") {
                    this.handleSearch();
                }
            }
            else {
                this.setState({ quantity: '', QuantitySymbol: '' }, () => {
                    this.handleSearch();
                })
            }
        })
    }

    QuantitySymbolChanged(val) {
        if (val != null) {
            this.setState({ QuantitySymbol: val.value }, () => {
                if (this.refs.quantity.value != "") {
                    this.handleSearch();
                }
            })
        }
        else {
            this.setState({ QuantitySymbol: '', quantity: '' }, () => {
                this.handleSearch();
            })
        }
    }


    ThresholdChanged() {
        this.setState({ threshold: this.refs.threshold.value }, () => {
            if (this.refs.threshold.value !== "") {
                if (this.state.ThresholdSymbol != null) {
                    this.handleSearch();
                }
            }
            else {
                this.setState({ threshold: '', ThresholdSymbol: '' }, () => {
                    this.handleSearch();
                })
            }
        })
    }

    ThresholdSymbolChanged(val) {
        if (val != null) {
            this.setState({ ThresholdSymbol: val.value }, () => {
                if (this.refs.threshold.value != null) {
                    this.handleSearch();
                }
            })
        }
        else {
            this.setState({ ThresholdSymbol: '', threshold: '' }, () => {
                this.handleSearch();
            })
        }
    }



    handleSearch() {
        this.setState({
            itemName: this.refs.itemName.value,
            modelNumber: this.refs.modelNumber.value,
            brand: this.refs.brand.value,
            threshold: this.refs.threshold.value,
            quantity: this.refs.quantity.value
        }, () => {

            this.GetItemModels(this.state.currentPage, this.state.sizePerPage);
        })
    }

    EditItem(cell, row) {
        return (
            <a>
                <i className='glyphicon glyphicon-edit' style={{ fontSize: '14px', cursor: 'pointer' }} title="Edit Model" onClick={() => this.props.history.push("/Model/" + row["Id"])}  ></i>
            </a>
        )
    }

    ViewItems(cell, row) {
        return (
            <a>
                {/* <i className="glyphicon glyphicon-th-list" style={{ fontSize: '14px', cursor: 'pointer' }} title="Items List" onClick={() => { this.GetItemsList(row["Id"]) }}  ></i> */}

                <i className="glyphicon glyphicon-th-list" style={{ fontSize: '14px', cursor: 'pointer' }} title="Items List" onClick={() => { this.props.history.push('/Items/' + row["Id"]) }}  ></i>

            </a>
        )
    }

    // GetItemsList(modelId) {
    //     var url = ApiUrl + "/api/Items/GetItems?modelId=" + modelId + "&serialNum=" + '' +
    //         "&batchNum=" + '' + "&macAddress=" + '' + "&page=" + 1 + "&count=" + 10;

    //     $.ajax({
    //         url: url,
    //         type: "get",
    //         success: (data) => {
    //             this.setState({
    //                 Items: data["items"], dataTotalSize: data["totalCount"], showItemsLists: true,
    //                 ModelId: modelId
    //             })
    //         }
    //     }, () => {
    //         $("#itemList").modal("show");
    //     })
    // }

    clearClick() {
        this.refs.itemName.value = "";
        this.refs.modelNumber.value = "";
        this.refs.brand.value = "";
        this.refs.quantity.value = "";
        this.refs.threshold.value = "";

        this.setState({
            itemName: '', modelNumber: '', brand: '', quantity: '', QuantitySymbol: null, threshold: '', ThresholdSymbol: null
        }, () => {
            this.GetItemModels(this.state.currentPage, this.state.sizePerPage);
        })
    }

    onPageChange(page, sizePerPage) {
        this.GetItemModels(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.GetItemModels(this.state.currentPage, sizePerPage);
    }
}

export default StockReport;

// item code, serial number