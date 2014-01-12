requirejs.config( {
	baseUrl: '/assets/scripts/src/lib',
	paths: {
		implementations: 'requirejs-plugins/amd-feature/dynamic',
		feature: 'requirejs-plugins/feature',
		app: '../app',
		util: '../util',
		jquery: 'jquery-1.9.1',
		easing: 'jquery.easing.1.3',
		throttledebounce: 'jquery.ba-throttle-debounce.min',
		evensteven: 'jquery.evensteven',
		pubsub: 'jquery.ba-tinypubsub',
		printernator: 'jquery.printernator',
		JSON: 'json3.min',
		matchMediaIE8: 'matchMedia-ie8'
	},
	shim: {
		matchMedia: {
			exports: 'matchMedia'
		},
		matchMediaIE8: {
			exports: 'matchMedia'
		},
		JSON: {
			exports: 'JSON'
		},
		getComputedStyle: {
			exports: 'getComputedStyle'
		},
		easing: {
			deps: ['jquery'],
			exports: 'jQuery'
		},
		throttledebounce: {
			deps: ['jquery'],
			exports: 'jQuery'
		},
		pubsub: {
			deps: ['jquery'],
			exports: 'jQuery'
		},
		enquire: {
			deps: ['feature!matchMedia'],
			exports: 'enquire'
		},
		printernator: {
			deps: ['jquery'],
			exports: 'jQuery'
		},
		evensteven: {
			deps: ['jquery'],
			exports: 'jQuery'
		},
		templayed: {
			exports: 'templayed'
		}
	},
	waitSeconds: 30
} );
