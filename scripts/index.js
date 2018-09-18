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

  $('.open-modal-button').click(function(e) {
    let modal = $(this).closest('.work-item').children('.modal');
    modal.fadeIn(250);
    $('body').addClass('modal-open');

    // If the modal contains an iframe, autoplay
    let video = modal.find('iframe')[0];
    if (video)
      video.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
  });

  function closeModal(modal) {
    // If the modal contains an iframe, stop it before exiting
    let video = modal.find('iframe')[0];
    if (video)
      video.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');

    modal.fadeOut(250);
    $('.Wallop-item--showNext').removeClass('Wallop-item--showNext');
    $('.Wallop-item--hideNext').removeClass('Wallop-item--hideNext');
    $('.Wallop-item--showPrevious').removeClass('Wallop-item--showPrevious');
    $('.Wallop-item--hidePrevious').removeClass('Wallop-item--hidePrevious');
    $('body').removeClass('modal-open');
  }

  $('.modal').click(function(e) {
    closeModal($(this));
  });

  $('.close-modal-button').click(function(e) {
    closeModal($(this).closest('.modal'));
  });

  $('.modal-pane').click(function(e) {
    e.stopPropagation();
  });

  $('.Wallop').each(function(w) {
    let wallop = new Wallop(this);

    wallop.on('change', function(e) {
      let index = e.detail.currentItemIndex;
      let descIndex = $(e.target).find('img').eq(index).data('desc-index');
      $(e.target).parent().find('.description-list p').hide();
      $(e.target).parent().find('.description-list p').eq(descIndex).show();
    });
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