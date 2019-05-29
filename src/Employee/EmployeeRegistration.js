import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { showErrorsForInput, setUnTouched, ValidateForm } from '.././Validation';
import { ApiUrl } from '../Config';
import Select from 'react-select';
import './EmployeeRegistration.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MyAjaxForAttachments, MyAjax } from '../MyAjax';


var validate = require('validate.js');
var moment = require('moment');

class EmployeeRegistration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Country: null, Employee: [], Countries: [], State: null, States: [], EmpType: null, Department: null,
            Departments: [], Designation: null, Designations: [], Role: null, Roles: [], Gender: null,
            BloodGroup: null, Managers: [], Manager: null, EmployeeId: null, ProvisionalPeriod: 0,
            AddressLine1: null, Organisations: [], Shifts: [], Shift: null, Organisation: null,
            filename: "http://cliquecities.com/assets/no-image-e3699ae23f866f6cbdf8ba2443ee5c4e.jpg",
            fileUrl: ''
        }
    }

    componentWillMount() {

        this.setState({ EmployeeId: this.props.match.params["id"] }, () => {

            if (sessionStorage.getItem("roles").indexOf("Admin") == -1 || sessionStorage.getItem("roles").indexOf("SuperAdmin") == -1) {
                this.setState({
                    Organisation: { value: sessionStorage.getItem("OrgId"), label: sessionStorage.getItem("OrgName") }
                })
            }

            else {
                $.ajax({
                    url: ApiUrl + "/api/MasterData/GetOrganisations",
                    type: "get",
                    success: (data) => { this.setState({ Organisations: data["organisations"] }) }
                })
            }

            if (this.props.match.params["id"] != null) {
                $.ajax({
                    url: ApiUrl + "/api/Employee/GetEmployee?EmpId=" + this.props.match.params["id"],
                    type: "get",
                    success: (data) => {
                        this.setState({
                            Employee: data["employee"],
                            BloodGroup: { value: data["employee"]["BloodGroup"], label: data["employee"]["BloodGroup"] },
                            Country: { value: data["employee"]["Country"], label: data["employee"]["CountryName"] },
                            State: { value: data["employee"]["StateId"], label: data["employee"]["StateName"] },
                            City: { value: data["employee"]["CityId"], label: data["employee"]["CityName"] },
                            EmpType: { value: data["employee"]["EmploymentType"], label: data["employee"]["EmploymentType"] },
                            Designation: { value: data["employee"]["DesgId"], label: data["employee"]["DesgName"] },
                            Department: { value: data["employee"]["DeptId"], label: data["employee"]["DeptName"] },
                            Role: { value: data["employee"]["RoleId"], label: data["employee"]["RoleName"] },
                            Manager: { value: data["employee"]["ManagerId"], label: data["employee"]["ManagerName"] },
                            Gender: { value: data["employee"]["Gender"], label: data["employee"]["Gender"] },
                            Organisation: { value: data["employee"]["OrgId"], label: data["employee"]["OrgName"] },
                            Shift: { value: data["employee"]["ShiftId"], label: data["employee"]["ShiftTimings"] },
                            filename: data["employee"]["PhotoUrl"] != null ? data["employee"]["PhotoUrl"] : this.state.filename
                        }, () => {

                            $.ajax({
                                url: ApiUrl + "/api/MasterData/GetManagersOfOrg?orgId=" + data["employee"]["OrgId"],
                                type: "get",
                                success: (data) => { this.setState({ Managers: data["managers"] }) }
                            })
                        })
                    }
                })
            }

        })

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetShifts",
            type: "get",
            success: (data) => {
                var shifts = this.state.Shifts;
                data["shifts"].map((ele, i) => {
                    var Id = ele["Id"]
                    var timeRange = moment(ele["InTime"], 'HH:mm:ss').format("HH:mm") + '-' +
                        moment(ele["OutTime"], 'HH:mm:ss').format("HH:mm")

                    shifts.push({ value: Id, label: timeRange })
                })
                this.setState({ Shifts: shifts })
            }
        })

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetCountries",
            type: "get",
            success: (data) => { this.setState({ Countries: data["countries"] }) }
        });

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetDesignations",
            type: "get",
            success: (data) => { this.setState({ Designations: data["designations"] }) }
        });

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetDepartments",
            type: "get",
            success: (data) => { this.setState({ Departments: data["departments"] }) }
        });

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetEmpRoles",
            type: "get",
            success: (data) => { this.setState({ Roles: data["empRoles"] }) }
        });

    }

    componentDidMount() {
        setUnTouched(document);
    }

    componentDidUpdate() {
        setUnTouched(document);
    }

    render() {
        return (
            <div className="container" key={this.state.Employee} style={{ marginTop: '0%' }}>


                {
                    this.props.match.params["id"] != null ?
                        <div className="col-xs-12">
                            <button className="col-md-3 btn btn-default btn-circle" style={{ marginLeft: '5%' }} onClick={() => this.props.history.push("/EmployeeRegistration/" + this.props.match.params["id"])} title="General Details" > 1</button>
                            <hr className="col-md-4" />
                            <button className="col-md-3 btn btn-default btn-circle" onClick={() => this.props.history.push("/EmployeeDocuments/" + this.props.match.params["id"])} title="Documents" > 2</button>
                            <hr className="col-md-5" />
                            <button className="col-md-3 btn btn-default btn-circle" onClick={() => this.props.history.push("/EmployeePayScale/" + this.props.match.params["id"])} title="PayScales" > 3 </button>
                        </div>
                        :
                        <div className="col-xs-12">
                            <button className="col-md-3 btn btn-default btn-circle" style={{ marginLeft: '5%' }} onClick={() => this.props.history.push("/EmployeeRegistration/")} title="General Details" > 1</button>
                            <hr className="col-md-4" />
                            <button className="col-md-3 btn btn-default btn-circle" title="Documents" > 2</button>
                            <hr className="col-md-5" />
                            <button className="col-md-3 btn btn-default btn-circle" title="PayScales" > 3</button>
                        </div>
                }

                <div className="container">

                    <form onSubmit={this.handleSubmit.bind(this)} onChange={this.validate.bind(this)} >

                        <div className="col-xs-12">
                            <h3 className="col-md-11 formheader" style={{ paddingLeft: '10px' }}>Personal Details</h3>
                            <div className="col-md-1 mybutton">
                                <button type="button" style={{ marginTop: '3%' }} className="btn btn-default pull-left headerbtn" onClick={() => this.props.history.push("/EmployeesList")} >
                                    <span className="glyphicon glyphicon-th-list"></span>
                                </button>
                            </div>
                        </div>

                        <div className="col-xs-12">


                            <div className="col-md-3 form-group">
                                <label> First Name </label>
                                <div className="input-group">
                                    <span className="input-group-addon" >
                                        <i className="glyphicon glyphicon-user" aria-hidden="true"></i>
                                    </span>
                                    <input className="form-control" type="text" name="FirstName" placeholder="First Name" autoComplete="off" ref="firstname" defaultValue={this.state.Employee["FirstName"]} />
                                </div>
                            </div>

                            <div className="col-md-3 form-group">
                                <label> Middle Name </label>
                                <div className="input-group">
                                    <span className="input-group-addon" >
                                        <i className="glyphicon glyphicon-user" aria-hidden="true"></i>
                                    </span>
                                    <input className="form-control" type="text" name="MiddleName" placeholder="Middle Name" autoComplete="off" ref="middlename" defaultValue={this.state.Employee["MiddleName"]} />
                                </div>

                            </div>

                            <div className="col-md-3">
                                <label> Last Name </label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon" >
                                            <span className="glyphicon glyphicon-user"></span>
                                        </span>
                                        <input className="col-md-3 form-control" type="text" name="LastName" placeholder="Last Name" autoComplete="off" ref="lastname" defaultValue={this.state.Employee["LastName"]} />
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
                                        <input className="col-md-3 form-control" name="email" type="text" placeholder="Email" autoComplete="off" ref="email" defaultValue={this.state.Employee["Email"]} />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="col-xs-12">
                            <div className="col-md-10 pleft0" >
                                <div className="col-md-3">
                                    <label> Primary Phone Number </label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <span className="glyphicon glyphicon-phone"></span>
                                            </span>
                                            <input className="col-md-3 form-control" name="PhoneNumber" type="text" placeholder="Primary Phone Number" autoComplete="off" ref="primaryNum" defaultValue={this.state.Employee["PrimaryPhoneNum"]} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label> Secondary Phone Number </label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <span className="glyphicon glyphicon-phone"></span>
                                            </span>
                                            <input className="col-md-3 form-control" name="SecondaryPhoneNumber" type="text" placeholder="Secondary Phone Number" autoComplete="off" ref="secondaryNum" defaultValue={this.state.Employee["SecondaryPhoneNum"]} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label> Gender </label>

                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <span className="glyphicon glyphicon-user"></span>
                                            </span>
                                            <Select className="form-control" name="gender" ref="gender" placeholder="Select Gender" value={this.state.Gender}
                                                options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }]}
                                                onChange={this.onGenderChanged.bind(this)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label>Date of birth </label>
                                    {/* (For eg: 3/30/2000) */}
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <span className="glyphicon glyphicon-calendar"></span>
                                            </span>
                                            <input className="col-md-3 form-control" style={{ lineHeight: '19px' }} type="date" name="DateOfBirth" ref="dob" autoComplete="off" defaultValue={this.state.Employee["DOB"]} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-2">
                                    <label>Blood Group </label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <span className="glyphicon glyphicon-user"></span>
                                            </span>
                                            <Select className="form-control" name="BloodGroup" ref="bloodgroup" placeholder="Blood Group" value={this.state.BloodGroup}
                                                options={[{ value: 'A+', label: 'A+' }, { value: 'A-', label: 'A-' }, { value: 'B+', label: 'B+' },
                                                { value: 'B-', label: 'B-' }, { value: 'AB+', label: 'AB-' }, { value: 'O+', label: 'O+' },
                                                { value: 'O-', value: 'O-' }]}
                                                onChange={this.onBloodGroupChanged.bind(this)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label>Aadhar </label>
                                    {/* ( For eg: 232333323232) */}
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <span className="glyphicon glyphicon-info-sign"></span>
                                            </span>
                                            <input className="col-md-3 form-control" name="aadhar" type="text" placeholder="Aadhar Number" autoComplete="off" ref="aadhar" defaultValue={this.state.Employee["Aadhar"]} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label>Pan </label>
                                    {/* ( For Eg: ASDFG7654H) */}
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <span className="glyphicon glyphicon-info-sign"></span>
                                            </span>
                                            <input className="col-md-3 form-control" name="pan" type="text" placeholder="Pan Number" autoComplete="off" ref="panNum" defaultValue={this.state.Employee["Pan"]} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label> Organisation </label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <span className="glyphicons glyphicons-group" > </span>
                                            </span>
                                            <Select className="form-control" name="organisation" ref="organisation" placeholder="Select Organisation"
                                                options={this.state.Organisations}
                                                value={this.state.Organisation}
                                                onChange={this.OrganisationChanged.bind(this)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label>Shift Time</label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">   </span>
                                            <Select className="form-control" placeholder=" Shift Timings" ref="shifttime" options={this.state.Shifts} value={this.state.Shift} onChange={this.shiftChanged.bind(this)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2" style={{ paddingLeft: '0px' }}>
                                <div className="imgUp" style={{ textAlign: 'right' }} >
                                    <img className="imagePreview" key={this.state.filename} src={this.state.filename} />
                                    <label className="btn btn-primary imgbtn-primary" > Upload
                                    <input type="file" id="imageUpload" className="uploadFile img" ref="file" accept=".png,.jpg,.jpeg"
                                            style={{ width: '0px', height: '0px', overflow: 'hidden' }}
                                            onChange={this.readURL.bind(this)}  />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-12">
                            <h3 className="Empheading">Address Details</h3>
                        </div>

                        <div className="col-xs-12">
                            <div className="col-md-6">
                                <label>Address Line 1 </label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <span className="glyphicon glyphicon-map-marker"></span>
                                        </span>
                                        <input className="col-md-5 form-control" type="text" name="AddressLine1" placeholder="Address " autoComplete="off" ref="addressLine1" defaultValue={this.state.Employee["AddressLine1"]} />
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
                                        <input className="col-md-5 form-control" type="text" placeholder="Address " autoComplete="off" ref="addressLine2" defaultValue={this.state.Employee["AddressLine2"]} />
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
                                        <Select className="form-control" name="state" ref="state" placeholder="Select State" value={this.state.State} options={this.state.States} onChange={this.onStateChanged.bind(this)} />
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
                                        <Select className="form-control" name="city" ref="city" placeholder="Select city" value={this.state.City} options={this.state.Cities} onChange={this.onCityChanged.bind(this)} />
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
                                        <input className="form-control" type="text" name="ZIP" ref="zip" placeholder="Postal code" defaultValue={this.state.Employee["ZIP"]} autoComplete="off" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-12">
                            <h3 className="Empheading">Employment Details</h3>
                        </div>

                        <div>
                            <div className="col-xs-12">

                                <div className={this.props.match.params["id"] != null ? "col-md-3" : "col-md-4"} >
                                    <label> Date of joining </label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <span className="glyphicon glyphicon-calendar"></span>
                                            </span>
                                            <input className="form-control" type="date" name="dateOfJoining" style={{ lineHeight: '19px' }} ref="doj" autoComplete="off" defaultValue={this.state.Employee["DOJ"]} />
                                        </div>
                                    </div>
                                </div>

                                {
                                    this.props.match.params["id"] != null ?
                                        <div className="col-md-3" >
                                            <label> Date of Resignation </label>
                                            <div className="form-group">
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <span className="glyphicon glyphicon-calendar"></span>
                                                    </span>
                                                    <input className="form-control" type="date" name="dateOfResignation" style={{ lineHeight: '19px' }} ref="dor" autoComplete="off" defaultValue={this.state.Employee["DOR"]} />
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div />

                                }

                                <div className={this.props.match.params["id"] != null ? "col-md-3" : "col-md-4"}>
                                    <label> Provisional Period(Months) </label>
                                    <div className="form-group">
                                        <input className="form-control" type="number" name="provisional period" defaultValue={this.state.Employee["ProvisionalPeriod"]} min='0' placeholder="Provisional Period" ref="provisionalPeriod" autoComplete="off" min="0" />
                                    </div>
                                </div>

                                <div className={this.props.match.params["id"] != null ? "col-md-3" : "col-md-4"}>
                                    <label> Employment Type </label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <span className="glyphicon glyphicon-user"></span>
                                            </span>
                                            <Select className="form-control" ref="EmpType" placeholder="Select Employment Type" value={this.state.EmpType}
                                                options={[{ value: 'Consultant', label: 'Consultant' }, { value: 'Permanent', label: 'Permanent' }]}
                                                onChange={this.onEmpTypeChanged.bind(this)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12">
                                <div className="col-md-3">
                                    <label> Designation</label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <span className="glyphicon glyphicon-group-chat"></span>
                                            </span>
                                            <Select className="form-control" name="designation" ref="designation" placeholder="Select Designation" value={this.state.Designation} options={this.state.Designations} onChange={this.onDesignationChanged.bind(this)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label> Department</label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <span className="glyphicon glyphicon-group-chat"></span>
                                            </span>
                                            <Select className="form-control" name="department" ref="department" placeholder="Select Department" value={this.state.Department} options={this.state.Departments} onChange={this.onDepartmentChanged.bind(this)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label>Head/Manager</label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <span className="glyphicon glyphicon-user"></span>
                                            </span>

                                            <Select className="form-control" name="manager" ref="manager" placeholder="Select Manager" value={this.state.Manager} options={this.state.Managers} onChange={this.onManagerChanged.bind(this)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label> Role</label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <span className="glyphicons-group-chat"></span>
                                            </span>
                                            <Select className="form-control" name="role" ref="role" placeholder="Select Role" value={this.state.Role} options={this.state.Roles} onChange={this.onRoleChanged.bind(this)} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="col-xs-12" >
                                <div className="loader loaderActivity btnSave" ></div>
                                <button type="submit" name="submit" className="btn btn-success btnSave btnsavesuccess"  > Submit </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        );
    }

    readURL(e) {
        var file = this.refs.file.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        this.setState({ filename: window.URL.createObjectURL(file) });
    } 

    shiftChanged(value) {
        if (value) {
            this.setState({ Shift: value });
            showErrorsForInput(this.refs.shifttime.wrapper, null);
        }
        else {
            this.setState({ Shift: null });
            showErrorsForInput(this.refs.shifttime.wrapper, ["Select employee shift"])
        }
    }

    onGenderChanged(val) {
        this.setState({ Gender: val })
        showErrorsForInput(this.refs.gender.wrapper, null);
    }

    onBloodGroupChanged(val) {
        this.setState({ BloodGroup: val })
        showErrorsForInput(this.refs.bloodgroup.wrapper, null);
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

    onStateChanged(val) {
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

    OrganisationChanged(val) {
        this.setState({ Organisation: val }, () => {
            if (val) {
                if (sessionStorage.getItem("roles").indexOf("SuperAdmin") == -1) {
                    if (val) {
                        showErrorsForInput(this.refs.organisation.wrapper, []);
                    }
                    else {
                        //  this.setState({ Organisation: { value: sessionStorage.getItem("OrgId"), label: sessionStorage.getItem("OrgName") } })
                        showErrorsForInput(this.refs.organisation.wrapper, ["Please select organisation"])
                    }
                }
                $.ajax({
                    url: ApiUrl + "/api/MasterData/GetManagersOfOrg?orgId=" + this.state.Organisation.value,
                    type: "get",
                    success: (data) => { this.setState({ Managers: data["managers"] }) }
                })
            }
            else {
                this.setState({ Organisation: { value: sessionStorage.getItem("OrgId"), label: sessionStorage.getItem("OrgName") } }, () => {
                    $.ajax({
                        url: ApiUrl + "/api/MasterData/GetManagersOfOrg?orgId=" + this.state.Organisation.value,
                        type: "get",
                        success: (data) => { this.setState({ Managers: data["managers"] }) }
                    })
                })
            }

        })
    }

    onCityChanged(val) {
        this.setState({ City: val })
        showErrorsForInput(this.refs.city.wrapper, null);
    }

    onEmpTypeChanged(val) {
        this.setState({ EmpType: val })
        showErrorsForInput(this.refs.EmpType.wrapper, null);
    }

    onDesignationChanged(val) {
        this.setState({ Designation: val });
        showErrorsForInput(this.refs.designation.wrapper, null);
    }

    onRoleChanged(val) {
        this.setState({ Role: val })
        showErrorsForInput(this.refs.role.wrapper, null);
    }

    onDepartmentChanged(val) {
        if (val) {
            this.setState({ Department: val }
                // ,
                // () => {
                //     $.ajax({
                //         url: ApiUrl + "/api/MasterData/GetManagers?departmentId=" + this.state.Department.value,
                //         type: "get",
                //         success: (data) => { this.setState({ Managers: data["managers"] }) }
                //     })

                // }
            );
            showErrorsForInput(this.refs.department.wrapper, null);
        }
        else {
            this.setState({ Department: '' })
            showErrorsForInput(this.refs.department.wrapper, ["Please select Department"]);
        }

    }

    onManagerChanged(val) {
        this.setState({ Manager: val })
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

        var data = new FormData();

        data.append("FirstName", this.refs.firstname.value);
        data.append("MiddleName", this.refs.middlename.value);
        data.append("LastName", this.refs.lastname.value);
        data.append("Email", this.refs.email.value);
        data.append("PrimaryNum", this.refs.primaryNum.value);
        data.append("SecondaryNum", this.refs.secondaryNum.value);
        data.append("Gender", this.state.Gender.value);
        data.append("CountryId", this.state.Country.value);
        data.append("StateId", this.state.State.value);
        data.append("CityId", this.state.City.value);
        data.append("RoleId", this.state.Role.value);
        data.append("DesignationId", this.state.Designation.value);
        data.append("DepartmentId", this.state.Department.value);
        data.append("EmpType", this.state.EmpType.value);
        data.append("Aadhar", this.refs.aadhar.value);
        data.append("Pan", this.refs.panNum.value);
        data.append("AddressLine1", this.refs.addressLine1.value);
        data.append("AddressLIne2", this.refs.addressLine2.value);
        data.append("Zip", this.refs.zip.value);
        data.append("DOB", this.refs.dob.value);
        data.append("OrgId", this.state.Organisation.value);
        data.append("Shift", this.state.Shift.value);

        if (this.refs.doj.value != null) {
            data.append("DOJ", this.refs.doj.value);
        }
        if (this.refs.provisionalPeriod.value) {
            data.append("ProvisionalPeriod", this.refs.provisionalPeriod.value);
        }

        var file = this.refs.file.files;

        if (file.length == 1) {
            if ($.inArray(this.refs.file.value.split('.').pop().toLowerCase(), ["png", "jpg", "jpeg"]) == -1) {
                toast("Supported formats are png, jpg, jpeg", {
                    type: toast.TYPE.ERROR
                });
                return;
            }
            data.append("empImage", file[0]);
        }

        data.append("BloodGroup", this.state.BloodGroup.value);

        if (!this.state.Manager || !this.state.Manager.value) {
            data.append("Manager", "");
        }
        else {
            data.append("Manager", this.state.Manager.value);
        }

        if (this.props.match.params["id"] != null) {
            if (this.refs.dor.value != null) {
                data.append("DOR", this.refs.dor.value);
            }
            data.append("OldEmail", this.state.Employee["Email"]);
            var url = ApiUrl + "/api/Employee/UpdateEmployee?EmpId=" + this.props.match.params["id"]
        }
        else {
            var url = ApiUrl + "/api/Employee/AddEmployee"
        }

        try {

            MyAjaxForAttachments(
                url,
                (data) => {
                    toast(" Employee saved successfully!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $("button[name='submit']").show();
                    this.props.history.push("/EmployeesList");
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
            toast("An error occured, please try again later", {
                type: toast.TYPE.ERROR
            });
            $(".loader").hide();
            $("button[name='submit']").show();
            return false;
        }

    }

    validate(e) {

        var isSubmit = e.type === "submit";
        let errors = {};
        var success = true;

        if (isSubmit) {
            $(e.currentTarget.getElementsByClassName('form-control')).map((i, el) => {
                el.classList.remove("un-touched");
            });
        }


        var FirstNameConstraints = {
            presence: true,
            format: {
                pattern: "[a-zA-Z ]+",
                message: "should contain only alphabets"
            }
        }

        if (validate.single(this.refs.firstname.value, FirstNameConstraints) !== undefined) {
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



        if (validate.single(this.refs.lastname.value, FirstNameConstraints) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.lastname, ["Please enter valid last name"]);

            if (isSubmit) {
                this.refs.lastname.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.lastname, []);

        }


        var emailConstraints = {
            presence: true,
            email: true
        }

        if (validate.single(this.refs.email.value, emailConstraints) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.email, ["Please enter valid email"]);

            if (isSubmit) {
                this.refs.email.focus();
                isSubmit = false;
            }
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
        if (validate.single(this.refs.primaryNum.value, phoneConstraints) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.primaryNum, ["Please enter a valid phone number"]);
            if (isSubmit) {
                this.refs.primaryNum.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.primaryNum, []);
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

        if (!this.state.Gender || !this.state.Gender.value) {
            success = false;
            showErrorsForInput(this.refs.gender.wrapper, ["Please select a gender"]);
            if (isSubmit) {
                this.refs.gender.focus();
                isSubmit = false;
            }

        }

        var dob = {
            presence: true
        }

        if (validate.single(this.refs.dob.value, dob) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.dob, ["Please select a gender"]);
            if (isSubmit) {
                this.refs.dob.focus();
                isSubmit = false;
            }
        }

        if (!this.state.BloodGroup || !this.state.BloodGroup.value) {
            success = false;
            showErrorsForInput(this.refs.bloodgroup.wrapper, ["Please select blood group"])
            if (isSubmit) {
                this.refs.bloodgroup.focus();
                isSubmit = false;
            }
        }

        var aadhar = {
            // presence: true,
            format: {
                pattern: /[0-9]{12}?|^$\s*$/,
                message: "is not valid"
            }
        }

        if (validate.single(this.refs.aadhar.value, aadhar) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.aadhar, ["Enter valid aadhar number"]);

            if (isSubmit) {
                this.refs.aadhar.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.aadhar, []);
        }


        var pan =
        {
            //  presence: true,
            format: {
                pattern: /[A-Z]{5}[0-9]{4}[A-Z]{1}|^$\s*$/,
                message: "is not valid"
            }
        }


        if (validate.single(this.refs.panNum.value, pan) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.panNum, ["Enter valid PAN number"]);

            if (isSubmit) {
                this.refs.panNum.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.panNum, []);
        }


        if (!this.state.Organisation || !this.state.Organisation.value) {
            success = false;
            showErrorsForInput(this.refs.organisation.wrapper, ["Please select Organisation"]);
            if (isSubmit) {
                this.refs.organisation.focus();
                isSubmit = false;
            }
        }

        if (!this.state.Shift || !this.state.Shift.value) {
            success = false;
            showErrorsForInput(this.refs.shifttime.wrapper, ["Select shift timings"]);
            if (isSubmit) {
                isSubmit = false;
                this.refs.shifttime.focus();
            }
        }

        if (validate.single(this.refs.addressLine1.value, { presence: true }) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.addressLine1, ["Addressline 1 should not be empty"])
            if (isSubmit) {
                this.refs.addressLine1.focus();
                isSubmit = false;
            }
        }

        else {
            showErrorsForInput(this.refs.addressLine1, []);
        }


        if (!this.state.Country || !this.state.Country.value) {
            success = false;
            showErrorsForInput(this.refs.country.wrapper, ["Please select a country"]);
            if (isSubmit) {
                this.refs.country.focus();
                isSubmit = false;
            }
        }
        if (!this.state.State || !this.state.State.value) {
            success = false;
            showErrorsForInput(this.refs.state.wrapper, ["Please select a valid state"]);
            if (isSubmit) {
                this.refs.state.focus();
                isSubmit = false;
            }
        }
        if (!this.state.City || !this.state.City.value) {
            success = false;
            showErrorsForInput(this.refs.city.wrapper, ["Please select a valid city"]);
            if (isSubmit) {
                this.refs.city.focus();
                isSubmit = false;
            }
        }

        var ZIPConstraints = {
            presence: true,
            length:
            {
                maximum: 10,
                tooLong: "is too long"
            }
        }

        if (validate.single(this.refs.zip.value, ZIPConstraints) !== undefined) {
            success = false;
            if (this.refs.zip.value.length > 10) {
                showErrorsForInput(this.refs.zip, ["Enter valid ZIP"])
            }
            else {
                showErrorsForInput(this.refs.zip, ["ZIP should not be empty"])
            }

            if (isSubmit) {
                this.refs.zip.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.zip, [])
        }

        var doj = {
            presence: true
        }

        if (validate.single(this.refs.doj.value, doj) !== undefined) {
            showErrorsForInput(this.refs.doj, ["Please select Joining date"]);
            if (isSubmit) {
                this.refs.doj.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.doj, []);
        }


        if (!this.state.EmpType || !this.state.EmpType.value) {
            success = false;
            showErrorsForInput(this.refs.EmpType.wrapper, ["Please select employment type"])
            if (isSubmit) {
                this.refs.EmpType.focus();
                isSubmit = false;
            }
        }

        if (!this.state.Designation || !this.state.Designation.value) {
            success = false;
            showErrorsForInput(this.refs.designation.wrapper, ["Please select designation"]);
            if (isSubmit) {
                this.refs.designation.focus();
                isSubmit = false;
            }
        }


        if (!this.state.Department || !this.state.Department.value) {
            success = false;
            showErrorsForInput(this.refs.department.wrapper, ["Please select department"]);
            if (isSubmit) {
                this.refs.department.focus();
                isSubmit = false;
            }
        }

        if (!this.state.Role || !this.state.Role.value) {
            success = false;
            showErrorsForInput(this.refs.role.wrapper, ["Please select role"]);
            if (isSubmit) {
                this.refs.role.focus();
                isSubmit = false;
            }
        }

        return success;
    }
}

export default EmployeeRegistration;

   // if (!this.state.Organisation || !this.state.Organisation.value) {
        //     success = false;
        //     showErrorsForInput(this.refs.organisation.wrapper, ["Please select Organisation"]);
        //     // if (isSubmit) {
        //     //     this.refs.organisation.focus();
        //     //     isSubmit = false;
        //     // }
        // }

        // if (!this.state.Gender || !this.state.Gender.value) {
        //     success = false;
        //     showErrorsForInput(this.refs.gender.wrapper, ["Please select a gender"]);

        // }
        // if (!this.state.Country || !this.state.Country.value) {
        //     success = false;
        //     showErrorsForInput(this.refs.country.wrapper, ["Please select a country"]);
        // }
        // if (!this.state.State || !this.state.State.value) {
        //     success = false;
        //     showErrorsForInput(this.refs.state.wrapper, ["Please select a valid state"]);
        // }
        // if (!this.state.City || !this.state.City.value) {
        //     success = false;
        //     showErrorsForInput(this.refs.city.wrapper, ["Please select a valid city"]);
        // }
        // if (!this.state.Department || !this.state.Department.value) {
        //     success = false;
        //     showErrorsForInput(this.refs.department.wrapper, ["Please select department"]);
        // }
        // if (!this.state.Designation || !this.state.Designation.value) {
        //     success = false;
        //     showErrorsForInput(this.refs.designation.wrapper, ["Please select designation"]);
        // }
        // if (!this.state.Role || !this.state.Role.value) {
        //     success = false;
        //     showErrorsForInput(this.refs.role.wrapper, ["Please select role"]);
        // }
        // if (!this.state.EmpType || !this.state.EmpType.value) {
        //     success = false;
        //     showErrorsForInput(this.refs.EmpType.wrapper, ["Please select employment type"])
        // }
        // if (!this.state.BloodGroup || !this.state.BloodGroup.value) {
        //     success = false;
        //     showErrorsForInput(this.refs.bloodgroup.wrapper, ["Please select blood group"])
    // }