import React, { Component } from "react";
import $ from "jquery";
import Select from "react-select";
import { ApiUrl } from "../Config.js";
import { showErrorsForInput, setUnTouched } from "../Validation.js";
import validate from "validate.js";
import { toast } from "react-toastify";
import { MyAjaxForAttachments } from "../MyAjax.js";
import "./Bill.css";

var moment = require("moment");

class Items extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ItemDetails: this.props.ItemDetails,
      ItemsList: [],
      ModelDetails: this.props.ModelDetails,
      ItemRefs: this.props.ItemRefs,
      ModelInfo: this.props.ModelInfo,
      StockLocation: null,
      WarrentyDuration: null,
      StockInDate: moment().format("YYYY-MM-DD"),
      CostPrice: this.props.ModelDetails.ItemRate,
      SellingPrice: this.props.ModelInfo.SP,
      MRP: this.props.ModelInfo.MRP,
      MinSP: this.props.ModelInfo.MinSP,
      HardwareVersion: this.props.ModelInfo.HardwareVersion,
      BatchNumber: this.props.ModelInfo.BatchNo,
      Supplier: this.props.ModelDetails.Supplier,
      SerialNumberExists: this.props.ModelDetails.SerialNumExists
    };
  }

  componentWillMount() {
    $.ajax({
      url:
        ApiUrl +
        "/api/MasterData/GetOrganisationLocations?orgId=" +
        sessionStorage.getItem("OrgId"),
      type: "get",
      success: data => {
        this.setState({ StockLocations: data["orgLocations"] });
      }
    });

    if (this.props.ModelInfo != null) {
      if (this.props.ModelInfo.Warrenty != null) {
        this.setState({
          WarrentyDuration: {
            value: this.props.ModelInfo["WarrentyPeriod"],
            label: this.props.ModelInfo["WarrentyPeriod"]
          },
          Warrenty: this.props.ModelInfo["Warrenty"]
        });
      }
      this.setState({
        StockLocation: {
          value: this.props.ModelInfo["StockLocation"],
          label: this.props.ModelInfo["Location"]
        }
      });
    }

    $("#myItemModel").modal("show");

    $(".loaderActivity").hide();
    $("button[name='saveitems']").show();
  }

  componentDidMount() {
    setUnTouched(document);

    if (this.state.ModelDetails.Quantity != "") {
      $("#myItemModel").modal("show");
    } else {
      $("#myItemModel").modal("hide");
    }
  }

  componentWillReceiveProps(nextProps) {
    setUnTouched(document);

    if (
      nextProps.AddItemInformation == true &&
      nextProps.ModelDetails.Quantity !== ""
    ) {
      this.setState(
        {
          ItemDetails: nextProps.ItemDetails,
          ItemsList: nextProps.ItemsList,
          ModelDetails: nextProps.ModelDetails,
          ModelInfo: nextProps.ModelInfo,
          CostPrice: nextProps.ModelDetails.ItemRate,
          MRP: nextProps.ModelInfo.MRP,
          SellingPrice: nextProps.ModelInfo.SP,
          MinSP: nextProps.ModelInfo.MinSP,
          HardwareVersion: nextProps.ModelInfo.HardwareVersion,
          BatchNumber: nextProps.ModelInfo.BatchNo,
          Supplier: this.props.ModelDetails.Supplier
        },
        () => {
          if (nextProps.ModelInfo.StockLocation !== 0) {
            this.setState({
              StockLocation: {
                value: nextProps.ModelInfo.StockLocation,
                label: nextProps.ModelInfo.Location
              },
              StockInDate: moment(nextProps.ModelInfo.StockInDate).format(
                "MM-DD-YYYY"
              )
            });
          } else {
            this.setState({ StockLocation: null });
          }
          if (nextProps.ModelInfo.Warrenty !== null) {
            this.setState({
              WarrentyDuration: {
                label: nextProps.ModelInfo.WarrentyPeriod,
                value: nextProps.ModelInfo.WarrentyPeriod
              },
              Warrenty: nextProps.ModelInfo.Warrenty
            });
          } else {
            this.setState({ WarrentyDuration: null, Warrenty: null });
          }



          console.log(this.state.ModelInfo);
        }
      );
      $("#myItemModel").modal("show");
    } else {
      $("#myItemModel").modal("hide");
    }

    $(".loaderActivity").hide();
    $("button[name='saveitems']").show();
  }

  render() {
    return (
      <div
        className="modal fade"
        show={true}
        id="myItemModel"
        role="dialog"
        data-keyboard="false"
        data-backdrop="static"
        key={this.state.ModelDetails}
      >
        <div className="modal-dialog modal-lg" style={{ width: "95%" }}>
          <div className="modal-content">
            <div className="modal-header" style={{ background: "#f5f3f3", borderBottom: "0px solid" }} >
              <button type="button" className="modelClose btnClose" data-dismiss="modal" id="closeModal"  > &times;  </button>
              <h5 className="modal-title" style={{ paddingLeft: "10px", paddingTop: "10px" }} key={this.props.ModelDetails}  >
                <label> Model Number :</label> {this.props.ModelDetails.Model}
                <label style={{ paddingLeft: "15px" }}> UPC : </label>
                {this.props.ModelDetails.UPC}
                <label style={{ paddingLeft: "15px" }}>Total Items :</label>
                {this.props.ModelDetails.Quantity}
              </h5>
            </div>
            <div>
              <div  className="modal-body col-xs-12" style={{ width: "100%", alignContent: "center" }} key={this.state.ModelInfo} >
                <form onSubmit={this.handleSaveItem.bind(this)} onChange={this.validateItem.bind(this)} key={this.state.ModelInfo}  >
                  <div className="col-xs-12">
                    <div className="col-md-2">
                      <div className="form-group" key={this.state.BatchNumber}>
                        <label> Batch Number</label>
                        <div className="input-group">
                          <span className="input-group-addon" />
                          <input  className="form-control" type="text" name="batchNo" ref="batchNo" placeholder="Batch Number" autoComplete="off"  defaultValue={this.state.BatchNumber}  />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="form-group" key={this.state.HardwareVersion}  >
                        <label> Hardware Version</label>
                        <div className="input-group">
                          <span className="input-group-addon" />
                          <input className="form-control" type="text" name="hardwareVersion" ref="hardwareVersion" placeholder="Hardware Version" autoComplete="off" defaultValue={this.state.HardwareVersion} />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-2" key={this.state.CostPrice}>
                      <div className="form-group">
                        <label> Cost Price</label>
                        <div className="input-group">
                          <span className="input-group-addon" />
                          <input  className="form-control" type="number" name="cp" ref="cp" step="0.01" min="1"  placeholder="Cost price" disabled={true} defaultValue={parseFloat( this.state.CostPrice ).toFixed(2)}  />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="form-group" key={this.state.MRP}>
                        <label>MRP</label>
                        <div className="input-group">
                          <span className="input-group-addon" />
                          <input  className="form-control"  type="number" name="mrp" ref="mrp" step="0.01"  min="0"
                            placeholder="MRP" onChange={this.mrpChanged.bind(this)} defaultValue={parseFloat(this.state.MRP).toFixed(2)} />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-2" key={this.state.MinSP}>
                      <div className="form-group">
                        <label> Minimum Selling Price</label>
                        <div className="input-group">
                          <span className="input-group-addon" />
                          <input className="form-control"  type="number" name="minSP" ref="minSP" step="0.01"  min="0" placeholder="Min Selling Price" defaultValue={parseFloat( this.state.ModelInfo.MinSP).toFixed(2)}  />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="form-group" key={this.state.SellingPrice}>
                        <label> Maximum Selling Price</label>
                        <div className="input-group">
                          <span className="input-group-addon" />
                          <input  className="form-control" type="number" step="0.01" name="sp"  ref="sp" min="0" placeholder="Selling Price" defaultValue={parseFloat(this.state.SellingPrice ).toFixed(2)} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xs-12">
                    <div className="col-md-2">
                      <div className="form-group" key={this.state.StockLocation}  >
                        <label>Stock Location</label>
                        <div className="input-group">
                          <span className="input-group-addon" />
                          <Select className="form-control" placeholder="Stock Location" ref="stockLocation" options={this.state.StockLocations} value={this.state.StockLocation} onChange={this.StockLocationChanged.bind(this)} />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label> Stock in date </label>
                        <div className="form-group">
                          <div className="input-group">
                            <span className="input-group-addon" />
                            <input style={{ lineHeight: "19px" }} className="form-control" type="date" name="stockInDate" ref="stockInDate"  defaultValue={this.state.StockInDate}  />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3" style={{ paddingLeft: "4%" }}>
                      <div className="form-group">
                        <label style={{ paddingLeft: "14px" }}> Warrenty</label>
                        <div className="form-group">
                          <span className="input-group">
                            <input className="col-md-1 form-control" min="0" id="discount-value" type="number" ref="warrenty"  name="warrenty" onChange={this.warrentyDurationChanged.bind(this)}  defaultValue={this.state.Warrenty}  />
                            <span  className="input-group"  key={this.state.WarrentyDuration} >
                              <Select className="col-md-2 form-control Warrenty" ref="warrentyduration" id="warrenty"  value={this.state.WarrentyDuration}
                                options={[ { value: "Days", label: "Days" },
                                  { value: "Months", label: "Months" },
                                  { value: "Year", label: "Year" }]}
                                onChange={this.WarrentyChanged.bind(this)}
                              />
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xs-12">  <hr />  </div>

                  <div className="col-xs-12" key={this.props.ItemDetails}>
                    {this.props.ItemDetails.map((item, i) => (
                      <div key={i}>
                        <div className="col-xs-12">
                          <div className="col-md-1">
                           <h5 className="pTop24"> <b> Item {i + 1} : </b>  </h5> 
                          </div>
                          <div className="col-md-10" key={this.props.ItemDetails} ItemDetails={item}> {item}   </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="col-xs-12">
                    <div className="loader loaderActivity" style={{ marginLeft: "45%", marginBottom: "8px" }} />
                     <button className="btn btn-success btnSave" type="submit" name="saveitems" >Save  </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="modal-footer" />
          </div>
        </div>
      </div>
    );
  }

  StockLocationChanged(val) {
    if (val) {
      this.setState({ StockLocation: val });
      showErrorsForInput(this.refs.stockLocation.wrapper, []);
    } else {
      this.setState({ StockLocation: "" });
      showErrorsForInput(this.refs.stockLocation.wrapper, [
        "Stock location required"
      ]);
    }
  }

  warrentyDurationChanged(val) {
    if (this.refs.warrenty.value != "" && this.state.WarrentyDuration != null) {
      showErrorsForInput(this.refs.warrenty, []);
    } else {
      if (this.refs.warrenty.value == "" && this.state.WarrentyDuration != null)
        showErrorsForInput(this.refs.warrenty, [
          "Enter a valid warrenty period"
        ]);
    }
  }

  WarrentyChanged(val) {
    if (val) {
      this.setState({ WarrentyDuration: val }, () => {
        if (this.refs.warrenty.value == "") {
          showErrorsForInput(this.refs.warrenty, [
            "Enter a valid warrenty period"
          ]);
        }
      });
      showErrorsForInput(this.refs.warrentyduration.wrapper, []);
    } else {
      this.setState({ WarrentyDuration: "" });
      if (this.refs.warrenty.value != "") {
        showErrorsForInput(this.refs.warrentyduration.wrapper, [
          "Enter a valid warrenty period"
        ]);
      }
    }
  }

  mrpChanged() {
    var mrp = this.refs.mrp.value;
    var cp = this.refs.cp.value;
    if (parseFloat(mrp) < parseFloat(cp)) {
      showErrorsForInput(this.refs.mrp, ["Should be greater than cost price"]);
    } else {
      showErrorsForInput(this.refs.mrp, []);
    }
  }

  minSPChanged() {
    var minsp = this.refs.minSP.value;
    var cp = this.refs.cp.value;
    var mrp = this.refs.mrp.value;

    if (mrp !== "") {
      if (parseFloat(minsp) > parseFloat(mrp)) {
        showErrorsForInput(this.refs.minSP, ["Should be less than mrp"]);
      } else {
        showErrorsForInput(this.refs.minSP, []);
      }
    } else {
      if (parseFloat(cp) > parseFloat(minsp)) {
        showErrorsForInput(this.refs.minSP, [
          "Should be greater than cost price"
        ]);
      } else {
        showErrorsForInput(this.refs.minSP, []);
      }
    }
  }

  handleSaveItem(e) {
    $(".loaderActivity").show();
    $("button[name='saveitems']").hide();

    e.preventDefault();

    var itemRefs = this.props.ItemRefs;
    var itemsList = [];
    var itemDetails = this.state.ItemDetails;
    var isSubmit = true;

    itemRefs.map((ele, i) => {
      var id = null;
      if (itemRefs[i].refs.itemId.value != null) {
        id = itemRefs[i].refs.itemId.value;
      } else {
        id = "";
      }
      var item = {
        id: id,
        serialNo: itemRefs[i].refs.serialNo.value,
        macAddress: itemRefs[i].refs.macAddress.value,
        manufacturedDate: itemRefs[i].refs.manufacturedDate.value
      };
      itemsList.push(item);
    });

    itemsList.map((ele, i) => {
      var serialNo = itemRefs[i].refs.serialNo.value;
      var url =
        ApiUrl +
        "/api/Items/CheckIfSerialNumberExists?serialNumber=" +
        serialNo;
      if (ele["id"] == undefined || ele["id"] == "") {
        $.get(url).then(data => {
          if (data["Result"] == true) {
            isSubmit = false;
            showErrorsForInput(this.props.ItemRefs[i].refs.serialNo, [
              "Serial number already exists"
            ]);
            this.props.ItemRefs[i].refs.serialNo.focus();
          } else {
            showErrorsForInput(this.props.ItemRefs[i].refs.serialNo, []);
          }
        });
      }
      var list = [];
      var li = itemsList.filter((k, o) => {
        if (k["serialNo"] == serialNo && serialNo.length > 0) {
          list.push(o);
        }
      });

      if (list.length > 1) {
        var index = list.length - 1;
        showErrorsForInput(this.props.ItemRefs[i].refs.serialNo, [
          "Duplicate serial number"
        ]);
        isSubmit = false;
        showErrorsForInput(this.props.ItemRefs[index].refs.serialNo, [
          "Duplicate serial number"
        ]);
        this.props.ItemRefs[index].refs.serialNo.focus();
      }

      if (isSubmit == false) {
        $(".loaderActivity").hide();
        $("button[name='saveitems']").show();
      }
    });

    if (!isSubmit) {
      return;
      $(".loaderActivity").hide();
      $("button[name='saveitems']").show();
    }

    if (!this.validateItem(e)) {
      if (!isSubmit) {
        $(".loaderActivity").hide();
        $("button[name='saveitems']").show();
        return;
      }
      $(".loaderActivity").hide();
      $("button[name='saveitems']").show();
      return;
    }

    var data = new FormData();
    data.append("items", JSON.stringify(itemsList));
    data.append("modelNo", this.props.ModelDetails.ModelId);
    data.append("batchNumber", this.refs.batchNo.value);
    data.append("hardwareVersion", this.refs.hardwareVersion.value);
    data.append("cp", this.refs.cp.value);
    data.append("minSp", this.refs.minSP.value);
    data.append("sp", this.refs.sp.value);
    data.append("mrp", this.refs.mrp.value);
    data.append("stockLocation", this.state.StockLocation.value);
    data.append("stockInDate", this.refs.stockInDate.value);
    data.append("poNumber", this.props.ModelDetails.PONum);
    data.append("billNumber", this.props.ModelDetails.BillNum);
    data.append("gst", this.props.ModelDetails.GST);
    data.append("serialNumberExists", this.props.ModelDetails.SerialNumExists);
    data.append("supplierId", this.props.ModelDetails.Supplier);

    if (this.refs.warrenty.value != "") {
      data.append("warrenty", this.refs.warrenty.value);
      data.append("warrentyDuration", this.state.WarrentyDuration.value);
    }

    if (isSubmit == true) {
      var url = ApiUrl + "/api/Items/AddItem";

      try {
        MyAjaxForAttachments(
          url,
          data => {
            $("#myItemModel").modal("hide");
            toast("Item(s) added successfully!", {
              type: toast.TYPE.SUCCESS
            });
            $(".loaderActivity").hide();
            $("button[name='saveitems']").show();
          },
          error => {
            toast(error.responseText, {
              type: toast.TYPE.ERROR,
              autoClose: false
            });
            $(".loaderActivity").hide();
            $("button[name='saveitems']").show();
            return false;
          },
          "POST",
          data
        );
      } catch (e) {
        toast("An error occoured, please try again!", {
          type: toast.TYPE.ERROR
        });
        $(".loaderActivity").hide();
        $("button[name='saveitems']").show();
        return false;
      }
    } else {
      $(".loaderActivity").hide();
      $("button[name='saveitems']").show();
      return;
    }
  }

  validateItem(e) {
    e.preventDefault();
    var success = true;
    var Submit = e.type === "submit";
    var itemsList = [];
    var itemRefs = this.props.ItemRefs;
    var serialNumberExists = this.state.SerialNumberExists;

    if (Submit) {
      $(e.currentTarget.getElementsByClassName("form-control")).map((i, el) => {
        el.classList.remove("un-touched");
      });
    }

    itemRefs.map((ele, i) => {
      var id = null;
      if (itemRefs[i].refs.itemId.value != null) {
        id = itemRefs[i].refs.itemId.value;
      } else {
        id = "";
      }
      var item = {
        id: id,
        serialNo: itemRefs[i].refs.serialNo.value,
        macAddress: itemRefs[i].refs.macAddress.value,
        manufacturedDate: itemRefs[i].refs.manufacturedDate.value
      };
      itemsList.push(item);
    });

    var batchNoConstraints = {
      presence: true,
      length: {
        maximum: 20,
        tooLong: "is too long"
      }
    };

    if (this.props.ModelDetails.SerialNumExists == true) {
      var hwConstraints = {
        presence: true,
        length: {
          maximum: 15,
          tooLong: "is too long"
        }
      };

      if ( validate.single(this.refs.hardwareVersion.value, hwConstraints) !== undefined ) {
        if (this.refs.batchNo.value.length > 15) {
          showErrorsForInput(this.refs.hardwareVersion, [ "Enter valid hardware version" ]);
        } else {
          showErrorsForInput(this.refs.hardwareVersion, [ "Enter hardware version" ]);
        }
        if (Submit) {
          Submit = false;
          this.refs.hardwareVersion.focus();
        }
        success = false;
      } else {
        showErrorsForInput(this.refs.hardwareVersion, []);
      }
    }

    if (validate.single(this.refs.cp.value, { presence: true }) !== undefined) {
      showErrorsForInput(this.refs.cp, ["Enter Cost Price"]);
      if (Submit) {
        Submit = false;
        this.refs.cp.focus();
      }
      success = false;
    } else {
      showErrorsForInput(this.refs.cp, []);
    }

    if (
      validate.single(this.refs.mrp.value, { presence: true }) !== undefined
    ) {
      showErrorsForInput(this.refs.mrp, ["Enter MRP"]);
      if (Submit) {
        Submit = false;
        this.refs.mrp.focus();
      }
      success = false;
    } else {
      var mrp = this.refs.mrp.value;
      var sp = this.refs.sp.value;
      var cp = this.refs.cp.value;
      var minSp = this.refs.minSP.value;

      if (parseFloat(mrp) < parseFloat(cp)) {
        showErrorsForInput(this.refs.mrp, ["MRP should be greater than CP"]);
        if (Submit) {
          Submit = false;
          this.refs.mrp.focus();
        }
        success = false;
      } else if (sp !== "") {
        if (parseFloat(sp) > parseFloat(mrp)) {
          showErrorsForInput(this.refs.sp, ["Selling price should not be greater than mrp" ]);
          if (Submit) {
            Submit = false;
            this.refs.mrp.focus();
          }
          success = false;
        } else {
          showErrorsForInput(this.refs.sp, []);
        }
      } else if (minSp !== "") {
        if (parseFloat(minSp) > parseFloat(mrp)) {
          showErrorsForInput(this.refs.minSP, ["Minimum selling price should be less than mrp"  ]);
          if (Submit) {
            Submit = false;
            this.refs.minSP.focus();
          }
          success = false;
        } else {
          showErrorsForInput(this.refs.minSP, []);
        }
      } else {
        showErrorsForInput(this.refs.mrp, []);
      }
    }

    if (
      validate.single(this.refs.minSP.value, { presence: true }) !== undefined
    ) {
      showErrorsForInput(this.refs.minSP, ["Enter Min Selling Price"]);
      if (Submit) {
        Submit = false;
        this.refs.minSP.focus();
      }
      success = false;
    } else {
      var mrp = this.refs.mrp.value;
      var sp = this.refs.sp.value;
      var cp = this.refs.cp.value;
      var minSp = this.refs.minSP.value;

      if (parseFloat(cp) > parseFloat(minSp)) {
        success = false;
        if (Submit) {
          Submit = false;
          this.refs.minSP.focus();
        }
        showErrorsForInput(this.refs.minSP, [ "should be greater than cost price" ]);
      } else if (mrp !== "") {
        if (parseFloat(minSp) > parseFloat(mrp)) {
          success = false;
          if (Submit) {
            Submit = false;
            this.refs.minSP.focus();
          }
          showErrorsForInput(this.refs.minSP, ["should be less than MRP"]);
        } else {
          showErrorsForInput(this.refs.minSP, []);
        }
      } else if (sp !== "") {
        if (parseFloat(sp) < parseFloat(minSp)) {
          success = false;
          if (Submit) {
            Submit = false;
            this.refs.sp.focus();
          }
          showErrorsForInput(this.refs.sp, [
            "Should be greater than minimum selling price"
          ]);
        }
      } else {
        showErrorsForInput(this.refs.minSP, []);
      }
    }

    if (validate.single(this.refs.sp.value, { presence: true }) !== undefined) {
      showErrorsForInput(this.refs.sp, ["Enter Selling Price"]);
      if (Submit) {
        Submit = false;
        this.refs.sp.focus();
      }
      success = false;
    } else {
      var mrp = this.refs.mrp.value;
      var sp = this.refs.sp.value;
      var cp = this.refs.cp.value;
      var minSp = this.refs.minSP.value;

      if (minSp !== "") {
        if (parseFloat(minSp) > parseFloat(sp)) {
          if (Submit) {
            Submit = false;
            this.refs.sp.focus();
          }
          success = false;
          showErrorsForInput(this.refs.sp, [ "Should not be less than minimum selling price" ]);
        }
      } else if (mrp !== "") {
        if (parseFloat(mrp) > parseFloat(sp)) {
          if (Submit) {
            Submit = false;
            this.refs.sp.focus();
          }
          success = false;
          showErrorsForInput(this.refs.sp, ["Should be less than MRP "]);
        }
      } else {
        showErrorsForInput(this.refs.sp, []);
      }
    }

    if (!this.state.StockLocation || !this.state.StockLocation.value) {
      success = false;
      if (Submit) {
        Submit = false;
        this.refs.stockLocation.focus();
      }
      showErrorsForInput(this.refs.stockLocation.wrapper, ["Stock Locationrequired"]);
    }

    if ( validate.single(this.refs.stockInDate.value, { presence: true }) !== undefined) {
      showErrorsForInput(this.refs.stockInDate, ["Enter Stock in date"]);
      if (Submit) {
        Submit = false;
        this.refs.stockInDate.focus();
      }
      success = false;
    } else {
      showErrorsForInput(this.refs.stockInDate, []);
    }

    if (
      this.refs.warrenty.value != "" &&
      (!this.state.WarrentyDuration || !this.state.WarrentyDuration.value)
    ) {
      success = false;
      if (Submit) {
        Submit = false;
        this.refs.warrentyduration.focus();
      }
      showErrorsForInput(this.refs.warrentyduration.wrapper, [ "Duration required" ]);
    }

    if (itemRefs != null) {
      var serialNoConstraints = {
        presence: true,
        length: {
          maximum: 25,
          tooLong: "is too long"
        }
      };

      if (serialNumberExists == true) {
        itemsList.map((ele, i) => {
          if ( validate.single(ele["serialNo"], serialNoConstraints) !== undefined  ) {
            if (ele["serialNo"].length > 25) {
              showErrorsForInput(this.props.ItemRefs[i].refs.serialNo, ["Serial number is too long" ]);
            } else{
              showErrorsForInput(this.props.ItemRefs[i].refs.serialNo, [ "Serial number is required" ]);
            }

            success = false;
            if (Submit) {
              Submit = false;
              this.props.ItemRefs[i].refs.serialNo.focus();
            }
          }
           else {
            var serialNo = ele["serialNo"];
            var list = [];
            var li = itemsList.filter((k, o) => {
            if (k["serialNo"] == serialNo && serialNo.length > 0) {
              list.push(o);
            }
            });

           if (list.length > 1) {
            var index = list.length - 1;
            // showErrorsForInput(this.props.ItemRefs[i].refs.serialNo, [
            //   "Duplicate serial number"
            // ]);
            if (Submit) {
              showErrorsForInput(this.props.ItemRefs[index].refs.serialNo, ["Duplicate serial number"]);
             // this.props.ItemRefs[index].refs.serialNo.focus();
              Submit = false;
              success = false;
            }
          }
          else{
            showErrorsForInput(this.props.ItemRefs[i].refs.serialNo, []);
           }
        }

        });
      } else {
        itemsList.map((ele, i) => {
          var serialNo = ele["serialNo"];
          if (serialNo != "") {
            var url = ApiUrl + "/api/Items/CheckIfSerialNumberExists?serialNumber=" + serialNo;
            if (ele["id"] == undefined || ele["id"] == "") {
              $.get(url).then(data => {
                if (data["Result"] == true) {
                  success = false;
                  showErrorsForInput(this.props.ItemRefs[i].refs.serialNo, [ "Serial number already exists" ]);
                  this.props.ItemRefs[i].refs.serialNo.focus();
                } else {
                  showErrorsForInput(this.props.ItemRefs[i].refs.serialNo, []);
                }
              });
            }
            else{

              var list = [];
              var li = itemsList.filter((k, o) => {
                if (k["serialNo"] == serialNo) {
                  list.push(o);
                }
              });

              if (list.length > 1) {
                var index = list.length - 1;
                showErrorsForInput(this.props.ItemRefs[i].refs.serialNo, [ "Duplicate serial number"  ]);
                success = false;
                if (Submit) {
                  // showErrorsForInput(this.props.ItemRefs[i].refs.serialNo, [
                  //   "Duplicate serial number"
                  // ]);
                  this.props.ItemRefs[index].refs.serialNo.focus();
                  Submit = false;
                  return success;
                }

            }

            }
          }
        });
      }
    }

    return success;
  }
}

export { Items };
