function makeString(array, separator) {
    var new_str = "";
    for (var i = 0; i < array.length; i++) {
        if (i > 0) new_str += separator;
            new_str += array[i];
    }

    return new_str;
}


function jqHover(selector, property, value) {
    var current_value;
    $(selector).mouseenter(function() {
        current_value = $(this).css(property);
        $(this).css(property, value);
    }).mouseleave(function() {
        $(this).css(property, current_value);
    });
}


$(document).ready(function() {

        // Get the screen resolution
        var width = $(window).width();
        var height = $(window).height();
	    if (width < 800) {
            if (width < height) {
                height = width;
            } else {
                width = height;
            }
        } else {
            width = 800;
        }
        if (height < 800) {
            if (height < width) {
                width = height;
            } else {
                height = width;
            }
        } else {
            height = 800;
        }
        var current_url = window.location.href;
        current_url = current_url.split('_');
        if (current_url.length < 2) {
            var span = '1.9991229'
            var wh = 
'?_r_'+width+'_x_'+height+'_ReC_0.0000017_ImC_0.6666666_Xmin_-'+span+'_Xmax_'+span+'_Ymin_-'+span+'_Ymax_'+span+'_w_r';
            window.location.href = window.location.href+wh;
        }
        else {
            // Set the values
            // For title
            var title_text = $('title').text() + ' for c = '+current_url[6]+' + '+current_url[8]+'i. Coordinates: Real from '+current_url[10]+' to '+current_url[12]+' Imaginary from '+current_url[14]+' to '+current_url[16];
            $('title').text(title_text);
            // For inputs
            $("input[name$='ReC']").val(current_url[6]);
            $("input[name$='ImC']").val(current_url[8]);
            $("input[name$='Xmin']").val(current_url[10]);
            $("input[name$='Xmax']").val(current_url[12]);
            $("input[name$='Ymin']").val(current_url[14]);
            $("input[name$='Ymax']").val(current_url[16]);
            // Set the picture
            var query = 'cgi-bin/julia?_'+makeString(current_url.slice(1), '_');
            $.get(query, function(){
                $('#set').attr('src', 'img/loading.gif');
            }).done(function(data) {
                var img_string = 'data:image/png;base64,'+data.split('Status:')[0].trim();
                $('#set').attr('src', img_string);
            });
            // Set the color scheme
            var background_color = current_url[17];
            var bc;
            var color = current_url[18];
            // Set the background
            switch (background_color) {
                case 'b':
                    $('body').css('background', 'black');
                    $('#cursorRect').css('border-color', 'rgba(255, 255, 255, 0.66)');
                    jqHover('h2', 'color', 'black');
                    jqHover('a', 'color', 'black');
                    $('select').css('color', 'black');
                    bc = 'black';
                    $('#black').prop('selected', true);
                    break;
                case 'w':
                    $('body').css('background', 'white');
                    $('#cursorRect').css('border-color', 'rgba(0, 0, 0, 0.66)');
                    jqHover('h2','color', 'white');
                    jqHover('a', 'color', 'white');
                    $('select').css('color', 'white');
                    bc = 'white';
                    $('#white').prop('selected', true);
                    break;
            }
            // Set the color
            var red = 0;
            var green = 0;
            var blue = 0;
            if (color.indexOf('r') >= 0) {
                red = 255;
                $('#red').prop('checked', true);
            }
            if (color.indexOf('g') >= 0) {
                green = 255;
                $('#green').prop('checked', true);
            }
            if (color.indexOf('b') >= 0) {
                blue = 255;
                $('#blue').prop('checked', true);
            }
            // Visibility check
            if (background_color == 'b') {
                if (red == 0 && green == 0 && blue == 0) {
                    red = 255;
                    green = 255;
                    blue = 255;
                }
            }
            if (background_color == 'w') {
                if (red == 255 && green == 255 && blue == 255) {
                    red = 0;
                    green = 0;
                    blue = 0;
                }
            }
            // Set the css colors        
            var current_color = 'rgba('+String(red)+', '+String(green)+', '+String(blue)+', 0.66)';
            $('body').css('color', current_color);
            $('a').css('color', current_color);
            $('h2').css('border-color', current_color);
            jqHover('h2', 'background-color', current_color);
            $('input').css('color', current_color);
            $('select').css('background-color', current_color);
            $('input').focus(function() {
                $(this).css('background-color', current_color);
                $(this).css('color', bc);
            }).focusout(function() {
                $(this).css('background-color', 'transparent');
                $(this).css('color', current_color);
            });
        }
        // Event listeners
        $('img').on('click', function(event) {
            // current_url convertion
            // Extract the current current_url from the url
            var xresolution = parseFloat(current_url[2]);
            var yresolution = parseFloat(current_url[4]);
            var x_min = parseFloat(current_url[10]);
            var x_max = parseFloat(current_url[12]);
            var y_min = parseFloat(current_url[14]);
            var y_max = parseFloat(current_url[16]);
            var new_x = event.pageX - this.offsetLeft;
            var new_y = event.pageY - this.offsetTop;
            var x_mn = x_min+((new_x-80)/xresolution)*(x_max-x_min);
            var x_mx = x_min+((new_x+80)/xresolution)*(x_max-x_min);
            var y_mn = y_min+((new_y-80)/yresolution)*(y_max-y_min);
            var y_mx = y_min+((new_y+80)/yresolution)*(y_max-y_min);
            current_url[10] = String(x_mn.toFixed(12));
            current_url[12] = String(x_mx.toFixed(12));
            current_url[14] = String(y_mn.toFixed(12));
            current_url[16] = String(y_mx.toFixed(12));
            window.location.href = makeString(current_url, '_');
        });
        $('img').on('mousemove', function(event) {
            $(this).css('cursor', 'none');
            var x = event.pageX - 80;
            var y = event.pageY - 80;
            $('#cursorRect').css('top', y).css('left', x);
            var xresolution = parseFloat(current_url[2]);
            var yresolution = parseFloat(current_url[4]);
            var x_min = parseFloat(current_url[10]);
            var x_max = parseFloat(current_url[12]);
            var y_min = parseFloat(current_url[14]);
            var y_max = parseFloat(current_url[16]);
            var new_x = event.pageX - this.offsetLeft;
            var new_y = event.pageY - this.offsetTop;
            x_mn = x_min+((new_x-80)/xresolution)*(x_max-x_min);
            x_mx = x_min+((new_x+80)/xresolution)*(x_max-x_min);
            y_mn = y_min+((new_y-80)/yresolution)*(y_max-y_min);
            y_mx = y_min+((new_y+80)/yresolution)*(y_max-y_min);
            $("input[name$='Xmin']").val(x_mn.toFixed(12));
            $("input[name$='Ymin']").val(y_mn.toFixed(12));
            $("input[name$='Xmax']").val(x_mx.toFixed(12));
            $("input[name$='Ymax']").val(y_mx.toFixed(12));
        });
        $('img').on('mouseenter', function(event) {
            var x = event.pageX - 80;
            var y = event.pageY - 80;
            $('#cursorRect').css('top', y).css('left', x);
            $('#cursorRect').show();
        });
        $('img').on('mouseleave', function(event) {
            $('#cursorRect').hide();
            // Extract the current current_url back from the url
            var x_min = parseFloat(current_url[10]);
            var x_max = parseFloat(current_url[12]);
            var y_min = parseFloat(current_url[14]);
            var y_max = parseFloat(current_url[16]);
            $("input[name$='Xmin']").val(x_min.toFixed(12));
            $("input[name$='Ymin']").val(y_min.toFixed(12));
            $("input[name$='Xmax']").val(x_max.toFixed(12));
            $("input[name$='Ymax']").val(y_max.toFixed(12));
        });
        // Form submit
        $('form').submit(function(event) {
            event.preventDefault();
            current_url[6] = $("input[name$='ReC']").val();
            current_url[8] = $("input[name$='ImC']").val();
            current_url[10] = $("input[name$='Xmin']").val();
            current_url[12] = $("input[name$='Xmax']").val();
            current_url[14] = $("input[name$='Ymin']").val();
            current_url[16] = $("input[name$='Ymax']").val();
            window.location.href = makeString(current_url, '_');
        });
        // Form reset
        $('#reset').click(function(event) {
            event.preventDefault();
            $("input[name$='Xmin']").val(-2);
            $("input[name$='Ymin']").val(-2);
            $("input[name$='Xmax']").val(2);
            $("input[name$='Ymax']").val(2);
        });
        // Color form
        $('#colorScheme').on('click', function() {
            $('#colorForm').toggle();
        });
        $('#colorForm').submit(function(event) {
            event.preventDefault();
            current_url[17] = $('#background').val();
            var new_color = "";
            if ($('#red').prop('checked')) {
                new_color += $('#red').val();
            }
            if ($('#green').prop('checked')) {
                new_color += $('#green').val();
            }
            if ($('#blue').prop('checked')) {
                new_color += $('#blue').val();
            }
            current_url[18] = new_color;
            window.location.href = makeString(current_url, '_');
        });
});
