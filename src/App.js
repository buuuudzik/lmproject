import React from 'react';
import './App.css';
import Section from "./components/Section";
import Form from "./components/Form";
import Backdrop from './components/Backdrop';
import { filterByProperties, printDate, printLogDate, printSimpleDate, generateId, downloadBackup } from './utilities';
import UploaderBackup from './components/UI/UploaderBackup/UploaderBackup';

const sectionsPrinters = {
  todos: el => {
    // if deadline is before planned
    const deadlineIsSet = el.deadline !== 0;
    const plannedIsSet = el.planned !== 0;
    let time = el.planned;
    if (!plannedIsSet || (deadlineIsSet && plannedIsSet && el.deadline < el.planned)) time = el.deadline; 
    return `${time ? printSimpleDate(time) + ": " : ""}${el.subject}`;
  },
  warnings: el => `${el.deadline ? printDate(el.deadline) + ": " : ""}${el.subject}`,
  logs: el => `${el.finished ? printLogDate(el.finished) + ": " : ""}${el.subject}`
};

const configPath = "config.lp";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      filter: "",
      showBackup: false,
      form: null,
      todos: [],
      warnings: [],
      logs: []
    }
  }

  clearElement() {
    if (this.state.form !== null) this.setState({ form: null });
  }

  selectElement = element => {
    this.setState({ form: element, showBackup: false });
  }

  deleteElement = (element, event) => {
    event.stopPropagation();
    if (!window.confirm("Do you really want delete this element?")) return;

    const destName = element.type + "s";
    const newState = { [destName]: this.state[destName].filter(el => el.id !== element.id) };
    this.setState(newState);
    this.uploadData(newState);
  }

  createElement = type => {
    if (!this.state.form) {
      this.selectElement({
        id: generateId(),
        type,
        subject: "",
        description: "",
        tools: "",
        duration: 0,
        created: Date.now(),
        deadline: 0,
        finished: 0,
        veryImportant: false,
        links: [],
        isNew: true
      });
    }
  }

  saveElement = (beforeEl, el) => {
    const isNew = el.isNew;
    const beforeDestName = beforeEl.type + "s";
    const destName = el.type + "s";

    const updatedEl = {};
    Object.keys(el).forEach(key => {
      if (key !== "isNew") updatedEl[key] = el[key];
    });

    const newState = { form: null };
    if (isNew) {
      newState[destName] = this.state[destName].concat(updatedEl);
    } else {
      if (beforeDestName !== destName) {
        newState[beforeDestName] = this.state[beforeDestName].filter(elem => elem.id !== el.id);
        newState[destName] = this.state[destName].concat(updatedEl);
      } else {
        newState[destName] = this.state[destName].map(elem => {
          if (elem.id === el.id) return updatedEl;
          return elem;
        });
      }
    }

    this.setState(newState);
    this.uploadData({
      [destName]: newState[destName],
      [beforeDestName]: newState[beforeDestName]
    });
  }

  changeFilter = (event) => {
    this.setState({filter: event.target.value});
  }

  syncFromServer = () => {
    fetch(configPath)
    .then(res => res.json())
    .then(data => {
      this.setState({ loading: false, todos: data.todos, warnings: data.warnings, logs: data.logs });
    }).catch(err => {
      console.log(err);
    })
  }

  syncToServer = config => {
    const url = configPath;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onload = function () {
      if (xhr.status !== 200 || xhr.responseText !== "OK") console.log("Nie zapisano na serwerze", xhr.status, xhr.responseText);
    };
    xhr.send(JSON.stringify(config));
  }

  fetchData = () => {
    this.syncFromServer();
  }

  uploadData = change => {
    const config = {
      todos: this.state.todos,
      warnings: this.state.warnings,
      logs: this.state.logs,
      ...change
    }
    this.syncToServer(config);
  }

  openBackup = () => {
    this.setState({ showBackup: true, form: null })
  }

  closeApp = () => {
    window.location = '/apps/';
  }

  componentWillMount() {
    this.fetchData();
  }

  render() {
    const { loading, showBackup, form, filter, todos, warnings, logs } = this.state;
    const comparedProperties = ["subject", "description", "tools"];
    const filteredTodos = filterByProperties(todos, filter, comparedProperties);
    const filteredWarnings = filterByProperties(warnings, filter, comparedProperties);
    const filteredLogs = filterByProperties(logs, filter, comparedProperties);

    return (
      <div className="App">
        <header className="App-header">
          <div className="app-title">Project</div>
          <div className="app-filter">
            <input type="text" onChange={this.changeFilter} value={filter} placeholder="Search..." />
          </div>
          <div className="header-right">
            {loading ? null : <div className="show-backup" onClick={this.openBackup}>Backup</div>}
            <div className="close-app" onClick={this.closeApp}><i className="fa fa-window-close"></i></div>
          </div>
        </header>
        <div className="container">
          {
            !loading
            ?
              <React.Fragment>
                <Section name="todos" elements={filteredTodos} printRow={sectionsPrinters.todos} clickedElement={this.selectElement} createdElement={() => this.createElement("todo")} deletedElement={this.deleteElement} />
                <Section name="warnings" elements={filteredWarnings} printRow={sectionsPrinters.warnings} clickedElement={this.selectElement} createdElement={() => this.createElement("warning")} deletedElement={this.deleteElement} />
                <Section name="logs" elements={filteredLogs} printRow={sectionsPrinters.logs} clickedElement={this.selectElement} createdElement={() => this.createElement("log")} deletedElement={this.deleteElement} />
              </React.Fragment>
            :
              <div className="loading-container">
                <div className="loading-text">Loading data...</div>
              </div>
          }
        </div>
        {
          form ?
          <Backdrop clicked={() => this.setState({form: null})}>
            <Form element={form} saved={this.saveElement} />
          </Backdrop>
          : null
        }
        {
          showBackup ?
          <Backdrop clicked={event => {
            console.log(event, "backup backdrop clicked");
            this.setState({showBackup: false});
            }}>
            <div className="backup">
              <div className="backup-caption">Backup</div>
              <div className="backup-section">
                <div className="backup-header">Restore from file</div>
                <UploaderBackup url="backup.lp" refresh={this.fetchData} />
              </div>
              <div className="backup-section">
                <div className="backup-header">Download backup</div>
                <button className="download-backup" onClick={() => downloadBackup(this.state)}>Download</button>
                <a id="downloadBackup" style={{ display: "none" }}></a>
              </div>
            </div>
          </Backdrop>
          : null
        }
      </div>
    );
  }
}

export default App;
