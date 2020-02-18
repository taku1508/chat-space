$(function(){
  function buildHTML(message){
    if ( message.image ) {
      var html =
       `<div class="list__box" data-message-id=${message.id}>
          <div class="list__box__upper">
            <div class="list__box__upper__name">
              ${message.user_name}
            </div>
            <div class="list__box__upper__time">
              ${message.created_at}
            </div>
          </div>
          <div class="list__box__message">
              ${message.content}
          </div>
          <img src=${message.image} >
        </div>`
      return html;
    } else {
      var html =
       `<div class="list__box" data-message-id=${message.id}>
          <div class="list__box__upper">
            <div class="list__box__upper__name">
              ${message.user_name}
            </div>
            <div class="list__box__upper__time">
              ${message.created_at}
            </div>
          </div>
          <div class="ist__box__message">
              ${message.content}
          </div>
        </div>`
      return html;
    };
  }
  $('#new_message').on('submit', function(e){
    e.preventDefault()
    var formData = new FormData(this);
    var url = $(this).attr("action");
    $('#send-btn').removeAttr('data-disable-with');

      $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        dataType: 'json',
        processData: false,
        contentType: false
      })
      .done(function(data){
        var html = buildHTML(data);
        $('.list').append(html);
        $('.list').animate({ scrollTop: $('.list')[0].scrollHeight});
        $('form')[0].reset();
        autoScroll();
      })
      .fail(function() {
      alert("メッセージ送信に失敗しました");
      });
  });

  var reloadMessages = function() {
    last_message_id = $('.message:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.lenght !== 0){
        var insertHTML = '';
        $.each(messages, function(i,message){
          insertHTML += buildHTML(message)
        });
        $('.messages').append(insertHTML);
        $('.messages').animate({ scrollTop: $('.message')[0].scrollHeight});
      }
    })
    .fail(function() {
      console.log('error');
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages,7000);
  }
});