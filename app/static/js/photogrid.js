COOKIE_NAME_GRIDPAGE = "lastGridPage";

var el_win = $(window);
var el_doc = $(document);

// var scroll_load_more_enabled ... set in photogrid.html
var scroll_enabled = true; // to disable temp. only works if scroll_load_more_enabled is true.


$(document).ready(function(){
    // Set hover handler
    $(".photo-container").each(function() {
        set_photo_hover_handler($(this));
    });

    // Set scroll handler
    if (scroll_load_more_enabled) {
        el_win.scroll(function() {
            check_scroll_bottom();
        });
        check_scroll_bottom();
    }

    // If user comes back from an image after loading more, auto-load more
//    var grid_page_last = getCookie(COOKIE_NAME_GRIDPAGE);
//    if (grid_page_last) {
//        console.log("--- skip to page " + grid_page_last);
//    }
//    setCookie(COOKIE_NAME_GRIDPAGE, "", 30);
});

function set_photo_hover_handler(el) {
    // Update hover mechanism for all photos (at start and after loading another page)
    el.hover(function() {
        $(this).find(".photo-caption").show();
    }, function() {
        $(this).find(".photo-caption").hide();
    })
}

// Stuff for loading more pages
var is_loading = false;
var page = 0;
var last_response;

function load_photos() {
    if (is_loading) {
        console.log("Already loading.");
        return;
    }

    if (last_response && !last_response.has_more) {
        console.log("Cannot load page; no more available");
        return;
    }

    // Toggle loading ui state
    is_loading = true;
    $("#photo-container-more .default").hide();
    $("#photo-container-more .loading").show();

    // Build arguments
    console.log(photogrid_info);

    // Make ajax request
    $.get("/ajax/photo/more", photogrid_info, function(data) {
        d = JSON.parse(data);
        photogrid_info["last_hash"] = d.last_hash;

        for (var i=0; i<d.photos.length; i++) {
            item = $(d.photos[i]);
            item.insertBefore("#photo-container-more");
            set_photo_hover_handler(item);
        }

        if (d.has_more) {
            $("#photo-container-more .default").show();
            $("#photo-container-more .loading").hide();
        } else {
            $("#photo-container-more").hide();
        }

        is_loading = false;
        if (window.onMorePhotosLoaded) {
            window.onMorePhotosLoaded();
        }

        page++;
//        setCookie(COOKIE_NAME_GRIDPAGE, page, 30);

        last_response = d;
    })
}

// Scroll helper
function check_scroll_bottom() {
    if (scroll_enabled) {
        if (el_win.scrollTop() >= el_doc.height() - el_win.height() - 40) {
            load_photos();
        }
    }
}

//function setCookie(cookie_name, value, min_valid) {
//    var base_date = new Date(), expiry_date = new Date(base_date);
//    expiry_date.setMinutes(base_date.getMinutes() + min_valid);
//
//    var c_value=escape(value) + ((expiry_date==null) ? "" : "; expires="+expiry_date.toUTCString());
//    document.cookie=cookie_name + "=" + c_value;
//}
//
//function getCookie(cookie_name) {
//    var i,x,y,ARRcookies=document.cookie.split(";");
//    for (i=0;i<ARRcookies.length;i++) {
//        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
//        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
//        x=x.replace(/^\s+|\s+$/g,"");
//        if (x==cookie_name) {
//            return unescape(y);
//        }
//    }
//}
