import React from "react";

class Backdrop extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    render() {
        return (
            <div className="backdrop" ref={this.ref} onClick={event => event.target === this.ref.current ? this.props.clicked() : null}>{this.props.children}</div>
        );
    }
}

export default Backdrop;