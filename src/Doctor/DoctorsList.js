import React, { Component } from 'react';
import $ from 'jquery';
import './Doctors.css';
import { ApiUrl } from '../Config';
import Select from 'react-select';

var moment = require('moment');
var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

function trClassFormat(row, rowIdx) {
    return "pointer";
}


class DoctorsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1, sizePerPage: 10, dataTotalSize: 0, searchClick: false,
            DoctorsList: [], authId: '', Client: '', Name: '', Email: '',
            PhoneNumber: '', JobLevel: "", VoiceGrade: '', sortCol: 'Name',
            sortDir: 'asc', IsDataAvailable: false
        }
    }

    componentWillMount() {
        this.getDoctorsList(this.state.currentPage, this.state.sizePerPage);
    }


    getDoctorsList(page, count) {
        this.setState({ IsDataAvailable: false });
        var url = ApiUrl + "/api/Doctors/GetDoctorsList?authId=" + this.state.authId +
            "&name=" + this.state.Name +
            "&client=" + this.state.Client +
            "&email=" + this.state.Email +
            "&phoneNum=" + this.state.PhoneNumber +
            "&jobLevel=" + this.state.JobLevel +
            "&voiceGrade=" + this.state.VoiceGrade +
            "&page=" + page +
            "&count=" + count +
            "&sortCol=" + this.state.sortCol +
            "&sortDir=" + this.state.sortDir;

        $.ajax({
            url: url,
            type: "get",
            success: (data) => {
                this.setState({
                    DoctorsList: data["DoctorsList"], dataTotalSize: data["totalCount"],
                    IsDataAvailable: true, currentPage: page, sizePerPage: count
                })
            }
        })
    }

    render() {
        return (
            <div className="container" style={{ marginTop: '0%' }}>

                <div className="col-md-12">
                    <h3 className="col-md-10 formheader" style={{ paddingLeft: '10px' }}> Doctors </h3>
                    <div className="col-md-2 mybutton">
                        <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => this.setState({ searchClick: !this.state.searchClick })} >
                            <span className="glyphicon glyphicon-chevron-down"></span>
                        </button>
                        <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => this.props.history.push("/Doctor")} >
                            <span className="glyphicon glyphicon-plus"></span>
                        </button>

                    </div>
                </div>

                {
                    this.state.searchClick ?
                        <form style={{ paddingLeft: '14px' }}>
                            <div className="col-xs-12 clientSearch">
                                <div className="col-md-2 form-group">
                                    <input className="col-md-3 form-control" type="text" name="Name" placeholder="Name" autoComplete="off" ref="name" onChange={this.SearchClick.bind(this)} />
                                </div>

                                <div className="col-md-2 form-group">
                                    <input className="col-md-3 form-control" type="text" name="Client" placeholder="Client Name" autoComplete="off" ref="clientName" onChange={this.SearchClick.bind(this)} />
                                </div>

                                <div className="col-md-2 form-group">
                                    <input className="col-md-3 form-control" type="text" name="Email" placeholder="Email" autoComplete="off" ref="email" onChange={this.SearchClick.bind(this)} />
                                </div>

                                <div className="col-md-2 form-group">
                                    <input className="col-md-3 form-control" type="text" name="PhoneNum" placeholder="Phone Number" autoComplete="off" ref="phoneNum" onChange={this.SearchClick.bind(this)} />
                                </div>

                                <div className="col-md-2 form-group">
                                    {/* <input className="col-md-2 form-control" type="text" name="joblevel" placeholder="Job Level" autoComplete="off" ref="jobLevel" onChange={this.SearchClick.bind(this)} />  */}
                                    <Select className="col-md-2 form-control" value={this.state.JobLevel} placeholder="Job Level"
                                        options={[{ value: 'L1', label: 'L1' }, { value: 'L1-L3', label: 'L1-L3' }, { value: 'L1-L2-L3', label: 'L1-L2-L3' }]} onChange={this.jobLevelChanged.bind(this)} />
                                </div>

                                <div className="col-md-1 form-group">
                                    <input className="col-md-1 form-control" type="text" name="clientType" placeholder="Voice Grade" autoComplete="off" ref="voiceGrade" onChange={this.SearchClick.bind(this)} />
                                    {/* <Select className="col-md-2 form-control" value={this.state.voiceGrade}
                                    options={[{ value: 'A', label: 'A' }, { value: 'B', label: 'B' }, { value: 'C', label: 'C' }, { value: 'D', label: 'D' }]} onChange={this.voiceGradeChanged.bind(this)} /> */}
                                </div>
                                <div className="col-md-1">
                                    <input type="button" className="btn btn-default" value="Clear" onClick={this.clear.bind(this)} />
                                </div>
                            </div>

                        </form>
                        :
                        <div />
                }

                {
                    this.state.IsDataAvailable ?
                        <div className="col-xs-12" style={{ marginTop: '1%' }}>
                            <BootstrapTable striped hover remote={true} pagination={true}
                                data={this.state.DoctorsList} trClassName={trClassFormat}
                                fetchInfo={{ dataTotalSize: this.state.dataTotalSize }}
                                options={{
                                    sizePerPage: this.state.sizePerPage,
                                    onPageChange: this.onPageChange.bind(this),
                                    sizePerPageList: [{ text: '10', value: 10 },
                                    { text: '25', value: 25 },
                                    { text: 'ALL', value: this.state.dataTotalSize }],
                                    page: this.state.currentPage,
                                    onSizePerPageList: this.onSizePerPageList.bind(this),
                                    paginationPosition: 'bottom',
                                    onSortChange: this.onSortChange.bind(this),
                                    onRowClick: this.rowClicked.bind(this)
                                }}
                            >
                                <TableHeaderColumn dataField="IdigitalAuthorId" isKey={true} dataAlign="left" dataSort={true} width="14" > Auth Id</TableHeaderColumn>
                                <TableHeaderColumn dataField="Name" dataAlign="left" dataSort={true} width="35" >Name</TableHeaderColumn>
                                <TableHeaderColumn dataField="Client" dataAlign="left" dataSort={true} width="35" >Client</TableHeaderColumn>
                                <TableHeaderColumn dataField="Email" dataAlign="left" dataSort={true} width="37" >Email </TableHeaderColumn>
                                <TableHeaderColumn dataField="PrimaryPhone" dataAlign="left" dataSort={true} width="19" >Phone</TableHeaderColumn>
                                <TableHeaderColumn dataField="JobLevel" dataAlign="left" dataSort={true} width="15" >Job Level</TableHeaderColumn>
                                <TableHeaderColumn dataField="VoiceGrade" dataAlign="center" dataSort={true} width="12" >Voice Grade</TableHeaderColumn>
                                <TableHeaderColumn columnClassName="edit" dataField="Edit" dataAlign="center" width="18" dataFormat={this.editDataFormatter.bind(this)} ></TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                        :
                        < div className="loader visible" style={{ marginTop: '5%' }}  ></div >
                }

            </div>
        )
    }

    rowClicked(row) {
        this.props.history.push("/Doctor/" + row["Id"]);
    }

    jobLevelChanged(val) {
        this.setState({ JobLevel: val || '' }, () => {
            this.SearchClick();
        });
    }

    // voiceGradeChanged(val) {
    //     this.setState({ voiceGrade: val }, () => {
    //         this.SearchClick();
    //     })
    // }

    clear() {
        this.refs.name.value = "";
        this.refs.clientName.value = "";
        this.refs.email.value = "";
        this.refs.phoneNum.value = "";
        this.state.JobLevel = "";
        this.refs.voiceGrade.value = "";

        this.setState({
            Name: this.refs.name.value,
            Client: this.refs.clientName.value,
            Email: this.refs.email.value,
            PhoneNumber: this.refs.phoneNum.value,
            JobLevel: this.state.JobLevel,
            VoiceGrade: this.refs.voiceGrade.value
        }, () => {
            this.getDoctorsList(this.state.currentPage, this.state.sizePerPage);
        })

    }

    SearchClick() {
        this.setState({
            Name: this.refs.name.value,
            Client: this.refs.clientName.value,
            Email: this.refs.email.value,
            PhoneNumber: this.refs.phoneNum.value,
            JobLevel: this.state.JobLevel.value,
            VoiceGrade: this.refs.voiceGrade.value
        }, () => {
            if (this.state.JobLevel != undefined) {
                this.getDoctorsList(this.state.currentPage, this.state.sizePerPage);
            }
            else {
                this.state.JobLevel = "";
                this.getDoctorsList(this.state.currentPage, this.state.sizePerPage);
            }

        })
    }

    editDataFormatter(cell, row) {
        return (
            <a>
                <i className='glyphicon glyphicon-edit' style={{ fontSize: '18px', cursor: 'pointer' }} onClick={() => this.props.history.push("/Doctor/" + row["Id"])} ></i>
            </a>
        )
    }

    onSortChange(sortCol, sortDir) {
        sortDir = this.state.sortCol === sortCol && this.state.sortDir === "asc" ? "desc" : "asc";
        this.setState({
            sortCol: sortCol,
            sortDir: sortDir
        }, () => {
            this.getDoctorsList(this.state.currentPage, this.state.sizePerPage);
        });
    }

    onPageChange(page, sizePerPage) {
        this.getDoctorsList(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.getDoctorsList(this.state.currentPage, sizePerPage);
    }
}

export default DoctorsList;