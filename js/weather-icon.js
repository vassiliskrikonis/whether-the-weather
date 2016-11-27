class WeatherIcon extends HTMLElement {
	constructor(self) {
		self = super(self);

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
	}

	static get observedAttributes() {
		return ['icon'];
	}

	connectedCallback() {
		let img = new Image();
		img.src = this.folderPath + this.icon.filename;
		img.setAttribute('alt', this.icon.name);
		img.setAttribute('title', this.icon.name);
		img.className = 'weather-icon';
		img.onload = this._onIconLoad.bind(this);
		this.appendChild(img);
	}

	disconnectedCallback() {
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if(name === 'icon') {
			let icon = this._kebabToCamelCase(newValue);
			if(this.icons[icon]) {
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

	_onIconLoad() {
		this.classList.add('loaded');
		this.dispatchEvent(new Event('load'));	
	}

	_kebabToCamelCase(str) {
		return str.replace(/-([a-z])/g, (match, p1) => p1.toUpperCase());
	}
}

customElements.define('weather-icon', WeatherIcon);
