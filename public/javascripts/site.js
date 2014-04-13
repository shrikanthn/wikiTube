$(document).ready(function(){

  $('#topMenu').bind('click', function(evt){
    $('#divSearchTool').slideDown(500);
    $('#topMenu').hide();
  });

	$( "#txtSearch" ).autocomplete({
      minLength: 2,
      source: function( request, response ) 
      {
          $.ajax( {
            url : "/getWikiOptions?term=" + request.term, 
            success : function(data) { 
              response(data[1]); 
            }
          });
      },
      select: function( event, ui ) {

        /*$.ajax({
            url : "/getEntities?term=" + ui.item.value, 
            success : function(data) { 
            if(data['items']) {
              var items = data['items'];
              var content = '';
              for(var i in items)  {
                  content += "<div class='media'><a class='pull-left' href='#'> \
                  <img src='"+items[i]['snippet']['thumbnails']['default']['url']+"' alt='"+items[i]['snippet']['title']+"' class='img-thumbnail' /> \
                  </a> <div class='media-body'> <h4 class='media-heading'><a class='youtube' rel='"+items[i]['id']['videoId']+"' href='javascript::void(0)'>"+items[i]['snippet']['title']+"</a></h4> "+items[i]['snippet']['description']+"</div></div>";
              };
              $('#video_playlist').html(content);

              $('a.youtube',$('#video_playlist')).click('bind',function(evt){
                $('#youtube_video').html('<iframe id="ytplayer" type="text/html" width="425" height="349" src="http://www.youtube.com/embed/'+$(this).attr('rel')+'?autoplay=1&origin=http://example.com" frameborder="0"/>');                
                $("html, body").animate({ scrollTop: 0 }, "slow");          
                // $('#ytplayer').attr('src', "http://www.youtube.com/embed/"+$(this).attr('rel')+"?autoplay=1&origin=http://example.com");
              });

              $('#youtube_video').html('');
              $('#youtube_video').html('<iframe id="ytplayer" type="text/html" width="425" height="349" src="http://www.youtube.com/embed/'+content[0]['id']['videoId']+'?autoplay=1&origin=http://example.com" frameborder="0"/>');                
              $('#youtube_video').slideDown(1000);
              $('#divSearchTool').slideUp(1000);
              $('#topMenu').show();
            };
          }
        });*/

        $.ajax( {
            url : "/getWikiPage?term=" + ui.item.value, 
            success : function(data) { 
              //$('div.container-fluid').append("<div class='row' id='divWikiResults'><div class='col-xs-8'><iframe id='divWikiPage' style='display: block' style='width:100%'></iframe></div> <div class='col-xs-4'>here is the you tube</div></div>");
              $.ajax({
                  url : "/getEntities?url=" + data, 
                  success : function(data) { 
                    getALlVideos(data);
                }
              });
              $('#divWikiPage').attr('src',data);
            }
          });

        $( "#txtSearch" ).val( ui.item.value);
        return false;
      }
    });
  
});

window.loadedVideos = {};

function getALlVideos(items) {
  $('#video_playlist').html('');
  for (var x in items) {
    $.ajax({
        url : "/searchYoutube", 
        type : 'POST',
        data : {'term' : items[x]},
        datetype : 'json',
        success : function(data) { 
        if(data['items']) {
          var items = data['items'];
          var content = '';

          for(var i in items)  {
            if(!window.loadedVideos[items[i]['id']['videoId']]) {
              content += "<div class='media'><a class='pull-left' href='#'> \
              <img src='"+items[i]['snippet']['thumbnails']['default']['url']+"' rel='"+items[i]['id']['videoId']+"' alt='"+items[i]['snippet']['title']+"' class='img-thumbnail' /> \
              </a> <div class='media-body'> <h4 class='media-heading'><a class='youtube' rel='"+items[i]['id']['videoId']+"' href='javascript:void(0)'>"+items[i]['snippet']['title']+"</a></h4> "+items[i]['snippet']['description']+"</div></div>";
              window.loadedVideos[items[i]['id']['videoId']] = items[i]['snippet']['title'];
            }
          };

          $('#video_playlist').append(content);
        }
      }
    });
  }
    $('body').delegate('a.youtube', 'click',function(evt){
      $('#youtube_video').html('<iframe id="ytplayer" type="text/html" width="425" height="349" src="http://www.youtube.com/embed/'+$(this).attr('rel')+'?autoplay=1&origin=http://example.com" frameborder="0"/>'); 
      $("html, body").animate({ scrollTop: 0 }, "slow");          
    // $('#ytplayer').attr('src', "http://www.youtube.com/embed/"+$(this).attr('rel')+"?autoplay=1&origin=http://example.com");
    });

    $('body').delegate('img.img-thumbnail', 'click',function(evt){
      $('#youtube_video').html('<iframe id="ytplayer" type="text/html" width="425" height="349" src="http://www.youtube.com/embed/'+$(this).attr('rel')+'?autoplay=1&origin=http://example.com" frameborder="0"/>'); 
      $("html, body").animate({ scrollTop: 0 }, "slow");          
    // $('#ytplayer').attr('src', "http://www.youtube.com/embed/"+$(this).attr('rel')+"?autoplay=1&origin=http://example.com");
    });

    $('#youtube_video').html('');
    $('#youtube_video').slideDown(1000);
    $('#divSearchTool').slideUp(1000);
    $('#topMenu').show();
    $('#btnViewEntities').show();
}

window.loadedEntities = {};
window.allEntities = '';

function viewEntities() {
  $.ajax({
    url : "/getAllEntities?url=" + $('#divWikiPage').attr('src'), 
    success : function(data) { 
      window.allEntities = data;
      if(!data['entities']) {
        return;
      }

      for(var i in data['entities']) {
        var o1 = data['entities'][i];
        if(window.loadedEntities[o1['type']]) {
          window.loadedEntities[o1['type']].push(o1['text']);
        } else {
          window.loadedEntities[o1['type']] = [];
          window.loadedEntities[o1['type']].push(o1['text']);
        }
      }
    },
    complete : function(arg1) {
      console.log(window.loadedEntities);
      createListFromJson(window.loadedEntities);
    }
  });

};

function createTableFromJson(data) {
  var headers = {};
  var content = '<table style="width:100%" class="table table-condensed table-striped table-bordered"><tr>';
  for(var i in data) {
    headers[i] = data[i].length;
    content += '<th>' + i + '</th>';
  }
  content += '</tr>';

  // find the max
  var maxRows = 0;
  for(var i in headers) {
    if(headers[i] > maxRows) {
      maxRows = headers[i];
    }
  }

  // for each for the max row, add  rows to the table
  for(var i =0; i<maxRows; i++) {
    var newRow = '<tr>';
    for(var j in headers) {
      if(i < headers[j]) {
        console.log(j + ' : ' + i);
          newRow += '<td>' + data[j][i] + '</td>';
      } else {
        newRow += '<td></td>';
      }
    }  
    content += newRow + '</tr>';
  }
  $('#modalBody').html(content);
  $('#filterModal').modal('show');
};


function createListFromJson(data) {
  var headers = {};
  var content = '<ul>';
  for(var i in data) {
    var lst = data[i];
    content += '<b>'+ i + '</b><ul>';
    for(var j in lst) {
      content += '<li>' + lst[j] + '</li>';
    }
    content += '</ul>';
  }
  content += '</ul>';
  $('#modalBody').html(content);
  $('#filterModal').modal('show');
};