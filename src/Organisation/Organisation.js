import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { showErrorsForInput, setUnTouched, ValidateForm } from '.././Validation';
import { ApiUrl } from '../Config';
import { MyAjaxForAttachments, MyAjax } from '../MyAjax';
import Select from 'react-select';
import './Organisation.css';
import { validate } from 'validate.js';
import OrganisationLocation from './OrganisationLocation';


class Organisation extends Component {

    constructor(props) {
        super(props);
        var OrganisationLocation = [];
        this.state = {
            Country: '', State: '', City: '', Countries: [], States: [], Cities: [], OrgName: '',
            ZIP: '', GST: '', TIN: '', PAN: '', Email: '', PrimaryPhone: '', SecondaryPhone: '', WebSite: '',
            Organisation: [], OrgLocations: OrganisationLocation, OrgLocationRefs: [], zip: ''

        }
    }

    componentWillMount() {

        this.setState({ orgId: this.props.match.params["id"] }, () => {
            if (this.props.match.params["id"] != null) {
                $.ajax({
                    url: ApiUrl + "/api/Organisation/GetOrganisation?orgId=" + this.props.match.params["id"],
                    type: "get",
                    success: (data) => {
                        this.setState({
                            Organisation: data["organisation"]
                        }, () => {
                            this.renderLocations(data["organisation"]["OrgLocation"]);
                        })
                    }
                })
            }

            else {
                this.AddOrganisationLocation();
            }
        })

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetCountries",
            type: "get",
            success: (data) => { this.setState({ Countries: data["countries"] }) }
        });


    }

    componentDidMount() {
        setUnTouched(document);
    }
    componentDidUpdate() {
        setUnTouched(document);
    }

    renderLocations(locations) {
        var orgLocations = locations.map((item, i) => {
            return (
                <div key={i}>
                    <OrganisationLocation location={item} ref={(i) => this.state.OrgLocationRefs.push(i)}
                        OrgId={this.state.orgId}
                    />
                </div>
            )
        })
        this.setState({ OrgLocations: orgLocations });
    }

    render() {
        return (
            <div className="container" key={this.state.Organisation}>
                <div className="col-xs-12">
                    <h2 className="col-xs-12" style={{ color: 'lightseagreen', textAlign: 'center' }}> Organisation Details</h2>
                </div>
                <div className="col-xs-12">
                    <h3 className="col-md-11 formheader" >General Details</h3>
                    <div className="col-md-1 mybutton">
                        <button type="button" style={{ marginTop: '3%' }} className="btn btn-default pull-left headerbtn" onClick={() => this.props.history.push("/OrganisationsList")} >
                            <span className="glyphicon glyphicon-th-list"></span>
                        </button>
                    </div>
                </div>

                <form onSubmit={this.handleSubmit.bind(this)} onChange={this.validate.bind(this)}  >
                    <div className="col-xs-12">

                        <div className="col-md-10">

                            <div className="col-md-4">
                                <label>Organisation Name </label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon" >
                                            <span className="glyphicon glyphicon-user"></span>
                                        </span>
                                        <input className="col-md-4 form-control" type="text" name="OrgName" placeholder="Organisation Name" autoComplete="off" ref="orgname" defaultValue={this.state.Organisation["OrgName"]} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label>Web Site</label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon" >
                                            <span className="glyphicon glyphicon-user"></span>
                                        </span>
                                        <input className="col-md-4 form-control" type="text" name="WebSite" placeholder="Web Site" autoComplete="off" ref="website" defaultValue={this.state.Organisation["Website"]} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label>Email</label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon" >
                                            <span className="glyphicon glyphicon-user"></span>
                                        </span>
                                        <input className="col-md-2 form-control" type="text" name="email" placeholder="Email" autoComplete="off" ref="email" defaultValue={this.state.Organisation["Email"]} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label> Primary Phone Number </label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <span className="glyphicon glyphicon-phone"></span>
                                        </span>
                                        <input className="col-md-3 form-control" name="PhoneNumber" type="text" placeholder="Primary Phone Number" autoComplete="off" ref="primaryNumber" defaultValue={this.state.Organisation["PrimaryPhone"]} />
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
                                        <input className="col-md-3 form-control" name="secondaryNum" type="text" placeholder="Secondary Phone Number" autoComplete="off" ref="secondaryNum" defaultValue={this.state.Organisation["SecondaryPhone"]} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label> Employee Prefix </label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <span className="glyphicon glyphicon-user"></span>
                                        </span>
                                        <input className="col-md-3 form-control" name="EmployeePrefix" type="text" placeholder="Prefix of EmployeeNumber" autoComplete="off" ref="empPrefix" defaultValue={this.state.Organisation["EmpPrefix"]} />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="col-md-2">
                            <div className="form-group">
                                <img className="imagePreview" id="img-upload" src={this.props.match.params["id"] != undefined ? this.state.Organisation["OrgLogo"] !== null ? this.state.Organisation["OrgLogo"] : "Images/dummy-profile-pic.png" : "Images/dummy-profile-pic.png"} />
                                {/* <img className="imagePreview" id="img-upload" src="Images/dummy-profile-pic.png" /> */}
                                <label className="image-delete pointer" for="imageInput">
                                    <button type="button" className="glyphicon glyphicon-edit text-success" onClick={() => { document.getElementById("upload").click() }} >
                                        <input type="file" id="upload" ref="image" style={{ visibility: 'hidden' }} onChange={() => this.readUrl(this)} accept=".png, .jpg, .jpeg" />
                                    </button>
                                </label>

                            </div>
                        </div>
                    </div>


                    <div className="col-xs-12">
                        <h3 className="col-md-11 formheader" style={{ paddingLeft: '10px' }}>Address Details</h3>
                        <div className="col-md-1 mybutton">
                            <button type="button" style={{ marginTop: '3%' }} className="btn btn-default pull-left headerbtn" onClick={this.AddOrganisationLocation.bind(this)} >
                                <span className="glyphicon glyphicon-plus"></span>
                            </button>
                        </div>
                    </div>

                    {
                        this.state.OrgLocations.map((item, i) => {
                            return (
                                <div key={i}>
                                    <h4 className="col-xs-12"> Location {i + 1} </h4>
                                    <div > {item} </div>
                                </div>
                            )
                        })
                    }


                    <div className="col-xs-12">
                        <h3 className="col-md-12 myheading">Other Details</h3>
                    </div>

                    <div className="col-xs-12">
                        <div className="col-md-4">
                            <label> PAN </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-home"></span>
                                    </span>
                                    <input className="form-control" type="text" name="pan" ref="pan" placeholder="PAN" autoComplete="off" defaultValue={this.state.Organisation["PAN"]} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label> TIN  (eg: 111-11-1111)</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-home"></span>
                                    </span>
                                    <input className="form-control" type="text" name="TIN" ref="tin" placeholder="TIN" autoComplete="off" defaultValue={this.state.Organisation["TIN"]} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label>GST </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-home"></span>
                                    </span>
                                    <input className="form-control" type="text" name="GST" ref="gst" placeholder="GST" autoComplete="off" defaultValue={this.state.Organisation["GST"]} />
                                </div>
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

    readUrl(input) {
        setUnTouched(document);
        if (this.refs.image.files[0]) {
            var reader = new FileReader();
            document.getElementById("img-upload").src = window.URL.createObjectURL(this.refs.image.files[0])
        }
    }

    AddOrganisationLocation() {

        var orgLocations = this.state.OrgLocations;
        var orgLocationRefs = this.state.OrgLocationRefs;
        var count = "location " + this.state.OrgLocations.length;
        var dummyLoc = { dummy: "" }

        orgLocations.push(<OrganisationLocation location={dummyLoc} ref={(count) => orgLocationRefs.push(count)} />)
        this.setState({ OrgLocations: orgLocations, OrgLocationRefs: orgLocationRefs })
    }


    CountryChanged(val) {
        this.setState({ Country: val }, () => {
            if (this.state.Country && this.state.Country.value) {
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

    StateChanged(val) {
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

    CityChanged(val) {
        this.setState({ City: val || '' })
        showErrorsForInput(this.refs.city.wrapper, null);
    }

    handleSubmit(e) {
        e.preventDefault();


        var orgLocationsRefs = this.state.OrgLocationRefs;
        var locations = [];

        orgLocationsRefs.map((ele, i) => {
            var location = {
                locId: orgLocationsRefs[i].refs.locationId.value,
                addressLine1: orgLocationsRefs[i].refs.addressLine1.value.trim(),
                addressLine2: orgLocationsRefs[i].refs.addressLine2.value.trim(),
                country: orgLocationsRefs[i].state.Country.value,
                state: orgLocationsRefs[i].state.State.value,
                city: orgLocationsRefs[i].state.City.value,
                zip: orgLocationsRefs[i].refs.zip.value
            }

            locations.push(location)
        })

        $(".loaderActivity").show();
        $("button[name='submit']").hide();

        if (!this.validate(e)) {
            $(".loaderActivity").hide();
            $("button[name='submit']").show();
            return;
        }

        var data = new FormData();

        data.append("orgName", this.refs.orgname.value);
        data.append("website", this.refs.website.value);
        data.append("Email", this.refs.email.value);
        data.append("primaryPhoneNum", this.refs.primaryNumber.value);
        data.append("secondaryPhoneNum", this.refs.secondaryNum.value);
        data.append("tin", this.refs.tin.value);
        data.append("gst", this.refs.gst.value);
        data.append("pan", this.refs.pan.value);
        data.append("empPrefix", this.refs.empPrefix.value);
        data.append("OrgLogo", this.refs.image.files[0]);
        data.append("OrgLocations", JSON.stringify(locations));

        if (this.props.match.params["id"] != null) {
            var url = ApiUrl + "/api/Organisation/UpdateOrg?OrgId=" + this.props.match.params["id"]
        }

        else {
            var url = ApiUrl + "/api/Organisation/AddOrganisation"
        }

        try {
            MyAjaxForAttachments(
                url,
                (data) => {
                    toast("Organisation saved successfully!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $("button[name='submit']").show();
                    this.props.history.push("/OrganisationsList");
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

        var success = true;
        var isSubmit = e.type === "submit";


        if (isSubmit) {
            $(e.currentTarget.getElementsByClassName('form-control')).map((i, el) => {
                el.classList.remove("un-touched");
            });
        }

        if (validate.single(this.refs.orgname.value, { presence: true }) !== undefined) {
            if (isSubmit) {
                this.refs.orgname.focus();
                isSubmit = false;
            }
            success = false;
            showErrorsForInput(this.refs.orgname, ["Please enter organisation name"]);
        }
        else {
            showErrorsForInput(this.refs.orgname, []);
        }


        if (validate.single(this.refs.website.value, { presence: true }) !== undefined) {
            if (isSubmit) {
                if (isSubmit) {
                    this.refs.website.focus();
                    isSubmit = false;
                }
            }
            success = false;
            showErrorsForInput(this.refs.website, ["Please enter web url"]);
        }
        else {
            showErrorsForInput(this.refs.website, []);
        }
        var emailConstraints = {
            presence: true,
            email: true
        }

        if (validate.single(this.refs.email.value, emailConstraints) !== undefined) {
            if (isSubmit) {
                this.refs.email.focus();
                isSubmit = false;
            }
            success = false;
            showErrorsForInput(this.refs.email, ["Please enter a valid mail"]);
        }
        else {
            showErrorsForInput(this.refs.email, []);
        }

        var phoneConstraints = {
            presence: true,
            format: {
                pattern: /^^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
                flags: "g"
            }
        }

        if (validate.single(this.refs.primaryNumber.value, phoneConstraints) !== undefined) {
            showErrorsForInput(this.refs.primaryNumber, ["Enter a valid phone number"]);
            if (isSubmit) {
                this.refs.primaryNumber.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.primaryNumber, []);
        }

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
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.secondaryNum, []);
        }

        if (validate.single(this.refs.empPrefix.value, { presence: true }) !== undefined) {
            if (isSubmit) {
                isSubmit = false;
                this.refs.empPrefix.focus();
            }
            success = false;
            showErrorsForInput(this.refs.empPrefix, ["Please enter employee prefix"])
        }
        else {
            showErrorsForInput(this.refs.empPrefix, [])
        }

        // address validation here

        var orgLocationsRefs = this.state.OrgLocationRefs;

        orgLocationsRefs.map((ele, i) => {
            //validate address line 1        

            if (validate.single(orgLocationsRefs[i].refs.addressLine1.value, { presence: true }) !== undefined) {
                success = false;
                showErrorsForInput(orgLocationsRefs[i].refs.addressLine1, ["Address line 1 should not be empty"])

                if (isSubmit) {
                    isSubmit = false;
                    orgLocationsRefs[i].refs.addressLine1.focus();
                }
            }
            else {
                showErrorsForInput(orgLocationsRefs[i].refs.addressLine1, []);
            }

            // Validate Country
            if (!orgLocationsRefs[i].state.Country || !orgLocationsRefs[i].state.Country.value) {
                success = false;
                showErrorsForInput(orgLocationsRefs[i].refs.country.wrapper, ["Please select a valid country"]);

                if (isSubmit) {
                    isSubmit = false;
                    orgLocationsRefs[i].refs.country.focus();
                }
            }

            // Validate State

            if (!orgLocationsRefs[i].state.State || !orgLocationsRefs[i].state.State.value) {
                success = false;
                showErrorsForInput(orgLocationsRefs[i].refs.state.wrapper, ["Please select a valid state"]);

                if (isSubmit) {
                    isSubmit = false;
                    orgLocationsRefs[i].refs.state.focus();
                }

            }

            // Validate City

            if (!orgLocationsRefs[i].state.City || !orgLocationsRefs[i].state.City.value) {
                success = false;
                showErrorsForInput(orgLocationsRefs[i].refs.city.wrapper, ["Please select a valid city"])

                if (isSubmit) {
                    isSubmit = false;
                    orgLocationsRefs[i].refs.city.focus();
                }
            }

            // validate ZIP

            var ZipConstraints = {
                presence: true,
                length: {
                    maximum: 10,
                    tooLong: " is too long"
                }
            }
           
            if (validate.single(orgLocationsRefs[i].refs.zip.value, ZipConstraints) !== undefined) {
                success = false;
                if (orgLocationsRefs[i].refs.zip.value.length > 10) {
                    showErrorsForInput(orgLocationsRefs[i].refs.zip, ["ZIP is too long"]);
                }
                else {
                    showErrorsForInput(orgLocationsRefs[i].refs.zip, ["ZIP should not be empty"]);
                }

                if (isSubmit) {
                    orgLocationsRefs[i].refs.zip.focus();
                    isSubmit = false;
                }
            }

            else {
                showErrorsForInput(orgLocationsRefs[i].refs.zip, []);
            }

        })


        var PANConstraints = {
            presence: true,
            format: {
                pattern: /([A-Za-z]{5}[0-9]{4}[A-Za-z]{1})/,
                message: "is not valid"
            }
        }

        if (validate.single(this.refs.pan.value, PANConstraints) !== undefined) {
            if (isSubmit) {
                this.refs.pan.focus();
                isSubmit = false;
            }
            success = false;
            showErrorsForInput(this.refs.pan, ["Please enter a valid pan"]);
        }
        else {
            showErrorsForInput(this.refs.pan, []);
        }

        var TINConstraints = {
            presence: true,
            format: {
                pattern: /^(?:\d{3}-\d{2}-\d{4}|\d{2}-\d{7})$/,
                message: "is not valid"
            }
        }

        if (validate.single(this.refs.tin.value, TINConstraints) !== undefined) {

            if (isSubmit) {
                this.refs.tin.focus();
                isSubmit = false;
            }
            success = false;
            showErrorsForInput(this.refs.tin, ["Please enter a valid tin"]);
        }
        else {
            showErrorsForInput(this.refs.tin, []);
        }

        var GSTConstraints = {
            presence: true,
            format: {
                pattern: "^([0][1-9]|[1-2][0-9]|[3][0-5])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$",
                message: "is not valid"
            }
        }

        if (validate.single(this.refs.gst.value, GSTConstraints) !== undefined) {

            if (isSubmit) {
                this.refs.gst.focus();
                isSubmit = false;
            }
            success = false;
            showErrorsForInput(this.refs.gst, ["Please enter a valid GST number"]);
        }
        else {
            showErrorsForInput(this.refs.gst, []);
        }

        return success;
    }

}

export default Organisation;


// data.append("addressLine1", this.refs.addressLine1.value.trim());
 // data.append("addressLine2", this.refs.addressLine2.value.trim());
 // data.append("countryId", this.state.Country.value);
 // data.append("stateId", this.state.State.value);
 // data.append("cityId", this.state.City.value); 
 // data.append("zip", this.refs.zip.value);

 // showErrorsForInput(orgLocationsRefs[i].refs.zip.value, ["Zip is not valid"]);
            
            // if (orgLocationsRefs[i].refs.zip.value == "") {
            //     success = false;

            //     showErrorsForInput(orgLocationsRefs[i].refs.zip, ["ZIP should not be empty"]);

            //     if (isSubmit) {
            //         isSubmit = false;
            //         orgLocationsRefs[i].refs.zip.focus();
            //     }
            // }

            // else if (orgLocationsRefs[i].refs.zip.value.length > 10) {
            //     showErrorsForInput(orgLocationsRefs[i].refs.zip, ["ZIP is too long"]);
            //     if (isSubmit) {
            //         isSubmit = false;
            //         orgLocationsRefs[i].refs.zip.focus();
            //     }
            // }


{/* <div className="col-xs-12">
                        <h3 className="col-md-12 myheading">Address Details</h3>
                    </div>

                    <div className="col-xs-12">
                        <div className="col-md-6">
                            <label>Address Line 1 </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-map-marker"></span>
                                    </span>
                                    <input className="col-md-5 form-control" name="AddressLine1" type="text" ref="addressLine1" placeholder="Address " autoComplete="off" defaultValue={this.state.Organisation["AddressLine1"]} />
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
                                    <input className="col-md-5 form-control" type="text" name="AddressLine2" ref="addressLine2" placeholder="Address" autoComplete="off" defaultValue={this.state.Organisation["AddressLine2"]} />
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
                                        <span className="glyphicon glyphicon-map-marker"></span>
                                    </span>
                                    <Select className="form-control" name="country" ref="country" placeholder="Select Country" value={this.state.Country} options={this.state.Countries} onChange={this.CountryChanged.bind(this)} />
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
                                        <span className="glyphicon glyphicon-map-marker"></span>
                                    </span>
                                    <Select className="form-control" name="city" ref="city" placeholder="Select city" value={this.state.City} options={this.state.Cities} onChange={this.CityChanged.bind(this)} />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <label> Zip </label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-home"></span>
                                    </span>
                                    <input className="form-control" type="text" name="ZIP" ref="zip" placeholder="Postal code" autoComplete="off" defaultValue={this.state.Organisation["ZIP"]} />
                                </div>
                            </div>
                        </div>
                    </div> */}
  // if (validate.single(this.refs.addressLine1.value, { presence: true }) !== undefined) {
        //     success = false;
        //     showErrorsForInput(this.refs.addressLine1, ["Address Line1 should not be empty"])
        //     if (isSubmit) {
        //         this.refs.addressLine1.focus();
        //         isSubmit = false;
        //     }
        // }
        // else {
        //     showErrorsForInput(this.refs.addressLine1, []);
        // }


        // if (!this.state.Country || !this.state.Country.value) {
        //     if (isSubmit) {
        //         this.refs.country.focus();
        //         isSubmit = false;
        //     }
        //     success = false;
        //     showErrorsForInput(this.refs.country.wrapper, ["Please select a country"]);
        // }

        // if (!this.state.State || !this.state.State.value) {

        //     if (isSubmit) {
        //         this.refs.state.focus();
        //         isSubmit = false;
        //     }
        //     success = false;
        //     showErrorsForInput(this.refs.state.wrapper, ["Please select a valid state"]);
        // }

        // if (!this.state.City || !this.state.City.value) {

        //     if (isSubmit) {
        //         this.refs.city.focus();
        //         isSubmit = false;
        //     }
        //     success = false;
        //     showErrorsForInput(this.refs.city.wrapper, ["Please select a valid city"]);
        // }

        // var ZIPConstraints = {
        //     presence: true,
        //     length:
        //         {
        //             maximum: 10,
        //             tooLong: "is too long"
        //         }
        // }

        // if (validate.single(this.refs.zip.value, ZIPConstraints) !== undefined) {
        //     if (this.refs.zip.value.length > 10) {
        //         showErrorsForInput(this.refs.zip, ["zip is too long"]);
        //     }
        //     else {
        //         showErrorsForInput(this.refs.zip, ["zip should not be empty"]);
        //     }
        //     if (isSubmit) {
        //         this.refs.zip.focus();
        //         isSubmit = false;
        //     }
        //     success = false;
        // }
        // else {
        //     showErrorsForInput(this.refs.zip, []);
        // }