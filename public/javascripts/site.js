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

        $.ajax({
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
        });

        $.ajax( {
            url : "/getWikiPage?term=" + ui.item.value, 
            success : function(data) { 
              //$('div.container-fluid').append("<div class='row' id='divWikiResults'><div class='col-xs-8'><iframe id='divWikiPage' style='display: block' style='width:100%'></iframe></div> <div class='col-xs-4'>here is the you tube</div></div>");
              $('#divWikiPage').attr('src',data);
              //$('#divWikiResults').slideDown(1000);
              //$('#divWikiPage').html(data); 
            }
          });

        $( "#txtSearch" ).val( ui.item.value);
        return false;
      }
    });


  // $( "#searchVideos").bind('click', function(){
  //   $.ajax( {
  //       url : "/searchArtist",
  //       type : 'POST',
  //       datatype : 'json',
  //       data : {'term' : $('#txtSearch').val().trim() },
  //       success : function(data) { 
  //         if(data['items']) {
  //           var items = data['items'];
  //           var content = '';
  //           for(var i in items)  {
  //               content += "<div class='media'><a class='pull-left' href='#'> \
  //               <img src='"+items[i]['snippet']['thumbnails']['default']['url']+"' alt='"+items[i]['snippet']['title']+"' class='img-thumbnail' /> \
  //               </a> <div class='media-body'> <h4 class='media-heading'>"+items[i]['snippet']['title']+"</h4> "+items[i]['snippet']['description']+"</div></div>";
  //           };
  //           $('#video_playlist').html(content);
  //         } else {

  //           console.log(data);
  //         }
  //       }
  //     });
  //   });

  
});

function playVideo() {

};