require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ImageFigure from './ImageFigureComponent.js';
import ControllerUnit from './ControllerUnitComponent.js';
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


/**
*	获取0~30之间的任意正负值
*/
let get30DegRandom = function () {
	return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
}

class GalleryByReactComponent extends React.Component {

	/**
	* es6使用constructor es5使用getInitalState
	*/
	constructor(props) {
		super(props);
		this.state = {
			imgsArrangeArr: [
				// {
				// 	pos: {
				// 		left: '0',
				// 		top: '0'
				// 	},
				// 	rotate: 0, // 旋转角度
				// 	isInverse: false, // 图片正反面
				//  isCenter: false // 居中
				// }
			]
		};
	}

	/**
	*	翻转图片
	*	@param index 输入当前被执行inverse操作的图片对应的图片信息数组的Index值
	*	@return {Function} 这是一个闭包函数, 其内对应一个真正待被执行的函数
	*/
	inverse (index) {
		return function () {
			let imgsArrangeArr = this.state.imgsArrangeArr;

			imgsArrangeArr[index].isInverse = ! imgsArrangeArr[index].isInverse;

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}.bind(this);
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
			topImgNum = Math.floor(Math.random() * 2), // 取一个或者不取
			topImgSpliceIndex = 0,

			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

		// 首先居中, centerIndex图片
		imgsArrangeCenterArr[0] = {
			pos: centerPos,
			rotate: 0,
			isCenter: true
		};

		// 取出要布局在上侧的图片状态信息
		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

		// 布局位于上侧的图片
		imgsArrangeTopArr.forEach(function(value, index) {
			imgsArrangeTopArr[index] = {
				pos: {
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
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

			imgsArrangeArr[i] = {
				pos : {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLOrR[0], hPosRangeLOrR[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
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
	*	利用rearrange函数,居中对应index的图片
	*	@param index 需要被居中的图片对应的图片信息数组的index值
	*	@return {Function}
	*/
	center (index) {
		return function () {
			this.reArrange(index);
		}.bind(this);
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

	  		// 初始化组件参数
	  		if (!this.state.imgsArrangeArr[index]) {
	  			this.state.imgsArrangeArr[index] = {
	  				pos: {
	  					left: 0,
	  					top: 0
	  				},
	  				rotate: 0,
	  				isInverse: false,
	  				isCenter: false
	  			}
	  		}

	  		// 增加图片
	  		imageFigures.push(<ImageFigure data={imageData} key={ index}
	  			ref= {'imageFigure' + index} arrange={this.state.imgsArrangeArr[index]}
	  			inverse={this.inverse(index)} center={this.center(index)} />);

	  		// 增加控制器
	  		controllerUnits.push(<ControllerUnit key={index}
	  			arrange={this.state.imgsArrangeArr[index]}
	  			inverse={this.inverse(index)} center={this.center(index)} />);
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
