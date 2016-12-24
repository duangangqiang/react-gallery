require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ImageFigure from './ImageFigureComponent.js';
import ReactDOM from 'react-dom';

// 获取图片数据
let imageDatas = require('../data/imageDatas.json');

// 利用自执行函数将图片信息转成图片URL路径信息
imageDatas = (function(imageDatasArr) {

	for (var i = 0, j = imageDatasArr.length; i < j; i++) {
		var singleImageData = imageDatasArr[i];

		// 使用require来得到图片地址
		singleImageData.imageUrl = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

let getRangeRandom = function (low, high) {
	return Math.ceil(Math.random() * (high - low) + low);
};

class GalleryByReactComponent extends React.Component {

	/**
	* es6使用constructor es5使用getInitalState
	*/
	constructor(props) {
		super(props);
		this.state = {
			imgsArrangeArr: []
		};
	}

	/**
	* 重新布局所有图片
	* @param centerIndex 指定居中哪个图片
	*/
	reArrange(centerIndex) {
		let imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.y,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			topImgNum = Math.ceil(Math.random() * 2), // 取一个或者不取
			topImgSpliceIndex = 0,

			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

			// 首先居中, centerIndex图片
			imgsArrangeCenterArr[0].pos = centerPos;

			// 取出要布局在上侧的图片状态信息
			topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

			// 布局位于上侧的图片
			imgsArrangeTopArr.forEach(function(value, index) {
				imgsArrangeTopArr[index].pos = {
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				}
			});

			// 布局左右两侧的图片
			for(let i = 0, j = imgsArrangeArr.length, k = j /2; i < j; i++) {

				let hPosRangeLOrR = null;

				// 前半部分布局左边,右半部分布局右边
				if (i < k) {
					hPosRangeLOrR = hPosRangeLeftSecX;
				} else {
					hPosRangeLOrR = hPosRangeRightSecX;
				}

				imgsArrangeArr[i].pos = {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLOrR[0], hPosRangeLOrR[1])
				}
			}

			
			if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
				imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
			}

			imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});

	}

	/**
	*	组件渲染完成之后回调
	*/
	componentDidMount() {

		// 声明所有区域的默认值
		this.Constant = {
			centerPos: {
				left: 0,
				right: 0
			},
			hPosRange: {
				leftSecX: [0, 0],
				rightSecX: [0, 0],
				y: [0, 0]
			},
			vPosRange: {
				x: [0, 0],
				y: [0, 0]
			}
		};

		// 首先拿到舞台的大小
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		// 拿到一个imageFigure的大小
		let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imageFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);

		// 计算中心图片的位置点
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}

		// 计算左侧右侧区域图片排布位置的取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		// 计算上侧区域图片排布的取值范围
		this.Constant.vPosRange.y[0] = -halfImgH;
		this.Constant.vPosRange.y[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		// 默认布局第一张
		this.reArrange(0);
	}

  	render() {
	  	let controllerUnits = [],imageFigures = [];

	  	// 将所有的图片添加进来 bind(this) 是把GalleryByReactComponent对象传递进来
	  	imageDatas.forEach(function(imageData, index) {

	  		if (!this.state.imgsArrangeArr[index]) {
	  			this.state.imgsArrangeArr[index] = {
	  				pos: {
	  					left: 0,
	  					top: 0
	  				}
	  			}
	  		}

	  		imageFigures.push(<ImageFigure data={imageData} key={'imageFigureKey' + index}
	  			ref= {'imageFigure' + index} arrange={this.state.imgsArrangeArr[index]}/>)
	  	}.bind(this));

	    return (
	      	<section className="stage" ref="stage">
	      		<section className="image-sec">
	      			{imageFigures}
	      		</section>
	      		<nav className="controller-nav">
	      			{controllerUnits}
	      		</nav>
	      	</section>
	    );
  	}
}

GalleryByReactComponent.defaultProps = {

};

export default GalleryByReactComponent;
