import React, { Component } from 'react';
import $ from 'jquery';
import Select from 'react-select';
import { ApiUrl } from '../Config';
import { MyAjaxForAttachments } from '../MyAjax';
import { toast } from 'react-toastify';
import Model from '../Stock/Model';
import validate from 'validate.js';
import { showErrorsForInput, setUnTouched, ValidateForm } from '.././Validation';

var moment = require('moment');

class Item extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Supplier: null, Suppliers: [], BatchNo: '', SerialNo: '', MacAddress: '', ManufacturedDate: '',
            ItemDetails: this.props.ItemDetails, Id: ""

        }
    }

    componentWillMount() {
        if (this.props.ItemDetails !== undefined) {
            this.setState({ ItemDetails: this.props.ItemDetails, Id: this.props.ItemDetails.Id })
        }
    }

    componentDidMount() {
        setUnTouched(document);
    }

    componentWillReceiveProps(nextProps) {

        setUnTouched(document);
        this.setState({ ItemDetails: nextProps.ItemDetails })

    }

    render() {
        return (
            <div key={this.props.ItemDetails}>

                <div className="col-md-1 form-group">
                    <input style={{ visibility: "hidden" }} className="form-control" type="text" ref="itemId" defaultValue={this.props.ItemDetails != null ? this.props.ItemDetails["id"] : null} />
                </div>

                <div className="col-md-3" key={this.state.Id}>
                    <div className="form-group">
                        <label> Serial Number </label>
                        <div className="input-group">
                            <span className="input-group-addon"></span>
                            <input className="form-control" type="text" ref="serialNo" name="SerialNo" placeholder="Serial Number" autoComplete="off" onChange={this.SerialNumberChanged.bind(this)} onBlur={this.CheckIfSerialNumberExists.bind(this)} defaultValue={this.props.ItemDetails != null ? this.props.ItemDetails["serialNo"] : ""} />
                        </div>
                    </div>
                </div>

                <div className="col-md-3 form-group">
                    <label> MAC Address</label>
                    <div className="input-group">
                        <span className="input-group-addon"></span>
                        <input className="form-control" type="text" name="macAddress" ref="macAddress" placeholder="MAC Address" autoComplete="off" onChange={this.MACAddressChanged.bind(this)} defaultValue={this.props.ItemDetails != null ? this.props.ItemDetails["macAddress"] : ""} />
                    </div>
                </div>

                <div className="col-md-3 form-group">
                    <label> Manufactured Date</label>
                    <div className="input-group">
                        <span className="input-group-addon"></span>
                        <input style={{ lineHeight: '19px' }} className="form-control" type="date" name="manufacturedDate" ref="manufacturedDate" onChange={this.ManufactureDateChanged.bind(this)} defaultValue={this.props.ItemDetails != null ? this.props.ItemDetails["manufacturedDate"] : ""} />
                    </div>
                </div>
            </div>
        )
    }

    SerialNumberChanged(val) {
        this.setState({ SerialNo: this.refs.serialNo.value });
    }

    MACAddressChanged(val) {
        this.setState({ MacAddress: this.refs.macAddress.value });
    }

    ManufactureDateChanged(val) {
        this.setState({ ManufacturedDate: this.refs.manufacturedDate.value })
    }

    CheckIfSerialNumberExists(e) {
        e.persist();
        var input = e.target;
        var serialNo = input.value;
        console.log(this.state.ItemDetails);
        // check error here


        if (this.state.ItemDetails == undefined || this.state.ItemDetails.id == undefined) {
            if (validate.single(serialNo, { presence: true }) === undefined) {
                var url = ApiUrl + "/api/Items/CheckIfSerialNumberExists?serialNumber=" + serialNo;

                $.get(url).then((data) => {
                    if (data["Result"] == true) {
                        showErrorsForInput(input, ["Serial number already exists"]);
                    }
                    else {
                        showErrorsForInput(input, null);
                    }
                })
            }
        }

        else {
            var items = this.state.ItemDetails;
        }

    }

}

export default Item;
