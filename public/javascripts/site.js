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
        $( "#txtSearch" ).val( ui.item.value );
        return false;
      }
    });
});