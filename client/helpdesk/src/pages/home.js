import React, { Component } from 'react'

export class Home extends Component {
  render() {
    return (
      <div className='global'>
        <div className='navbar-main'
	           style={{
		         display: 'flex',
		         justifyContent: 'Right',
		         alignItems: 'Right',
		         height: '100vh'
	          }}
        >
          
        </div>
        <div className='body-main'>This is our help desk application</div>

      </div>

    )
  }
}

export default Home;

