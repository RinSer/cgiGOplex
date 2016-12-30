package main

/**
 * CGI-script that creates specified Mandelbrot set images as base64 strings.
 * 
 * created by RinSer
 */


import (
    "fmt"
	"image"
	"image/png"
    "math/cmplx"
    "bytes"
    "encoding/base64"
    "net/http"
    "strings"
    "strconv"
    "net/http/cgi"
)


func MakePic(dx, dy int, data [][]uint8, background, color string) string {
    // Color settings
    var red, green, blue uint8
    if strings.IndexRune(color, 'r') == -1 {
        red = 0
    } else {
        red = 255
    }
    if strings.IndexRune(color, 'g') == -1 {
        green = 0
    } else {
        green = 255
    }
    if strings.IndexRune(color, 'b') == -1 {
        blue = 0
    } else {
        blue = 255
    }
	// Image creation
	m := image.NewRGBA(image.Rect(0, 0, dx, dy))
	for y := 0; y < dy; y++ {
		for x := 0; x < dx; x++ {
			v := data[y][x]
            i := y*m.Stride + x*4
            if background == "b" {
                if red == 255 {
			        m.Pix[i] = v
                } else {
                    m.Pix[i] = 255-v
                }
                if green == 255 {
                    m.Pix[i+1] = v
                } else {
			        m.Pix[i+1] = 255-v
                }
                if blue == 255 {
                    m.Pix[i+2] = v
                } else {
			        m.Pix[i+2] = 255-v
                }
			    m.Pix[i+3] = v
            } else {
                v = 255-v
                if red == 255 {
			        m.Pix[i] = 255
                } else {
                    m.Pix[i] = v
                }
                if green == 255 {
                    m.Pix[i+1] = 255
                } else {
			        m.Pix[i+1] = v
                }
                if blue == 255 {
                    m.Pix[i+2] = 255
                } else {
			        m.Pix[i+2] = v
                }
			    m.Pix[i+3] = 255-v
            }
		}
	}
    // Encode the image base64
    var buf bytes.Buffer
	err := png.Encode(&buf, m)
	if err != nil {
		panic(err)
	}
	
    return base64.StdEncoding.EncodeToString(buf.Bytes())
}


func Mandelbrot(dx, dy int, xs, xe, ys, ye float64) [][]uint8 {
    // Initialize the complex plane
    cplane := make([][]uint8, dy)
    for y := 0; y < dy; y++ {
        cplane[y] = make([]uint8, dx)
        for x := 0; x < dx; x++ {
            re := xs+float64(x)/float64(dx)*(xe-xs)
            im := ys+float64(y)/float64(dy)*(ye-ys)
            c := complex(re, im)
            z := complex(0, 0)
            f := z*z + c
            iteration := 0
            for iteration < 255 {
                if cmplx.Abs(f) > 2 {
                    cplane[y][x] = uint8(iteration)
                    break
                }
                f = f*f + c
                iteration++
            }
            if iteration == 255 {
                cplane[y][x] = uint8(255)
            }
        }
    }
    return cplane
}


func viewHandler(w http.ResponseWriter, r *http.Request) {
    // Fetch the url query parameters
	url := r.URL.RawQuery
    params := strings.Split(url, "_")
    // Make the picture string
    if len(params) > 3 {
        var xresolution, yresolution int64        
        xscreen, _ := strconv.ParseInt(params[2], 10, 16)
        yscreen, _ := strconv.ParseInt(params[4], 10, 16)
        xresolution = 800
        yresolution = 800
        if xscreen < xresolution {
            xresolution = xscreen
            yresolution = xscreen
        }
        if yscreen < yresolution {
            xresolution = yscreen
            yresolution = yscreen
        }
        // Params
        var xmin, xmax, ymin, ymax float64
        // Colors
        var bw, rgb string
        if len(params) < 15 {
            xmin = -2
            xmax = 0.75
            ymin = -1.5
            ymax = 1.5
            bw = "w"
            rgb = "b"
        } else {
            xmin, _ = strconv.ParseFloat(params[6], 64)
            xmax, _ = strconv.ParseFloat(params[8], 64)
            ymin, _ = strconv.ParseFloat(params[10], 64)
            ymax, _ = strconv.ParseFloat(params[12], 64)
            bw = params[13]
            rgb = params[14]
        }
        // Create the picture string
        mandelbrot_set := Mandelbrot(int(xresolution), int(yresolution), xmin, xmax, ymin, ymax)
	    image := MakePic(int(xresolution), int(yresolution), mandelbrot_set, bw, rgb)
        // Print the picture
        fmt.Println("Content-type: text/html\n\n")
        fmt.Println(image)
    } else {
        fmt.Println("Content-type: text/html\n\n")
        fmt.Println("<h1>I do not understand you talking like this!</h1>")
    }
}


func main() {
    if err := cgi.Serve(http.HandlerFunc(viewHandler)); err != nil {
        fmt.Println(err)
    }
}


