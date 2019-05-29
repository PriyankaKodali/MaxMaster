import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import $ from 'jquery';
import './EmployeeRegistration.css';
// import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';

var moment = require('moment');
var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

class Employee extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1, sizePerPage: 25, dataTotalSize: 0
        }
    }

    render() {
        return (
            <div className="EmpBootstrap">
                <BootstrapTable striped hover remote={true} pagination={true}
                    fetchInfo={{ dataTotalSize: this.state.dataTotalSize }}
                    options={{
                        sizePerPage: this.state.sizePerPage,
                        onPageChange: this.onPageChange.bind(this),
                        sizePerPageList: [{ text: '10', value: 10 },
                        { text: '25', value: 25 },
                        { text: 'ALL', value: this.state.dataTotalSize }],
                        page: this.state.currentPage,
                        onSizePerPageList: this.onSizePerPageList.bind(this),
                        paginationPosition: 'bottom'
                    }}
                >
                    <TableHeaderColumn dataField="JobDate" isKey={true} dataAlign="left" dataSort={true} width="20" > Date </TableHeaderColumn>
                    <TableHeaderColumn dataField="" dataAlign="left" dataSort={true} width="30" > Job Number </TableHeaderColumn>
                    <TableHeaderColumn dataField="" dataAlign="left" dataSort={true} width="30" > Client </TableHeaderColumn>
                    <TableHeaderColumn dataField="" dataAlign="left" dataSort={true} width="30" > Job Level </TableHeaderColumn>
                    <TableHeaderColumn dataField="" dataAlign="left" dataSort={true} width="30" > Job type </TableHeaderColumn>
                    <TableHeaderColumn dataField="" dataAlign="left" dataSort={true} width="30" > MRA </TableHeaderColumn>
                    <TableHeaderColumn dataField="" dataAlign="left" dataSort={true} width="30" > AQA </TableHeaderColumn>
                    <TableHeaderColumn dataField="" dataAlign="left" dataSort={true} width="30" > QA </TableHeaderColumn>
                    <TableHeaderColumn dataField="" dataAlign="left" dataSort={true} width="30" > TAT </TableHeaderColumn>
                    <TableHeaderColumn columnClassName="download" dataField='Upload' dataFormat={this.uploadFormatter.bind(this)} width='18'></TableHeaderColumn>
                    <TableHeaderColumn dataField="" dataAlign="left" dataSort={true} width="30" headerText='Download Time' > DT </TableHeaderColumn>
                    <TableHeaderColumn dataField="" dataAlign="left" dataSort={true} width="30" headerText='Uplaod' >  UT </TableHeaderColumn>
                    <TableHeaderColumn dataField="" dataAlign="left" dataSort={true} width="30" headerText='Number of pages'> No.of pages </TableHeaderColumn>
                  
                </BootstrapTable>
            </div>
        )
    }

    uploadFormatter(cell, row) {
          return (
            <a data-toggle="tooltip" className="tooltipLink" title="Upload" data-original-title="">
                <i className='glyphicon glyphicon-cloud-upload' headerText='Upload' style={{ cursor: 'pointer', fontSize: '17px' }}  ></i>
            </a>
        )
    }

    onPageChange(page, sizePerPage) {
    }

    onSizePerPageList(sizePerPage) {
    }

}

export default Employee;