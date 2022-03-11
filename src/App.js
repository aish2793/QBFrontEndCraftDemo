import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { ROUTES } from "./routes/routes";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class App extends React.Component {
  documentData;
  constructor(props) {
    super(props);
    this.handleChoiceChange.bind(this);
    this.handleChoiceRemove.bind(this);
    this.handleChoiceAdd.bind(this);
    this.setDefaultValue.bind(this);

    this.state = {
      label: "",
      isValueRequired: false,
      defaultValue: "",
      choiceList: [],
      order: "",
    };
  }

  notify = (msg) => toast.error(msg, { toastId: "msg" });

  setDefaultValue = (e) => {
    if (e.key === "Enter") {
      this.handleUpdateState("defaultValue", e.target.value);
      if (!choiceExists(this.state.choiceList, e.target.value)) {
        this.handleUpdateState("choiceList", [
          ...this.state.choiceList,
          e.target.value,
        ]);
      }
    }
  };

  handleChoiceChange = (e, index) => {
    if (e.key === "Enter") {
      const value = e.target.value;
      const list = [...this.state.choiceList];
      if (value !== "") {
        if (!choiceExists(this.state.choiceList, value)) {
          list[index] = value;
          this.handleUpdateState("choiceList", list);
        } else {
          this.notify(value + " already exists in list!");
        }
      }
    }
  };

  handleChoiceRemove = (e, value) => {
    const list = this.state.choiceList.filter((item) => item !== value.value);
    if (value.value === this.state.defaultValue) {
      this.handleUpdateState("defaultValue", "");
    }
    this.handleUpdateState("choiceList", list);
  };

  handleChoiceAdd = () => {
    this.handleUpdateState("choiceList", [...this.state.choiceList, ""]);
  };

  AddButton = () => {
    return (
      <>
        <Button
          type="button"
          onClick={this.handleChoiceAdd}
          className="add-btn"
          color="primary"
          size="sm"
          style={{ border: "none", alignContent: "center" }}
        >
          <AddCircleOutlineIcon fontSize="small" />
        </Button>
      </>
    );
  };

  DisabledAddButton = () => {
    this.notify("You cannot add more than 50 choices!");
    return (
      <>
        <Button
          type="button"
          onClick={this.handleChoiceAdd}
          className="add-btn"
          color="primary"
          size="sm"
          disabled={true}
          style={{ border: "none", alignContent: "center" }}
        >
          <AddCircleOutlineIcon fontSize="small" />
        </Button>
      </>
    );
  };

  RemoveButton = (value) => {
    return (
      <>
        <Button
          type="button"
          id={value}
          onClick={(e) => this.handleChoiceRemove(e, value)}
          className="remove-btn"
          color="danger"
          size="sm"
          style={{ border: "none" }}
        >
          <RemoveCircleOutlineIcon fontSize="small" outline="none" />
        </Button>
        <br />
      </>
    );
  };

  componentDidMount() {
    if (localStorage) {
      this.documentData = JSON.parse(localStorage.getItem("formData"));
      if (localStorage.getItem("formData")) {
        this.setState({
          label: this.documentData.label,
          isValueRequired: this.documentData.isValueRequired,
          defaultValue: this.documentData.defaultValue,
          choiceList: this.documentData.choiceList,
          order: this.documentData.order,
        });
      } else {
        this.setState({
          label: "Sales Region",
          isValueRequired: false,
          defaultValue: "Asia",
          choiceList: ["Asia"],
          order: "Display choices in alphabetical order",
        });
      }
    }
  }

  handleUpdateState = (field = "", value = "") => {
    this.setState({ [field]: value }, () => {
      if (localStorage) {
        localStorage.setItem("formData", JSON.stringify(this.state));
      }
    });
  };

  resetForm = () => {
    localStorage.removeItem("formData");
    this.handleUpdateState("label", "Sales Region");
    this.handleUpdateState("isValueRequired", false);
    this.handleUpdateState("defaultValue", "Asia");
    this.handleUpdateState("choiceList", ["Asia"]);
    this.handleUpdateState("order", "Display choices in alphabetical order");
  };

  saveForm = () => {
    console.log(this.state);
    axios
      .post(ROUTES.SUBMIT_DATA, this.state)
      .then(function (response) {
        const { data } = response;
        const { status } = data;
        console.log(response);
        status === "success"
          ? toast.success("Save Successfull!!", {
              toastId: "msg",
            })
          : toast.error("Error while saving!", {
              toastId: "msg",
            });
      })
      .catch(function (error) {
        console.log(error);
        toast.error(error, {
          toastId: "msg",
        });
      });
  };

  render() {
    return (
      <div>
        <ToastContainer />
        <Container style={{ borderRadius: "15px", paddingTop: "30px" }}>
          <Row>
            <Col lg={{ size: 6, offset: 3 }} md={{ size: 10, offset: 1 }}>
              <Card
                style={{
                  border: "2px solid rgb(197, 239, 247)",
                }}
              >
                <CardHeader
                  style={{ backgroundColor: "rgba(197, 239, 247,0.6)" }}
                >
                  <h2 style={{ color: "rgb(37, 116, 169)" }}>Feild Builder</h2>
                </CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup>
                      <Label for="fieldLabel">Label </Label>
                      <Input
                        type="text"
                        id="fieldLabel"
                        onChange={(e) => {
                          this.handleUpdateState("label", e.target.value);
                        }}
                        value={this.state.label}
                        required
                      />
                    </FormGroup>
                    <br />
                    <FormGroup>
                      <Label for="feildtypes">Type</Label>
                      <div id="feildtypes">
                        Multi-Select &nbsp;
                        <Input
                          type="checkbox"
                          checked={this.state.isValueRequired}
                          onChange={(e) => {
                            this.handleUpdateState(
                              "isValueRequired",
                              e.target.checked
                            );
                          }}
                        />{" "}
                        A Value is Required
                      </div>
                    </FormGroup>
                    <br />
                    <FormGroup>
                      <Label for="dValue">Default Value</Label>
                      <Input
                        type="text"
                        id="dValue"
                        defaultValue={this.state.defaultValue}
                        onKeyDown={(e) => this.setDefaultValue(e)}
                      />
                    </FormGroup>
                    <br />
                    <FormGroup>
                      <Label for="choices">
                        Choices{"   "}
                        {this.state.choiceList.length < 50 ? (
                          <this.AddButton />
                        ) : (
                          <this.DisabledAddButton />
                        )}
                      </Label>
                      {this.state.choiceList.map((singleChoice, index) => (
                        <Row
                          key={singleChoice + index}
                          style={{ paddingTop: "1%", paddingBottom: "1%" }}
                        >
                          <Col lg={10} sm={10}>
                            <Input
                              type="text"
                              id={`choices-${singleChoice}`}
                              onKeyDown={(e) =>
                                this.handleChoiceChange(e, index)
                              }
                              defaultValue={singleChoice}
                              required
                            />
                          </Col>
                          <Col lg={2} sm={2}>
                            {this.state.choiceList.length !== 1 && (
                              <this.RemoveButton value={`${singleChoice}`} />
                            )}
                          </Col>
                        </Row>
                      ))}
                    </FormGroup>
                    <br />
                    <FormGroup>
                      <Label for="order">Order</Label>
                      <Input
                        type="select"
                        id="order"
                        onChange={(e) => {
                          this.handleUpdateState("order", e.target.value);
                          if (
                            e.target.value !==
                            "Display choices in alphabetical order"
                          ) {
                            this.state.choiceList.sort();
                          }
                        }}
                        value={this.state.order}
                      >
                        <option>Display choices in alphabetical order</option>
                        <option>Display choices in the order shown here</option>
                      </Input>
                    </FormGroup>
                    <br />
                    <Row>
                      <Col lg={{ size: 3, offset: 3 }} sm={{ size: 1 }}>
                        <Button
                          color="success"
                          onClick={this.saveForm}
                          style={{ paddingTop: "1%", paddingBottom: "1%" }}
                        >
                          Save Changes
                        </Button>
                      </Col>
                      <Col lg={{ size: 3 }} sm={{ size: 1 }}>
                        <Button
                          color="danger"
                          block={false}
                          onClick={this.resetForm}
                          style={{ paddingTop: "1%", paddingBottom: "1%" }}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;

function choiceExists(choiceList, value) {
  return choiceList.some((item) => value === item);
}
