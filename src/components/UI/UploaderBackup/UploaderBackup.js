import React, {Component} from 'react';
import classes from './UploaderBackup.css';
import { post } from 'axios';

class UploaderBackup extends Component {
    state = {
        file: null
    }
    
    onFormSubmit = e => {
        e.preventDefault() // Stop form submit
        this.fileUpload(this.state.file).then((response)=>{
            if (response.data.match('saved') && typeof this.props.refresh === "function") this.props.refresh();
            console.log(response.data);
        })
    }
    onChange = e => this.setState({file:e.target.files[0]});
    
    fileUpload = file => {
        const {url, filename} = this.props;

        const formData = new FormData();
        formData.append('request_type', 'backup');
        formData.append('file', file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        if (typeof this.props.parseResponse === "function") this.props.parseResponse(JSON.parse(file));
        return  post(url, formData, config);
    }

    render() {
        return (
            <div className={classes.UploaderBackup}>
                <form onSubmit={this.onFormSubmit}>
                    <div className={classes.UploadInput}>
                        <input type="file" accept=".json" name="backup" onChange={this.onChange} />
                    </div>
                    <div className={classes.UploadBtn}>
                        <button type="submit">Upload</button>
                    </div>
                </form>
            </div>
        );
    }
};
  
export default UploaderBackup;