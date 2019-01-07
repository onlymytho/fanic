// View star list
function open_view_list() {
    document.querySelector('.starListDiv').classList.toggle('open');
    ga('send', 'event', 'View list', 'Click view list');
    return false;
  }
  