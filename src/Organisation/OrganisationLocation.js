import React, { Component } from 'react';
import $ from 'jquery';
import Select from 'react-select';
import { ApiUrl } from '../Config';
import { showErrorsForInput, setUnTouched, showErrors } from '../Validation.js';


class OrganisationLocation extends Component {

    constructor(props) {
        super(props);
        var OrgLocations = [];
        OrgLocations.push();

        this.state = {
            Country: '', Countries: [], State: '', States: [], City: '', Cities: [], Zip: '', addresLine1: '',
            addresLine2: '', zip: '', OrgLocation: {}, LocationId: null
        }
    }

    componentWillMount() {
        var OrgLocations = [];
        if (this.props.OrgId !== undefined) {
            this.setState({
                OrgLocation: this.props.location,
                LocationId: this.props.location["LocId"],
                Country: { value: this.props.location["Country"], label: this.props.location["CountryName"] },
                State: { value: this.props.location["State"], label: this.props.location["StateName"] },
                City: { value: this.props.location["City"], label: this.props.location["CityName"] }
            })
        }

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetCountries",
            type: "get",
            success: (data) => { this.setState({ Countries: data["countries"] }) }
        });
    }

    componentDidMount() {
        setUnTouched(document);
    }

    render() {
        return (
            <div key={this.state.OrgLocation}>
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

                <div className="col-xs-12">
                    <div className="col-md-3">
                        <label> Country </label>
                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <span className="glyphicon glyphicon-map-marker"> </span>
                                </span>
                                <Select className="form-control" name="country" ref="country" value={this.state.Country} placeholder="Select Country" options={this.state.Countries} onChange={this.CountryChanged.bind(this)} />
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
                                <Select className="form-control" name="state" ref="state" placeholder="Select State" value={this.state.State} options={this.state.States} onChange={this.StateChanged.bind(this)} />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <label> City </label>
                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <span className="glyphicon glyphicon-map-marker" > </span>
                                </span>
                                <Select className="form-control" name="city" ref="city" options={this.state.Cities} value={this.state.City} placeholder="Select City" onChange={this.CityChanged.bind(this)} />
                            </div>

                        </div>
                    </div>

                    <div className="col-md-3">
                        <label> ZIP </label>
                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <span className="glyphicon glyphicon-map-marker"></span>
                                </span>
                                <input className="form-control" name="zip" ref="zip" placeholder="Enter ZIP" defaultValue={this.props.location["ZIP"]} autoComplete="off" />

                            </div>
                        </div>
                    </div>

                </div>


            </div>
        )
    }


    AddressLine1Changed(val) {
        this.setState({ addresLine1: this.refs.addressLine1.value });
    }

    AddressLine2Changed(val) {
        this.setState({ addresLine2: this.refs.addressLine2.value });
    }

    CountryChanged(val) {
        if (val) {
            this.setState({ Country: val, State: '', States: [] }, () => {
                $.ajax({
                    url: ApiUrl + "/api/MasterData/GetStates?countryId=" + val.value,
                    type: "get",
                    success: (data) => {
                        this.setState({ States: data["states"] })
                    }
                })
            })
            showErrorsForInput(this.refs.country.wrapper, []);
        }
        else {
            this.setState({ Country: '', States: [], State: '', Cities: [], City: '' });
            showErrorsForInput(this.refs.country.wrapper, ["Please select valid country"]);

        }
    }

    StateChanged(val) {
        if (val) {
            this.setState({ State: val, Cities: [], City: '' }, () => {
                $.ajax({
                    url: ApiUrl + "/api/MasterData/GetCities?stateId=" + val.value,
                    success: (data) => { this.setState({ Cities: data["cities"] }) }
                })
                showErrorsForInput(this.refs.state.wrapper, null);
            })
        }
        else {
            this.setState({ State: '', Cities: [], City: '' });
            showErrorsForInput(this.refs.state.wrapper, ["Enter a valid state"]);
        }
    }

    CityChanged(val) {
        if (val) {
            this.setState({ City: val })
            showErrorsForInput(this.refs.city.wrapper, []);
        }
        else {
            this.setState({ City: '' })
            showErrorsForInput(this.refs.city.wrapper, ["Select a valid city"]);
        }
    }
    ZipChange(val) {
        this.setState({ zip: this.refs.zip.value });
    }

}

export default OrganisationLocation;