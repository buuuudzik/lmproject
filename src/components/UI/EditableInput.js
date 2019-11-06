import React from "react";
import { printDate, capitilize, getDate } from '../../utilities';

const EditableInput = props => {
    const { name, type, editing, value, placeholder, changed, nullText, add, del } = props;

    switch (type) {
        case "number": return (
            <div className="editable-input">
                <div className="editable-input-number">
                <div className="input-title">{capitilize(name)}:</div>
                    {
                        editing ?
                            <input className="input-control" type="number" value={value} placeholder={placeholder} onChange={changed} />
                        :
                            <div className="input-control">{value}h</div>
                    }
                </div>
            </div>
        ); break;
        case "text": return (
            <div className="editable-input">
                <div className="editable-input-text">
                <div className="input-title">{capitilize(name)}:</div>
                    {
                        editing ?
                            <input className="input-control" type="text" value={value} placeholder={placeholder} onChange={changed} />
                        :
                            <div className="input-control">{value}</div>
                    }
                </div>
            </div>
        ); break;
        case "longtext": return (
            <div className="editable-input">
                <div className="editable-input-longtext">
                    <div className="input-title">{capitilize(name)}:</div>
                    {
                        editing ?
                            <textarea className="input-control" value={value} placeholder={placeholder} onChange={changed} />
                        :
                            <div className="input-control">{value}</div>
                    }
                </div>
            </div>
        ); break;
        case "date": return (
            <div className="editable-input">
                <div className="editable-input-date">
                    <div className="input-title">{capitilize(name)}:</div>
                    {
                        editing ?
                            <input className="input-control" type="date" value={getDate(value)} placeholder={placeholder} onChange={changed} />
                        :
                            <div className="input-control">{value ? printDate(value) : (nullText ? nullText : "Not set")}</div>
                    }
                </div>
            </div>
        ); break;
        case "checkbox": return (
            <div className="editable-input">
                <div className="editable-input-checkbox">
                    {
                        editing ?
                            <React.Fragment>
                            Very Important? <input className="input-control" type="checkbox" checked={value} onChange={changed} />
                            </React.Fragment>
                        :
                            <div className="input-control">{value ? "Very Important!!!" : "Normal"}</div>
                    }
                </div>
            </div>
        ); break;
        case "links": return (
            <div className="editable-input">
                <div className="editable-input-links">
                    <div className="input-title">{capitilize(name)}:</div>
                    { editing ? <div className="add-link" onClick={add}>Add new</div> : null }
                    <div className="links-list">
                    {
                        value.map(link => {
                            return (
                                editing ?
                                        <div className="edited-link" key={link.id}>
                                            <input className="input-control" type="text" value={link.url} placeholder={placeholder} onChange={event => changed(link.id, event)} />
                                            <div className="delete-link" onClick={() => del(link.id)}><i className="fa fa-window-close"></i></div>
                                        </div>
                                :
                                    <div className="input-control link" key={link.id}>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                                    </div>
                            )
                        })
                    }
                    </div>
                </div>
            </div>
        ); break;
        default: return (
            <div className="editable-input">
                <div className="editable-input-text">
                <div className="input-title">{capitilize(name)}:</div>
                    <div className="input-control">{value}</div>
                </div>
            </div>
        );
    }
}

export default EditableInput;