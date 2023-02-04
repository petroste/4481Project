import React, { Component } from 'react';
  
export class About extends Component {
    render() {
        return(
            <div
                style={{
                display: 'flex',
                justifyContent: 'Center',
                alignItems: 'Center',
                height: '50vh'
            }}
            >
                <h1>This is the about page</h1>
             </div>
        )
    };
}
  
export default About;