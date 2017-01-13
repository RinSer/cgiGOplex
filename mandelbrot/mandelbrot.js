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
            var wh = '?_r_'+width+'_x_'+height+'_Xmin_-2_Xmax_0.75_Ymin_-1.5_Ymax_1.5_w_b';
            window.location.href = window.location.href+wh;
        }
        else {
            // Set the values
            // For title
            var title_text = $('title').text() +current_url[6]+' '+current_url[8]+' '+current_url[10]+' '+current_url[12];
            $('title').text(title_text);
            // For inputs
            $("input[name$='Xmin']").val(current_url[6]);
            $("input[name$='Xmax']").val(current_url[8]);
            $("input[name$='Ymin']").val(current_url[10]);
            $("input[name$='Ymax']").val(current_url[12]);
            // Set the picture
            var query = 'cgi-bin/mandelbrot?_'+makeString(current_url.slice(1), '_');
            $.get(query, function(){
                $('#mset').hide();
		$('#load').show();
            }).done(function(data) {
                var img_string = 'data:image/png;base64,'+data.split('Status:')[0].trim();
                $('#mset').attr('src', img_string);
		$('#load').hide();
		$('#mset').show();
            });
            // Set the color scheme
            var background_color = current_url[13];
            var bc;
            var color = current_url[14];
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
                    jqHover('h2', 'color', 'white');
                    jqHover('a', 'color', 'white');
                    $('select').css('color', 'white');
                    bc = 'white';
                    $('#white').prop('selected', true);
                    break;
            }
            // Set the color
            var redColor = 0;
            var greenColor = 0;
            var blueColor = 0;
            if (color.indexOf('r') >= 0) {
                redColor = 255;
                $('#redColor').prop('checked', true);
            }
            if (color.indexOf('g') >= 0) {
                greenColor = 255;
                $('#greenColor').prop('checked', true);
            }
            if (color.indexOf('b') >= 0) {
                blueColor = 255;
                $('#blueColor').prop('checked', true);
            }
            // Visibility check
            if (background_color == 'b') {
                if (redColor == 0 && greenColor == 0 && blueColor == 0) {
                    redColor = 255;
                    greenColor = 255;
                    blueColor = 255;
                }
            }
            if (background_color == 'w') {
                if (redColor == 255 && greenColor == 255 && blueColor == 255) {
                    redColor = 0;
                    greenColor = 0;
                    blueColor = 0;
                }
            }
            // Set the css colors        
            var current_color = 'rgba('+String(redColor)+', '+String(greenColor)+', '+String(blueColor)+', 0.66)';
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
            var x_min = parseFloat(current_url[6]);
            var x_max = parseFloat(current_url[8]);
            var y_min = parseFloat(current_url[10]);
            var y_max = parseFloat(current_url[12]);
            var new_x = event.pageX - this.offsetLeft;
            var new_y = event.pageY - this.offsetTop;
            var x_mn = x_min+((new_x-80)/xresolution)*(x_max-x_min);
            var x_mx = x_min+((new_x+80)/xresolution)*(x_max-x_min);
            var y_mn = y_min+((new_y-80)/yresolution)*(y_max-y_min);
            var y_mx = y_min+((new_y+80)/yresolution)*(y_max-y_min);
            current_url[6] = String(x_mn.toFixed(12));
            current_url[8] = String(x_mx.toFixed(12));
            current_url[10] = String(y_mn.toFixed(12));
            current_url[12] = String(y_mx.toFixed(12));
            var new_url = makeString(current_url, '_');
            // Design
            $('#mset').hide();
	    $('#load').show();
            // Set the values
            // For title
            var title_text = 'Mandelbrot set '+current_url[6]+' '+current_url[8]+' '+current_url[10]+' '+current_url[12];
            $('title').text(title_text);
            // For inputs
            $("input[name$='Xmin']").val(current_url[6]);
            $("input[name$='Xmax']").val(current_url[8]);
            $("input[name$='Ymin']").val(current_url[10]);
            $("input[name$='Ymax']").val(current_url[12]);
            // Set the picture
            var query = 'cgi-bin/mandelbrot?_'+makeString(current_url.slice(1), '_');
            $.get(query, function(){
                $('#mset').hide();
		$('#load').show();
            }).done(function(data) {
                var img_string = 'data:image/png;base64,'+data.split('Status:')[0].trim();
                $('#mset').attr('src', img_string);
		$('#load').hide();
		$('#mset').show();
            });
            // Set the URL
            window.history.replaceState({}, title_text, new_url);
        });
        $('img').on('mousemove', function(event) {
            $(this).css('cursor', 'none');
            var x = event.pageX - 80;
            var y = event.pageY - 80;
            $('#cursorRect').css('top', y).css('left', x);
            var xresolution = parseFloat(current_url[2]);
            var yresolution = parseFloat(current_url[4]);
            var x_min = parseFloat(current_url[6]);
            var x_max = parseFloat(current_url[8]);
            var y_min = parseFloat(current_url[10]);
            var y_max = parseFloat(current_url[12]);
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
            var x_min = parseFloat(current_url[6]);
            var x_max = parseFloat(current_url[8]);
            var y_min = parseFloat(current_url[10]);
            var y_max = parseFloat(current_url[12]);
            $("input[name$='Xmin']").val(x_min.toFixed(6));
            $("input[name$='Ymin']").val(y_min.toFixed(6));
            $("input[name$='Xmax']").val(x_max.toFixed(6));
            $("input[name$='Ymax']").val(y_max.toFixed(6));
        });
        // Form submit
        $('#coordinateForm').submit(function(event) {
            event.preventDefault();
            current_url[6] = $("input[name$='Xmin']").val();
            current_url[8] = $("input[name$='Xmax']").val();
            current_url[10] = $("input[name$='Ymin']").val();
            current_url[12] = $("input[name$='Ymax']").val();
            var new_url = makeString(current_url, '_');
            // Design
            $('#mset').hide();
	    $('#load').show();
            // Set the values
            // For title
            var title_text = 'Mandelbrot set '+current_url[6]+' '+current_url[8]+' '+current_url[10]+' '+current_url[12];
            $('title').text(title_text);
            // Set the picture
            var query = 'cgi-bin/mandelbrot?_'+makeString(current_url.slice(1), '_');
            $.get(query, function(){
                $('#mset').hide();
		$('#load').show();
            }).done(function(data) {
                var img_string = 'data:image/png;base64,'+data.split('Status:')[0].trim();
                $('#mset').attr('src', img_string);
		$('#load').hide();
		$('#mset').show();
            });
            // Set the URL
            window.history.replaceState({}, title_text, new_url);
        });
        // Form reset
        $('#reset').click(function(event) {
            event.preventDefault();
            $("input[name$='Xmin']").val(-2);
            $("input[name$='Ymin']").val(-1.5);
            $("input[name$='Xmax']").val(0.75);
            $("input[name$='Ymax']").val(1.5);
        });
        // Color form
        $('#colorScheme').on('click', function() {
            $('#colorForm').toggle();
        });
        $('#colorForm').submit(function(event) {
            event.preventDefault();
            current_url[13] = $('#backgroundColor').val();
            var new_color = "";
            if ($('#redColor').prop('checked')) {
                new_color += $('#redColor').val();
            }
            if ($('#greenColor').prop('checked')) {
                new_color += $('#greenColor').val();
            }
            if ($('#blueColor').prop('checked')) {
                new_color += $('#blueColor').val();
            }
            current_url[14] = new_color;
            window.location.href = makeString(current_url, '_');
        });
});
