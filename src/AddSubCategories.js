import React, { Component } from 'react';
import toast from 'react-toastify';
import $ from 'jquery';
import Select from 'react-select';
import { ApiUrl } from './Config';


class AddSubCategories extends Compoent {

    constructor(props) {
        super(props);
        this.state = {
            Departments: [], Categories: [], SubCategories: [], Department: null, SubCategory: null,
            Category: null
        }
    }

    componentWillMount() {

        $.ajax({
            url: ApiUrl + "/api/MasterData/GetDepartments",
            type: "get",
            success: (data) => { this.setState({ Departments: data["departments"] }) }
        })
    }

    render() {
        return (
            <div>
                <div className="col-xs-12">

                    <div className="col-xs-3">
                    <label> Category </label>
                    <div className="input-group">
                    
                        </div>
                        <Select className="form-control" value={this.state.Category}
                            option={this.state.Categories} onChange={this.CategoryChanged.bind(this)} />
                    </div>

                </div>

            </div>
        )
    }

    CategoryChanged(val) {
        if (val) {
            this.setState({ Category: val });
        }
        else {
            this.setState({ Category: '' })
        }
    }



}

