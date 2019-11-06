import React from "react";
import { showOverview } from '../utilities';

const DAY = 86400000;

const compareCloserToNow = (a, b) => {
    const now = Date.now();
    const aClose = a !== 0 && now - a < DAY;
    const bClose = b !== 0 && now - b < DAY;
    if (aClose !== bClose) {
        if (aClose) return 1;
        else if (bClose) return -1;
    }
    return 0;
}

const compareExistOrSooner = (a, b) => {
    // is has earlier date or it is set at all
    if (a !== b) {
        const aConfigured = a.planned !== 0;
        const bConfigured = b.planned !== 0;

        if (aConfigured && bConfigured) return a - b;
        else {
            if (aConfigured) return 1;
            else if (bConfigured) return -1;
        }
    } return 0;
}

const compareBoolean = (a, b) => {
    if (a !== b) {
        if (a) return 1;
        else if (b) return -1;
    }
    return 0;
}

class Section extends React.Component {
    render() {
        const { name, printRow } = this.props;
        const sortedElements = [...this.props.elements].sort((a, b) => {

            if (name === "logs") {
                // earlier finished or at all
                const finishedResult = compareExistOrSooner(a.finished, b.finished);
                if (finishedResult !== 0) return finishedResult;
            } else if (name === "todos") {
                // closer deadline
                const deadlineCloserResult = compareCloserToNow(a.deadline, b.deadline);
                if (deadlineCloserResult !== 0) return deadlineCloserResult;

                // earlier planned or at all
                const plannedResult = compareExistOrSooner(a.planned, b.planned);
                if (plannedResult !== 0) return plannedResult;
                
                // is more important
                const moreImportantResult = compareBoolean(a.veryImportant, b.veryImportant);
                if (moreImportantResult !== 0) return moreImportantResult;

                // has deadline at all or it is earlier
                const deadlineResult = compareExistOrSooner(a.deadline, b.deadline);
                if (deadlineResult !== 0) return deadlineResult;
            } else if (name === "warnings") {
                // is more important
                const moreImportantResult = compareBoolean(a.veryImportant, b.veryImportant);
                if (moreImportantResult !== 0) return moreImportantResult;

                // earlier planned or at all
                const createdResult = compareExistOrSooner(a.created, b.created);
                if (createdResult !== 0) return createdResult;
            }
            
            return 0;
        });

        sortedElements.reverse();

        return (
            <div className={name}>
                <div className="caption">{name}<span className="add-element" onClick={this.props.createdElement}><i className="fa fa-plus-square"></i></span></div>
                <div className="elements">
                    {
                        sortedElements.map(el => (
                            <div className="element" key={el.id} title={showOverview(el)} onClick={() => this.props.clickedElement(el)} >
                                <div className={"element-subject" + (el.veryImportant ? " element-important" : "")}>{printRow(el)}</div>
                                <div className="element-delete" onClick={event => this.props.deletedElement(el, event)}><i className="fa fa-window-close"></i></div>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default Section;