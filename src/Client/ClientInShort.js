import React, { Component } from 'react';
import $ from 'jquery';
import Select from 'react-select';
import { showErrorsForInput, setUnTouched, ValidateForm } from '.././Validation';
import { ApiUrl } from '../Config';
import { MyAjaxForAttachments, MyAjax } from '../MyAjax';
import { validate } from 'validate.js';
import { toast } from 'react-toastify';

class ClientInShort extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Countries: [], Country: null, States: [], State: null, Cities: [], City: null, TimeZones: [],
            TimeZone: null,
        }

    }

    componentWillMount() {

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetCountries",
            type: "get",
            success: (data) => {
                this.setState({
                    Countries: data["countries"],
                    Country: { value: 101, label: 'India' }
                }, () => {
                    $.ajax({
                        url: ApiUrl + "/api/MasterData/GetStates?countryId=" + 101,
                        type: "get",
                        success: (data) => {
                            this.setState({
                                States: data["states"], State: { value: 36, label: 'Telangana' }
                            }, () => {
                                $.ajax({
                                    url: ApiUrl + "/api/MasterData/GetCities?stateId=" + this.state.State.value,
                                    success: (data) => {
                                        this.setState({
                                            Cities: data["cities"],
                                            City: { value: 4460, label: 'Hyderabad' }
                                        })
                                    }
                                })
                            })
                        }
                    })
                })
            }
        });

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetTimeZones",
            type: "get",
            success: (data) => {
                this.setState({
                    TimeZones: data["timeZones"],
                    TimeZone: { value: 104, label: "Indian Standard Time ( UTC+05:30) ( IST )" }
                })
            }
        })
    }

    componentDidMount() {
        setUnTouched(document);
    }


    render() {
        return (
            <div className="container" style={{ marginTop: '0%' }} >
                <form onSubmit={this.handleSubmit.bind(this)} onChange={this.validate.bind(this)}>
                    <div className="col-xs-12" >
                        <div className="col-md-3">
                            <label> Name </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon" >
                                        <span className="glyphicon glyphicon-user"></span>
                                    </span>
                                    <input className="form-control" type="text" name="ClientName" placeholder="Client Name" autoComplete="off" ref="clientname" />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label> Short Name </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon" >
                                        <span className="glyphicon glyphicon-user"></span>
                                    </span>
                                    <input className="form-control" type="text" name="ShortName" placeholder="Short Name" autoComplete="off" ref="shortname" />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label> Email </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-envelope"></span>
                                    </span>
                                    <input className="form-control" type="text" name="email" placeholder="Email" autoComplete="off" ref="email" />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label>User Name </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-envelope"></span>
                                    </span>
                                    <input className="form-control" type="text" name="userName" placeholder="User Name" autoComplete="off" ref="userName" />
                                </div>
                            </div>
                        </div>



                    </div>
                    <div className="col-xs-12">
                        <div className="col-md-3">
                            <label> password </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-key"></span>
                                    </span>
                                    <input className="form-control" type="password" name="password" placeholder="password" autoComplete="off" ref="password" />
                                </div>
                            </div>
                        </div>

                    </div>


                    <div className="col-xs-12" style={{ textAlign: 'center' }} >
                        <div className="loader loaderActivity" style={{ marginLeft: '43%', marginBottom: '8px' }} ></div>
                        <button className="submit btn btn-success " type="submit" name="submit"   > Save </button>
                    </div>

                </form>
            </div>

        )
    }


    resetForm() {
        this.refs.clientname.value = "";
        this.refs.shortname.value = "";
        this.refs.email.value = "";
        this.refs.password.value = "";
        this.refs.userName.value = "";
    }

    handleSubmit(e) {
        e.preventDefault();

        $(".loaderActivity").show();
        $("button[name='submit']").hide();

        var location = [];
        var clientLoc = {
            addressLine1: "Line 1",
            country: this.state.Country.value,
            state: this.state.State.value,
            city: this.state.City.value,
            zip: '1234',
            timeZone: this.state.TimeZone.value,
        }
        location.push(clientLoc);

        if (!this.validate(e)) {
            $(".loaderActivity").hide();
            $("button[name='submit']").show();
            return;
        }


        var data = new FormData();

        data.append("Name", this.refs.clientname.value);
        data.append("ShortName", this.refs.shortname.value);
        data.append("PrimaryPhone", '121212222');
        data.append("ClientLocations", JSON.stringify(location));
        data.append("Email", this.refs.email.value);
        data.append("password", this.refs.password.value);
        data.append("Organisation", 1);
        data.append("ClientType", "Direct Client");
        data.append("userName", this.refs.userName.value)

        var url = ApiUrl + "/api/Client/AddClientWithPwd"
        try {

            MyAjaxForAttachments(
                url,
                (data) => {
                    toast("Client saved successfully!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $(".loaderActivity").hide();
                    $("button[name='submit']").show();
                    this.resetForm();
                    return true;
                },
                (error) => {
                    toast(error.responseText, {
                        type: toast.TYPE.ERROR,
                        autoClose: false
                    });
                    $(".loaderActivity").hide();
                    $("button[name='submit']").show();
                    return false;
                },
                "POST",
                data
            );
        }
        catch (e) {
            toast("An error occured, please try again later", {
                type: toast.TYPE.ERROR
            });
            $(".loaderActivity").hide();
            $("button[name='submit']").show();
            return false;
        }
    }

    validate(e) {
        var success = true;
        var isSubmit = e.type === "submit";
        var clientName = this.refs.clientname.value;
        var shortname = this.refs.shortname.value;

        //validate client name
        var nameConstraints = {
            presence: true,
            format: {
                pattern: "[a-zA-Z0-9_]+.*$",
                message: "is not valid"
            },
            length: {
                minimum: 3,
                maximum: 150,
                tooShort: "is too short",
                tooLong: "is too long"
            }
        }

        var passwordConstraints = {
            presence: true,
            length: {
                minimum: 3,
                tooShort: "is too short"
            }
        }

        if (validate.single(clientName, nameConstraints) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.clientname, ["Please enter valid name"]);
            if (isSubmit) {
                this.refs.clientname.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.clientname, []);
        }


        if (validate.single(shortname, nameConstraints) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.shortname, ["Please enter valid short name"]);
            if (isSubmit) {
                this.refs.shortname.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.shortname, []);
        }
        // validate email
        var emailConstraints = {
            presence: true,
            email: true
        }
        if (validate.single(this.refs.email.value, emailConstraints) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.email, ["Please enter a valid mail"]);
            if (isSubmit) {
                this.refs.email.focus();
                success = false;
            }
        }
        else {
            showErrorsForInput(this.refs.email, []);
        }

        if (validate.single(this.refs.password.value, passwordConstraints) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.password, ["Please enter password of minimum 3 characters"]);
            if (isSubmit) {
                this.refs.password.focus();
                success = false;
            }
        }
        else {
            showErrorsForInput(this.refs.password, []);
        }

        var userNameConstraints = {
            presence: true,
            length: {
                minimum: 4,
                tooShort: "is too short"
            }
        }

        if (validate.single(this.refs.userName.value, userNameConstraints) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.userName, ["Please enter user name with minimum 4 characters"]);
            if (isSubmit) {
                this.refs.userName.focus();
                success = false;
            }
        }
        else {
            showErrorsForInput(this.refs.userName, []);
        }

        return success;
    }
}

export default ClientInShort;