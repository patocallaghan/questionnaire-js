/* app/ui/video/load */

define(
	[
		'jquery',
		'util/lazyload',
		'pubsub',
		'templayed'
	],

	function ($, LazyLoad) {

		var VideoLoad;

		return {

			init: function () {

				VideoLoad = this;
				this._initVideoEvent();
				this._youkouVideoHeight();
				LazyLoad.initLazyFunction({
					elems: $('.js-load-playlist'),
					callback: function () {
						var $thisGallery = $(this);
						if (this.className.indexOf('js-load-playlist') > -1) {
							$thisGallery.removeClass('js-load-playlist');
							VideoLoad._getPlaylist($thisGallery);
						}
					}
				});
			},

			_getPlaylist: function ($thisGallery) {

				var playListId = $thisGallery.data('playlistid');
				var dataUrl = 'http://gdata.youtube.com/feeds/api/playlists/' + playListId + '?alt=json&v=2';

				$.ajax({
					url: dataUrl,
					dataType: "jsonp"
				}).done(
					$.proxy(VideoLoad._createGallery, $thisGallery[0])
				).fail(function () {
					$thisGallery.addClass('js-load-playlist');
				});

			},

			_createGallery: function (data) {
				var videos;
				var tmplMainVideo = $('#js-video-template-main').html();
				var tmplThumbVideo = $('#js-video-template-thumb').html();
				var playlist = data.feed.entry;
				var $thisGallery = $(this);

				var placeholderMain = $(this).attr('data-main-placeholder');
				var imageMain = $(this).attr('data-main-image');
				var placeholderThumb = $(this).attr('data-thumb-placeholder');

				videos = VideoLoad._generateVideoData($thisGallery, playlist);
				VideoLoad._renderThumbs($thisGallery, videos, placeholderThumb, tmplThumbVideo);
				VideoLoad._renderMain($thisGallery, videos[0], placeholderMain, imageMain, tmplMainVideo);
				$.publish('/carousel/setup');
			},

			_renderThumbs: function ($thisGallery, videos, placeholder, template) {
				var $carouselContent = $thisGallery.find('.js-carousel-content');
				for (var i = 0; i < videos.length; i++) {
					var currentVideo = videos[i];
					currentVideo.placeholderThumb = placeholder;
					this._compileAndInsertTemplate($carouselContent, template, currentVideo, 'append', false);
				}
				$carouselContent.find('li').first().addClass('is-selected');
			},

			_renderMain: function ($thisGallery, video, placeholder, image, template) {
				var $videoContainer = $thisGallery.find('.js-video-container');
				video.placeholderMain = placeholder != '' ? placeholder : video.imageLarge;
				video.imageMain = image;
				this._compileAndInsertTemplate($videoContainer, template, video, 'overwrite', true);
			},

			_compileAndInsertTemplate: function ($container, template, vars, action, lazyload) {
				var compiledTemplate;
				var insertionType = action === 'append' ? 'append' : 'html';
				template = template.replace(/(\r\n|\n|\r)/gm, '');
				compiledTemplate = templayed(template)(vars);
				$container[insertionType](compiledTemplate);

				lazyload === true && $.publish('/lazyload/image', [$container.find('img')]);
			},

			_lazyLoadPlaceholder: function ($container) {
				var $placeholder = $container.find('.lazy-load');
				$.publish('/lazyload/image', $placeholder);
			},

			_generateVideoData: function ($thisGallery, playlist) {
				var videos = [];

				$.each(playlist, function () {
					var info = this.media$group;
					if (info.media$description) {
						var video = {
							title: info.media$title.$t,
							description: info.media$description.$t,
							videoId: info.yt$videoid.$t,
							imageThumb: info.media$thumbnail[0].url,
							imageLarge: info.media$thumbnail[2].url
						};
						videos.push(video);
					}
				});

				return videos;
			},

			loadVideo: function (e) {
				e.preventDefault();
				var thisVid = this;
				require(['app/ui/video/common', 'app/ui/video/youtube'], function (VideoCommon, YouTube) {
					VideoCommon.init( thisVid );
					YouTube.init( thisVid );
				});
			},

			cloneRotatorVideos: function () {
				$('#js-rotator').find('.js-video-pane').each(function () {
					var $thisPane = $(this);
					var $clone = $thisPane.clone();
					$thisPane.closest('li').data('video.clone', $clone);
				});
			},

			_initVideoEvent: function () {
				$('.js-video-gallery').on('click', '.js-video', VideoLoad.loadVideo);
			},

			_youkouVideoHeight: function () {
				if ($('.js-youku-player-load').length) {
					$('.js-youku-player-load').each(function () {
						var $player = $(this);
						var playerWidth = $player.width();
						var playerHeight = (playerWidth / 1.78) + 40;
						$player.find('iframe').attr('height', playerHeight);
					});
				}
			}

		};
	}
);