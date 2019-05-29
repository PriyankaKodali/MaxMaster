import React, { Component } from 'react';
import $ from 'jquery';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { ValidateForm, showErrorsForInput, setUnTouched, showErrors } from '.././Validation';
import { ApiUrl } from '../Config';
import { MyAjaxForAttachments, MyAjax } from '../MyAjax';
import { validate } from 'validate.js';

class EditClientEmployee extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ClientEmp: '',
            Clients: [],
            Client: '', ImageOne: '', ImageTwo: ''
        }
    }

    componentWillMount() {
        this.setState({ Employee_Id: this.props.match.params["id"] });
        $.ajax({
            url: ApiUrl + "/api/Client/GetClientEmployee?empId=" + this.props.match.params["id"],
            type: "GET",
            success: (data) => {
                this.setState({
                    ClientEmp: data["clientEmp"],
                    Client: { value: data["clientEmp"]["Client_Id"], label: data["clientEmp"]["client"] }
                });
            }
        });

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetAllClients",
            type: "get",
            success: (data) => { this.setState({ Clients: data["clients"] }) }
        })
    }

    componentDidMount() {
        setUnTouched(document);
    }

    render() {

        if (this.state.ClientEmp !== null) {
            return (
                <div className="container" key={this.state.ClientEmp} style={{ marginTop: '0%' }}>

                    <div className="col-xs-12" >
                        <h3 className="col-md-11 formheader" style={{ paddingLeft: '10px' }}> Client Contact </h3>
                        <div className="col-md-1 mybutton">
                            <button type="button" style={{ marginTop: '3%' }} className="btn btn-default pull-left headerbtn" onClick={() => this.props.history.push("/ClientEmployeesList")} >
                                <span className="glyphicon glyphicon-th-list"></span>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={this.handleSubmit.bind(this)} onChange={this.validate.bind(this)} >
                        <div className="col-xs-12">
                            <div className="col-md-4">
                                <label> Client </label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon" >
                                            <span className="glyphicon glyphicon-user"></span>
                                        </span>
                                        <Select className="form-control" name="clientname" ref="clientname" placeholder="Select Client" value={this.state.Client} options={this.state.Clients} onChange={this.ClientChanged.bind(this)} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label> First Name </label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon" >
                                            <span className="glyphicon glyphicon-user"></span>
                                        </span>
                                        <input className="col-md-3 form-control" type="text" name="FirstName" placeholder=" First Name" autoComplete="off" ref="firstname" defaultValue={this.state.ClientEmp["FirstName"]} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label>Middle Name </label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon" >
                                            <span className="glyphicon glyphicon-user"></span>
                                        </span>
                                        <input className="col-md-3 form-control" name="MiddleName" type="text" placeholder="Middle Name" autoComplete="off" ref="middlename" defaultValue={this.state.ClientEmp["MiddleName"]} />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="col-xs-12">

                            <div className="col-md-4">
                                <label> Last Name </label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon" >
                                            <span className="glyphicon glyphicon-user"></span>
                                        </span>
                                        <input className="col-md-3 form-control" name="LastName" type="text" placeholder="Last Name" autoComplete="off" ref="lastname" defaultValue={this.state.ClientEmp["LastName"]} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label> Primary Phone Number </label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <span className="	glyphicon glyphicon-phone"></span>
                                        </span>
                                        <input className="col-md-3 form-control" name="PhoneNumber" type="text" placeholder="Primary Phone Number" autoComplete="off" ref="primaryNumber" defaultValue={this.state.ClientEmp["PhoneNumber"]} />
                                    </div>
                                </div>
                            </div>


                            <div className="col-md-4">
                                <label> Secondary Phone Number </label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <span className="glyphicon glyphicon-phone"></span>
                                        </span>
                                        <input className="col-md-3 form-control" type="text" placeholder="Secondary Phone Number" autoComplete="off" ref="secondaryNum" defaultValue={this.state.ClientEmp["SecondaryNumber"]} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-12" >
                            <div className="col-md-4">
                                <label> Email </label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <span className="glyphicon glyphicon-envelope"></span>
                                        </span>
                                        <input className="col-md-3 form-control" name="email" type="text" placeholder="Email" autoComplete="off" ref="email" defaultValue={this.state.ClientEmp["Email"]} />
                                    </div>
                                </div>
                            </div>


                            <div className="col-md-4">
                                <label> Fax </label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <span className="glyphicon glyphicon-fax"></span>
                                        </span>
                                        <input className="col-md-3 form-control" name="fax" type="text" placeholder="FAX" autoComplete="off" ref="fax" defaultValue={this.state.ClientEmp["Fax"]} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label> Department </label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <span className="glyphicon glyphicon-user"></span>
                                        </span>
                                        <input className="col-md-3 form-control" type="text" name="department" placeholder="Department" autoComplete="off" ref="department" defaultValue={this.state.ClientEmp["Department"]} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-12">
                            <label> Visiting Card images</label>
                        </div>

                        <div className="col-xs-12">

                            <div className="col-md-6 form-group">
                                <img className="col-md-12 imagePreview" id="img-upload" src={this.state.ClientEmp["ImageOne"] != null ? this.state.ClientEmp["ImageOne"] : "Images/dummy-visting card.png"} style={{ width: '500px' }} />
                                <label className="imgBtn pointer" for="imageInput">
                                    <button type="button" className="glyphicon glyphicon-edit successBtn" onClick={() => { document.getElementById("upload").click() }} >
                                        <input type="file" id="upload" ref="imageOne" style={{ visibility: 'hidden' }} onChange={() => this.readUrl(this)} accept=".png, .jpg, .jpeg" />
                                    </button>
                                </label>
                            </div>

                            <div className="col-md-6 form-group">
                                <img className="col-md-12 imagePreview" id="img2-upload" src={this.state.ClientEmp["ImageTwo"] != null ? this.state.ClientEmp["ImageTwo"] : "Images/dummy-visting card.png"} style={{ width: '500px' }} />
                                <label className="imgBtn pointer" for="imageInput">
                                    <button type="button" className="glyphicon glyphicon-edit successBtn" onClick={() => { document.getElementById("image2Upload").click() }} >
                                        <input type="file" id="image2Upload" ref="imageTwo" style={{ visibility: 'hidden' }} onChange={() => this.getImage2(this)} accept=".png, .jpg, .jpeg" />
                                    </button>
                                </label>
                            </div>

                        </div>


                        <div className="col-xs-12">
                            <div className="loader loaderActivity" style={{ marginLeft: '43%', marginBottom: '8px' }} ></div>
                            <button type="submit" name="submit" className="btn btn-md btn-success" style={{ marginLeft: '45%' }} > Save </button>
                        </div>
                    </form>

                </div>

            )
        }

        else {
            return (<div className="loader"></div>)
        }

    }

    ClientChanged(val) {
        this.setState({ Client: val || '' })
    }

    readUrl(url) {
        setUnTouched(document);
        if (this.refs.imageOne.files[0]) {
            var reader = new FileReader();
            document.getElementById("img-upload").src = window.URL.createObjectURL(this.refs.imageOne.files[0])
        }
    }

    getImage2(url) {
        setUnTouched(document);
        if (this.refs.imageTwo.files[0]) {
            var reader = new FileReader();
            document.getElementById("img2-upload").src = window.URL.createObjectURL(this.refs.imageTwo.files[0])
        }
    }

    handleSubmit(e) {

        e.preventDefault();

        $(".loaderActivity").show();
        $("button[name='submit']").hide();


        $(e.currentTarget.getElementsByClassName('form-control')).map((i, ele) => {
            ele.classList.remove("un-touched");
            return null;
        })

        if (!this.validate(e)) {
            $(".loaderActivity").hide();
            $("button[name='submit']").show();

            return;
        }

        // var inputs = $(e.currentTarget.getElementsByClassName('form-control')).map((i, el) => {
        //     if (el.closest(".form-group").classList.contains("hidden")) {
        //         return null;
        //     }
        //     else {
        //         return el;
        //     }
        // });

        var data = new FormData();

        data.append("ClientId", this.state.Client.value);
        data.append("FirstName", this.refs.firstname.value);
        data.append("MiddleName", this.refs.middlename.value);
        data.append("LastName", this.refs.lastname.value);
        data.append("OldEmail", this.state.ClientEmp["Email"])
        data.append("Email", this.refs.email.value);
        data.append("Fax", this.refs.fax.value);
        data.append("PrimaryPhoneNum", this.refs.primaryNumber.value);
        data.append("SecondaryPhoneNum", this.refs.secondaryNum.value);
        data.append("Department", this.refs.department.value);
        data.append("Id", this.props.match.params["id"]);

        var imageOne = this.refs.imageOne.files;
        if (imageOne.length == 1) {
            data.append("ImageOne", imageOne[0]);
            showErrorsForInput(this.refs.imageOne, null);
        }

        var imageTwo = this.refs.imageTwo.files;
        if (imageTwo.length == 1) {
            data.append("ImageTwo", imageTwo[0]);

        }

        let url = ApiUrl + "/api/Client/UpdateClientEmployee?EmployeeId=" + this.props.match.params["id"];

        try {
            MyAjaxForAttachments(
                url,
                (data) => {
                    toast("Client Employee Updated successfully!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $("button[name='submit']").show();
                    this.props.history.push("/ClientEmployeesList");
                    return true;
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
        var success = ValidateForm(e);
        var success = true;
        var isSubmit = e.type === "submit";

        if (isSubmit) {
            $(e.currentTarget.getElementsByClassName('form-control')).map((i, el) => {
                el.classList.remove("un-touched");
            });
        }

        if (!this.state.Client || !this.state.Client.value) {
            success = false;
            showErrorsForInput(this.refs.clientname.wrapper, ["Please select a valid client"]);
        }

        var nameConstraints = {
            presence: true,
            format: {
                pattern: "[a-zA-Z0-9_]+.*$",
                message: "is not valid"
            },
            length: {
                minimum: 3,
                maximum: 34,
                tooShort: "is too short",
                tooLong: "is too long"
            }
        }

        if (validate.single(this.refs.firstname.value, nameConstraints) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.firstname, ["Please enter valid name"]);
            if (isSubmit) {
                this.refs.firstname.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.firstname, []);
        }

        var lastNameConstraints = {
            presence: true,
            format: {
                pattern: "[a-zA-Z0-9_]+.*$",
                message: "is not valid"
            },
            length: {
                minimum: 1,
                maximum: 20,
                tooShort: "is too short",
                tooLong: "is too long"
            }
        }

        if (validate.single(this.refs.lastname.value, lastNameConstraints) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.lastname, ["Please enter valid name"]);
            if (isSubmit) {
                this.refs.lastname.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.lastname, []);
        }


        var phoneConstraints = {
            presence: true,
            format: {
                pattern: /^^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
                flags: "g"
            }
        }
        if (validate.single(this.refs.primaryNumber.value, phoneConstraints) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.primaryNumber, ["Please enter a valid phone number"]);
            if (isSubmit) {
                this.refs.primaryNumber.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.primaryNumber, []);
        }


        // validation for secondary phone

        var SecondaryPhoneNumber = {
            format: {
                pattern: /^^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?|^$\s*$/,
                flags: "g",
                message: "is not valid"
            }
        }

        if (validate.single(this.refs.secondaryNum.value, SecondaryPhoneNumber) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.secondaryNum, ["Please enter valid secondary number"])
            if (isSubmit) {
                this.refs.secondaryNum.focus();
                success = false;
            }
        }
        else {
            showErrorsForInput(this.refs.secondaryNum, []);
        }
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

        return success;
    }
}

export default EditClientEmployee






                                // {
                                //     this.state.ClientLocation.map((item) => {
                                //         <Clie location={itemX} >
                                //             })
                                // }