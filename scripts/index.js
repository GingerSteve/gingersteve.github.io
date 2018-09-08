$(function() {
  var navPos = $('nav').position().top;

  // Update the position of the nav bar when the window is resized
  $(window).resize(function(e) {
    navPos = $('#main').position().top + $('#main').outerHeight(true) - $('nav').outerHeight(true);
    $(window).scroll();
  });

  $(window).scroll(function(e) {
    var windowPos = $(window).scrollTop();

    if (windowPos >= navPos - 1)
      $('nav').addClass('fixed');
    if (windowPos < navPos)
      $('nav').removeClass('fixed');
  });

  // Nav links to sections
  $('.page-link').click(function(e) {
    e.preventDefault();

    var elem = $(this).attr('href');
    $('html, body').animate({
      scrollTop: $(elem).offset().top
    }, 250);
  });
})