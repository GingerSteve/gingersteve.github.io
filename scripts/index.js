$(function() {
  var navPos = Math.floor($('nav').position().top);
  var navHeight = $('nav').outerHeight();

  var navLinks = $('nav a').map(function(i) {
    return $(this).attr('href');
  });

  // Update the position of the nav bar when the window is resized
  $(window).resize(function(e) {
    navPos = $('#main').position().top + $('#main').outerHeight(true) - $('nav').outerHeight(true);
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
        let sectionPos = $(sectionId).offset().top - navHeight - 4;
        let sectionHeight = $(sectionId).height();

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
      scrollTop: $(elem).offset().top - navHeight
    }, 250);
  });
})