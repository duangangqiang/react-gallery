require('styles/imageFigure.css');

import React from 'react';

class ImageFigureComponent extends React.Component {
	
	constructor(props) {
	    super(props);

	    // This binding is necessary to make `this` work in the callback
	    this.handleClick = this.handleClick.bind(this);
	 }

	/**
	*	imgFigure的
	*/
	handleClick(e) {

		// 如果居中就翻转,不是居中就居中
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center()
		}

		e.stopPropagation();
		e.preventDefault();
	}

	render() {

		// 样式对象,可直接设置到style中
		let styleObj = {},
			imgFigureClassName = 'img-figure';

		// 设置翻转样式
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		// 如果props属性中指定了这个图片的位置信息,则使用
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos
		}

		// 如果图片的旋转角度有值且不为0, 添加旋转角度
		if (this.props.arrange.rotate) {
			styleObj.transform = 'rotate(' + this.props.arrange.rotate + 'deg)';
		}

		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageUrl} alt={this.props.data.title}/>
				<figcaption>
					<h2 className='img-title'>{this.props.data.title}</h2>
					<div className='img-back' onClick={this.handleClick}>
						<p>{this.props.data.desc}</p>
					</div>
				</figcaption>
			</figure>
		);
	}
}

ImageFigureComponent.defaultProps = {

};

export default ImageFigureComponent;