import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Login from './Login/Login';
import ChangePassword from './ChangePassword/ChangePassword';
import './Login/Login.css';
import 'bootstrap/dist/css/bootstrap.css';
import EmployeeRegistration from './Employee/EmployeeRegistration';
import Employee from './Employee/EmployeeDashboard';
import ClientEmpRegistration from './ClientEmpRegistration/ClientEmpRegistration';
import ClientRegistration from './Client/ClientRegistration';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import ResetPassword from './ResetPassword/ResetPassword';
import ClientEmployeesList from './ClientEmpRegistration/ClientEmployeesList';
import EmployeesList from './Employee/EmployeesList';
import ClientsList from './Client/ClientsList';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { Router, Route, IndexRoute } from 'react-router';
import { HashRouter } from 'react-router-dom';
import 'react-select/dist/react-select.css';
import EmployeePayScale from './Employee/EmployeePayScale';
import EmployeeDocuments from './Employee/EmployeeDocuments';
import EditClientEmployee from './ClientEmpRegistration/EditClientEmployee';
import Doctor from './Doctor/Doctor';
import DoctorsList from './Doctor/DoctorsList';
import DoctorGroups from './Doctor/DoctorGroups';
import DefaultAllocationsList from './Allocations/DefaultAllocationsList';
import DefaultAllocations from './Allocations/DefaultAllocations';
import Organisation from './Organisation/Organisation';
import OrganisationsList from './Organisation/OrganisationsList';
import Bill from './Bill/Bill';
import 'bootstrap-fileinput/js/plugins/piexif.min.js';
import 'bootstrap-fileinput/js/plugins/purify.min.js';
import 'bootstrap-fileinput/js/fileinput.js';
import 'froala-editor/js/froala_editor.pkgd.min.js';

import Opportunity from './Opportunity/Opportunity';
import Estimate from './Estimate/Estimate';
import SalesOrder from './SalesOrder/SalesOrder';
import PurchaseOrder from './PurchaseOrder/PurchaseOrder';
import OpportunitiesList from './Opportunity/OpportunitiesList';
import EditOpportunity from './Opportunity/EditOpportunity';
import Model from './Stock/Model';
import StockReport from './Stock/StockReport';
import Item from './Bill/Item';
import BillsList from './Bill/BillsList';
import Items from './Stock/Items';
import DispatchReport from './Stock/DispatchReport';
import ClientInShort from './Client/ClientInShort';

window.jQuery = window.$ = require("jquery");
var bootstrap = require('bootstrap');

window.isLoggedIn = sessionStorage.getItem("access_token") !== null;

ReactDOM.render((
    <HashRouter>
        <div>
            <ToastContainer autoClose={3000} position="top-center" />
            <App>
                <Route exact path="/" component={Login} />
                <Route exact path="/userLogin" component={Login} />
                <Route path='/Login' component={Login} />
                <Route exact path="/ForgotPassword" component={ForgotPassword} />
                <Route exact path="/ChangePassword" render={(nextState) => requireAuth(nextState, <ChangePassword location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/reset-password/:userId/:code" component={ResetPassword} />
                <Route exact path="/Employee" render={(nextState) => requireAuth(nextState, <Employee location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/ClientEmpRegistration/:addContact?" render={(nextState) => requireAuth(nextState, <ClientEmpRegistration location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/ClientRegistration/:id?" render={(nextState) => requireAuth(nextState, <ClientRegistration location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/EmployeeRegistration/:id?" render={(nextState) => requireAuth(nextState, <EmployeeRegistration location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/EmployeePayScale/:id" render={(nextState) => requireAuth(nextState, <EmployeePayScale location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/EmployeeDocuments/:id" render={(nextState) => requireAuth(nextState, <EmployeeDocuments location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/Doctor/:id?" render={(nextState) => requireAuth(nextState, <Doctor location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/ClientEmployeesList/:id?" render={(nextState) => requireAuth(nextState, <ClientEmployeesList location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/EmployeesList" render={(nextState) => requireAuth(nextState, <EmployeesList location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/ClientsList" render={(nextState) => requireAuth(nextState, <ClientsList location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/EditClientEmployee/:id" render={(nextState) => requireAuth(nextState, <EditClientEmployee location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/DoctorsList" render={(nextState) => requireAuth(nextState, <DoctorsList location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/DoctorGroups" render={(nextState) => requireAuth(nextState, <DoctorGroups location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route excat path="/DefaultAllocationsList" render={(nextState) => requireAuth(nextState, <DefaultAllocationsList location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/DefaultAllocations/:id?" render={(nextState) => requireAuth(nextState, <DefaultAllocations location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/Organisation/:id?" render={(nextState) => requireAuth(nextState, <Organisation location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/OrganisationsList" render={(nextState) => requireAuth(nextState, <OrganisationsList location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/Opportunity/:id?" render={(nextState) => requireAuth(nextState, <Opportunity location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/EditOpportunity/:id" render={(nextState) => requireAuth(nextState, <EditOpportunity location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/Estimate" render={(nextState) => requireAuth(nextState, <Estimate location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/SalesOrder" render={(nextState) => requireAuth(nextState, <SalesOrder location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/PurchaseOrder" render={(nextState) => requireAuth(nextState, <PurchaseOrder location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/OpportunitiesList" render={(nextState) => requireAuth(nextState, <OpportunitiesList location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/Model/:id?" render={(nextState) => requireAuth(nextState, <Model location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/StockReport" render={(nextState) => requireAuth(nextState, <StockReport location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/Item/:id/:modelNumber" render={(nextState) => requireAuth(nextState, <Item location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/Bill/:id?" render={(nextState) => requireAuth(nextState, <Bill location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route excat path="/BillsList" render={(nextState) => requireAuth(nextState, <BillsList location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/Items/:id" render={(nextState) => requireAuth(nextState, <Items location={nextState.location} match={nextState.match} history={nextState.history} />)} />
                <Route exact path="/DispatchedStock" render={(nextState) => requireAuth(nextState, <DispatchReport location={nextState.location} match={nextState.match} history={nextState.history} />)} />
                <Route exact path='/ClientInShort' render={(nextState) => requireAuth(nextState, <ClientInShort location={nextState.location} match={nextState.match} history={nextState.history} />)} />
            </App>
        </div>
    </HashRouter>
),
    document.getElementById('root')
);


function requireAuth(nextState, component) {
    var isLoggedIn = sessionStorage.getItem("access_token") != null;
    if (!isLoggedIn) {
        nextState.history.push("/Login");
        return null;
    }
    else {
        return component;
    }
}