require('styles/controllerUnit.css');

import React from 'react';

class ControllerUnit extends React.Component {
	
	constructor(props) {
	    super(props);

	    // 绑定this
	    this.handleClick = this.handleClick.bind(this);
	 }

	handleClick (e) {

		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	}

	render () {

		var controllerUnitClassName = 'controller-unit';

		if (this.props.arrange.isCenter) {
			controllerUnitClassName += ' is-center';
		}

		if (this.props.arrange.isInverse) {
			controllerUnitClassName += ' is-inverse';
		}

		return (
			<span className={controllerUnitClassName} onClick={this.handleClick}></span>
		);
	}
}

ControllerUnit.defaultProps = {

}

export default ControllerUnit;