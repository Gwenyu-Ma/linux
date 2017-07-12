define(function() {
  return {
    init: function(menu, data) {
      menu.on('click', 'li>a', function() {
        var li = $(this).parent('li');
        var panel = $(this).siblings('ul');
        if (li.hasClass('open')) {
          panel.slideUp();
          li.removeClass('open');
        } else {
          var siblingsLi = li.siblings('li');
          siblingsLi.find('>ul').slideUp();
          siblingsLi.removeClass('open');
          if (panel.length > 0) {
            panel.slideDown();
            li.addClass('open');
          } else {
            //event.data.menu.find('li').removeClass('active');
            menu.find('li').removeClass('active current');
            li.addClass('active current');
            li.parentsUntil('.side-menu', 'li').addClass('active');
            return;
          }
        };
        return false;
      });
      menu.on('click','>li>a', function() {
        iconSwitch($(this).find('>i.fa-chevron-down,>i.fa-chevron-up'));
        $(this).parent('li').siblings('li').find('>a>i.fa-chevron-up').removeClass('fa-chevron-up').addClass('fa-chevron-down');
      });
      function iconSwitch(icon) {
        if(icon.hasClass('fa-chevron-down')) {
          icon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
        }
        else {
          icon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
        }
      };
    }
  }
});