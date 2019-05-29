import React, { Component } from 'react';
import $ from 'jquery';
import { ApiUrl } from '../Config';
import { toast } from 'react-toastify';
import { validate } from 'validate.js';
import Select from 'react-select';
import './Item.css';
import { MyAjaxForAttachments } from '../MyAjax';
import { showErrorsForInput, setUnTouched } from '../Validation';


class Model extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Country: '', Countries: [], Model: [], GSTPercent: null, SrlNoExists: false
        }

    }

    componentWillMount() {
        if (this.props.match !== undefined) {
            if (this.props.match.params["id"] !== undefined) {
                var url = ApiUrl + "/api/Items/GetItemModel?Id=" + this.props.match.params["id"];

                $.ajax({
                    url: url,
                    type: "get",
                    success: (data) => {
                        this.setState({
                            Model: data["itemModel"],
                            Country: { value: data["itemModel"]["CountryId"], label: data["itemModel"]["Country"] },
                            GSTPercent: { value: data["itemModel"]["GSTID"], label: data["itemModel"]["GST"], rate: data["itemModel"]["GSTRate"] }
                        })
                    }
                })
            }
        }


        $.ajax({
            url: ApiUrl + "/api/MasterData/GetCountries",
            type: "get",
            success: (data) => {
                this.setState({ Countries: data["countries"] });
            }
        })

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetGST",
            type: "get",
            success: (data) => { this.setState({ GST: data["gst"] }) }
        })
    }

    componentDidMount() {
        setUnTouched(document);
    }

    render() {
        return (
            <div className="container" style={{ marginTop: '0%' }} key={this.state.Model}>
                {
                    this.props.match !== undefined ?
                        <div className="col-xs-12">
                            <h3 className="col-md-11 formheader" style={{ paddingLeft: '10px' }}  > Item</h3>
                            <div className="col-md-1 mybutton">
                                <button type="button" style={{ marginTop: '3%' }} className="btn btn-default pull-left headerbtn" onClick={() => this.props.history.push("/StockReport")} >
                                    <span className="glyphicon glyphicon-th-list"></span>
                                </button>
                            </div>
                        </div>
                        :
                        ""
                }
                
                <form onSubmit={this.handleSubmit.bind(this)} onChange={this.validate.bind(this)}>
                    <div className="col-xs-12" >
                        <div className="col-md-3">
                            <label> Item Name</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon" >
                                        <span className="glyphicon glyphicon-user"></span>
                                    </span>
                                    <input className="form-control" type="text" name="itemName" placeholder="Item Name" autoComplete="off" ref="itemname" defaultValue={this.state.Model["ItemName"]} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label> Model Number</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon" >
                                        <span className="glyphicon glyphicon-user"></span>
                                    </span>
                                    <input className="form-control" type="text" name="modelNumber" placeholder="Model Number" autoComplete="off" ref="modelnumber" defaultValue={this.state.Model["ModelNum"]} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label>Brand Name</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon" >
                                        <span className="glyphicon glyphicon-user"></span>
                                    </span>
                                    <input className="form-control" type="text" name="brandName" placeholder="Brand Name" autoComplete="off" ref="brand" defaultValue={this.state.Model["Brand"]} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label> Units </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                    </span>
                                    <input className="form-control" type="text" name="units" placeholder="Units" ref="units" autoComplete="off" defaultValue={this.state.Model["Units"]} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12">

                        <div className="col-md-3">
                            <label> Manufacturer </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-user" />
                                    </span>
                                    <input className="form-control" type="text" name="manufacturer" placeholder="Manufacturer " ref="manufacturer" autoComplete="off" defaultValue={this.state.Model["Manufacturer"]} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label>UPN </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                    </span>
                                    <input className="form-control" type="text" name="upn" placeholder="UPN Number" ref="upn" autoComplete="off" defaultValue={this.state.Model["UPC"]} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label> EAN </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                    </span>
                                    <input className="form-control" type="text" name="ean" placeholder="EAN Number " ref="ean" autoComplete="off" defaultValue={this.state.Model["EAN"]} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label> Threshold value </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon"></span>
                                    <input className="form-control" type="number" name="thresholdValue" placeholder="Threshold value" ref="thresholdvalue" autoComplete="off" defaultValue={this.state.Model["ThresholdValue"]} />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="col-xs-12">

                        <div className="col-md-2">
                            <label> Power Input </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                    </span>
                                    <input className="form-control" type="number" name="powerInput" placeholder="Power Input " min="0" ref="powerInput" autoComplete="off" defaultValue={this.state.Model["PowerInput"]} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <label> Power Input Units </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                    </span>
                                    <input className="form-control" type="text" name="powerInputUnits" placeholder="Power Input Units" ref="powerInputUnits" autoComplete="off" defaultValue={this.state.Model["PowerInputUnits"]} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <label> Made In </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-map-marker" />
                                    </span>
                                    <Select className="form-control" placeholder="Select Country" ref="country" value={this.state.Country} options={this.state.Countries} onChange={this.MadeInChanged.bind(this)} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <label> HSN Code </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                    </span>
                                    <input className="form-control" type="text" name="hsnCode" ref="hsnCode" placeholder="HSN Number" autoComplete="off" defaultValue={this.state.Model["HSNCode"]} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <label> GST </label>
                            <div className="form-group" key={this.state.GSTPercent}>
                                <div className="input-group">
                                    <span className="input-group-addon">
                                    </span>
                                    <Select className="form-control" ref="gst" value={this.state.GSTPercent} options={this.state.GST} placeholder="GST" onChange={this.GSTChanged.bind(this)} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-2" key={this.state.SrlNoExists}>
                            <label >Serial Number Exists   </label>
                            <label className="chkBox">
                                <input type="checkbox" name="SrlNoExists" ref="srlNoExists" value={this.state.SrlNoExists} onChange={this.srlNoActiveChanged.bind(this)} defaultChecked={this.props.match !== undefined ? this.props.match.params["id"] !== undefined ? this.state.Model["SerialNoExists"] : this.state.SrlNoExists : this.state.SrlNoExists} />
                                <span className="checkmark"></span>
                            </label>
                        </div>

                    </div>

                    <div className="col-xs-12">
                        <div className="col-xs-12">
                            <label> Description </label>
                            <div className="form-group">
                                <textarea className="form-control descTextArea" name="description" ref="description" defaultValue={this.state.Model["Description"]} />
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12">
                        <div className="col-xs-12">
                            <label> Contents </label>
                            <div className="form-group">
                                <textarea className="form-control descTextArea" name="contents" ref="contents" defaultValue={this.state.Model["Contents"]} />
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12">
                        <div className="loader loaderActivity docSubmit" ></div>
                        <button className="btn btn-md btn-success docSubmit" type="submit" name="submit"  > Submit </button>
                    </div>

                </form>
            </div>
        )
    }

    srlNoActiveChanged(val) {
        this.setState({ SrlNoExists: !this.state.SrlNoExists })
    }

    MadeInChanged(val) {
        if (val) {
            this.setState({ Country: val })
            showErrorsForInput(this.refs.country.wrapper, []);
        }
        else {
            this.setState({ Country: '' });
            showErrorsForInput(this.refs.country.wrapper, ["Please select Country"])
        }
    }

    GSTChanged(val) {
        if (val) {
            this.setState({ GSTPercent: val });
            showErrorsForInput(this.refs.gst.wrapper, [])
        }
        else {
            this.setState({ GSTPercent: '' });
            showErrorsForInput(this.refs.gst.wrapper, ["Please select GST"])
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        var data = new FormData();

        if (!this.validate(e)) {
            $(".loaderActivity").hide();
            $("button[name='submit']").show();
            return;
        }

        data.append("ItemName", this.refs.itemname.value);
        data.append("ModelNumber", this.refs.modelnumber.value);
        data.append("Brand", this.refs.brand.value);
        data.append("Units", this.refs.units.value);
        data.append("Manufacturer", this.refs.manufacturer.value);
        data.append("Upc", this.refs.upn.value);
        data.append("Ean", this.refs.ean.value);
        data.append("ThresholdValue", this.refs.thresholdvalue.value);
        data.append("PowerInput", this.refs.powerInput.value);
        data.append("PowerUnits", this.refs.powerInputUnits.value);
        data.append("Country", this.state.Country.value);
        data.append("HsnCode", this.refs.hsnCode.value);
        data.append("Description", this.refs.description.value);
        data.append("Contents", this.refs.contents.value);
        data.append("Gst", this.state.GSTPercent.rate);
        data.append("SrlNoExits", this.state.SrlNoExists)

        var url = "";
        if (this.props.match !== undefined) {
            if (this.props.match.params["id"] !== undefined) {
                url = ApiUrl + "/api/Items/UpdateItemModel?Id=" + this.props.match.params["id"]
            }
            else {
                url = ApiUrl + "/api/Items/AddModel"
            }

        }
        else {
            url = ApiUrl + "/api/Items/AddModel"
        }

        try {
            MyAjaxForAttachments(
                url,
                (data) => {
                    if (this.props.match !== undefined) {
                        if (this.props.match.params["id"] !== undefined) {
                            toast("Model updated successfully", {
                                type: toast.TYPE.SUCCESS
                            })
                            this.props.history.push("/StockReport");
                        }

                        else {
                            toast("Model added successfully", {
                                type: toast.TYPE.SUCCESS
                            })
                            this.props.history.push("/StockReport");
                        }
                    }

                    else {
                        toast("Model added successfully", {
                            type: toast.TYPE.SUCCESS
                        })

                        this.props.closeItemModal();

                    }

                    $(".loader").hide();
                    $("button[name='submit']").show();

                },
                (error) => {
                    toast(error.responseText, {
                        type: toast.TYPE.ERROR,
                        autoClose: false
                    });
                    $(".loader").hide();
                    $("button[name='submit']").show();
                    return false;
                },
                "POST",
                data
            );
        }
        catch (e) {
            toast("An error occoured, please try again!", {
                type: toast.TYPE.ERROR
            });
            $(".loader").hide();
            $("button[name='submit']").show();
            return false;
        }
    }

    validate(e) {

        e.preventDefault();
        var success = true;
        var isSubmit = e.type === "submit";

        if (isSubmit) {
            $(e.currentTarget.getElementsByClassName('form-control')).map((i, el) => {
                el.classList.remove("un-touched");
            });
        }

        if (validate.single(this.refs.itemname.value, { presence: true }) !== undefined) {
            success = false;
            if (isSubmit) {
                this.refs.itemname.focus()
                isSubmit = false;
            }
            showErrorsForInput(this.refs.itemname, ["Please enter item name"]);
        }
        else {
            showErrorsForInput(this.refs.itemname, []);
        }


        if (this.state.SerialNoExists == true) {

            if (validate.single(this.refs.modelnumber.value, { presence: true }) !== undefined) {
                if (this.refs.powerInput.length > 20) {
                    showErrorsForInput(this.refs.modelnumber, ["Please enter a valid model number"])
                }
                else {
                    showErrorsForInput(this.refs.modelnumber, ["Please enter model number"])
                }
                success = false;
                if (isSubmit) {
                    this.refs.modelnumber.focus();
                    isSubmit = false;
                }
            }
            else {
                showErrorsForInput(this.refs.modelnumber, []);
            }

            if (validate.single(this.refs.manufacturer.value, { presence: true }) !== undefined) {
                success = false;
                if (isSubmit) {
                    this.refs.manufacturer.focus();
                    isSubmit = false;
                }
                showErrorsForInput(this.refs.manufacturer, ["Please enter manufacturer name"]);
            }
            else {
                showErrorsForInput(this.refs.manufacturer, [])
            }

        }

        if (validate.single(this.refs.units.value, { presence: true }) !== undefined) {
            success = false;
            if (isSubmit) {
                this.refs.units.focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.units, ["Please enter item units"]);
        }
        else {
            showErrorsForInput(this.refs.units, []);
        }


        if (validate.single(this.refs.thresholdvalue.value, { presence: true }) !== undefined) {
            success = false;
            if (isSubmit) {
                this.refs.thresholdvalue.focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.thresholdvalue, ["Please enter threshold value"]);
        }
        else if (this.refs.thresholdvalue.value > 100 || this.refs.thresholdvalue.value < 0) {
            showErrorsForInput(this.refs.thresholdvalue, ["Threshold value should be less than 100"]);
        }
        else {
            showErrorsForInput(this.refs.thresholdvalue, []);
        }

        if (!this.state.Country || !this.state.Country.value) {
            success = false;
            if (isSubmit) {
                this.refs.country.focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.country.wrapper, ["Select country name"])
        }

        if (this.refs.description.value.trim() === "") {
            success = false;
            if (isSubmit) {
                this.refs.description.focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.description, ["Please enter description of item"])
        }
        else {
            showErrorsForInput(this.refs.description, []);
        }

        if (!this.state.GSTPercent || !this.state.GSTPercent.value) {
            success = false;
            if (isSubmit) {
                this.refs.gst.focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.gst.wrapper, ["Please select gst"])
        }

        if (this.state.SrlNoExists == true) {

            if (validate.single(this.refs.contents.value.trim(), { presence: true }) !== undefined) {
                success = false;
                if (isSubmit) {
                    this.refs.contents.focus();
                    isSubmit = false;
                }
                showErrorsForInput(this.refs.contents, ["Please enter item contents"]);
            }
            else {
                showErrorsForInput(this.refs.contents, []);
            }
        }

        return success;
    }
}

export default Model;

