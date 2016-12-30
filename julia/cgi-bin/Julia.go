package main

/**
 * CGI-script that creates specified Julia set images as base64 strings.
 * 
 * created by RinSer
 */


import (
    "fmt"
	"image"
	"image/png"
    "math/cmplx"
    "encoding/base64"
    "bytes"
    "net/http"
    "strings"
    "strconv"
    "math"
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
			        m.Pix[i] = 255-v
                } else {
                    m.Pix[i] = v
                }
                if green == 255 {
                    m.Pix[i+1] = 255-v
                } else {
			        m.Pix[i+1] = v
                }
                if blue == 255 {
                    m.Pix[i+2] = 255-v
                } else {
			        m.Pix[i+2] = v
                }
			    m.Pix[i+3] = 255-v
            } else {
                if red == 255 {
			        m.Pix[i] = 255-v
                } else {
                    m.Pix[i] = v
                }
                if green == 255 {
                    m.Pix[i+1] = 255-v
                } else {
			        m.Pix[i+1] = v
                }
                if blue == 255 {
                    m.Pix[i+2] = 255-v
                } else {
			        m.Pix[i+2] = v
                }
			    m.Pix[i+3] = 255
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


func JuliaSet(dx, dy int, a, b, c, d float64, C complex128) [][]uint8 {
    // Compute the R value
    r := (1+math.Sqrt(1+4*cmplx.Abs(C)))/2
    // Initialize the complex plane
    cplane := make([][]uint8, dy)
    for y := 0; y < dy; y++ {
        cplane[y] = make([]uint8, dx)
        for x := 0; x < dx; x++ {
            var z complex128
            re := a+float64(x)/float64(dx)*(b-a)
            im := c+float64(y)/float64(dy)*(d-c)
            z = complex(re, im)
            f := z*z + C
            iteration := 0
            for iteration < 255 {
                if cmplx.Abs(f) > r {
                    cplane[y][x] = uint8(255-iteration*7)
                    break
                }
                f = f*f + C
                iteration++
            }
            if iteration == 255 {
                cplane[y][x] = uint8(0)
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
    if len(params) == 19 {
        // Set the image resolution
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
        var xmin, xmax, ymin, ymax, rec, imc float64
        var c complex128
        // Colors
        var bw, rgb string
        if len(params) < 19 {
            rec = 0
            imc = 1
            xmin = -2
            xmax = 2
            ymin = -2
            ymax = 2
            bw = "b"
            rgb = "r"
        } else {
            rec, _ = strconv.ParseFloat(params[6], 64)
            imc, _ = strconv.ParseFloat(params[8], 64)
            xmin, _ = strconv.ParseFloat(params[10], 64)
            xmax, _ = strconv.ParseFloat(params[12], 64)
            ymin, _ = strconv.ParseFloat(params[14], 64)
            ymax, _ = strconv.ParseFloat(params[16], 64)
            bw = params[17]
            rgb = params[18]
        }
        c = complex(rec, imc)
        // Create image
        julia_set := JuliaSet(int(xresolution), int(yresolution), xmin, xmax, ymin, ymax, c)
	    image := MakePic(int(xresolution), int(yresolution), julia_set, bw, rgb)
        // Print the image string
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


