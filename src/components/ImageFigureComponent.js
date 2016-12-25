require('styles/imageFigure.css');

import React from 'react';

class ImageFigureComponent extends React.Component {
	render() {

		// 样式对象,可直接设置到style中
		let styleObj = {};

		// 如果props属性中指定了这个图片的位置信息,则使用
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos
		}

		// 如果图片的旋转角度有值且不为0, 添加旋转角度
		if (this.props.arrange.rotate) {
			styleObj.transform = 'rotate(' + this.props.arrange.rotate + 'deg)';
		}

		return (
			<figure className='img-figure' style={styleObj}>
				<img src={this.props.data.imageUrl} alt={this.props.data.title}/>
				<figcaption>
					<h2 className='img-title'>{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
}

ImageFigureComponent.defaultProps = {

};

export default ImageFigureComponent;