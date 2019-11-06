import React from "react";
import EditableInput from './UI/EditableInput';
import { generateId } from '../utilities';

class Form extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: false || props.element.isNew,
            element: this.deepCopyElement(props.element)
        }
    }

    addLink = () => {
        const { element } = this.state;
        this.setState({
            element: {
                ...element,
                links: element.links.concat({ id: generateId(), url: "" })
            }
        });
    }

    deleteLink = id => {
        const { element } = this.state;
        this.setState({
            element: {
                ...element,
                links: element.links.filter(link => link.id !== id)
            }
        });
    }

    changeLinks = (id, event) => {
        this.setState({
            element: {
                ...this.state.element,
                links: this.state.element.links.map(link => {
                    if (link.id === id) {
                        link = { ...link };
                        link.url = event.target.value;
                    }

                    return link;
                })
            }
        })
    }

    deepCopyElement = element => {
        return {
            ...element,
            links: [
                ...element.links.map(link => ({ ...link }))
            ]
        };
    }

    changeSubject = event => {
        const { target } = event;
        if (target) {
            this.setState(prev => ({
                element: {
                    ...prev.element,
                    subject: target.value
                }
            }));
        }
    }

    changeDescription = event => {
        const { target } = event;
        if (target) {
            this.setState(prev => ({
                element: {
                    ...prev.element,
                    description: target.value
                }
            }));
        }
    }

    changeDuration = event => {
        const { target } = event;
        if (target) {
            this.setState(prev => ({
                element: {
                    ...prev.element,
                    duration: parseInt(target.value)
                }
            }));
        }
    }

    changeTools = event => {
        const { target } = event;
        if (target) {
            this.setState(prev => ({
                element: {
                    ...prev.element,
                    tools: target.value
                }
            }));
        }
    }

    changeDate = (name, event) => {
        const { target } = event;
        const unixtime = new Date(target.value).getTime();

        if (target) {
            this.setState(prev => ({
                element: {
                    ...prev.element,
                    [name]: unixtime
                }
            }));
        }
    }

    // ZMIENIANIE DAT

    changeImportant = event => {
        this.setState(prev => ({
            element: {
                ...prev.element,
                veryImportant: !prev.element.veryImportant
            }
        }));
    }

    edit = () => {
        this.setState({ editing: true });
    }

    changeType = type => {
        this.setState({ element: { ...this.state.element, type } });
    }

    cancelEditing = () => {
        this.setState({
            editing: false,
            element: this.deepCopyElement(this.props.element)
        });
    }

    render() {
        const { editing, element } = this.state;
        const { saved } = this.props;
        const { isNew, type, subject, description, tools, duration, created, planned, deadline, finished, veryImportant, links } = element;

        const style = { background: "white" };

        switch (type) {
            case "todo": style.background = "skyblue"; break;
            case "warning": style.background = "indianred"; break;
            case "log": style.background = "mediumseagreen"; break;
            default: style.background = "white"; break;
        }

        return (
            <div className="form" onClick={e => e.stopPropagation()}>
                <div className="subject" style={style}>{subject}</div>
                {/* Pola */}
                <div className="form-inputs">
                    <EditableInput type="text" name="subject" value={subject} editing={editing} changed={this.changeSubject} />
                    <EditableInput type="longtext" name="description" value={description} editing={editing} changed={this.changeDescription} />
                    <div className="form-inputs-row">
                        <div className="form-inputs-col">
                            <EditableInput type="checkbox" name="very important?" value={veryImportant} editing={editing} changed={this.changeImportant} />
                        </div>
                        <div className="form-inputs-col">
                            <EditableInput type="number" name="duration" value={duration} editing={editing} changed={this.changeDuration} />
                        </div>
                        <div className="form-inputs-col">
                            <EditableInput type="text" name="tools" value={tools} editing={editing} changed={this.changeTools} />
                        </div>
                    </div>
                    <div className="form-inputs-col">
                    <div className="form-inputs-row">
                        <div className="form-inputs-col">
                            <EditableInput type="links" name="links" value={links} editing={editing} add={this.addLink} del={this.deleteLink} changed={this.changeLinks} />
                        </div>
                        <div className="form-inputs-col">    
                            <div className="form-inputs-row">
                            <div className="form-inputs-row form-inputs-columns">
                                <EditableInput type="date" name="created" value={created} editing={editing} changed={event => this.changeDate("created", event)} />
                                <EditableInput type="date" name="planned" value={planned} editing={editing} changed={event => this.changeDate("planned", event)} />
                            </div>
                                <div className="form-inputs-row form-inputs-columns">
                                <EditableInput type="date" name="deadline" value={deadline} editing={editing} changed={event => this.changeDate("deadline", event)} />
                                <EditableInput type="date" name="finished" value={finished} editing={editing} changed={event => this.changeDate("finished", event)} nullText="Not yet" />
                            </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="form-buttons-row">
                    <div className="form-buttons">
                        {
                            editing ?
                                <div className="transitions-buttons">
                                    { type !== "todo" ? <div className="form-to-todo" onClick={() => this.changeType("todo")}>to todo</div> : null }
                                    { type !== "warning" ? <div className="form-to-warning" onClick={() => this.changeType("warning")}>to warning</div> : null }
                                    { type !== "log" ? <div className="form-to-log" onClick={() => this.changeType("log")}>to log</div> : null }
                                </div>
                            : null
                        }
                        <div className="action-buttons">
                            {
                                editing ?
                                <React.Fragment>
                                    <div className="form-save" onClick={() => saved(this.props.element, this.state.element)}>Save</div>
                                    { !isNew ? <div className="form-cancel" onClick={this.cancelEditing}>Cancel</div> : null }
                                </React.Fragment>
                                :
                                <div className="form-edit" onClick={this.edit}>Edit</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Form;