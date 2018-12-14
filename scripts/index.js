$(function() {
  particlesJS.load('particles-js', './scripts/particlesjs-config.json');

  var navPos = $('nav').position().top;
  var navHeight = $('nav').outerHeight();

  var navLinks = $('nav a').map(function(i) {
    return $(this).attr('href');
  });

  // Update the position of the nav bar when the window is resized
  $(window).resize(function(e) {
    navPos = $('header').position().top + $('header').outerHeight(true) - $('nav').outerHeight(true);
    $(window).scroll();
  });

  $(window).scroll(function(e) {
    var windowPos = $(window).scrollTop();

    if (windowPos >= navPos)
      $('nav').addClass('fixed');
    else if (windowPos < navPos)
      $('nav').removeClass('fixed');

    if (windowPos + $(window).height() >= $(document).height()) {
      // Highlight last nav link if at bottom of page
      $('nav a').removeClass('active');
      $('nav a:last-child').addClass('active');
    } else {
      // Select the nav link corresponding to the current section
      for (let i = 0; i < navLinks.length; i++) {
        let sectionId = navLinks[i];
        let sectionPos = $(sectionId).offset().top - navHeight;
        let sectionHeight = $(sectionId).outerHeight();

        if (windowPos >= sectionPos && windowPos < (sectionPos + sectionHeight))
          $('a[href="' + sectionId + '"]').addClass('active');
        else
          $('a[href="' + sectionId + '"]').removeClass('active');
      }
    }
  });

  $('.section-link').click(function(e) {
    e.preventDefault();

    var elem = $(this).attr('href');
    $('html, body').animate({
      scrollTop: $(elem).offset().top - navHeight + 1
    }, 250);
  });

  $('.open-photoswipe-button').click(function(e) {
    let pswpElement = $('.pswp')[0];
    let items = [];

    $(this).siblings('.project-gallery').eq(0).children().each(function() {
      let img = $(this);
      items.push({
        src: img.data('src'),
        w: img.data('width'),
        h: img.data('height'),
        title: img.html()
      });
    });

    let options = {
      index: 0,
      showHideOpacity: true,
      getThumbBoundsFn: function(index) {
        let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
        return {x: $(window).width() / 2, y: $(window).height() / 2 + pageYScroll, w: 0};
      }
    };
    let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
  });

  $('.open-video-button').click(function(e) {
    let pswpElement = $('.pswp')[0];
    let src = $(this).siblings('.project-video').eq(0).data('src');

    let items = [{
      html: "<iframe src='" + src + "' frameborder='0' allowfullscreen></iframe>"
    }];

    let options = {
      tapToToggleControls: false,
      closeOnVerticalDrag: false
    };
    let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();

    // Stop video when PhotoSwipe is closed
    gallery.listen('close', function() {
      let video = $('.pswp iframe')[0];
      if (video)
        video.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
    });

    // Autoplay video when PhotoSwipe open animation is done
    setTimeout(function() {
      let video = $('.pswp iframe')[0];
      if (video)
        video.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    }, 500);
  });

  $('#contact-form').submit(function(e) {
    e.preventDefault();
    let button = $(this).children('.ajax-button');
    button.prop('disabled', true);
    button.addClass('loading');

    let array = $(this).serializeArray();
    let json = {};
    array.forEach(i => {
      json[i.name] = i.value;
    });

    var request = $.ajax({
      url: 'https://prt2rnb72i.execute-api.us-west-2.amazonaws.com/default/contact',
      method: 'POST',
      data: JSON.stringify(json),
    });

    request.done(function(resp) {
      button.removeClass('loading');
      button.addClass('success');

      setTimeout(function() {
        button.removeClass('success');
        button.prop('disabled', false);
      }, 2000);
    });

    request.fail(function(jqXHR, textStatus) {
      button.removeClass('loading');
      button.prop('disabled', false);
      alert('There was an issue sending your message, please try again later.');
    });

    button.blur();
  })
})