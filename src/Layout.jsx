import React from 'react'
import {Link} from 'react-router'

function Layout(props, context) {
  return (
    <div className="wrapper">
        {context.toast ? <Toast>{context.toast}</Toast> : null}
	    <div className="sidebar" data-color="purple" style={{zIndex: 100}}>
			<div className="logo">
              Editable
			</div>

	    	<div className="sidebar-wrapper">
	            <ul className="nav">
	                <li className="active">
	                    <Link to="/">
	                        <i className="material-icons">dashboard</i>
	                        <p>Dashboard</p>
	                    </Link>
	                </li>
	                <li>
	                    <Link to="/pages">
	                        <i className="material-icons">library_books</i>
	                        <p>Pages</p>
	                    </Link>
	                </li>
	                <li>
	                    <Link to="/posts">
	                        <i className="material-icons">speaker_notes</i>
	                        <p>Posts</p>
	                    </Link>
	                </li>
	                <li>
	                    <Link to="/images">
	                        <i className="material-icons">image</i>
	                        <p>Image Library</p>
	                    </Link>
	                </li>
	                <li>
	                    <Link to="/settings">
	                        <i className="material-icons">settings</i>
	                        <p>Site Settings</p>
	                    </Link>
	                </li>
	            </ul>
	    	</div>
	    </div>

	    <div className="main-panel">
			<nav className="navbar navbar-transparent navbar-absolute visible-xs visible-sm">
				<div className="container-fluid">
					<div className="navbar-header">
						<button type="button" className="navbar-toggle" data-toggle="collapse">
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<a className="navbar-brand" href="#">Material Dashboard</a>
					</div>
				</div>
			</nav>

            {props.children}
		</div>
    </div>
  )
}

function Toast(props) {
  return (
    <div style={{
      position: 'absolute',
      width: '200px',
      top: '10px',
      right: '10px',
      zIndex: 100
    }}>
      <div className="alert alert-success">
        <div className="container-fluid">
          <div className="alert-icon">
            <i className="material-icons">cached</i>
          </div>
          <b>Rebuilding Site...</b>
        </div>
      </div>
    </div>
  )
}


Layout.contextTypes = {
  toast: React.PropTypes.string
}

export default Layout
