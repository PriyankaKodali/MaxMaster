import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { showErrorsForInput, setUnTouched, ValidateForm } from '.././Validation';
import { ApiUrl } from '../Config';
import Select from 'react-select';
import './ClientRegistration.css';

class ClientLocation extends Component {

    constructor(props) {
        super(props);
        var ClientLocations = [];
        ClientLocations.push();
        this.state = {
            Countries: [], Country: '', States: [], State: '', Cities: [], City: '', TimeZone: '',
            TimeZones: [], ZIP: '', ClientLocation: {}, AddresLine1: '', AddressLine2: '', Landmark: '',
            IsInvoice: false, LocationId: null, ClientId: null, gstVisible: false
        }
    }

    componentDidMount() {
        setUnTouched(document);
    }

    componentWillMount() {
        if (this.props.ClientId != undefined) {
            this.setState({
                ClientLocation: this.props.location,
                LocationId: this.props.location["LocationId"],
                Country: { value: this.props.location["Country"], label: this.props.location["CountryName"] },
                State: { value: this.props.location["State"], label: this.props.location["StateName"] },
                City: { value: this.props.location["City"], label: this.props.location["CityName"] },
                TimeZone: { value: this.props.location["TimeZone"], label: this.props.location["TimeZoneLabel"] }
            })
        }

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetCountries",
            type: "get",
            success: (data) => { this.setState({ Countries: data["countries"] }) }
        });
        

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetTimeZones",
            type: "get",
            success: (data) => { this.setState({ TimeZones: data["timeZones"] }) }
        })
    }

    render() {

        return (
            <div key={this.state.ClientLocation}>

                <input type="hidden" ref="locationId" value={this.state.LocationId} />
                <div className="col-xs-12">
                    <div className="col-md-6">
                        <label>Address Line 1 </label>
                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <span className="glyphicon glyphicon-map-marker"></span>
                                </span>
                                <input className="col-md-5 form-control" name="AddressLine1" type="text" ref="addressLine1" placeholder="Address " autoComplete="off" onChange={this.AddressLine1Changed.bind(this)} defaultValue={this.props.location["AddressLine1"]} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label>Address Line 2 </label>
                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <span className="glyphicon glyphicon-map-marker"></span>
                                </span>
                                <input className="col-md-5 form-control" type="text" name="AddressLine2" ref="addressLine2" placeholder="Address" autoComplete="off" onChange={this.AddressLine2Changed.bind(this)} defaultValue={this.props.location["AddressLine2"]} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-12">
                    <div className="col-md-3">
                        <label> Landmark </label>
                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <span className="glyphicon glyphicon-map-marker"></span>
                                </span>
                                <input className="form-control" name="LandMark" type="text" ref="landmark" placeholder="Land Mark" onChange={this.LandMarkChanged.bind(this)} defaultValue={this.props.location["Landmark"]} />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <label> Country </label>
                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <span className="glyphicon glyphicon-map-marker"></span>
                                </span>
                                <Select className="form-control" name="Country" placeholder="Select Country" ref="country" value={this.state.Country} options={this.state.Countries} onChange={this.CountryChanged.bind(this)} />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <label> State </label>
                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <span className="glyphicon glyphicon-map-marker"></span>
                                </span>
                                <Select className="form-control" name="State" placeholder="Select State" ref="state" value={this.state.State} options={this.state.States} onChange={this.StateChanged.bind(this)} />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <label> City </label>
                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <span className="glyphicon glyphicon-map-marker"></span>
                                </span>
                                <Select className="form-control" name="City" placeholder="Select city" ref="city" value={this.state.City} options={this.state.Cities} onChange={this.CityChanged.bind(this)} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xs-12">
                    <div className="col-md-3">
                        <label> ZIP </label>
                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <span className="glyphicon glyphicon-home"></span>
                                </span>
                                <input className="form-control" name="ZIP" type="text" ref="zip" placeholder="Postal code" onChange={this.ZipChange.bind(this)} defaultValue={this.props.location["zip"]} autoComplete="off" />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label> Time Zone </label>
                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <span className="glyphicon glyphicon-time"></span>
                                </span>
                                <Select className="form-control" name="TimeZone" ref="timezone" placeholder="Select TimeZone" value={this.state.TimeZone} options={this.state.TimeZones} onChange={this.timeZoneChanged.bind(this)} />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3" style={{ marginTop: '2.8%' }}>
                        {/* <input className="form-group invoiceChkBox" type="checkbox" name="isInvoice" ref="isInvoice" value={this.state.IsInvoice} onChange={this.isInvoiceChanged.bind(this)} defaultChecked={this.props.location["IsInvoice"]} /> <span />
                              <label>  IsInvoice </label>   */}

                        <label className="chkBox">IsInvoice
                                  <input type="checkbox" name="isInvoice" ref="isInvoice" value={this.state.IsInvoice} onChange={this.isInvoiceChanged.bind(this)} defaultChecked={this.props.location["IsInvoice"]} />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                </div>

            </div>
        )
    }


    AddressLine1Changed(val) {
        this.setState({ AddresLine1: this.refs.addressLine1.value });
    }

    AddressLine2Changed(val) {
        this.setState({ AddresLine2: this.refs.addressLine2.value });
    }

    LandMarkChanged(val) {
        this.setState({ Landmark: this.refs.landmark.value });
    }

    CountryChanged(val) {
        if (val) {
            this.setState({ Country: val }, () => {
                if (this.state.Country && this.state.Country.value) {

                    this.props.countryChanged(true);
                    // this.props.countryChanged.bind(this);

                    $.ajax({
                        url: ApiUrl + "/api/MasterData/GetStates?countryId=" + this.state.Country.value,
                        success: (data) => { this.setState({ States: data["states"] }) }
                    })
                    showErrorsForInput(this.refs.country.wrapper, null);
                }
                else {
                    this.setState({ States: [], State: null });
                    showErrorsForInput(this.refs.country.wrapper, ["Please select a valid country"]);
                    showErrorsForInput(this.refs.state.wrapper, ["Please select a valid state"]);
                    showErrorsForInput(this.refs.city.wrapper, ["Please select a valid city"]);
                }
            });
        }
        else {
            this.setState({ Country: '' })
            showErrorsForInput(this.refs.country.wrapper, ["Please select valid country"]);
        }

    }

    StateChanged(val) {
        if (val) {
            this.setState({ State: val }, () => {
                if (this.state.State && this.state.State.value) {
                    $.ajax({
                        url: ApiUrl + "/api/MasterData/GetCities?stateId=" + this.state.State.value,
                        success: (data) => { this.setState({ Cities: data["cities"] }) }
                    })
                    showErrorsForInput(this.refs.state.wrapper, null);
                }
                else {
                    this.setState({ Cities: [], City: null });
                    showErrorsForInput(this.refs.state.wrapper, ["Please select a valid state"]);
                    showErrorsForInput(this.refs.city.wrapper, ["Please select a valid city"]);
                }
            });
        }
        else {
            this.setState({ State: '' })
            showErrorsForInput(this.refs.state.wrapper, ["Please select valid state"]);
        }

    }

    CityChanged(val) {
        if (val) {
            this.setState({ City: val })
            showErrorsForInput(this.refs.city.wrapper, null);
        }
        else {
            this.setState({ City: '' })
            showErrorsForInput(this.refs.city.wrapper, ["Please select valid city"]);
        }

    }

    timeZoneChanged(val) {
        this.setState({ TimeZone: val || '' })
        showErrorsForInput(this.refs.timezone.wrapper, null);
    }

    ZipChange(val) {
        this.setState({ ZIP: this.refs.zip.value });
    }

    isInvoiceChanged() {
        this.props.InvoiceChanged(this.refs.isInvoice)
        if (this.props.ClientId != undefined) {
            this.setState({ IsInvoice: !this.props.location["IsInvoice"] })
        }
        else {
            this.setState({ IsInvoice: !this.state.IsInvoice })
        }
    }


    // if (this.props.location["LocationId"] == "") {
    //     <input type="hidden" name="locationId" ref="locationId" value={this.state.newLoc.length} />
    // }
    // else {
    //     <input type="hidden" ref="locationId" value={this.props.location["LocationId"]} />
    // }

}

export default ClientLocation;
