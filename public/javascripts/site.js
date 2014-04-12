$(document).ready(function(){

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

        $.ajax( {
            url : "/getWikiPage?term=" + ui.item.value, 
            success : function(data) { 
              //$('div.container-fluid').append("<div class='row' id='divWikiResults'><div class='col-xs-8'><iframe id='divWikiPage' style='display: block' style='width:100%'></iframe></div> <div class='col-xs-4'>here is the you tube</div></div>");
              $('#divWikiPage').attr('src',data);
              //$('#divWikiResults').slideDown(1000);
              //$('#divWikiPage').html(data); 
            }
          });

        $( "#txtSearch" ).val( ui.item.value );
        return false;
      }
    });
});