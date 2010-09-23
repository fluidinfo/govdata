/*
 * FluidDB government metadata search'o'meter
 *
 * (c) 2010 Fluidinfo Inc. http://fluidinfo.com
 *
 * Based upon the Sammy javascript framework: http://code.quirkey.com/sammy/
 */
(function($) {
    var app = $.sammy(function() {
        /**********************************************************************
         *
         * UI Helper functions
         *
         *********************************************************************/

        /*
         * Displays the results of a search of FluidDB
         */
        function search_results(data, context){
            // cache the jQuery object
            var $search_results = $('#search_results');
            // empty the element
            $('#loading').hide();
            $search_results.empty();
            // add the results
            $search_results.append('<h2>Results</h2><p>Objects with the following ids match your query:</p>');
            if (data.ids.length>0) {
                var ol = "";
                for(o in data.ids) {
                    var obj_id = data.ids[o];
                    ol = ol + '<div class="result"><a href="#/show?id='+obj_id+'">'+obj_id+'</a></div>'
                }
                $search_results.append(ol);
            } else {
                $search_results.append('<div>None found. Please try again...</div>');
            }
        }

        /**********************************************************************
         *
         * Routes
         *
         *********************************************************************/
        
        /*
         * Search FluidDB using the query language described here:
         *
         * http://doc.fluidinfo.com/fluidDB/queries.html
         *
         */
        this.post('#/search', function(context) {
            var search_term = context['params']['search'];
            // Basic validation
            if (search_term.length > 0) {
                try {
                    $('#loading').show();
                    fluidDB.get('objects?query='+escape(search_term), function(data){search_results(data, context);}, true, context.auth);
                }
                catch (err) {
                    $('#loading').hide();
                    $('#search_results').append('<h3>There was a problem with your search :-(<h3><p>Please try again...</p>');
                }
            } else {
            // oops...
                alert('You must enter something to search for...');
            }
        });

        /*
         * Search FluidDB with a GET request made using the query language
         * referenced above.
         */
        this.get(/\#\/(.*)$/, function(context) {
            var search_term = this.params["splat"][0];
                try {
                    // update the UI and get the search request from FluidDB
                    $('#loading').show();
                    $("#search_box").val(search_term.replace("%20"," "));
                    fluidDB.get('objects?query='+search_term, function(data){search_results(data, context);}, true, context.auth);
                }
                catch (err) {
                    $('#loading').hide();
                    $('#search_results').append('<h3>There was a problem with your search :-(<h3><p>Please try again...</p>');
                }
        });
    });

    $(function() {
        app.run();
    });
})(jQuery);
