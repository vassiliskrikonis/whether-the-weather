'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WeatherIcon = function (_HTMLElement) {
	_inherits(WeatherIcon, _HTMLElement);

	function WeatherIcon(self) {
		var _this;

		_classCallCheck(this, WeatherIcon);

		self = (_this = _possibleConstructorReturn(this, (WeatherIcon.__proto__ || Object.getPrototypeOf(WeatherIcon)).call(this, self)), _this);

		self.folderPath = 'icons/set2/';
		self.icons = {
			clearDay: 'sun.svg',
			clearNight: 'moon.svg',
			rain: 'rain.svg',
			snow: '',
			sleet: '',
			wind: 'wind.jpg',
			fog: 'fog-lighthouse1.svg',
			cloudy: 'clouds.svg',
			partlyCloudyDay: 'partly-day.svg',
			partlyCloudyNight: 'partly-night.svg'
		};
		return _this;
	}

	_createClass(WeatherIcon, [{
		key: 'connectedCallback',
		value: function connectedCallback() {
			var img = new Image();
			img.src = this.folderPath + this.icon.filename;
			img.setAttribute('alt', this.icon.name);
			img.setAttribute('title', this.icon.name);
			img.className = 'weather-icon';
			img.onload = this._onIconLoad.bind(this);
			this.appendChild(img);
		}
	}, {
		key: 'disconnectedCallback',
		value: function disconnectedCallback() {}
	}, {
		key: 'attributeChangedCallback',
		value: function attributeChangedCallback(name, oldValue, newValue) {
			if (name === 'icon') {
				var icon = this._kebabToCamelCase(newValue);
				if (this.icons[icon]) {
					this.icon = {
						name: icon,
						value: newValue,
						filename: this.icons[icon]
					};
				} else {
					console.log('not a valid attribute value');
				}
			}
		}
	}, {
		key: '_onIconLoad',
		value: function _onIconLoad() {
			this.dispatchEvent(new Event('load'));
		}
	}, {
		key: '_kebabToCamelCase',
		value: function _kebabToCamelCase(str) {
			return str.replace(/-([a-z])/g, function (match, p1) {
				return p1.toUpperCase();
			});
		}
	}], [{
		key: 'observedAttributes',
		get: function get() {
			return ['icon'];
		}
	}]);

	return WeatherIcon;
}(HTMLElement);

customElements.define('weather-icon', WeatherIcon);
//# sourceMappingURL=weather-icon-es5.js.map
