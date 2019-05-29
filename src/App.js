import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Link } from 'react-router-dom';


class App extends Component {

    constructor(props) {
        super(props);
        var isLoggedIn = sessionStorage.getItem("access_token") != null;
        window.isLoggedIn = isLoggedIn;
    }

    logoutClick(e) {
        e.preventDefault();
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("roles");
        window.isLoggedIn = false;
        window.open("/#/userLogin", "_self")
    }

    moveToTMSClick(e) {
        e.preventDefault();
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("roles");
        window.isLoggedIn = false;
        window.open("http://maxtms.azurewebsites.net/#/", "_self");
    }


    render() {
        var roles = sessionStorage.getItem("roles");
        return (
            <div >
                {
                    window.isLoggedIn && roles.indexOf("Manager") != -1 || window.isLoggedIn && roles.indexOf("Coordinator") != -1 || window.isLoggedIn && roles.indexOf("Admin") != -1 || window.isLoggedIn && roles.indexOf("SuperAdmin") != -1 ?

                        <nav className="navbar navbar-default">
                            <div className="container-fluid">
                                <div className="navbar-header header headerimage">
                                    <img className="headerimage" src="Images/logo.png" alt="" />
                                </div>
                                <div className="navbar-header">
                                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                    </button>
                                </div>
                                <div className="collapse navbar-collapse" id="myNavbar">

                                    <ul className="nav navbar-nav navbar-right navbar-menu" >

                                        {
                                            window.isLoggedIn && roles.indexOf("Admin") != -1 || window.isLoggedIn && roles.indexOf("SuperAdmin") != -1 ?
                                                <li className="dropdown">
                                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false" onClick={this.moveToTMSClick.bind(this)}> Move To TMS </a>
                                                </li>
                                                :
                                                ""

                                        }

                                        {
                                            window.isLoggedIn && sessionStorage.getItem("OrgId") === "1" ?

                                                <li className="dropdown" >
                                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Items <span className="caret"> </span> </a>
                                                    <ul className="dropdown-menu">
                                                        <li> <Link to="../StockReport"> Stock Report</Link> </li>
                                                        <li> <Link to="../DispatchedStock"> Dispatched Stock </Link> </li>
                                                        <li>  <Link to="../BillsList"> Bills </Link> </li>
                                                    </ul>
                                                </li>
                                                :
                                                ""
                                        }

                                        <li className="dropdown">
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Clients <span className="caret"> </span> </a>
                                            <ul className="dropdown-menu">
                                                <li> <Link to="../ClientsList"> Clients </Link> </li>
                                                <li><Link to="../ClientEmployeesList"> Client Contacts </Link> </li>
                                                 

                                                {
                                                    window.isLoggedIn && sessionStorage.getItem("OrgId") === "1" ?
                                                        <li>
                                                            <Link to ='../ClientInShort' >Client In Short</Link>
                                                            <Link to="../DoctorsList"> Doctor </Link>
                                                            <Link to="../DoctorGroups">Doctor Groups </Link>
                                                        </li>
                                                        :
                                                        <li />
                                                }

                                            </ul>
                                        </li>
 
                                        <li className="dropdown">
                                            <Link className="dropdown-toggle" to="../DefaultAllocationsList"> Default Allocations  </Link>
                                        </li>

                                        <li className="dropdown">
                                            <Link className="dropdown-toggle" to="../EmployeesList"> Employees  </Link>
                                        </li>

                                        {
                                            window.isLoggedIn && roles.indexOf("Admin") != -1 || window.isLoggedIn && roles.indexOf("SuperAdmin") != -1 ?

                                                <li className="dropdown">
                                                    <Link className="dropdown-toggle" to="../OrganisationsList"> Organisations  </Link>
                                                </li>

                                                :
                                                <li>
                                                </li>
                                            // <ul className="nav navbar-nav navbar-right">
                                            // </ul>
                                        }

                                        <li className="dropdown">
                                            <Link to="../OpportunitiesList"> Opportunity </Link>
                                        </li>

                                        <li className="dropdown pointer">
                                            <ul className="dropdown-menu">
                                                {
                                                    window.isLoggedIn && roles.indexOf("Admin") != -1 || window.isLoggedIn && roles.indexOf("SuperAdmin") != -1 ?
                                                        <ul className="nav navbar-nav navbar-right">
                                                            <li className="dropdown">
                                                                <Link className="dropdown-toggle" to="../OrganisationsList"> Organisations  </Link>
                                                            </li>
                                                        </ul>
                                                        :
                                                        <ul className="nav navbar-nav navbar-right">
                                                        </ul>
                                                }

                                            </ul>
                                        </li>

                                        <li className="dropdown">
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">{"Hi " + sessionStorage.getItem("displayName")}</a>
                                            <ul className="dropdown-menu">
                                                <li> <Link to="/ChangePassword" > Change Password </Link> </li>
                                                <li><a onClick={this.logoutClick.bind(this)}>Logout</a></li>
                                            </ul>
                                        </li>
                                    </ul>

                                </div>
                            </div>
                        </nav>

                        :

                        <div />
                }
                {this.props.children}
            </div>
        );
    }
}

export default App;


{/* <div className="my-nav-bar" style={{ zIndex: '1000' }}>
    <div className="container-fluid">
        <div className="navbar-header header headerimage">
            <img className="headerimage" src="Images/logo.png" alt="" />
        </div>
        <div id="navbar2" className="navbar-collapse collapse">
            <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">{"Hi " + sessionStorage.getItem("displayName")}</a>
                    <ul className="dropdown-menu">
                        <li> <Link to="/ChangePassword" > Change Password </Link> </li>
                        <li><a onClick={this.logoutClick.bind(this)}>Logout</a></li>
                    </ul>
                </li>
            </ul>

            {
                window.isLoggedIn && roles.indexOf("Admin") != -1 || window.isLoggedIn && roles.indexOf("SuperAdmin") != -1 ?
                    <ul className="nav navbar-nav navbar-right">
                        <li className="dropdown">
                            <Link className="dropdown-toggle" to="../OrganisationsList"> Organisations  </Link>
                        </li>
                    </ul>
                    :
                    <ul className="nav navbar-nav navbar-right">
                    </ul>
            }


            <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                    <Link to="../OpportunitiesList"> Opportunity </Link>
                </li>
            </ul>


            <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                    <Link className="dropdown-toggle" to="../EmployeesList"> Employees  </Link>
                </li>
            </ul>

            <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Clients</a>
                    <ul className="dropdown-menu">
                        <li> <Link to="../ClientsList"> Clients </Link> </li>
                        <li><Link to="../ClientEmployeesList"> Client Contacts </Link> </li>

                        {
                            window.isLoggedIn && sessionStorage.getItem("OrgId") === "1" ?
                                <li>
                                    <Link to="../DoctorsList" > Doctor </Link>
                                    <Link to="../DoctorGroups">Doctor Groups </Link>
                                </li>
                                :
                                <li />
                        }

                    </ul>
                </li>
            </ul>

            <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                    <Link className="dropdown-toggle" to="../DefaultAllocationsList"> Default Allocations  </Link>
                </li>
            </ul>

            <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" onClick={this.moveToTMSClick.bind(this)} aria-expanded="false">Move To TMS</a>
                </li>
            </ul>

        </div>
    </div>
</div> */}