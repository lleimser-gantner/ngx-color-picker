import * as i0 from '@angular/core';
import { inject, DOCUMENT, ElementRef, Directive, model, viewChild, effect, ChangeDetectionStrategy, Component, InjectionToken, Injectable, input, Inject, booleanAttribute, output, numberAttribute, HostListener, computed, signal, HostBinding, Pipe, NgModule } from '@angular/core';
import { NgClass, AsyncPipe, CommonModule } from '@angular/common';
import { Subject, merge, fromEvent, of, BehaviorSubject } from 'rxjs';
import { takeUntil, map, delay, distinctUntilChanged } from 'rxjs/operators';

class BaseColor {
    round(value, decimals = 2) {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }
}

/**
 * CMYK color space
 *
 * Cyan = ranges from 0 to 100%
 * Magenta = ranges from 0 to 100%
 * Yellow = ranges from 0 to 100%
 * blacK = ranges from 0 to 100%
 */
class Cmyk extends BaseColor {
    constructor(cyan, magenta, yellow, black) {
        super();
        this.cyan = cyan;
        this.magenta = magenta;
        this.yellow = yellow;
        this.black = black;
    }
    toString() {
        return `cmyk(${this.getCyan()}%, ${this.getMagenta()}%, ${this.getYellow()}%, ${this.getBlack()}%)`;
    }
    getCyan() {
        return Math.round(this.cyan);
    }
    getMagenta() {
        return Math.round(this.magenta);
    }
    getYellow() {
        return Math.round(this.yellow);
    }
    getBlack() {
        return Math.round(this.black);
    }
    equal(color) {
        if (this === color) {
            return true;
        }
        return this.cyan === color.cyan
            && this.magenta === color.magenta
            && this.yellow === color.yellow
            && this.black === color.black;
    }
}

/**
 * HSL and HSI are the same
 *
 * Hue = ranges from 0 to 360°
 * Saturation = ranges from 0 to 100%
 * Lightness or Intensity = ranges from 0 to 100%
 * Alpha = range from 0-1
 */
class Hsla extends BaseColor {
    constructor(hue, saturation, lightness, alpha) {
        super();
        this.hue = hue;
        this.saturation = saturation;
        this.lightness = lightness;
        this.alpha = alpha;
    }
    toString(showAlphaChannel = true) {
        return showAlphaChannel
            ? `hsla(${this.getHue()}, ${this.getSaturation()}%, ${this.getLightness()}%, ${this.getAlpha(true)})`
            : `hsl(${this.getHue()}, ${this.getSaturation()}%, ${this.getLightness()}%)`;
    }
    getHue() {
        return Math.round(this.hue);
    }
    getSaturation() {
        return Math.round(this.saturation);
    }
    getLightness() {
        return Math.round(this.lightness);
    }
    getAlpha(round = false) {
        if (round != false) {
            return this.round(this.getAlpha());
        }
        return this.alpha;
    }
    equal(color) {
        if (this === color) {
            return true;
        }
        return this.hue === color.hue
            && this.saturation === color.saturation
            && this.lightness === color.lightness
            && this.alpha === color.alpha;
    }
}

/**
 * HSB and HSV are the same
 *
 * Hue = ranges from 0 to 360°
 * Saturation = ranges from 0 to 100%
 * Brightness or Value = ranges from 0 to 100%
 * Alpha = range from 0-1
 */
class Hsva extends BaseColor {
    constructor(hue, saturation, value, alpha) {
        super();
        this.hue = hue;
        this.saturation = saturation;
        this.value = value;
        this.alpha = alpha;
    }
    toString(showAlphaChannel = true) {
        return showAlphaChannel ? `hsva(${this.getHue()}, ${this.getSaturation()}%, ${this.getValue()}%, ${this.getAlpha(true)})`
            : `hsv(${this.getHue()}, ${this.getSaturation()}%, ${this.getValue()}%)`;
    }
    getHue() {
        return Math.round(this.hue);
    }
    getSaturation() {
        return Math.round(this.saturation);
    }
    getValue() {
        return Math.round(this.value);
    }
    getAlpha(round = false) {
        if (round != false) {
            return this.round(this.getAlpha());
        }
        return this.alpha;
    }
    equal(color) {
        if (this === color) {
            return true;
        }
        return this.hue === color.hue
            && this.saturation === color.saturation
            && this.value === color.value
            && this.alpha === color.alpha;
    }
}

/**
 * RGB (Red Green Blue)
 *
 * Red = ranges from 0-255
 * Green = ranges from 0-255
 * Blue = ranges from 0-255
 * Alpha = range from 0-1
 */
class Rgba extends BaseColor {
    constructor(red, green, blue, alpha) {
        super();
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
    toString(showAlphaChannel = true) {
        return showAlphaChannel
            ? `rgba(${this.getRed()}, ${this.getGreen()}, ${this.getBlue()}, ${this.getAlpha(true)})`
            : `rgb(${this.getRed()}, ${this.getGreen()}, ${this.getBlue()})`;
    }
    getRed() {
        return Math.round(this.red);
    }
    getGreen() {
        return Math.round(this.green);
    }
    getBlue() {
        return Math.round(this.blue);
    }
    getAlpha(round = false) {
        if (round != false) {
            return this.round(this.getAlpha());
        }
        return this.alpha;
    }
    equal(color) {
        if (this === color) {
            return true;
        }
        return this.red === color.red
            && this.green === color.green
            && this.blue === color.blue
            && this.alpha === color.alpha;
    }
}

/**
 * http://www.w3.org/TR/css3-color/
 */
class ColorsTable {
    static { this.transparent = new Rgba(0, 0, 0, 0); }
    static { this.aliceblue = new Rgba(240, 248, 255, 1); }
    static { this.antiquewhite = new Rgba(250, 235, 215, 1); }
    static { this.aqua = new Rgba(0, 255, 255, 1); }
    static { this.aquamarine = new Rgba(127, 255, 212, 1); }
    static { this.azure = new Rgba(240, 255, 255, 1); }
    static { this.beige = new Rgba(245, 245, 220, 1); }
    static { this.bisque = new Rgba(255, 228, 196, 1); }
    static { this.black = new Rgba(0, 0, 0, 1); }
    static { this.blanchedalmond = new Rgba(255, 235, 205, 1); }
    static { this.blue = new Rgba(0, 0, 255, 1); }
    static { this.blueviolet = new Rgba(138, 43, 226, 1); }
    static { this.brown = new Rgba(165, 42, 42, 1); }
    static { this.burlywood = new Rgba(222, 184, 135, 1); }
    static { this.cadetblue = new Rgba(95, 158, 160, 1); }
    static { this.chartreuse = new Rgba(127, 255, 0, 1); }
    static { this.chocolate = new Rgba(210, 105, 30, 1); }
    static { this.coral = new Rgba(255, 127, 80, 1); }
    static { this.cornflowerblue = new Rgba(100, 149, 237, 1); }
    static { this.cornsilk = new Rgba(255, 248, 220, 1); }
    static { this.crimson = new Rgba(220, 20, 60, 1); }
    static { this.cyan = new Rgba(0, 255, 255, 1); }
    static { this.darkblue = new Rgba(0, 0, 139, 1); }
    static { this.darkcyan = new Rgba(0, 139, 139, 1); }
    static { this.darkgoldenrod = new Rgba(184, 134, 11, 1); }
    static { this.darkgray = new Rgba(169, 169, 169, 1); }
    static { this.darkgreen = new Rgba(0, 100, 0, 1); }
    static { this.darkgrey = ColorsTable.darkgray; }
    static { this.darkkhaki = new Rgba(189, 183, 107, 1); }
    static { this.darkmagenta = new Rgba(139, 0, 139, 1); }
    static { this.darkolivegreen = new Rgba(85, 107, 47, 1); }
    static { this.darkorange = new Rgba(255, 140, 0, 1); }
    static { this.darkorchid = new Rgba(153, 50, 204, 1); }
    static { this.darkred = new Rgba(139, 0, 0, 1); }
    static { this.darksalmon = new Rgba(233, 150, 122, 1); }
    static { this.darkseagreen = new Rgba(143, 188, 143, 1); }
    static { this.darkslateblue = new Rgba(72, 61, 139, 1); }
    static { this.darkslategray = new Rgba(47, 79, 79, 1); }
    static { this.darkslategrey = ColorsTable.darkslategray; }
    static { this.darkturquoise = new Rgba(0, 206, 209, 1); }
    static { this.darkviolet = new Rgba(148, 0, 211, 1); }
    static { this.deeppink = new Rgba(255, 20, 147, 1); }
    static { this.deepskyblue = new Rgba(0, 191, 255, 1); }
    static { this.dimgray = new Rgba(105, 105, 105, 1); }
    static { this.dimgrey = ColorsTable.dimgray; }
    static { this.dodgerblue = new Rgba(30, 144, 255, 1); }
    static { this.firebrick = new Rgba(178, 34, 34, 1); }
    static { this.floralwhite = new Rgba(255, 250, 240, 1); }
    static { this.forestgreen = new Rgba(34, 139, 34, 1); }
    static { this.fuchsia = new Rgba(255, 0, 255, 1); }
    static { this.gainsboro = new Rgba(220, 220, 220, 1); }
    static { this.ghostwhite = new Rgba(248, 248, 255, 1); }
    static { this.gold = new Rgba(255, 215, 0, 1); }
    static { this.goldenrod = new Rgba(218, 165, 32, 1); }
    static { this.gray = new Rgba(128, 128, 128, 1); }
    static { this.grey = ColorsTable.gray; }
    static { this.green = new Rgba(0, 128, 0, 1); }
    static { this.greenyellow = new Rgba(173, 255, 47, 1); }
    static { this.honeydew = new Rgba(240, 255, 240, 1); }
    static { this.hotpink = new Rgba(255, 105, 180, 1); }
    static { this.indianred = new Rgba(205, 92, 92, 1); }
    static { this.indigo = new Rgba(75, 0, 130, 1); }
    static { this.ivory = new Rgba(255, 255, 240, 1); }
    static { this.khaki = new Rgba(240, 230, 140, 1); }
    static { this.lavender = new Rgba(230, 230, 250, 1); }
    static { this.lavenderblush = new Rgba(255, 240, 245, 1); }
    static { this.lawngreen = new Rgba(124, 252, 0, 1); }
    static { this.lemonchiffon = new Rgba(255, 250, 205, 1); }
    static { this.lightblue = new Rgba(173, 216, 230, 1); }
    static { this.lightcoral = new Rgba(240, 128, 128, 1); }
    static { this.lightcyan = new Rgba(224, 255, 255, 1); }
    static { this.lightgoldenrodyellow = new Rgba(250, 250, 210, 1); }
    static { this.lightgray = new Rgba(211, 211, 211, 1); }
    static { this.lightgreen = new Rgba(144, 238, 144, 1); }
    static { this.lightgrey = ColorsTable.lightgray; }
    static { this.lightpink = new Rgba(255, 182, 193, 1); }
    static { this.lightsalmon = new Rgba(255, 160, 122, 1); }
    static { this.lightseagreen = new Rgba(32, 178, 170, 1); }
    static { this.lightskyblue = new Rgba(135, 206, 250, 1); }
    static { this.lightslategray = new Rgba(119, 136, 153, 1); }
    static { this.lightslategrey = ColorsTable.lightslategray; }
    static { this.lightsteelblue = new Rgba(176, 196, 222, 1); }
    static { this.lightyellow = new Rgba(255, 255, 224, 1); }
    static { this.lime = new Rgba(0, 255, 0, 1); }
    static { this.limegreen = new Rgba(50, 205, 50, 1); }
    static { this.linen = new Rgba(250, 240, 230, 1); }
    static { this.magenta = new Rgba(255, 0, 255, 1); }
    static { this.maroon = new Rgba(128, 0, 0, 1); }
    static { this.mediumaquamarine = new Rgba(102, 205, 170, 1); }
    static { this.mediumblue = new Rgba(0, 0, 205, 1); }
    static { this.mediumorchid = new Rgba(186, 85, 211, 1); }
    static { this.mediumpurple = new Rgba(147, 112, 219, 1); }
    static { this.mediumseagreen = new Rgba(60, 179, 113, 1); }
    static { this.mediumslateblue = new Rgba(123, 104, 238, 1); }
    static { this.mediumspringgreen = new Rgba(0, 250, 154, 1); }
    static { this.mediumturquoise = new Rgba(72, 209, 204, 1); }
    static { this.mediumvioletred = new Rgba(199, 21, 133, 1); }
    static { this.midnightblue = new Rgba(25, 25, 112, 1); }
    static { this.mintcream = new Rgba(245, 255, 250, 1); }
    static { this.mistyrose = new Rgba(255, 228, 225, 1); }
    static { this.moccasin = new Rgba(255, 228, 181, 1); }
    static { this.navajowhite = new Rgba(255, 222, 173, 1); }
    static { this.navy = new Rgba(0, 0, 128, 1); }
    static { this.oldlace = new Rgba(253, 245, 230, 1); }
    static { this.olive = new Rgba(128, 128, 0, 1); }
    static { this.olivedrab = new Rgba(107, 142, 35, 1); }
    static { this.orange = new Rgba(255, 165, 0, 1); }
    static { this.orangered = new Rgba(255, 69, 0, 1); }
    static { this.orchid = new Rgba(218, 112, 214, 1); }
    static { this.palegoldenrod = new Rgba(238, 232, 170, 1); }
    static { this.palegreen = new Rgba(152, 251, 152, 1); }
    static { this.paleturquoise = new Rgba(175, 238, 238, 1); }
    static { this.palevioletred = new Rgba(219, 112, 147, 1); }
    static { this.papayawhip = new Rgba(255, 239, 213, 1); }
    static { this.peachpuff = new Rgba(255, 218, 185, 1); }
    static { this.peru = new Rgba(205, 133, 63, 1); }
    static { this.pink = new Rgba(255, 192, 203, 1); }
    static { this.plum = new Rgba(221, 160, 221, 1); }
    static { this.powderblue = new Rgba(176, 224, 230, 1); }
    static { this.purple = new Rgba(128, 0, 128, 1); }
    static { this.red = new Rgba(255, 0, 0, 1); }
    static { this.rosybrown = new Rgba(188, 143, 143, 1); }
    static { this.royalblue = new Rgba(65, 105, 225, 1); }
    static { this.saddlebrown = new Rgba(139, 69, 19, 1); }
    static { this.salmon = new Rgba(250, 128, 114, 1); }
    static { this.sandybrown = new Rgba(244, 164, 96, 1); }
    static { this.seagreen = new Rgba(46, 139, 87, 1); }
    static { this.seashell = new Rgba(255, 245, 238, 1); }
    static { this.sienna = new Rgba(160, 82, 45, 1); }
    static { this.silver = new Rgba(192, 192, 192, 1); }
    static { this.skyblue = new Rgba(135, 206, 235, 1); }
    static { this.slateblue = new Rgba(106, 90, 205, 1); }
    static { this.slategray = new Rgba(112, 128, 144, 1); }
    static { this.slategrey = ColorsTable.slategray; }
    static { this.snow = new Rgba(255, 250, 250, 1); }
    static { this.springgreen = new Rgba(0, 255, 127, 1); }
    static { this.steelblue = new Rgba(70, 130, 180, 1); }
    static { this.tan = new Rgba(210, 180, 140, 1); }
    static { this.teal = new Rgba(0, 128, 128, 1); }
    static { this.thistle = new Rgba(216, 191, 216, 1); }
    static { this.tomato = new Rgba(255, 99, 71, 1); }
    static { this.turquoise = new Rgba(64, 224, 208, 1); }
    static { this.violet = new Rgba(238, 130, 238, 1); }
    static { this.wheat = new Rgba(245, 222, 179, 1); }
    static { this.white = new Rgba(255, 255, 255, 1); }
    static { this.whitesmoke = new Rgba(245, 245, 245, 1); }
    static { this.yellow = new Rgba(255, 255, 0, 1); }
    static { this.yellowgreen = new Rgba(154, 205, 50, 1); }
}

class Color {
    // private rgba: Rgba = new Rgba(255, 0, 0, 1);
    constructor(colorString) {
        /**
         * base color used to calculate other
         * default color
         * rgb(255, 0, 0)
         * hsl(0, 100%, 50%)
         * #ff0000
         */
        this.hsva = new Hsva(0, 1, 1, 1);
        if (colorString) {
            this.stringToColor(colorString);
        }
    }
    static from(color) {
        if (typeof color === 'string') {
            return new Color(color);
        }
        else if (color instanceof Color) {
            return color.clone();
        }
        else if (color instanceof Rgba) {
            return new Color().setRgba(color.red, color.green, color.blue, color.alpha);
        }
        else if (color instanceof Hsva) {
            return new Color().setHsva(color.hue, color.saturation, color.value, color.alpha);
        }
        else if (color instanceof Hsla) {
            return new Color().setHsla(color.hue, color.saturation, color.lightness, color.alpha);
        }
        throw new Error('Invalid color type');
    }
    /**
     * make from existing color new color object
     */
    clone() {
        return Color.from(this.getRgba());
    }
    /**
     * define Color from hex, rgb, rgba, hsl, hsla or cmyk string
     */
    setFromString(color) {
        return this.stringToColor(color);
    }
    /**
     * define Color from HSV values
     */
    setHsva(hue, saturation = 100, brightness = 100, alpha = 1) {
        if (hue != null) {
            this.hsva.hue = hue;
        }
        if (saturation != null) {
            this.hsva.saturation = saturation;
        }
        if (brightness != null) {
            this.hsva.value = brightness;
        }
        if (alpha != null) {
            alpha = alpha > 1 ? 1 : alpha < 0 ? 0 : alpha;
            this.hsva.alpha = alpha;
        }
        // this.rgba = this.hsvaToRgba(this.hsva);
        return this;
    }
    /**
     * define Color from RGBa
     */
    setRgba(red, green, blue, alpha = 1) {
        if (alpha != null) {
            alpha = alpha > 1 ? 1 : alpha < 0 ? 0 : alpha;
        }
        this.hsva = this.rgbaToHsva(new Rgba(red, green, blue, alpha));
        return this;
    }
    /**
     * define Color from HSLa
     */
    setHsla(hue, saturation, lightness, alpha = 1) {
        if (alpha != null) {
            alpha = alpha > 1 ? 1 : alpha < 0 ? 0 : alpha;
        }
        const hsla = new Hsla(hue, saturation, lightness, alpha);
        this.hsva = this.hslaToHsva(hsla);
        return this;
    }
    /**
     * return hexadecimal value formatted as '#341d2a' or '#341d2aFF' if alhpa channel is enabled
     */
    toHexString(alpha = false) {
        const rgba = this.getRgba();
        let hex = '#' + ((1 << 24) | (rgba.getRed() << 16) | (rgba.getGreen() << 8) | rgba.getBlue()).toString(16).substring(1);
        if (alpha) {
            hex += ((1 << 8) | Math.round(rgba.alpha * 255)).toString(16).substring(1);
        }
        return hex.toUpperCase();
    }
    /**
     * return rgba string formatted as rgba(52, 29, 42, 1)
     */
    toRgbaString() {
        return this.getRgba().toString();
    }
    /**
     * return rgb string formatted as rgb(52, 29, 42)
     */
    toRgbString() {
        return this.getRgba().toString(false);
    }
    /**
     * return hsla string formatted as hsla(327, 29%, 16%, 1)
     */
    toHslaString() {
        return this.getHsla().toString();
    }
    /**
     * return hsl string formatted as hsl(327, 29%, 16%)
     */
    toHslString() {
        return this.getHsla().toString(false);
    }
    /**
     * return hsva string formatted as hsva(327, 29%, 16%, 100%)
     */
    toHsvaString() {
        return this.getHsva().toString();
    }
    /**
     * return hsv string formatted as hsv(327, 29%, 16%)
     */
    toHsvString() {
        return this.getHsva().toString(false);
    }
    /**
     * return Cmyk string formatted as cmyk(100%, 100%, 100%, 100%)
     */
    toCmykString() {
        return this.getCmyk().toString();
    }
    getHsva() {
        return new Hsva(this.hsva.hue, this.hsva.saturation, this.hsva.value, this.hsva.alpha);
    }
    getRgba() {
        return this.hsvaToRgba(this.getHsva());
    }
    getHsla() {
        return this.rgbaToHsla(this.getRgba());
    }
    getCmyk() {
        return this.rgbaToCmyk(this.getRgba());
    }
    equal(color) {
        return this.hsva.equal(color.getHsva());
    }
    hsvaToHsla(color) {
        const hue = color.hue;
        const s = color.saturation / 100;
        const v = color.value / 100;
        const lightness = ((2 - s) * color.value) / 2;
        const saturation = (s * v) / ((lightness <= 1) ? lightness : 2 - lightness) || 0;
        return new Hsla(hue, lightness * 100, saturation * 100, color.alpha);
    }
    hslaToHsva(color) {
        const hue = color.hue;
        const l = (color.lightness / 100) * 2;
        const s = (color.saturation / 100) * (l <= 1 ? l : 2 - l);
        const value = (l + s) / 2;
        const saturation = (2 * s) / (l + s) || 0;
        return new Hsva(hue, saturation, value, color.alpha);
    }
    rgbaToHsva(color) {
        const red = color.red / 255;
        const green = color.green / 255;
        const blue = color.blue / 255;
        const alpha = color.alpha;
        const Cmax = Math.max(red, green, blue);
        const Cmin = Math.min(red, green, blue);
        const delta = Cmax - Cmin;
        let hue = 0;
        let saturation = Cmax === 0 ? 0 : delta / Cmax;
        let brightness = Cmax;
        if (Cmax !== Cmin) {
            switch (Cmax) {
                case red:
                    hue = (green - blue) / delta + (green < blue ? 6 : 0);
                    break;
                case green:
                    hue = 2 + (blue - red) / delta;
                    break;
                case blue:
                    hue = 4 + (red - green) / delta;
                    break;
            }
            hue /= 6;
        }
        hue = hue * 360;
        saturation = saturation * 100;
        brightness = brightness * 100;
        return new Hsva(hue, saturation, brightness, alpha);
    }
    hsvaToRgba(color) {
        let red = 1;
        let green = 0;
        let blue = 0;
        const saturation = color.saturation / 100;
        const brightness = color.value / 100;
        const alpha = color.alpha;
        const hex = color.hue / 60;
        const primary = Math.floor(hex);
        const secoundary = hex - primary;
        const a = (1 - saturation) * brightness;
        const b = (1 - (saturation * secoundary)) * brightness;
        const c = (1 - (saturation * (1 - secoundary))) * brightness;
        switch (primary) {
            case 6:
            case 0:
                red = brightness;
                green = c;
                blue = a;
                break;
            case 1:
                red = b;
                green = brightness;
                blue = a;
                break;
            case 2:
                red = a;
                green = brightness;
                blue = c;
                break;
            case 3:
                red = a;
                green = b;
                blue = brightness;
                break;
            case 4:
                red = c;
                green = a;
                blue = brightness;
                break;
            case 5:
                red = brightness;
                green = a;
                blue = b;
                break;
        }
        red = red * 255;
        green = green * 255;
        blue = blue * 255;
        return new Rgba(red, green, blue, alpha);
    }
    rgbaToHsla(color) {
        // based on CamanJS
        const red = color.red / 255;
        const green = color.green / 255;
        const blue = color.blue / 255;
        const alpha = color.alpha;
        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);
        let hue = 0;
        let saturation = 0;
        let luminance = (max + min) / 2;
        const delta = max - min;
        if (max !== min) {
            saturation = luminance > 0.5 ? delta / (2.0 - max - min) : delta / (max + min);
            switch (max) {
                case red:
                    hue = (green - blue) / delta + (green < blue ? 6 : 0);
                    break;
                case green:
                    hue = (blue - red) / delta + 2;
                    break;
                case blue:
                    hue = (red - green) / delta + 4;
                    break;
            }
            hue /= 6;
        }
        hue = hue * 360;
        saturation = saturation * 100;
        luminance = luminance * 100;
        return new Hsla(hue, saturation, luminance, alpha);
    }
    /**
     * convert rgb color from HSLa
     *
     * hue = 0 => 360
     * saturation = 0 => 1
     * lightness = 0 => 1
     */
    hslaToRgba(color) {
        const hue = color.hue / 360;
        const saturation = color.saturation / 100;
        const lightness = color.lightness / 100;
        const alpha = color.alpha;
        let red = lightness;
        let green = lightness;
        let blue = lightness;
        if (saturation !== 0) {
            const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - (lightness * saturation);
            const p = 2 * lightness - q;
            red = this.hueToRgb(p, q, hue + (1 / 3));
            green = this.hueToRgb(p, q, hue);
            blue = this.hueToRgb(p, q, hue - (1 / 3));
        }
        red = red * 255;
        green = green * 255;
        blue = blue * 255;
        return new Rgba(red, green, blue, alpha);
    }
    hueToRgb(p, q, t) {
        // based on CamanJS
        if (t < 0) {
            t += 1;
        }
        if (t > 1) {
            t -= 1;
        }
        if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
        }
        if (t < 1 / 2) {
            return q;
        }
        if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
        }
        return p;
    }
    /**
     * The Red, Green, Blue values are given in the range of 0..255,
     *
     * the red color(R) is calculated from the cyan(C) and black(K) colors,
     * the green color(G) is calculated from the magenta(M) and black(K) colors,
     * The blue color(B) is calculated from the yellow(Y) and black(K) colors.
     *
     * Below is the formula of CMYK to RGB convertion
     *
     * Red = 255 × 1 - min( (1 - Cyan ÷ 100) × (1 - Black) )
     * Green = 255 × 1 - min(1 - Magenta ÷ 100) × (1 - Black)
     * Blue = 255 × 1 - min(1 - Yellow ÷ 100) × (1 - Black)
     */
    cmykToRgba(color) {
        const black = color.black / 100;
        const cyan = color.cyan / 100;
        const magenta = color.magenta / 100;
        const yellow = color.yellow / 100;
        let red = Math.min(1, (1 - cyan) * (1 - black));
        let green = Math.min(1, (1 - magenta) * (1 - black));
        let blue = Math.min(1, (1 - yellow) * (1 - black));
        red = red * 255;
        green = green * 255;
        blue = blue * 255;
        return new Rgba(red, green, blue, 1);
    }
    /**
     * The max number of R, G, B values are 255, first of all, we divided them by 255 to become the number
     * of 0~1, this ratio will be used in the calculation.
     * Rc = R ÷ 255
     * Gc = G ÷ 255
     * Bc = B ÷ 255
     * The black key(K) color could be many result, when we assume a black key value,
     * the other three colors(cyan, magenta, yellow) can be calculated.
     * we can calculate it from the red, green and blue colors, the max number of black key should be :
     * K = 1 - min(Rc, Gc, Bc);
     *
     * or we can assume we run out of the black ink, need use the remaining other three color inks to finish the printing job.
     * K = 0;
     *
     * The cyan color(C) is calculated from the red and black colors:
     * C = (1 - Rc - K) ÷ (1 - K)
     *
     * The magenta color (M) is calculated from the green and black colors:
     * M = (1 - Gr - K) ÷ (1 - K)
     *
     * The yellow color(Y) is calculated from the blue and black colors:
     * Y = (1 - Bc - K) ÷ ( 1 - K)
     */
    rgbaToCmyk(color) {
        const red = color.red / 255;
        const green = color.green / 255;
        const blue = color.blue / 255;
        let cyan = 1 - red;
        let magenta = 1 - green;
        let yellow = 1 - blue;
        let black = Math.min(cyan, magenta, yellow);
        if (black === 1) {
            return new Cmyk(0, 0, 0, 100);
        }
        cyan = (cyan - black) / (1 - black);
        magenta = (magenta - black) / (1 - black);
        yellow = (yellow - black) / (1 - black);
        black = black * 100;
        cyan = cyan * 100;
        magenta = magenta * 100;
        yellow = yellow * 100;
        return new Cmyk(cyan, magenta, yellow, black);
    }
    roundNumber(n) {
        return Math.round(n * 100) / 100;
    }
    stringToColor(colorString) {
        const str = colorString.replace(/ /g, '').toLowerCase();
        /**
         * try to find color by name in table
         */
        let rgba = ColorsTable[str] || null;
        /**
         * hex find
         */
        if (str[0] === '#') {
            let hex = str.substr(1);
            const length = hex.length;
            let a = 1;
            let hexArray = [];
            if (length === 3) {
                hexArray = hex.split('').map((value) => value + value);
            }
            else if (length === 6) {
                hexArray = hex.match(/.{2}/g) || [];
            }
            else if (length === 8) {
                const alpha = hex.substr(-2);
                hex = hex.substr(0, length - 2);
                a = parseInt(alpha || 'FF', 16) / 255;
                hexArray = hex.match(/.{2}/g) || [];
            }
            if (hexArray.length === 3) {
                rgba = new Rgba(parseInt(hexArray[0], 16), parseInt(hexArray[1], 16), parseInt(hexArray[2], 16), a);
            }
        }
        const OpenParenthesis = str.indexOf('(');
        const CloseParenthesis = str.indexOf(')');
        if (OpenParenthesis !== -1 && CloseParenthesis + 1 === str.length) {
            const colorTypeName = str.substr(0, OpenParenthesis);
            const params = str.substr(OpenParenthesis + 1, CloseParenthesis - (OpenParenthesis + 1)).split(',');
            let alpha = 1;
            switch (colorTypeName) {
                case 'rgba':
                    alpha = parseFloat(params.pop() || '1');
                // Fall through.
                case 'rgb':
                    rgba = new Rgba(parseInt(params[0], 10), parseInt(params[1], 10), parseInt(params[2], 10), alpha);
                    break;
                case 'hsla':
                    alpha = parseFloat(params.pop() || '1');
                case 'hsl':
                    const hsla = new Hsla(parseInt(params[0], 10), parseInt(params[1], 10), parseInt(params[2], 10), alpha);
                    rgba = this.hslaToRgba(hsla);
                    break;
                case 'cmyk':
                    const cmyk = new Cmyk(parseInt(params[0], 10), parseInt(params[1], 10), parseInt(params[2], 10), parseInt(params[3], 10));
                    rgba = this.cmykToRgba(cmyk);
                    break;
            }
        }
        if (rgba) {
            this.hsva = this.rgbaToHsva(rgba);
        }
        return this;
    }
}

class BaseComponent {
    constructor() {
        this.subscriptions = [];
        this.mouseup = new Subject();
        this.document = inject(DOCUMENT);
        this.elementRef = inject(ElementRef);
        this.window = this.document.defaultView;
        this.requestAnimationFrame = this.getRequestAnimationFrame();
        this.addEventListeners();
    }
    addEventListeners() {
        this.subscriptions.push(merge(fromEvent(this.elementRef.nativeElement, 'touchstart', { passive: true, capture: true }), fromEvent(this.elementRef.nativeElement, 'mousedown', { capture: true }))
            .subscribe((e) => this.onEventChange(e)));
    }
    onEventChange(event) {
        this.calculate(event);
        merge(fromEvent(this.document, 'mouseup', { capture: true }), fromEvent(this.document, 'touchend', { capture: true }))
            .pipe(takeUntil(this.mouseup))
            .subscribe(() => this.mouseup.next());
        merge(fromEvent(this.document, 'mousemove', { capture: true }), fromEvent(this.document, 'touchmove', { passive: true, capture: true }))
            .pipe(takeUntil(this.mouseup))
            .subscribe((e) => this.calculate(e));
    }
    calculateCoordinates(event) {
        const { width: elWidth, height: elHeight, top: elTop, left: elLeft } = this.elementRef.nativeElement.getBoundingClientRect();
        const pageX = typeof event.pageX === 'number'
            ? event.pageX : event.touches[0].pageX;
        const pageY = typeof event.pageY === 'number'
            ? event.pageY : event.touches[0].pageY;
        const x = Math.max(0, Math.min(pageX - (elLeft + this.window.pageXOffset), elWidth));
        const y = Math.max(0, Math.min(pageY - (elTop + this.window.pageYOffset), elHeight));
        this.movePointer({ x, y, height: elHeight, width: elWidth });
    }
    calculate(event) {
        event.stopPropagation();
        if (!event.type.includes('touch')) {
            event.preventDefault();
        }
        if (!this.requestAnimationFrame) {
            return this.calculateCoordinates(event);
        }
        this.requestAnimationFrame.call(this.window, () => this.calculateCoordinates(event));
    }
    getRequestAnimationFrame() {
        const windowWithLegacyAnimationFrame = this.window;
        return windowWithLegacyAnimationFrame.requestAnimationFrame ||
            windowWithLegacyAnimationFrame.webkitRequestAnimationFrame ||
            windowWithLegacyAnimationFrame.mozRequestAnimationFrame ||
            windowWithLegacyAnimationFrame.oRequestAnimationFrame ||
            windowWithLegacyAnimationFrame.msRequestAnimationFrame;
    }
    ngOnDestroy() {
        this.mouseup.next();
        this.mouseup.complete();
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: BaseComponent, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "22.0.0", type: BaseComponent, isStandalone: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: BaseComponent, decorators: [{
            type: Directive
        }], ctorParameters: () => [] });

class SaturationComponent extends BaseComponent {
    constructor(renderer) {
        super();
        this.renderer = renderer;
        this.color = model.required(/* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "color" }] : /* istanbul ignore next */ []));
        this.pointer = viewChild.required('pointer');
        /**
         * color can be changed through inputs
         * and then we need to move pointer
         */
        effect(() => {
            const hsva = this.color().getHsva();
            this.changePointerPosition(hsva.saturation, hsva.value);
            // background update
            this.updateBackgroundColor();
        });
    }
    movePointer({ x, y, height, width }) {
        const saturation = (x * 100) / width;
        let bright = -((y * 100) / height) + 100;
        /**
         * prevent cursor jumping
         * when value is rgb(0,0,0)
         */
        if (saturation > 10) {
            bright = bright < 1 ? 1 : bright;
        }
        this.changePointerPosition(saturation, bright);
        const color = this.color().getHsva();
        const newColor = new Color().setHsva(color.hue, saturation, bright, color.alpha);
        this.color.set(newColor);
    }
    updateBackgroundColor() {
        let backgroundColor = null;
        if (this.color()) {
            const currentColor = this.color().getHsva();
            backgroundColor = new Color().setHsva(currentColor.hue, 100, 100).toRgbString();
        }
        this.renderer.setStyle(this.elementRef.nativeElement, 'backgroundColor', backgroundColor);
    }
    changePointerPosition(x, y) {
        const pointer = this.pointer();
        this.renderer.setStyle(pointer.nativeElement, 'top', `${100 - y}%`);
        this.renderer.setStyle(pointer.nativeElement, 'left', `${x}%`);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: SaturationComponent, deps: [{ token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.2.0", version: "22.0.0", type: SaturationComponent, isStandalone: true, selector: "saturation-component", inputs: { color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: true, transformFunction: null } }, outputs: { color: "colorChange" }, viewQueries: [{ propertyName: "pointer", first: true, predicate: ["pointer"], descendants: true, isSignal: true }], usesInheritance: true, ngImport: i0, template: "<div #pointer class=\"pointer\"></div>", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{display:block;position:relative;overflow:hidden;height:50px;background-size:100% 100%;background-image:url(data:image/png;base64,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);touch-action:none}.pointer{position:absolute;top:15%;left:90%;width:12px;height:12px;border-radius:50%;border:1px solid #fff;margin:-6px 0 0 -6px}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: SaturationComponent, decorators: [{
            type: Component,
            args: [{ selector: `saturation-component`, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, template: "<div #pointer class=\"pointer\"></div>", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{display:block;position:relative;overflow:hidden;height:50px;background-size:100% 100%;background-image:url(data:image/png;base64,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);touch-action:none}.pointer{position:absolute;top:15%;left:90%;width:12px;height:12px;border-radius:50%;border:1px solid #fff;margin:-6px 0 0 -6px}\n"] }]
        }], ctorParameters: () => [{ type: i0.Renderer2 }], propDecorators: { color: [{ type: i0.Input, args: [{ isSignal: true, alias: "color", required: true }] }, { type: i0.Output, args: ["colorChange"] }], pointer: [{ type: i0.ViewChild, args: ['pointer', { isSignal: true }] }] } });

const COLOR_PICKER_CONFIG = new InjectionToken('COLOR_PICKER_CONFIG', { providedIn: 'root', factory: () => new ColorPickerConfig() });
class ColorPickerConfig {
    constructor() {
        this.indicatorTitle = 'Copy color to clipboard';
        this.presetsTitle = '{0}. Long-click to show alternate shades.';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: ColorPickerConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: ColorPickerConfig, providedIn: 'root', useExisting: COLOR_PICKER_CONFIG }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: ColorPickerConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root', useExisting: COLOR_PICKER_CONFIG }]
        }] });

class IndicatorComponent {
    constructor(pickerConfig, renderer, elementRef, document) {
        this.pickerConfig = pickerConfig;
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.document = document;
        this.color = input.required(/* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "color" }] : /* istanbul ignore next */ []));
        this.colorType = input('rgba', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "colorType" }] : /* istanbul ignore next */ []));
        this.backgroundColorEl = viewChild.required('backgroundColorEl');
        this.subscriptions = [];
        this.renderTitle();
        effect(() => {
            this.renderBackgroundColor();
        });
    }
    ngOnInit() {
        this.subscriptions.push(fromEvent(this.elementRef.nativeElement, 'click').subscribe(() => this.onClick()));
    }
    renderTitle() {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'title', this.pickerConfig?.indicatorTitle || '');
    }
    renderBackgroundColor() {
        if (!this.backgroundColorEl()) {
            return;
        }
        this.renderer.setStyle(this.backgroundColorEl().nativeElement, 'backgroundColor', this.color().toRgbaString());
    }
    onClick() {
        const input = this.renderer.createElement('input');
        this.renderer.setStyle(input, 'position', 'absolute');
        this.renderer.setStyle(input, 'top', '-100%');
        this.renderer.setStyle(input, 'left', '-100%');
        switch (this.colorType()) {
            case 'hsla':
                input.value = this.color().toHslaString();
                break;
            case 'hex':
                input.value = this.color().toHexString(this.color().getRgba().alpha < 1);
                break;
            default:
                input.value = this.color().toRgbaString();
        }
        this.renderer.appendChild(this.elementRef.nativeElement, input);
        input.select();
        this.document.execCommand('copy');
        this.renderer.removeChild(this.elementRef.nativeElement, input);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: IndicatorComponent, deps: [{ token: ColorPickerConfig }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.2.0", version: "22.0.0", type: IndicatorComponent, isStandalone: true, selector: "indicator-component", inputs: { color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: true, transformFunction: null }, colorType: { classPropertyName: "colorType", publicName: "colorType", isSignal: true, isRequired: false, transformFunction: null } }, viewQueries: [{ propertyName: "backgroundColorEl", first: true, predicate: ["backgroundColorEl"], descendants: true, isSignal: true }], ngImport: i0, template: "<div #backgroundColorEl>\n    <svg viewBox=\"0 0 48 48\">\n        <path d=\"M0 0h48v48h-48z\" fill=\"none\"/>\n        <path d=\"M32 2h-24c-2.21 0-4 1.79-4 4v28h4v-28h24v-4zm6 8h-22c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h22c2.21 0 4-1.79 4-4v-28c0-2.21-1.79-4-4-4zm0 32h-22v-28h22v28z\"/>\n    </svg>\n</div>", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", "@charset \"UTF-8\";:host{display:block;cursor:pointer;text-align:center;border:1px solid #e3e3e3;overflow:hidden;position:relative;height:20px;width:20px;background:transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAh0lEQVRYR+2W0QlAMQgD60zdfwOdqa8TmI/wQMr5K0I5bZLIzLOa2nt37VVVbd+dDx5obgCC3KBLwJ2ff4PnVidkf+ucIhw80HQaCLo3DMH3CRK3iFsmAWVl6hPNDwt8EvNE5q+YuEXcMgkonVM6SdyCoEvAnZ8v1Hjx817MilmxSUB5rdLJDycZgUAZUch/AAAAAElFTkSuQmCC) repeat}:host>div{position:absolute;top:0;left:0;height:100%;width:100%;z-index:1}:host:hover:after{display:block;content:\"\\a0\";position:absolute;top:0;left:0;height:100%;width:100%;background:#000;opacity:.2;z-index:2}:host svg{transition:background-color 2s ease-in-out;opacity:0;fill:#fff;height:46%;vertical-align:-20%}:host:hover svg{opacity:1}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: IndicatorComponent, decorators: [{
            type: Component,
            args: [{ selector: `indicator-component`, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, template: "<div #backgroundColorEl>\n    <svg viewBox=\"0 0 48 48\">\n        <path d=\"M0 0h48v48h-48z\" fill=\"none\"/>\n        <path d=\"M32 2h-24c-2.21 0-4 1.79-4 4v28h4v-28h24v-4zm6 8h-22c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h22c2.21 0 4-1.79 4-4v-28c0-2.21-1.79-4-4-4zm0 32h-22v-28h22v28z\"/>\n    </svg>\n</div>", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", "@charset \"UTF-8\";:host{display:block;cursor:pointer;text-align:center;border:1px solid #e3e3e3;overflow:hidden;position:relative;height:20px;width:20px;background:transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAh0lEQVRYR+2W0QlAMQgD60zdfwOdqa8TmI/wQMr5K0I5bZLIzLOa2nt37VVVbd+dDx5obgCC3KBLwJ2ff4PnVidkf+ucIhw80HQaCLo3DMH3CRK3iFsmAWVl6hPNDwt8EvNE5q+YuEXcMgkonVM6SdyCoEvAnZ8v1Hjx817MilmxSUB5rdLJDycZgUAZUch/AAAAAElFTkSuQmCC) repeat}:host>div{position:absolute;top:0;left:0;height:100%;width:100%;z-index:1}:host:hover:after{display:block;content:\"\\a0\";position:absolute;top:0;left:0;height:100%;width:100%;background:#000;opacity:.2;z-index:2}:host svg{transition:background-color 2s ease-in-out;opacity:0;fill:#fff;height:46%;vertical-align:-20%}:host:hover svg{opacity:1}\n"] }]
        }], ctorParameters: () => [{ type: ColorPickerConfig }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: HTMLDocument, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }], propDecorators: { color: [{ type: i0.Input, args: [{ isSignal: true, alias: "color", required: true }] }], colorType: [{ type: i0.Input, args: [{ isSignal: true, alias: "colorType", required: false }] }], backgroundColorEl: [{ type: i0.ViewChild, args: ['backgroundColorEl', { isSignal: true }] }] } });

class HueComponent extends BaseComponent {
    constructor(renderer) {
        super();
        this.renderer = renderer;
        this.color = model.required(/* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "color" }] : /* istanbul ignore next */ []));
        this.isVertical = input(false, { ...(ngDevMode ? { debugName: "isVertical" } : /* istanbul ignore next */ {}), alias: 'vertical', transform: booleanAttribute });
        this.pointer = viewChild.required('pointer');
        effect(() => {
            const hsva = this.color().getHsva();
            this.changePointerPosition(hsva.hue);
        });
    }
    movePointer({ x, y, height, width }) {
        const hue = this.isVertical() ? (y / height) * 359 : (x / width) * 359;
        this.changePointerPosition(hue);
        const currentColor = this.color().getHsva();
        const newHueColor = new Color().setHsva(hue, currentColor.saturation, currentColor.value, currentColor.alpha);
        this.color.set(newHueColor);
    }
    /**
     * hue value is in range from 0 to 360°
     */
    changePointerPosition(hue) {
        const x = (hue / 360) * 100;
        const orientation = this.isVertical() ? 'top' : 'left';
        this.renderer.setStyle(this.pointer().nativeElement, orientation, `${x}%`);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: HueComponent, deps: [{ token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.2.0", version: "22.0.0", type: HueComponent, isStandalone: true, selector: "hue-component", inputs: { color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: true, transformFunction: null }, isVertical: { classPropertyName: "isVertical", publicName: "vertical", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { color: "colorChange" }, viewQueries: [{ propertyName: "pointer", first: true, predicate: ["pointer"], descendants: true, isSignal: true }], usesInheritance: true, ngImport: i0, template: "<div #pointer class=\"pointer\"></div>", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAQCAYAAAD06IYnAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AIWDwkUFWbCCAAAAFxJREFUaN7t0kEKg0AQAME2x83/n2qu5qCgD1iDhCoYdpnbQC9bbY1qVO/jvc6k3ad91s7/7F1/csgPrujuQ17BDYSFsBAWwgJhISyEBcJCWAgLhIWwEBYIi2f7Ar/1TCgFH2X9AAAAAElFTkSuQmCC);background-size:100% 100%;border-radius:2px;display:block;height:12px;position:relative;touch-action:none}:host([vertical]){background-image:url(data:image/png;base64,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);width:12px;height:100px}.pointer{background:#fff;height:14px;width:14px;top:-1px;left:0;position:absolute;border-radius:50%;cursor:pointer;margin:0 0 0 -7px}:host([vertical]) .pointer{left:-1px;margin:-7px 0 0}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: HueComponent, decorators: [{
            type: Component,
            args: [{ selector: `hue-component`, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, template: "<div #pointer class=\"pointer\"></div>", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAQCAYAAAD06IYnAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AIWDwkUFWbCCAAAAFxJREFUaN7t0kEKg0AQAME2x83/n2qu5qCgD1iDhCoYdpnbQC9bbY1qVO/jvc6k3ad91s7/7F1/csgPrujuQ17BDYSFsBAWwgJhISyEBcJCWAgLhIWwEBYIi2f7Ar/1TCgFH2X9AAAAAElFTkSuQmCC);background-size:100% 100%;border-radius:2px;display:block;height:12px;position:relative;touch-action:none}:host([vertical]){background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAACWCAYAAADXGgikAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAJtJREFUeNrs2MEJBDEMQ1EZ5rTpv9TM1VuEBGbMTwFCfhdBqqWW8R79pOGAM95gQQCIIIIIYqhBdZvD8so8wQ644w0WBIAIIoggphqU3GGRuW2JgKPPnwAiiCCCuAWx1G0Oi7ltgYA73mBBAIgggghiqEFJ5rCYf3GBgDPeYEEAiCCCCGKqQbU7LDK3LRFw9fkTQAQRRBC3IP4HAGiDWTj81TDkAAAAAElFTkSuQmCC);width:12px;height:100px}.pointer{background:#fff;height:14px;width:14px;top:-1px;left:0;position:absolute;border-radius:50%;cursor:pointer;margin:0 0 0 -7px}:host([vertical]) .pointer{left:-1px;margin:-7px 0 0}\n"] }]
        }], ctorParameters: () => [{ type: i0.Renderer2 }], propDecorators: { color: [{ type: i0.Input, args: [{ isSignal: true, alias: "color", required: true }] }, { type: i0.Output, args: ["colorChange"] }], isVertical: [{ type: i0.Input, args: [{ isSignal: true, alias: "vertical", required: false }] }], pointer: [{ type: i0.ViewChild, args: ['pointer', { isSignal: true }] }] } });

class AlphaComponent extends BaseComponent {
    constructor(renderer) {
        super();
        this.renderer = renderer;
        this.color = input.required(/* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "color" }] : /* istanbul ignore next */ []));
        this.colorChange = output();
        this.isVertical = input(false, { ...(ngDevMode ? { debugName: "isVertical" } : /* istanbul ignore next */ {}), alias: 'vertical', transform: booleanAttribute });
        this.pointer = viewChild.required('pointer');
        /**
         * color can be changed through inputs
         * and then we need to move pointer
         */
        effect(() => {
            const hsva = this.color().getHsva();
            this.changePointerPosition(hsva.alpha);
        });
    }
    movePointer({ x, y, height, width }) {
        const alpha = this.isVertical() ? y / height : x / width;
        this.changePointerPosition(alpha);
        const hsva = this.color().getHsva();
        const newColor = new Color().setHsva(hsva.hue, hsva.saturation, hsva.value, alpha);
        this.colorChange.emit(newColor);
    }
    /**
     * hue value is in range from 0 to 360°
     */
    changePointerPosition(alpha) {
        const x = alpha * 100;
        const orientation = this.isVertical() ? 'top' : 'left';
        this.renderer.setStyle(this.pointer().nativeElement, orientation, `${x}%`);
    }
    get gradient() {
        const rgba = this.color().getRgba();
        const orientation = this.isVertical() ? 'bottom' : 'right';
        return `linear-gradient(to ${orientation}, rgba(${rgba.red}, ${rgba.green}, ${rgba.blue}, 0) 0%, rgb(${rgba.red}, ${rgba.green}, ${rgba.blue}) 100%)`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: AlphaComponent, deps: [{ token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.2.0", version: "22.0.0", type: AlphaComponent, isStandalone: true, selector: "alpha-component", inputs: { color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: true, transformFunction: null }, isVertical: { classPropertyName: "isVertical", publicName: "vertical", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { colorChange: "colorChange" }, viewQueries: [{ propertyName: "pointer", first: true, predicate: ["pointer"], descendants: true, isSignal: true }], usesInheritance: true, ngImport: i0, template: "<div #pointer class=\"pointer\"></div>\n<div class=\"gradient-color\" [style.background]=\"gradient\"></div>", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{display:block;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==);background-position:left center;height:12px;border-radius:2px;position:relative}:host([vertical]){width:12px;height:100px;background-position:center 0}.gradient-color{position:absolute;left:0;right:0;top:0;height:100%;z-index:1}.pointer{background:#fff;height:14px;width:14px;top:-1px;left:0;position:absolute;border-radius:50%;cursor:pointer;margin:0 0 0 -7px;z-index:2}:host([vertical]) .pointer{left:-1px;margin:-7px 0 0}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: AlphaComponent, decorators: [{
            type: Component,
            args: [{ selector: `alpha-component`, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, template: "<div #pointer class=\"pointer\"></div>\n<div class=\"gradient-color\" [style.background]=\"gradient\"></div>", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{display:block;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==);background-position:left center;height:12px;border-radius:2px;position:relative}:host([vertical]){width:12px;height:100px;background-position:center 0}.gradient-color{position:absolute;left:0;right:0;top:0;height:100%;z-index:1}.pointer{background:#fff;height:14px;width:14px;top:-1px;left:0;position:absolute;border-radius:50%;cursor:pointer;margin:0 0 0 -7px;z-index:2}:host([vertical]) .pointer{left:-1px;margin:-7px 0 0}\n"] }]
        }], ctorParameters: () => [{ type: i0.Renderer2 }], propDecorators: { color: [{ type: i0.Input, args: [{ isSignal: true, alias: "color", required: true }] }], colorChange: [{ type: i0.Output, args: ["colorChange"] }], isVertical: [{ type: i0.Input, args: [{ isSignal: true, alias: "vertical", required: false }] }], pointer: [{ type: i0.ViewChild, args: ['pointer', { isSignal: true }] }] } });

class ColorPickerInputDirective {
    constructor() {
        this.min = input(0, { ...(ngDevMode ? { debugName: "min" } : /* istanbul ignore next */ {}), transform: numberAttribute });
        this.max = input(255, { ...(ngDevMode ? { debugName: "max" } : /* istanbul ignore next */ {}), transform: numberAttribute });
        this.inputChange = output();
    }
    inputChanges(event) {
        const element = event.target || event.srcElement;
        const value = element.value;
        const numeric = parseFloat(value);
        if (!isNaN(numeric) && numeric >= this.min() && numeric <= this.max()) {
            this.inputChange.emit(numeric);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: ColorPickerInputDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "22.0.0", type: ColorPickerInputDirective, isStandalone: true, selector: "[inputChange]", inputs: { min: { classPropertyName: "min", publicName: "min", isSignal: true, isRequired: false, transformFunction: null }, max: { classPropertyName: "max", publicName: "max", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { inputChange: "inputChange" }, host: { listeners: { "input": "inputChanges($event)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: ColorPickerInputDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[inputChange]',
                    standalone: true
                }]
        }], propDecorators: { min: [{ type: i0.Input, args: [{ isSignal: true, alias: "min", required: false }] }], max: [{ type: i0.Input, args: [{ isSignal: true, alias: "max", required: false }] }], inputChange: [{ type: i0.Output, args: ["inputChange"] }], inputChanges: [{
                type: HostListener,
                args: ['input', ['$event']]
            }] } });

class RgbaComponent {
    constructor() {
        this.color = model.required(/* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "color" }] : /* istanbul ignore next */ []));
        this.labelVisible = input(false, { ...(ngDevMode ? { debugName: "labelVisible" } : /* istanbul ignore next */ {}), alias: 'label', transform: booleanAttribute });
        this.isAlphaVisible = input(true, { ...(ngDevMode ? { debugName: "isAlphaVisible" } : /* istanbul ignore next */ {}), alias: 'alpha', transform: booleanAttribute });
    }
    get value() {
        return this.color()?.getRgba();
    }
    onInputChange(newValue, color) {
        const value = this.value;
        const red = color === 'R' ? newValue : value.red;
        const green = color === 'G' ? newValue : value.green;
        const blue = color === 'B' ? newValue : value.blue;
        const alpha = color === 'A' ? newValue : value.alpha;
        const newColor = new Color().setRgba(red, green, blue, alpha);
        this.color.set(newColor);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: RgbaComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.0", type: RgbaComponent, isStandalone: true, selector: "rgba-input-component", inputs: { color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: true, transformFunction: null }, labelVisible: { classPropertyName: "labelVisible", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, isAlphaVisible: { classPropertyName: "isAlphaVisible", publicName: "alpha", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { color: "colorChange" }, ngImport: i0, template: "<div class=\"column\">\n    <input type=\"text\" pattern=\"[0-9]*\" min=\"0\" max=\"255\" [value]=\"value?.getRed()?.toString()\" (inputChange)=\"onInputChange($event, 'R')\" />\n    @if (labelVisible()) {\n        <span>R</span>\n    }\n</div>\n<div class=\"column\">\n    <input type=\"text\" pattern=\"[0-9]*\" min=\"0\" max=\"255\" [value]=\"value?.getGreen()?.toString()\" (inputChange)=\"onInputChange($event, 'G')\" />\n    @if (labelVisible()) {\n        <span>G</span>\n    }\n</div>\n<div class=\"column\">\n    <input type=\"text\" pattern=\"[0-9]*\" min=\"0\" max=\"255\" [value]=\"value?.getBlue()?.toString()\" (inputChange)=\"onInputChange($event, 'B')\" />\n    @if (labelVisible()) {\n        <span>B</span>\n    }\n</div>\n@if (isAlphaVisible()) {\n    <div class=\"column\">\n        <input type=\"text\" pattern=\"[0-9]+([\\.,][0-9]{1,2})?\" min=\"0\" max=\"1\" [value]=\"value?.getAlpha(true)?.toString()\" (inputChange)=\"onInputChange($event, 'A')\" />\n        @if (labelVisible()) {\n            <span>A</span>\n        }\n    </div>\n}", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{display:table;width:100%;text-align:center;color:var(--ngx-color-picker-input-label-color);font-size:11px}.column{display:table-cell;padding:0 2px}input{width:100%;border:1px solid var(--ngx-color-picker-input-border-color);color:var(--ngx-color-picker-input-color);text-align:center;font-size:12px;-webkit-appearance:none;border-radius:0;margin:0 0 6px;height:26px;outline:none}\n", ""], dependencies: [{ kind: "directive", type: ColorPickerInputDirective, selector: "[inputChange]", inputs: ["min", "max"], outputs: ["inputChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: RgbaComponent, decorators: [{
            type: Component,
            args: [{ selector: `rgba-input-component`, changeDetection: ChangeDetectionStrategy.OnPush, imports: [ColorPickerInputDirective], template: "<div class=\"column\">\n    <input type=\"text\" pattern=\"[0-9]*\" min=\"0\" max=\"255\" [value]=\"value?.getRed()?.toString()\" (inputChange)=\"onInputChange($event, 'R')\" />\n    @if (labelVisible()) {\n        <span>R</span>\n    }\n</div>\n<div class=\"column\">\n    <input type=\"text\" pattern=\"[0-9]*\" min=\"0\" max=\"255\" [value]=\"value?.getGreen()?.toString()\" (inputChange)=\"onInputChange($event, 'G')\" />\n    @if (labelVisible()) {\n        <span>G</span>\n    }\n</div>\n<div class=\"column\">\n    <input type=\"text\" pattern=\"[0-9]*\" min=\"0\" max=\"255\" [value]=\"value?.getBlue()?.toString()\" (inputChange)=\"onInputChange($event, 'B')\" />\n    @if (labelVisible()) {\n        <span>B</span>\n    }\n</div>\n@if (isAlphaVisible()) {\n    <div class=\"column\">\n        <input type=\"text\" pattern=\"[0-9]+([\\.,][0-9]{1,2})?\" min=\"0\" max=\"1\" [value]=\"value?.getAlpha(true)?.toString()\" (inputChange)=\"onInputChange($event, 'A')\" />\n        @if (labelVisible()) {\n            <span>A</span>\n        }\n    </div>\n}", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{display:table;width:100%;text-align:center;color:var(--ngx-color-picker-input-label-color);font-size:11px}.column{display:table-cell;padding:0 2px}input{width:100%;border:1px solid var(--ngx-color-picker-input-border-color);color:var(--ngx-color-picker-input-color);text-align:center;font-size:12px;-webkit-appearance:none;border-radius:0;margin:0 0 6px;height:26px;outline:none}\n"] }]
        }], propDecorators: { color: [{ type: i0.Input, args: [{ isSignal: true, alias: "color", required: true }] }, { type: i0.Output, args: ["colorChange"] }], labelVisible: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], isAlphaVisible: [{ type: i0.Input, args: [{ isSignal: true, alias: "alpha", required: false }] }] } });

class HslaComponent {
    constructor() {
        this.color = model.required(/* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "color" }] : /* istanbul ignore next */ []));
        this.labelVisible = input(false, { ...(ngDevMode ? { debugName: "labelVisible" } : /* istanbul ignore next */ {}), alias: 'label', transform: booleanAttribute });
        this.isAlphaVisible = input(true, { ...(ngDevMode ? { debugName: "isAlphaVisible" } : /* istanbul ignore next */ {}), alias: 'alpha', transform: booleanAttribute });
    }
    get value() {
        return this.color()?.getHsla();
    }
    onInputChange(newValue, color) {
        const value = this.value;
        const hue = color === 'H' ? newValue : value.hue;
        const saturation = color === 'S' ? newValue : value.saturation;
        const lightness = color === 'L' ? newValue : value.lightness;
        const alpha = color === 'A' ? newValue : value.alpha;
        const newColor = new Color().setHsla(hue, saturation, lightness, alpha);
        this.color.set(newColor);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: HslaComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.0", type: HslaComponent, isStandalone: true, selector: "hsla-input-component", inputs: { color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: true, transformFunction: null }, labelVisible: { classPropertyName: "labelVisible", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, isAlphaVisible: { classPropertyName: "isAlphaVisible", publicName: "alpha", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { color: "colorChange" }, ngImport: i0, template: "<div class=\"column\">\n    <input type=\"text\" pattern=\"[0-9]*\" min=\"0\" max=\"360\" [value]=\"value?.getHue()?.toString()\" (inputChange)=\"onInputChange($event, 'H')\" />\n    @if (labelVisible()) {\n        <span>H</span>\n    }\n</div>\n<div class=\"column\">\n    <input type=\"text\" pattern=\"[0-9]*\" min=\"0\" max=\"100\" [value]=\"$safeNavigationMigration(value?.getSaturation()) + '%'\" (inputChange)=\"onInputChange($event, 'S')\" />\n    @if (labelVisible()) {\n        <span>S</span>\n    }\n</div>\n<div class=\"column\">\n    <input type=\"text\" pattern=\"[0-9]*\" min=\"0\" max=\"100\" [value]=\"$safeNavigationMigration(value?.getLightness()) + '%'\" (inputChange)=\"onInputChange($event, 'L')\" />\n    @if (labelVisible()) {\n        <span>L</span>\n    }\n</div>\n@if (isAlphaVisible()) {\n    <div class=\"column\">\n        <input type=\"text\" pattern=\"[0-9]+([\\.,][0-9]{1,2})?\" min=\"0\" max=\"1\" [value]=\"value?.getAlpha(true)?.toString()\" (inputChange)=\"onInputChange($event, 'A')\" />\n        @if (labelVisible()) {\n            <span>A</span>\n        }\n    </div>\n}", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{display:table;width:100%;text-align:center;color:var(--ngx-color-picker-input-label-color);font-size:11px}.column{display:table-cell;padding:0 2px}input{width:100%;border:1px solid var(--ngx-color-picker-input-border-color);color:var(--ngx-color-picker-input-color);text-align:center;font-size:12px;-webkit-appearance:none;border-radius:0;margin:0 0 6px;height:26px;outline:none}\n", ""], dependencies: [{ kind: "directive", type: ColorPickerInputDirective, selector: "[inputChange]", inputs: ["min", "max"], outputs: ["inputChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: HslaComponent, decorators: [{
            type: Component,
            args: [{ selector: `hsla-input-component`, changeDetection: ChangeDetectionStrategy.OnPush, imports: [ColorPickerInputDirective], template: "<div class=\"column\">\n    <input type=\"text\" pattern=\"[0-9]*\" min=\"0\" max=\"360\" [value]=\"value?.getHue()?.toString()\" (inputChange)=\"onInputChange($event, 'H')\" />\n    @if (labelVisible()) {\n        <span>H</span>\n    }\n</div>\n<div class=\"column\">\n    <input type=\"text\" pattern=\"[0-9]*\" min=\"0\" max=\"100\" [value]=\"$safeNavigationMigration(value?.getSaturation()) + '%'\" (inputChange)=\"onInputChange($event, 'S')\" />\n    @if (labelVisible()) {\n        <span>S</span>\n    }\n</div>\n<div class=\"column\">\n    <input type=\"text\" pattern=\"[0-9]*\" min=\"0\" max=\"100\" [value]=\"$safeNavigationMigration(value?.getLightness()) + '%'\" (inputChange)=\"onInputChange($event, 'L')\" />\n    @if (labelVisible()) {\n        <span>L</span>\n    }\n</div>\n@if (isAlphaVisible()) {\n    <div class=\"column\">\n        <input type=\"text\" pattern=\"[0-9]+([\\.,][0-9]{1,2})?\" min=\"0\" max=\"1\" [value]=\"value?.getAlpha(true)?.toString()\" (inputChange)=\"onInputChange($event, 'A')\" />\n        @if (labelVisible()) {\n            <span>A</span>\n        }\n    </div>\n}", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{display:table;width:100%;text-align:center;color:var(--ngx-color-picker-input-label-color);font-size:11px}.column{display:table-cell;padding:0 2px}input{width:100%;border:1px solid var(--ngx-color-picker-input-border-color);color:var(--ngx-color-picker-input-color);text-align:center;font-size:12px;-webkit-appearance:none;border-radius:0;margin:0 0 6px;height:26px;outline:none}\n"] }]
        }], propDecorators: { color: [{ type: i0.Input, args: [{ isSignal: true, alias: "color", required: true }] }, { type: i0.Output, args: ["colorChange"] }], labelVisible: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], isAlphaVisible: [{ type: i0.Input, args: [{ isSignal: true, alias: "alpha", required: false }] }] } });

class HexComponent {
    constructor() {
        this.color = model.required(/* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "color" }] : /* istanbul ignore next */ []));
        this.labelVisible = input(false, { ...(ngDevMode ? { debugName: "labelVisible" } : /* istanbul ignore next */ {}), alias: 'label', transform: booleanAttribute });
        this.prefixValue = input('', { ...(ngDevMode ? { debugName: "prefixValue" } : /* istanbul ignore next */ {}), alias: 'prefix' });
    }
    get value() {
        return this.prefixValue() + (this.color() ? this.color().toHexString(this.color().getRgba().alpha < 1).replace('#', '') : '');
    }
    onInputChange(event, inputValue) {
        const value = inputValue.toLowerCase().replace('#', '');
        if (((event.keyCode === 13 || event.key.toLowerCase() === 'enter') && value.length === 3)
            || value.length === 6 || value.length === 8) {
            const hex = parseInt(value, 16);
            const hexStr = hex.toString(16);
            /**
             * if value is valid
             * change color else do nothing
             * after parsing number leading 0 is removed,
             * compare length and add leading 0 before comparing two values
             */
            if (hexStr.padStart(value.length, '0') === value && this.value !== value) {
                const newColor = new Color(`#${value}`);
                this.color.set(newColor);
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: HexComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.0", type: HexComponent, isStandalone: true, selector: "hex-input-component", inputs: { color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: true, transformFunction: null }, labelVisible: { classPropertyName: "labelVisible", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, prefixValue: { classPropertyName: "prefixValue", publicName: "prefix", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { color: "colorChange" }, ngImport: i0, template: "<div class=\"column\">\n    <input #elRef type=\"text\" [value]=\"value\" (keyup)=\"onInputChange($event, elRef.value)\" />\n    @if (labelVisible()) {\n        <span>HEX</span>\n    }\n</div>", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{display:table;width:100%;text-align:center;color:var(--ngx-color-picker-input-label-color);font-size:11px}.column{display:table-cell;padding:0 2px}input{width:100%;border:1px solid var(--ngx-color-picker-input-border-color);color:var(--ngx-color-picker-input-color);text-align:center;font-size:12px;-webkit-appearance:none;border-radius:0;margin:0 0 6px;height:26px;outline:none}\n", ""], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: HexComponent, decorators: [{
            type: Component,
            args: [{ selector: `hex-input-component`, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, template: "<div class=\"column\">\n    <input #elRef type=\"text\" [value]=\"value\" (keyup)=\"onInputChange($event, elRef.value)\" />\n    @if (labelVisible()) {\n        <span>HEX</span>\n    }\n</div>", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{display:table;width:100%;text-align:center;color:var(--ngx-color-picker-input-label-color);font-size:11px}.column{display:table-cell;padding:0 2px}input{width:100%;border:1px solid var(--ngx-color-picker-input-border-color);color:var(--ngx-color-picker-input-color);text-align:center;font-size:12px;-webkit-appearance:none;border-radius:0;margin:0 0 6px;height:26px;outline:none}\n"] }]
        }], propDecorators: { color: [{ type: i0.Input, args: [{ isSignal: true, alias: "color", required: true }] }, { type: i0.Output, args: ["colorChange"] }], labelVisible: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], prefixValue: [{ type: i0.Input, args: [{ isSignal: true, alias: "prefix", required: false }] }] } });

class ColorPresetComponent {
    constructor(pickerConfig, elementRef, renderer) {
        this.pickerConfig = pickerConfig;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.activeColor = input.required(/* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "activeColor" }] : /* istanbul ignore next */ []));
        this.color = input.required(/* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "color" }] : /* istanbul ignore next */ []));
        this.showDepthText = input(false, { ...(ngDevMode ? { debugName: "showDepthText" } : /* istanbul ignore next */ {}), alias: 'show-depth-title', transform: booleanAttribute });
        this.selectionChange = output();
        this.longPress = output();
        this.mouseup = new Subject();
        this.subscriptions = [];
        this.className = computed(() => {
            return this.activeColor() ? this.color().toRgbaString() === this.activeColor().toRgbaString() : false;
        }, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "className" }] : /* istanbul ignore next */ []));
        this.addEventListeners();
        effect(() => {
            this.updateBackground();
            this.updateTitleAttr();
        });
    }
    ngOnDestroy() {
        this.mouseup.next();
        this.mouseup.complete();
        this.removeEventListeners();
    }
    updateBackground() {
        this.renderer.setStyle(this.elementRef.nativeElement, 'backgroundColor', this.color().toRgbaString());
    }
    updateTitleAttr() {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'title', this.getTitle());
    }
    getTitle() {
        const color = this.color() ? this.color().toHexString() : '';
        if (this.showDepthText()) {
            return (this.pickerConfig?.presetsTitle || '').replace(/\{\s*(.+?)\s*\}/g, (match, firstMatch) => color);
        }
        return color;
    }
    addEventListeners() {
        this.subscriptions.push(merge(fromEvent(this.elementRef.nativeElement, 'mouseup'), fromEvent(this.elementRef.nativeElement, 'touchend'))
            .subscribe(() => this.onTouchEnd()));
        this.subscriptions.push(merge(fromEvent(this.elementRef.nativeElement, 'mousedown'), fromEvent(this.elementRef.nativeElement, 'touchstart', { passive: true }))
            .subscribe((e) => this.onTouch(e)));
    }
    removeEventListeners() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
    }
    onTouch(event) {
        of(event)
            .pipe(map((e) => e.timeStamp || new Date().getTime()), delay(350), takeUntil(this.mouseup))
            .subscribe(() => this.longPress.emit(true));
        this.selectionChange.emit(this.color());
    }
    onTouchEnd() {
        this.mouseup.next();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: ColorPresetComponent, deps: [{ token: ColorPickerConfig }, { token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.0", type: ColorPresetComponent, isStandalone: true, selector: "color-preset", inputs: { activeColor: { classPropertyName: "activeColor", publicName: "activeColor", isSignal: true, isRequired: true, transformFunction: null }, color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: true, transformFunction: null }, showDepthText: { classPropertyName: "showDepthText", publicName: "show-depth-title", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { selectionChange: "selectionChange", longPress: "longPress" }, host: { attributes: { "class.selected": "className()" } }, ngImport: i0, template: ``, isInline: true, styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{display:inline-block;height:12px;width:12px;position:relative;cursor:pointer;transition:all .2s}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: ColorPresetComponent, decorators: [{
            type: Component,
            args: [{ selector: `color-preset`, template: ``, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, host: {
                        'class.selected': 'className()',
                    }, styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{display:inline-block;height:12px;width:12px;position:relative;cursor:pointer;transition:all .2s}\n"] }]
        }], ctorParameters: () => [{ type: ColorPickerConfig }, { type: i0.ElementRef }, { type: i0.Renderer2 }], propDecorators: { activeColor: [{ type: i0.Input, args: [{ isSignal: true, alias: "activeColor", required: true }] }], color: [{ type: i0.Input, args: [{ isSignal: true, alias: "color", required: true }] }], showDepthText: [{ type: i0.Input, args: [{ isSignal: true, alias: "show-depth-title", required: false }] }], selectionChange: [{ type: i0.Output, args: ["selectionChange"] }], longPress: [{ type: i0.Output, args: ["longPress"] }] } });

// import { ReversePipe } from './../../../pipes/reverse.pipe';
class ColorPresetSublist {
    constructor(document) {
        this.document = document;
        this.list = input.required(/* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "list" }] : /* istanbul ignore next */ []));
        this.activeColor = input.required(/* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "activeColor" }] : /* istanbul ignore next */ []));
        this.direction = input('up', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "direction" }] : /* istanbul ignore next */ []));
        this.selectionChange = output();
        this.showChildren = signal(false, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "showChildren" }] : /* istanbul ignore next */ []));
        this.subscriptions = [];
    }
    ngOnDestroy() {
        this.removeListeners();
    }
    get className() {
        return `direction-${this.direction()}`;
    }
    /**
     * emit color change
     */
    onSelectionChange(color) {
        this.selectionChange.emit(color);
    }
    onLongPress() {
        this.showChildren.set(true);
        this.listenDocumentEvents();
    }
    removeListeners() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
    }
    listenDocumentEvents() {
        this.subscriptions.push(merge(fromEvent(this.document, 'mousedown'), fromEvent(this.document, 'touchstart', { passive: true }))
            .subscribe(() => this.closeList()));
    }
    closeList() {
        if (this.showChildren) {
            this.showChildren.set(false);
            this.removeListeners();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: ColorPresetSublist, deps: [{ token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.0", type: ColorPresetSublist, isStandalone: true, selector: "color-preset-sublist", inputs: { list: { classPropertyName: "list", publicName: "list", isSignal: true, isRequired: true, transformFunction: null }, activeColor: { classPropertyName: "activeColor", publicName: "activeColor", isSignal: true, isRequired: true, transformFunction: null }, direction: { classPropertyName: "direction", publicName: "direction", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { selectionChange: "selectionChange" }, host: { properties: { "className": "this.className" } }, ngImport: i0, template: "<color-preset [show-depth-title]=\"list().length > 1\" [color]=\"list()[0]\" [activeColor]=\"activeColor()\" (longPress)=\"onLongPress()\" (selectionChange)=\"onSelectionChange($event)\" />\n<div class=\"reflection\" [style.backgroundColor]=\"list()[0].toRgbaString()\"></div>\n<div class=\"reflection\" [style.backgroundColor]=\"list()[0].toRgbaString()\"></div>\n\n@if (showChildren()) {\n    <div class=\"sublist animated\">\n        @for(preset of list(); track preset; let i = $index, isLast = $last, isFirst = $first) {\n        <color-preset \n            [color]=\"preset\"\n            [activeColor]=\"activeColor()\"\n            (selectionChange)=\"onSelectionChange($event)\"\n            [class.first-preset]=\"isFirst\"\n            [class.last-preset]=\"isLast\"\n            [style.--i]=\"i\" />\n        }\n    </div>\n}", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{position:relative;display:inline-block}color-preset{display:inline-block;position:relative;z-index:3}color-preset.first-preset{margin:0}.reflection{display:none;position:absolute;height:100%;width:100%;z-index:2;right:-2px;top:-2px;opacity:.5}.reflection+.reflection{opacity:.2;right:-4px;top:-4px;z-index:1}color-preset:hover+.reflection,color-preset:hover+.reflection+.reflection{display:block}.sublist{display:flex;align-items:center;flex-direction:column;background:#fff;border-radius:2px;bottom:-8px;box-shadow:#0000004d 0 0 2px,#0000004d 0 2px 4px;height:0;left:-8px;opacity:0;padding:8px 5px;position:absolute;right:-8px;text-align:center;z-index:1000}.sublist.animated{opacity:1;transition:ease-in .08s opacity;height:auto}.sublist color-preset{animation-delay:calc(var(--i) * .01s)!important;margin:8px 0 0;opacity:0}.sublist color-preset.last-preset{margin:0}:host(.direction-down) .sublist{bottom:auto;top:-8px}:host(.direction-up) .sublist{flex-direction:column-reverse}:host(.direction-down) .animated color-preset{animation:enterDown .08s ease-out forwards}:host(.direction-up) .animated color-preset{animation:enterUp .08s ease-out forwards}:host(.direction-left) .animated color-preset{animation:enterLeft .08s ease-out forwards}:host(.direction-right) .animated color-preset{animation:enterRight .08s ease-out forwards}@keyframes enterDown{0%{opacity:0;transform:translateY(-15px)}to{opacity:1;transform:translateY(0)}}@keyframes enterUp{0%{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}@keyframes enterLeft{0%{opacity:0;transform:translate(15px)}to{opacity:1;transform:translate(0)}}@keyframes enterRight{0%{opacity:0;transform:translate(-15px)}to{opacity:1;transform:translate(0)}}\n"], dependencies: [{ kind: "component", type: ColorPresetComponent, selector: "color-preset", inputs: ["activeColor", "color", "show-depth-title"], outputs: ["selectionChange", "longPress"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: ColorPresetSublist, decorators: [{
            type: Component,
            args: [{ selector: `color-preset-sublist`, changeDetection: ChangeDetectionStrategy.OnPush, imports: [ColorPresetComponent], template: "<color-preset [show-depth-title]=\"list().length > 1\" [color]=\"list()[0]\" [activeColor]=\"activeColor()\" (longPress)=\"onLongPress()\" (selectionChange)=\"onSelectionChange($event)\" />\n<div class=\"reflection\" [style.backgroundColor]=\"list()[0].toRgbaString()\"></div>\n<div class=\"reflection\" [style.backgroundColor]=\"list()[0].toRgbaString()\"></div>\n\n@if (showChildren()) {\n    <div class=\"sublist animated\">\n        @for(preset of list(); track preset; let i = $index, isLast = $last, isFirst = $first) {\n        <color-preset \n            [color]=\"preset\"\n            [activeColor]=\"activeColor()\"\n            (selectionChange)=\"onSelectionChange($event)\"\n            [class.first-preset]=\"isFirst\"\n            [class.last-preset]=\"isLast\"\n            [style.--i]=\"i\" />\n        }\n    </div>\n}", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{position:relative;display:inline-block}color-preset{display:inline-block;position:relative;z-index:3}color-preset.first-preset{margin:0}.reflection{display:none;position:absolute;height:100%;width:100%;z-index:2;right:-2px;top:-2px;opacity:.5}.reflection+.reflection{opacity:.2;right:-4px;top:-4px;z-index:1}color-preset:hover+.reflection,color-preset:hover+.reflection+.reflection{display:block}.sublist{display:flex;align-items:center;flex-direction:column;background:#fff;border-radius:2px;bottom:-8px;box-shadow:#0000004d 0 0 2px,#0000004d 0 2px 4px;height:0;left:-8px;opacity:0;padding:8px 5px;position:absolute;right:-8px;text-align:center;z-index:1000}.sublist.animated{opacity:1;transition:ease-in .08s opacity;height:auto}.sublist color-preset{animation-delay:calc(var(--i) * .01s)!important;margin:8px 0 0;opacity:0}.sublist color-preset.last-preset{margin:0}:host(.direction-down) .sublist{bottom:auto;top:-8px}:host(.direction-up) .sublist{flex-direction:column-reverse}:host(.direction-down) .animated color-preset{animation:enterDown .08s ease-out forwards}:host(.direction-up) .animated color-preset{animation:enterUp .08s ease-out forwards}:host(.direction-left) .animated color-preset{animation:enterLeft .08s ease-out forwards}:host(.direction-right) .animated color-preset{animation:enterRight .08s ease-out forwards}@keyframes enterDown{0%{opacity:0;transform:translateY(-15px)}to{opacity:1;transform:translateY(0)}}@keyframes enterUp{0%{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}@keyframes enterLeft{0%{opacity:0;transform:translate(15px)}to{opacity:1;transform:translate(0)}}@keyframes enterRight{0%{opacity:0;transform:translate(-15px)}to{opacity:1;transform:translate(0)}}\n"] }]
        }], ctorParameters: () => [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }], propDecorators: { list: [{ type: i0.Input, args: [{ isSignal: true, alias: "list", required: true }] }], activeColor: [{ type: i0.Input, args: [{ isSignal: true, alias: "activeColor", required: true }] }], direction: [{ type: i0.Input, args: [{ isSignal: true, alias: "direction", required: false }] }], selectionChange: [{ type: i0.Output, args: ["selectionChange"] }], className: [{
                type: HostBinding,
                args: ['className']
            }] } });

class ChunksPipe {
    transform(arr, chunkSize) {
        return arr.reduce((prev, cur, i) => (i % chunkSize) ? prev : prev.concat([arr.slice(i, i + chunkSize)]), []);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: ChunksPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "22.0.0", ngImport: i0, type: ChunksPipe, isStandalone: true, name: "chunks" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: ChunksPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'chunks',
                    standalone: true
                }]
        }] });

class ColorPresetsComponent {
    constructor() {
        this.columns = input(8, { ...(ngDevMode ? { debugName: "columns" } : /* istanbul ignore next */ {}), transform: numberAttribute });
        this.colorPresets = input.required(/* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "colorPresets" }] : /* istanbul ignore next */ []));
        this.color = model.required(/* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "color" }] : /* istanbul ignore next */ []));
        this.direction = input('up', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "direction" }] : /* istanbul ignore next */ []));
    }
    onSelectionChange(color) {
        const selectedRgbaColor = color.getRgba();
        const newColor = new Color()
            .setRgba(selectedRgbaColor.red, selectedRgbaColor.green, selectedRgbaColor.blue, selectedRgbaColor.alpha);
        this.color.set(newColor);
    }
    isList(colorPreset) {
        return Array.isArray(colorPreset);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: ColorPresetsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.0", type: ColorPresetsComponent, isStandalone: true, selector: "color-presets-component", inputs: { columns: { classPropertyName: "columns", publicName: "columns", isSignal: true, isRequired: false, transformFunction: null }, colorPresets: { classPropertyName: "colorPresets", publicName: "colorPresets", isSignal: true, isRequired: true, transformFunction: null }, color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: true, transformFunction: null }, direction: { classPropertyName: "direction", publicName: "direction", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { color: "colorChange" }, ngImport: i0, template: "@for (chunk of colorPresets() | chunks: columns(); track chunk; let firstRow = $first; let lastRow = $last) {\n    <div class=\"presets-row\" [ngClass]=\"{ 'first': firstRow, 'last': lastRow }\">\n\n        @for (preset of chunk; track preset; let firstColumn = $first; let lastColumn = $last;) {\n            @if (isList(preset)) {\n            <color-preset-sublist \n                [list]=\"preset\" \n                [direction]=\"direction()\"\n                [activeColor]=\"color()\"\n                [ngClass]=\"{ 'first': firstColumn, 'last': lastColumn }\"\n                (selectionChange)=\"onSelectionChange($event)\" />\n            } @else {\n                <color-preset \n                    [ngClass]=\"{ 'first': firstColumn, 'last': lastColumn }\"\n                    [color]=\"preset\" \n                    [activeColor]=\"color()\" \n                    (selectionChange)=\"onSelectionChange($event)\" />\n            }\n        }\n    </div>\n}", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{display:block;font-size:0}:host .presets-row{display:flex}:host .presets-row:first-child{padding:0}color-preset-sublist:first-child,color-preset:first-child{margin:0}\n"], dependencies: [{ kind: "component", type: ColorPresetComponent, selector: "color-preset", inputs: ["activeColor", "color", "show-depth-title"], outputs: ["selectionChange", "longPress"] }, { kind: "component", type: ColorPresetSublist, selector: "color-preset-sublist", inputs: ["list", "activeColor", "direction"], outputs: ["selectionChange"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "pipe", type: ChunksPipe, name: "chunks" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: ColorPresetsComponent, decorators: [{
            type: Component,
            args: [{ selector: `color-presets-component`, changeDetection: ChangeDetectionStrategy.OnPush, imports: [ColorPresetComponent, ColorPresetSublist, NgClass, ChunksPipe], template: "@for (chunk of colorPresets() | chunks: columns(); track chunk; let firstRow = $first; let lastRow = $last) {\n    <div class=\"presets-row\" [ngClass]=\"{ 'first': firstRow, 'last': lastRow }\">\n\n        @for (preset of chunk; track preset; let firstColumn = $first; let lastColumn = $last;) {\n            @if (isList(preset)) {\n            <color-preset-sublist \n                [list]=\"preset\" \n                [direction]=\"direction()\"\n                [activeColor]=\"color()\"\n                [ngClass]=\"{ 'first': firstColumn, 'last': lastColumn }\"\n                (selectionChange)=\"onSelectionChange($event)\" />\n            } @else {\n                <color-preset \n                    [ngClass]=\"{ 'first': firstColumn, 'last': lastColumn }\"\n                    [color]=\"preset\" \n                    [activeColor]=\"color()\" \n                    (selectionChange)=\"onSelectionChange($event)\" />\n            }\n        }\n    </div>\n}", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{display:block;font-size:0}:host .presets-row{display:flex}:host .presets-row:first-child{padding:0}color-preset-sublist:first-child,color-preset:first-child{margin:0}\n"] }]
        }], propDecorators: { columns: [{ type: i0.Input, args: [{ isSignal: true, alias: "columns", required: false }] }], colorPresets: [{ type: i0.Input, args: [{ isSignal: true, alias: "colorPresets", required: true }] }], color: [{ type: i0.Input, args: [{ isSignal: true, alias: "color", required: true }] }, { type: i0.Output, args: ["colorChange"] }], direction: [{ type: i0.Input, args: [{ isSignal: true, alias: "direction", required: false }] }] } });

class ReversePipe {
    transform(arr, isReversed = true) {
        if (isReversed) {
            return arr.slice().reverse();
        }
        return arr;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: ReversePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "22.0.0", ngImport: i0, type: ReversePipe, isStandalone: true, name: "reverse" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: ReversePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'reverse',
                    standalone: true
                }]
        }] });

var ColorType;
(function (ColorType) {
    ColorType["hex"] = "hex";
    ColorType["hexa"] = "hexa";
    ColorType["rgba"] = "rgba";
    ColorType["rgb"] = "rgb";
    ColorType["hsla"] = "hsla";
    ColorType["hsl"] = "hsl";
    ColorType["cmyk"] = "cmyk";
})(ColorType || (ColorType = {}));
class ColorPickerControl {
    constructor() {
        this.initValue = null;
        this.valueChanged = new Subject();
        this.presetsVisibilityChanges = new BehaviorSubject(true);
        this.initType = null;
        this.alphaChannelVisibilityChanges = new BehaviorSubject(true);
        this.valueChanges = this.valueChanged.asObservable().pipe(distinctUntilChanged((x, y) => x.toRgbaString() == y.toRgbaString()));
        this.colorPresets = [];
        const color = Color.from(new Rgba(255, 0, 0, 1));
        this.setValue(color);
    }
    setValueFrom(color) {
        const newColor = Color.from(color);
        if (!this.initValue) {
            this.initValue = Color.from(color);
        }
        if (typeof color === 'string' && !this.initType) {
            this.initType = this.finOutInputType(color);
        }
        this.setValue(newColor);
        return this;
    }
    get value() {
        return this.modelValue;
    }
    /**
     * @internal
     * used for two-way data binding
     */
    set value(value) {
        this.setValue(value);
    }
    /**
     * reset color to initial
     */
    reset() {
        const color = !this.initValue ?
            Color.from(new Rgba(255, 0, 0, 1)) :
            this.initValue.clone();
        this.setValue(color);
        return this;
    }
    isAlphaChannelEnabled() {
        return this.alphaChannelVisibilityChanges.value;
    }
    showAlphaChannel() {
        this.alphaChannelVisibilityChanges.next(true);
        return this;
    }
    hideAlphaChannel() {
        this.alphaChannelVisibilityChanges.next(false);
        return this;
    }
    getColorType(colorString) {
        return this.finOutInputType(colorString);
    }
    setColorPresets(colorPresets) {
        this.colorPresets = this.setPresets(colorPresets);
        return this;
    }
    get presets() {
        return this.colorPresets;
    }
    hasPresets() {
        return this.colorPresets.length > 0;
    }
    isPresetVisible() {
        return this.presetsVisibilityChanges.value;
    }
    showPresets() {
        this.presetsVisibilityChanges.next(true);
        return this;
    }
    hidePresets() {
        this.presetsVisibilityChanges.next(false);
        return this;
    }
    setValue(value) {
        this.modelValue = value;
        this.valueChanged.next(value);
        return this;
    }
    finOutInputType(colorString) {
        const str = colorString.replace(/ /g, '').toLowerCase();
        if (str[0] === '#') {
            if (str.length > 7) {
                return ColorType.hexa;
            }
            return ColorType.hex;
        }
        const OpenParenthesis = str.indexOf('(');
        const colorTypeName = str.substr(0, OpenParenthesis);
        switch (colorTypeName) {
            case ColorType.rgba:
                return ColorType.rgba;
            case ColorType.rgb:
                return ColorType.rgb;
            case ColorType.hsla:
                return ColorType.hsla;
            case ColorType.hsl:
                return ColorType.hsl;
            case ColorType.cmyk:
                return ColorType.cmyk;
        }
        return null;
    }
    setPresets(colorPresets) {
        const presets = [];
        for (const color of colorPresets) {
            if (Array.isArray(color)) {
                presets.push(this.setPresets(color));
            }
            else {
                presets.push(new Color(color));
            }
        }
        return presets;
    }
}

function getValueByType(color, type) {
    const showAlpha = type == ColorType.hexa
        || type == ColorType.rgba
        || type == ColorType.hsla
        || color.getHsva().alpha <= 0.995;
    switch (type) {
        case ColorType.hex:
        case ColorType.hexa:
            return color.toHexString(showAlpha);
        case ColorType.rgb:
        case ColorType.rgba:
            if (!showAlpha) {
                return color.toRgbString();
            }
            return color.toRgbaString();
        case ColorType.hsl:
        case ColorType.hsla:
            if (!showAlpha) {
                return color.toHslString();
            }
            return color.toHslaString();
        default:
            return color.toRgbaString();
    }
}
function isColorEqual(first, second) {
    if (first instanceof Color && second instanceof Color) {
        return first.equal(second);
    }
    return first === second;
}

class ChromePickerComponent {
    constructor(cdr) {
        this.cdr = cdr;
        this.selectedPresentation = 0;
        this.presentations = ['rgba', 'hsla', 'hex'];
        this.color = model(/* @ts-ignore */
        ...(ngDevMode ? [undefined, { debugName: "color" }] : /* istanbul ignore next */ []));
        this.control = input(new ColorPickerControl(), /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "control" }] : /* istanbul ignore next */ []));
        this.subscriptions = [];
    }
    ngOnInit() {
        if (this.color() != null) {
            this.control().setValueFrom(this.color());
        }
        /**
         * set color presets
         * defined by this chrome color picker component
         */
        if (!this.control().hasPresets()) {
            this.control()
                .setColorPresets([
                ['#f44336', '#ffebee', '#ffcdd2', '#EF9A9A', '#E57373', '#EF5350', '#F44336', '#E53935', '#D32F2F', '#C62828', '#B71C1C'],
                ['#E91E63', '#fce4ec', '#f8bbd0', '#f48fb1', '#f06292', '#ec407a', '#e91e63', '#d81b60', '#c2185b', '#ad1457', '#880e4f'],
                ['#9C27B0', '#F3e5f5', '#e1bee7', '#ce93d8', '#ba68c8', '#ab47bc', '#9c27b0', '#8e24aa', '#7b1fa2', '#6a1b9a', '#4a148c'],
                ['#673AB7', '#ede7f6', '#d1c4e9', '#b39ddb', '#9575cd', '#7e57c2', '#673ab7', '#5e35b1', '#512da8', '#4527a0', '#311b92'],
                ['#3F51B5', '#e8eaf6', '#c5cae9', '#9fa8da', '#7986cb', '#5c6bc0', '#3f51b5', '#3949ab', '#303f9f', '#283593', '#1a237e'],
                ['#2196F3', '#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0D47a1'],
                ['#03A9F4', '#e1f5fe', '#b3e5fc', '#81d4fa', '#4fc3f7', '#29b6f6', '#03a9f4', '#039be5', '#0288d1', '#0277bd', '#01579b'],
                ['#00BCD4', '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064'],
                ['#009688', '#E0F2f1', '#b2dfdb', '#80cbc4', '#4db6ac', '#26a69a', '#009688', '#00897b', '#00796b', '#00695c', '#004d40'],
                ['#4CAF50', '#e8f5e9', '#c8e6c9', '#a5d6a7', '#81c784', '#66bb6a', '#4caf50', '#43a047', '#388e3c', '#2e7d32', '#1b5e20'],
                ['#8BC34A', '#f1f8e9', '#dcedc8', '#c5e1a5', '#aed581', '#9ccc65', '#8bc34a', '#7cb342', '#689f38', '#558b2f', '#33691e'],
                ['#cddc39', '#f9fbe7', '#f0f4c3', '#e6ee9c', '#dce775', '#d4e157', '#c0dc39', '#c0ca33', '#afb42b', '#9e9d24', '#827717'],
                ['#ffeb3b', '#fffde7', '#fff9c4', '#fff59d', '#fff176', '#ffee58', '#ffeb3b', '#fdd835', '#fbc02d', '#f9a825', '#f57f17'],
                ['#ffc107', '#fff8e1', '#ffecb3', '#ffe082', '#ffd54f', '#ffca28', '#ffc107', '#ffb300', '#ffa000', '#ff8f00', '#ff6f00'],
                ['#ff9800', '#fff3e0', '#ffe0b2', '#ffcc80', '#ffb74d', '#ffa726', '#ff9800', '#fb8c00', '#f57c00', '#ef6c00', '#e65100'],
                ['#ff5722', '#fbe9e7', '#ffccbc', '#ffab91', '#ff8a65', '#ff7043', '#ff5722', '#f4511e', '#e64a19', '#d84315', '#bf360c'],
                ['#795548', '#efebe9', '#d7ccc8', '#bcaaa4', '#a1887f', '#8d6e63', '#795548', '#6d4c41', '#5d4037', '#4e342e', '#3e2723'],
                ['#9e9e9e', '#fafafa', '#f5f5f5', '#eee', '#e0e0e0', '#bdbdbd', '#9e9e9e', '#757575', '#616161', '#424242', '#212121'],
                ['#607d8b', '#eceff1', '#cfd8dc', '#b0bec5', '#90a4ae', '#78909c', '#60708b', '#546e7a', '#455a64', '#37474f', '#263238']
            ]);
        }
        this.subscriptions.push(this.control().valueChanges.subscribe((value) => {
            this.color.set(getValueByType(value, this.control().initType));
            this.cdr.detectChanges();
        }));
    }
    ngOnChanges(changes) {
        /**
         * trigger only if color binding is changed
         */
        const color = this.color();
        const control = this.control();
        if (color && control && !isColorEqual(getValueByType(control.value, control.initType), color)) {
            control.setValueFrom(color);
        }
    }
    ngOnDestroy() {
        this.cdr.detach();
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
    }
    changePresentation() {
        this.selectedPresentation =
            this.selectedPresentation === this.presentations.length - 1 ? 0 : this.selectedPresentation + 1;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: ChromePickerComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.0", type: ChromePickerComponent, isStandalone: true, selector: "chrome-picker", inputs: { color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: false, transformFunction: null }, control: { classPropertyName: "control", publicName: "control", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { color: "colorChange" }, usesOnChanges: true, ngImport: i0, template: "<ng-content select=\"[before]\"></ng-content>\n\n<saturation-component [(color)]=\"control().value\"></saturation-component>\n\n<div class=\"controls\">\n    <div class=\"controls-row hue-alpha\">\n        <div class=\"column\">\n            <indicator-component [colorType]=\"presentations[selectedPresentation]\" [color]=\"control().value\" />\n        </div>\n        <div class=\"column\">\n            <hue-component [(color)]=\"control().value\" />\n            @if (control().alphaChannelVisibilityChanges | async) {\n                <alpha-component [(color)]=\"control().value\" />\n            }\n        </div>\n    </div>\n    <div class=\"controls-row presentation\">\n        <div class=\"column\">\n            @switch (presentations[selectedPresentation]) {\n                @case('rgba') {\n                    <rgba-input-component [alpha]=\"(control().alphaChannelVisibilityChanges | async) ?? true\" label [(color)]=\"control().value\" />\n                }\n                @case ('hsla') {\n                    <hsla-input-component [alpha]=\"(control().alphaChannelVisibilityChanges | async) ?? true\" label [(color)]=\"control().value\" />\n                }\n                @case('hex') {\n                    <hex-input-component label prefix=\"#\" [(color)]=\"control().value\" />\n                }\n            }\n        </div>\n        <div class=\"column type-column\">\n            <span class=\"type-btn\" (click)=\"changePresentation()\"></span>\n        </div>\n    </div>\n</div>\n\n@if (control().presetsVisibilityChanges | async) {\n    <color-presets-component [(color)]=\"control().value\" [colorPresets]=\"control().presets\" />\n}\n\n<ng-content></ng-content>", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{display:block;width:var(--ngx-color-picker-width);border-radius:var(--ngx-color-picker-border-radius);background:var(--ngx-color-picker-surface);border:1px solid var(--ngx-color-picker-border);box-shadow:var(--ngx-color-picker-shadow)}:host ::ng-deep .controls .pointer{box-shadow:var(--ngx-color-picker-pointer-shadow)}:host ::ng-deep .reflection,:host ::ng-deep color-preset{border-radius:2px}:host ::ng-deep color-preset{box-shadow:inset #0000004d 0 0 2px}:host ::ng-deep color-preset,:host ::ng-deep color-preset-sublist{margin:0 0 0 12px}:host ::ng-deep color-preset:first-child,:host ::ng-deep color-preset-sublist:first-child{margin:0}:host ::ng-deep .sublist color-preset:hover,:host ::ng-deep .presets-row>color-preset:hover{transform:scale(1.18)}saturation-component{height:120px}.controls{padding:15px 15px 10px}.controls-row{display:table;width:100%}.column{display:table-cell;vertical-align:middle}.hue-alpha .column:first-child{width:42px;padding:0 10px 0 0}indicator-component{height:32px;width:32px;border-radius:50%}alpha-component{margin-top:8px}color-presets-component{border-top:1px solid var(--ngx-color-picker-divider);padding:12px}color-presets-component ::ng-deep .presets-row{padding:12px 0 0}.type-btn{display:inline-block;height:20px;width:20px;background:transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAgCAYAAAAffCjxAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACewAAAnsB01CO3AAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIASURBVEiJ7ZY9axRRFIafsxMStrLQJpAgpBFhi+C9w1YSo00I6RZ/g9vZpBf/QOr4GyRgkSKNSrAadsZqQGwCkuAWyRZJsySwvhZ7N/vhzrgbLH3Ld8597jlzz50zJokyxXH8DqDVar0qi6v8BbItqSGpEcfxdlmsFWXkvX8AfAVWg3UKPEnT9GKujMzsAFgZsVaCN1VTQd77XUnrgE1kv+6935268WRpzrnHZvYRWC7YvC3pRZZl3wozqtVqiyH9IgjAspkd1Gq1xUJQtVrdB9ZKIAOthdg/Qc65LUk7wNIMoCVJO865rYFhkqjX6/d7vV4GPJwBMqofURS5JEk6FYBer/eeYb/Mo9WwFnPOvQbeAvfuAAK4BN4sAJtAG/gJIElmNuiJyba3EGNmZiPeZuEVmVell/Y/6N+CzDn3AXhEOOo7Hv/3BeAz8IzQkMPnJbuPx1wC+yYJ7/0nYIP5S/0FHKdp+rwCEEXRS/rf5Hl1Gtb2M0iSpCOpCZzPATmX1EySpHMLAsiy7MjMDoHrGSDXZnaYZdnRwBh7J91utwmczAA6CbG3GgPleX4jqUH/a1CktqRGnuc3hSCAMB32gKspkCtgb3KCQMmkjeP4WNJThrNNZval1WptTIsv7JtQ4tmIdRa8qSoEpWl6YWZNoAN0zKxZNPehpLSBZv2t+Q0CJ9lLnARQLAAAAABJRU5ErkJggg==) no-repeat center;background-size:6px 12px}.type-btn:hover{background-color:#eee}.type-column{width:25px;text-align:right}.presentation{padding:12px 0 0}\n"], dependencies: [{ kind: "component", type: SaturationComponent, selector: "saturation-component", inputs: ["color"], outputs: ["colorChange"] }, { kind: "component", type: IndicatorComponent, selector: "indicator-component", inputs: ["color", "colorType"] }, { kind: "component", type: HueComponent, selector: "hue-component", inputs: ["color", "vertical"], outputs: ["colorChange"] }, { kind: "component", type: AlphaComponent, selector: "alpha-component", inputs: ["color", "vertical"], outputs: ["colorChange"] }, { kind: "component", type: RgbaComponent, selector: "rgba-input-component", inputs: ["color", "label", "alpha"], outputs: ["colorChange"] }, { kind: "component", type: HslaComponent, selector: "hsla-input-component", inputs: ["color", "label", "alpha"], outputs: ["colorChange"] }, { kind: "component", type: HexComponent, selector: "hex-input-component", inputs: ["color", "label", "prefix"], outputs: ["colorChange"] }, { kind: "component", type: ColorPresetsComponent, selector: "color-presets-component", inputs: ["columns", "colorPresets", "color", "direction"], outputs: ["colorChange"] }, { kind: "pipe", type: AsyncPipe, name: "async" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: ChromePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: `chrome-picker`, changeDetection: ChangeDetectionStrategy.OnPush, imports: [
                        SaturationComponent,
                        IndicatorComponent,
                        HueComponent,
                        AlphaComponent,
                        RgbaComponent,
                        HslaComponent,
                        HexComponent,
                        ColorPresetsComponent,
                        AsyncPipe
                    ], template: "<ng-content select=\"[before]\"></ng-content>\n\n<saturation-component [(color)]=\"control().value\"></saturation-component>\n\n<div class=\"controls\">\n    <div class=\"controls-row hue-alpha\">\n        <div class=\"column\">\n            <indicator-component [colorType]=\"presentations[selectedPresentation]\" [color]=\"control().value\" />\n        </div>\n        <div class=\"column\">\n            <hue-component [(color)]=\"control().value\" />\n            @if (control().alphaChannelVisibilityChanges | async) {\n                <alpha-component [(color)]=\"control().value\" />\n            }\n        </div>\n    </div>\n    <div class=\"controls-row presentation\">\n        <div class=\"column\">\n            @switch (presentations[selectedPresentation]) {\n                @case('rgba') {\n                    <rgba-input-component [alpha]=\"(control().alphaChannelVisibilityChanges | async) ?? true\" label [(color)]=\"control().value\" />\n                }\n                @case ('hsla') {\n                    <hsla-input-component [alpha]=\"(control().alphaChannelVisibilityChanges | async) ?? true\" label [(color)]=\"control().value\" />\n                }\n                @case('hex') {\n                    <hex-input-component label prefix=\"#\" [(color)]=\"control().value\" />\n                }\n            }\n        </div>\n        <div class=\"column type-column\">\n            <span class=\"type-btn\" (click)=\"changePresentation()\"></span>\n        </div>\n    </div>\n</div>\n\n@if (control().presetsVisibilityChanges | async) {\n    <color-presets-component [(color)]=\"control().value\" [colorPresets]=\"control().presets\" />\n}\n\n<ng-content></ng-content>", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{display:block;width:var(--ngx-color-picker-width);border-radius:var(--ngx-color-picker-border-radius);background:var(--ngx-color-picker-surface);border:1px solid var(--ngx-color-picker-border);box-shadow:var(--ngx-color-picker-shadow)}:host ::ng-deep .controls .pointer{box-shadow:var(--ngx-color-picker-pointer-shadow)}:host ::ng-deep .reflection,:host ::ng-deep color-preset{border-radius:2px}:host ::ng-deep color-preset{box-shadow:inset #0000004d 0 0 2px}:host ::ng-deep color-preset,:host ::ng-deep color-preset-sublist{margin:0 0 0 12px}:host ::ng-deep color-preset:first-child,:host ::ng-deep color-preset-sublist:first-child{margin:0}:host ::ng-deep .sublist color-preset:hover,:host ::ng-deep .presets-row>color-preset:hover{transform:scale(1.18)}saturation-component{height:120px}.controls{padding:15px 15px 10px}.controls-row{display:table;width:100%}.column{display:table-cell;vertical-align:middle}.hue-alpha .column:first-child{width:42px;padding:0 10px 0 0}indicator-component{height:32px;width:32px;border-radius:50%}alpha-component{margin-top:8px}color-presets-component{border-top:1px solid var(--ngx-color-picker-divider);padding:12px}color-presets-component ::ng-deep .presets-row{padding:12px 0 0}.type-btn{display:inline-block;height:20px;width:20px;background:transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAgCAYAAAAffCjxAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACewAAAnsB01CO3AAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIASURBVEiJ7ZY9axRRFIafsxMStrLQJpAgpBFhi+C9w1YSo00I6RZ/g9vZpBf/QOr4GyRgkSKNSrAadsZqQGwCkuAWyRZJsySwvhZ7N/vhzrgbLH3Ld8597jlzz50zJokyxXH8DqDVar0qi6v8BbItqSGpEcfxdlmsFWXkvX8AfAVWg3UKPEnT9GKujMzsAFgZsVaCN1VTQd77XUnrgE1kv+6935268WRpzrnHZvYRWC7YvC3pRZZl3wozqtVqiyH9IgjAspkd1Gq1xUJQtVrdB9ZKIAOthdg/Qc65LUk7wNIMoCVJO865rYFhkqjX6/d7vV4GPJwBMqofURS5JEk6FYBer/eeYb/Mo9WwFnPOvQbeAvfuAAK4BN4sAJtAG/gJIElmNuiJyba3EGNmZiPeZuEVmVell/Y/6N+CzDn3AXhEOOo7Hv/3BeAz8IzQkMPnJbuPx1wC+yYJ7/0nYIP5S/0FHKdp+rwCEEXRS/rf5Hl1Gtb2M0iSpCOpCZzPATmX1EySpHMLAsiy7MjMDoHrGSDXZnaYZdnRwBh7J91utwmczAA6CbG3GgPleX4jqUH/a1CktqRGnuc3hSCAMB32gKspkCtgb3KCQMmkjeP4WNJThrNNZval1WptTIsv7JtQ4tmIdRa8qSoEpWl6YWZNoAN0zKxZNPehpLSBZv2t+Q0CJ9lLnARQLAAAAABJRU5ErkJggg==) no-repeat center;background-size:6px 12px}.type-btn:hover{background-color:#eee}.type-column{width:25px;text-align:right}.presentation{padding:12px 0 0}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }], propDecorators: { color: [{ type: i0.Input, args: [{ isSignal: true, alias: "color", required: false }] }, { type: i0.Output, args: ["colorChange"] }], control: [{ type: i0.Input, args: [{ isSignal: true, alias: "control", required: false }] }] } });

class SketchPickerComponent {
    constructor(cdr) {
        this.cdr = cdr;
        this.color = model(/* @ts-ignore */
        ...(ngDevMode ? [undefined, { debugName: "color" }] : /* istanbul ignore next */ []));
        this.control = input(new ColorPickerControl(), /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "control" }] : /* istanbul ignore next */ []));
        this.subscriptions = [];
    }
    ngOnInit() {
        if (this.color()) {
            this.control().setValueFrom(this.color());
        }
        if (!this.control().hasPresets()) {
            /**
             * set color presets
             * defined by sketch color picker component
             */
            this.control()
                .setColorPresets([
                '#d0041b', '#8b572a', '#f5a623', '#f8e71c', '#7ed321', '#417506', '#bd10e0', '#9013fe',
                '#4a90e2', '#50e3c2', '#b8e986', '#030303', '#4a4a4a', '#9b9b9b', '#fff'
            ]);
        }
        this.subscriptions.push(this.control().valueChanges.subscribe((value) => {
            this.color.set(getValueByType(value, this.control().initType));
            this.cdr.detectChanges();
        }));
    }
    ngOnChanges(changes) {
        /**
         * trigger only if color binding is changed
         */
        const color = this.color();
        const control = this.control();
        if (color && control && !isColorEqual(getValueByType(control.value, control.initType), color)) {
            control.setValueFrom(color);
        }
    }
    ngOnDestroy() {
        this.cdr.detach();
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: SketchPickerComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.0", type: SketchPickerComponent, isStandalone: true, selector: "sketch-picker", inputs: { color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: false, transformFunction: null }, control: { classPropertyName: "control", publicName: "control", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { color: "colorChange" }, usesOnChanges: true, ngImport: i0, template: "<ng-content select=\"[before]\"></ng-content>\n\n<saturation-component [(color)]=\"control().value\" />\n\n<div class=\"controls\">\n    <div class=\"controls-row hue-alpha\">\n        <div class=\"column\">\n            <hue-component [(color)]=\"control().value\" />\n            @if (control().alphaChannelVisibilityChanges | async) {\n                <alpha-component [(color)]=\"control().value\" />\n            }\n        </div>\n        <div class=\"column indicator-column\">\n            <indicator-component colorType=\"rgba\" [color]=\"control().value\" />\n        </div>\n    </div>\n    <div class=\"controls-row presentation\">\n        <div class=\"column\">\n            <hex-input-component label [(color)]=\"control().value\" />\n        </div>\n        <div class=\"column\">\n            <rgba-input-component [alpha]=\"(control().alphaChannelVisibilityChanges | async) ?? true\" label [(color)]=\"control().value\" />\n        </div>\n    </div>\n</div>\n\n@if (control().presetsVisibilityChanges | async) {\n    <color-presets-component [(color)]=\"control().value\" [colorPresets]=\"control().presets\" />\n}\n\n<ng-content></ng-content>", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{display:block;padding:9px;--ngx-color-picker-width: 220px;width:var(--ngx-color-picker-width);border-radius:var(--ngx-color-picker-border-radius);background:var(--ngx-color-picker-surface);border:1px solid var(--ngx-color-picker-border);box-shadow:var(--ngx-color-picker-shadow)}saturation-component{height:146px;border-radius:2px;box-shadow:inset #0009 0 0 2px}saturation-component ::ng-deep .pointer{border-width:2px;box-shadow:#0009 0 0 2px;width:10px;height:10px}.controls{padding:4px 0 0}hue-component,alpha-component{height:10px;border-radius:2px;box-shadow:inset #0009 0 0 2px}hue-component{margin-bottom:4px}.controls-row{display:table;width:100%}.column{display:table-cell;vertical-align:middle}.indicator-column{width:25px}indicator-component{height:24px;width:100%;box-shadow:inset #0009 0 0 2px;border-radius:2px}color-presets-component{border-top:1px solid var(--ngx-color-picker-divider);padding:10px 9px 0;margin:8px -9px 0}color-presets-component ::ng-deep .presets-row{padding:10px 0 0}:host indicator-component ::ng-deep svg{vertical-align:5%}.controls-row.hue-alpha{padding-bottom:9px}.controls-row.hue-alpha .column:first-child{padding-right:5px}.hue-alpha ::ng-deep .pointer{width:6px;margin:0 0 0 -3px;height:100%;top:0;border-radius:2px;border:1px solid #898989}.presentation .column:first-child{width:56px}.presentation ::ng-deep input{height:20px;font-size:11px}:host ::ng-deep .reflection,:host ::ng-deep color-preset{height:16px;width:16px;border-radius:2px}:host ::ng-deep color-preset{box-shadow:inset #0006 0 0 2px}:host ::ng-deep color-preset.selected{box-shadow:inset #0006 0 1px 4px}:host ::ng-deep .presets-row>color-preset,:host ::ng-deep .presets-row>color-preset-sublist{margin:0 0 0 10px}:host ::ng-deep .presets-row>color-preset:first-child,:host ::ng-deep .presets-row>color-preset-sublist:first-child{margin:0}\n"], dependencies: [{ kind: "component", type: SaturationComponent, selector: "saturation-component", inputs: ["color"], outputs: ["colorChange"] }, { kind: "component", type: IndicatorComponent, selector: "indicator-component", inputs: ["color", "colorType"] }, { kind: "component", type: HueComponent, selector: "hue-component", inputs: ["color", "vertical"], outputs: ["colorChange"] }, { kind: "component", type: AlphaComponent, selector: "alpha-component", inputs: ["color", "vertical"], outputs: ["colorChange"] }, { kind: "component", type: HexComponent, selector: "hex-input-component", inputs: ["color", "label", "prefix"], outputs: ["colorChange"] }, { kind: "component", type: RgbaComponent, selector: "rgba-input-component", inputs: ["color", "label", "alpha"], outputs: ["colorChange"] }, { kind: "component", type: ColorPresetsComponent, selector: "color-presets-component", inputs: ["columns", "colorPresets", "color", "direction"], outputs: ["colorChange"] }, { kind: "pipe", type: AsyncPipe, name: "async" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: SketchPickerComponent, decorators: [{
            type: Component,
            args: [{ selector: `sketch-picker`, changeDetection: ChangeDetectionStrategy.OnPush, imports: [
                        SaturationComponent,
                        IndicatorComponent,
                        HueComponent,
                        AlphaComponent,
                        HexComponent,
                        RgbaComponent,
                        ColorPresetsComponent,
                        AsyncPipe
                    ], template: "<ng-content select=\"[before]\"></ng-content>\n\n<saturation-component [(color)]=\"control().value\" />\n\n<div class=\"controls\">\n    <div class=\"controls-row hue-alpha\">\n        <div class=\"column\">\n            <hue-component [(color)]=\"control().value\" />\n            @if (control().alphaChannelVisibilityChanges | async) {\n                <alpha-component [(color)]=\"control().value\" />\n            }\n        </div>\n        <div class=\"column indicator-column\">\n            <indicator-component colorType=\"rgba\" [color]=\"control().value\" />\n        </div>\n    </div>\n    <div class=\"controls-row presentation\">\n        <div class=\"column\">\n            <hex-input-component label [(color)]=\"control().value\" />\n        </div>\n        <div class=\"column\">\n            <rgba-input-component [alpha]=\"(control().alphaChannelVisibilityChanges | async) ?? true\" label [(color)]=\"control().value\" />\n        </div>\n    </div>\n</div>\n\n@if (control().presetsVisibilityChanges | async) {\n    <color-presets-component [(color)]=\"control().value\" [colorPresets]=\"control().presets\" />\n}\n\n<ng-content></ng-content>", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{display:block;padding:9px;--ngx-color-picker-width: 220px;width:var(--ngx-color-picker-width);border-radius:var(--ngx-color-picker-border-radius);background:var(--ngx-color-picker-surface);border:1px solid var(--ngx-color-picker-border);box-shadow:var(--ngx-color-picker-shadow)}saturation-component{height:146px;border-radius:2px;box-shadow:inset #0009 0 0 2px}saturation-component ::ng-deep .pointer{border-width:2px;box-shadow:#0009 0 0 2px;width:10px;height:10px}.controls{padding:4px 0 0}hue-component,alpha-component{height:10px;border-radius:2px;box-shadow:inset #0009 0 0 2px}hue-component{margin-bottom:4px}.controls-row{display:table;width:100%}.column{display:table-cell;vertical-align:middle}.indicator-column{width:25px}indicator-component{height:24px;width:100%;box-shadow:inset #0009 0 0 2px;border-radius:2px}color-presets-component{border-top:1px solid var(--ngx-color-picker-divider);padding:10px 9px 0;margin:8px -9px 0}color-presets-component ::ng-deep .presets-row{padding:10px 0 0}:host indicator-component ::ng-deep svg{vertical-align:5%}.controls-row.hue-alpha{padding-bottom:9px}.controls-row.hue-alpha .column:first-child{padding-right:5px}.hue-alpha ::ng-deep .pointer{width:6px;margin:0 0 0 -3px;height:100%;top:0;border-radius:2px;border:1px solid #898989}.presentation .column:first-child{width:56px}.presentation ::ng-deep input{height:20px;font-size:11px}:host ::ng-deep .reflection,:host ::ng-deep color-preset{height:16px;width:16px;border-radius:2px}:host ::ng-deep color-preset{box-shadow:inset #0006 0 0 2px}:host ::ng-deep color-preset.selected{box-shadow:inset #0006 0 1px 4px}:host ::ng-deep .presets-row>color-preset,:host ::ng-deep .presets-row>color-preset-sublist{margin:0 0 0 10px}:host ::ng-deep .presets-row>color-preset:first-child,:host ::ng-deep .presets-row>color-preset-sublist:first-child{margin:0}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }], propDecorators: { color: [{ type: i0.Input, args: [{ isSignal: true, alias: "color", required: false }] }, { type: i0.Output, args: ["colorChange"] }], control: [{ type: i0.Input, args: [{ isSignal: true, alias: "control", required: false }] }] } });

class CompactPickerComponent {
    constructor(cdr) {
        this.cdr = cdr;
        this.color = model(/* @ts-ignore */
        ...(ngDevMode ? [undefined, { debugName: "color" }] : /* istanbul ignore next */ []));
        this.control = input(new ColorPickerControl(), /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "control" }] : /* istanbul ignore next */ []));
        this.subscriptions = [];
    }
    ngOnInit() {
        if (this.color()) {
            this.control().setValueFrom(this.color());
        }
        /**
         * set color presets
         * defined by compact color picker component
         */
        if (!this.control().hasPresets()) {
            this.control()
                .setColorPresets([
                '#6da6e8', '#74c283', '#f9d948', '#f5943f', '#f66c6c', '#ef8ab8', '#696cd4', '#6c6c6c', '#f6f5f5'
            ]);
        }
        this.subscriptions.push(this.control().valueChanges.subscribe((value) => {
            this.color.set(getValueByType(value, this.control().initType));
            this.cdr.detectChanges();
        }));
    }
    ngOnChanges(changes) {
        /**
         * trigger only if color binding is changed
         */
        const color = this.color();
        const control = this.control();
        if (color && control && !isColorEqual(getValueByType(control.value, control.initType), color)) {
            control.setValueFrom(color);
        }
    }
    ngOnDestroy() {
        this.cdr.detach();
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: CompactPickerComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.0", type: CompactPickerComponent, isStandalone: true, selector: "compact-picker", inputs: { color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: false, transformFunction: null }, control: { classPropertyName: "control", publicName: "control", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { color: "colorChange" }, usesOnChanges: true, ngImport: i0, template: "<ng-content select=\"[before]\"></ng-content>\n\n@if (control().presetsVisibilityChanges | async) {\n    <color-presets-component \n        direction=\"down\"\n        [columns]=\"9\" \n        [(color)]=\"control().value\" \n        [colorPresets]=\"control().presets\" />\n}\n\n<div class=\"controls\">\n    <div class=\"controls-row saturation-hue\">\n        <div class=\"column\">\n            <saturation-component [(color)]=\"control().value\" />\n        </div>\n        <div class=\"column hue-column\">\n            <hue-component vertical [(color)]=\"control().value\" />\n        </div>\n    </div>\n    <div class=\"controls-row presentation\">\n        <div class=\"column\">\n            <svg class=\"pencil\" viewBox=\"0 0 1024 1024\">\n                <path d=\"M639.77,121.045l-48.598,84.2l112.215,64.8l48.6-84.205L639.77,121.045z M558.773,261.354\n                    L315.78,682.206l112.215,64.795L670.99,326.15L558.773,261.354z M690.816,75.691l74.922,43.286\n                    c41.682,24.045,55.52,76.564,31.725,117.784l-37.967,65.68l-32.398,56.11L451.706,835.594L282.452,947.303\n                    c-40.961,27.004-70.24,9.027-67.329-38.894l12.149-202.411l275.395-477.041l32.398-56.11l37.883-65.686\n                    C596.824,65.946,649.473,51.857,690.816,75.691z M274.689,883.015l120.908-79.818l-112.218-64.8L274.689,883.015z\"/>\n            </svg>\n            <hex-input-component prefix=\"#\" [(color)]=\"control().value\" />\n        </div>\n        <div class=\"column\">\n            <indicator-component colorType=\"hex\" [color]=\"control().value\" />\n        </div>\n    </div>\n</div>\n\n<ng-content></ng-content>", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{display:block;--ngx-color-picker-width: 240px;width:var(--ngx-color-picker-width);border-radius:var(--ngx-color-picker-border-radius);background:var(--ngx-color-picker-surface);border:1px solid var(--ngx-color-picker-border);box-shadow:var(--ngx-color-picker-shadow)}:host ::ng-deep .reflection{display:none}:host ::ng-deep color-preset{height:18px;width:18px;border-radius:50%;box-shadow:inset #0009 0 1px 1px}:host ::ng-deep .presets-row>color-preset,:host ::ng-deep .presets-row>color-preset-sublist{margin:0 0 0 6px}:host ::ng-deep .presets-row>color-preset:first-child,:host ::ng-deep .presets-row>color-preset-sublist:first-child{margin:0}:host ::ng-deep color-preset.selected,:host ::ng-deep .sublist color-preset:hover,:host ::ng-deep .presets-row>color-preset:hover{box-shadow:inset #0009 0 1px 6px}:host hue-component{width:100%;height:178px;box-shadow:inset #0009 0 0 2px}:host hue-component[vertical] ::ng-deep .pointer{width:auto;height:9px;left:-3px;right:-3px;margin:-4.5px 0 0;background:transparent;border:3px solid #fff;border-radius:5px;box-shadow:#0009 0 0 2px}:host indicator-component ::ng-deep svg{vertical-align:25%}color-presets-component{border-bottom:1px solid #e4e4e6;padding:9px 12px}color-presets-component ::ng-deep .presets-row{padding:10px 0 0}.controls{padding:10px 12px 12px}.controls-row{display:table;width:100%}.column{display:table-cell;vertical-align:middle}.controls-row.saturation-hue{padding-bottom:9px}.controls-row.saturation-hue .column:first-child{width:178px}saturation-component{height:178px;box-shadow:inset #0009 0 0 2px}saturation-component ::ng-deep .pointer{border-width:2px;box-shadow:#0009 0 0 2px}.hue-column{padding-left:14px}.controls-row.presentation{border:1px solid var(--ngx-color-picker-control-border);border-radius:3px;padding:6px 6px 6px 26px;position:relative}indicator-component{height:18px;width:18px;box-shadow:inset #0009 0 0 2px;border-radius:50%}hex-input-component ::ng-deep input{border:0;color:var(--ngx-color-picker-input-secondary-color);margin:0;text-align:left;height:18px}.pencil{position:absolute;height:14px;width:14px;left:6px;top:50%;margin:-7px 0 0}svg.pencil,.pencil svg{fill:var(--ngx-color-picker-pencil-color)}\n"], dependencies: [{ kind: "component", type: SaturationComponent, selector: "saturation-component", inputs: ["color"], outputs: ["colorChange"] }, { kind: "component", type: IndicatorComponent, selector: "indicator-component", inputs: ["color", "colorType"] }, { kind: "component", type: HueComponent, selector: "hue-component", inputs: ["color", "vertical"], outputs: ["colorChange"] }, { kind: "component", type: ColorPresetsComponent, selector: "color-presets-component", inputs: ["columns", "colorPresets", "color", "direction"], outputs: ["colorChange"] }, { kind: "component", type: HexComponent, selector: "hex-input-component", inputs: ["color", "label", "prefix"], outputs: ["colorChange"] }, { kind: "pipe", type: AsyncPipe, name: "async" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: CompactPickerComponent, decorators: [{
            type: Component,
            args: [{ selector: `compact-picker`, changeDetection: ChangeDetectionStrategy.OnPush, imports: [
                        SaturationComponent,
                        IndicatorComponent,
                        HueComponent,
                        ColorPresetsComponent,
                        HexComponent,
                        AsyncPipe
                    ], template: "<ng-content select=\"[before]\"></ng-content>\n\n@if (control().presetsVisibilityChanges | async) {\n    <color-presets-component \n        direction=\"down\"\n        [columns]=\"9\" \n        [(color)]=\"control().value\" \n        [colorPresets]=\"control().presets\" />\n}\n\n<div class=\"controls\">\n    <div class=\"controls-row saturation-hue\">\n        <div class=\"column\">\n            <saturation-component [(color)]=\"control().value\" />\n        </div>\n        <div class=\"column hue-column\">\n            <hue-component vertical [(color)]=\"control().value\" />\n        </div>\n    </div>\n    <div class=\"controls-row presentation\">\n        <div class=\"column\">\n            <svg class=\"pencil\" viewBox=\"0 0 1024 1024\">\n                <path d=\"M639.77,121.045l-48.598,84.2l112.215,64.8l48.6-84.205L639.77,121.045z M558.773,261.354\n                    L315.78,682.206l112.215,64.795L670.99,326.15L558.773,261.354z M690.816,75.691l74.922,43.286\n                    c41.682,24.045,55.52,76.564,31.725,117.784l-37.967,65.68l-32.398,56.11L451.706,835.594L282.452,947.303\n                    c-40.961,27.004-70.24,9.027-67.329-38.894l12.149-202.411l275.395-477.041l32.398-56.11l37.883-65.686\n                    C596.824,65.946,649.473,51.857,690.816,75.691z M274.689,883.015l120.908-79.818l-112.218-64.8L274.689,883.015z\"/>\n            </svg>\n            <hex-input-component prefix=\"#\" [(color)]=\"control().value\" />\n        </div>\n        <div class=\"column\">\n            <indicator-component colorType=\"hex\" [color]=\"control().value\" />\n        </div>\n    </div>\n</div>\n\n<ng-content></ng-content>", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", ":host{display:block;--ngx-color-picker-width: 240px;width:var(--ngx-color-picker-width);border-radius:var(--ngx-color-picker-border-radius);background:var(--ngx-color-picker-surface);border:1px solid var(--ngx-color-picker-border);box-shadow:var(--ngx-color-picker-shadow)}:host ::ng-deep .reflection{display:none}:host ::ng-deep color-preset{height:18px;width:18px;border-radius:50%;box-shadow:inset #0009 0 1px 1px}:host ::ng-deep .presets-row>color-preset,:host ::ng-deep .presets-row>color-preset-sublist{margin:0 0 0 6px}:host ::ng-deep .presets-row>color-preset:first-child,:host ::ng-deep .presets-row>color-preset-sublist:first-child{margin:0}:host ::ng-deep color-preset.selected,:host ::ng-deep .sublist color-preset:hover,:host ::ng-deep .presets-row>color-preset:hover{box-shadow:inset #0009 0 1px 6px}:host hue-component{width:100%;height:178px;box-shadow:inset #0009 0 0 2px}:host hue-component[vertical] ::ng-deep .pointer{width:auto;height:9px;left:-3px;right:-3px;margin:-4.5px 0 0;background:transparent;border:3px solid #fff;border-radius:5px;box-shadow:#0009 0 0 2px}:host indicator-component ::ng-deep svg{vertical-align:25%}color-presets-component{border-bottom:1px solid #e4e4e6;padding:9px 12px}color-presets-component ::ng-deep .presets-row{padding:10px 0 0}.controls{padding:10px 12px 12px}.controls-row{display:table;width:100%}.column{display:table-cell;vertical-align:middle}.controls-row.saturation-hue{padding-bottom:9px}.controls-row.saturation-hue .column:first-child{width:178px}saturation-component{height:178px;box-shadow:inset #0009 0 0 2px}saturation-component ::ng-deep .pointer{border-width:2px;box-shadow:#0009 0 0 2px}.hue-column{padding-left:14px}.controls-row.presentation{border:1px solid var(--ngx-color-picker-control-border);border-radius:3px;padding:6px 6px 6px 26px;position:relative}indicator-component{height:18px;width:18px;box-shadow:inset #0009 0 0 2px;border-radius:50%}hex-input-component ::ng-deep input{border:0;color:var(--ngx-color-picker-input-secondary-color);margin:0;text-align:left;height:18px}.pencil{position:absolute;height:14px;width:14px;left:6px;top:50%;margin:-7px 0 0}svg.pencil,.pencil svg{fill:var(--ngx-color-picker-pencil-color)}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }], propDecorators: { color: [{ type: i0.Input, args: [{ isSignal: true, alias: "color", required: false }] }, { type: i0.Output, args: ["colorChange"] }], control: [{ type: i0.Input, args: [{ isSignal: true, alias: "control", required: false }] }] } });

function columnAttribute(value) {
    return !isNaN(parseFloat(value)) && !isNaN(Number(value))
        ? Number(value)
        : 'auto';
}
class GithubPickerComponent {
    get width() {
        return this.columns() === 'auto' ? `auto` : `${25 * this.columns() + 12}px`;
    }
    get columnsCount() {
        return this.columns() === 'auto' ? this.control().presets.length : this.columns();
    }
    constructor(cdr) {
        this.cdr = cdr;
        this.color = model(/* @ts-ignore */
        ...(ngDevMode ? [undefined, { debugName: "color" }] : /* istanbul ignore next */ []));
        this.control = input(new ColorPickerControl(), /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "control" }] : /* istanbul ignore next */ []));
        this.columns = input(8, { ...(ngDevMode ? { debugName: "columns" } : /* istanbul ignore next */ {}), transform: columnAttribute });
        this.subscriptions = [];
    }
    ngOnInit() {
        if (this.color()) {
            this.control().setValueFrom(this.color());
        }
        if (!this.control().hasPresets()) {
            /**
             * set color presets
             * defined by github color picker component
             */
            this.control()
                .setColorPresets([
                '#b80000', '#db3e00', '#fccb00', '#008b02', '#006b76', '#1273de', '#004dcf', '#5300eb',
                '#eb9694', '#fad0c3', '#fef3bd', '#c1e1c5', '#bedadc', '#c4def6', '#bed3f3', '#d4c4fb'
            ]);
        }
        this.subscriptions.push(this.control().valueChanges.subscribe((value) => {
            this.color.set(getValueByType(value, this.control().initType));
            this.cdr.detectChanges();
        }));
    }
    ngOnChanges(changes) {
        /**
         * trigger only if color binding is changed
         */
        const color = this.color();
        const control = this.control();
        if (color && control && !isColorEqual(getValueByType(control.value, control.initType), color)) {
            control.setValueFrom(color);
        }
    }
    ngOnDestroy() {
        this.cdr.detach();
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: GithubPickerComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.0", type: GithubPickerComponent, isStandalone: true, selector: "github-picker", inputs: { color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: false, transformFunction: null }, control: { classPropertyName: "control", publicName: "control", isSignal: true, isRequired: false, transformFunction: null }, columns: { classPropertyName: "columns", publicName: "columns", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { color: "colorChange" }, host: { properties: { "style.width": "this.width" } }, usesOnChanges: true, ngImport: i0, template: "<ng-content select=\"[before]\"></ng-content>\n\n<color-presets-component \n    direction=\"down\"\n    [columns]=\"columnsCount\"\n    [(color)]=\"control().value\" \n    [colorPresets]=\"control().presets\" />\n\n<ng-content></ng-content>", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", "@charset \"UTF-8\";:host{display:block;background:var(--ngx-color-picker-surface);border:1px solid var(--ngx-color-picker-border, rgba(0, 0, 0, .2));box-shadow:#00000026 0 3px 12px;border-radius:var(--ngx-color-picker-border-radius);padding:5px}:host ::ng-deep color-preset,:host ::ng-deep color-preset-sublist{width:25px;height:25px}:host ::ng-deep color-preset:hover:after,:host ::ng-deep color-preset.selected:after{display:block;content:\"\\a0\";position:absolute;inset:-1px;z-index:10;border:2px solid #fff;box-shadow:#0003 0 0 5px 2px}\n"], dependencies: [{ kind: "component", type: ColorPresetsComponent, selector: "color-presets-component", inputs: ["columns", "colorPresets", "color", "direction"], outputs: ["colorChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: GithubPickerComponent, decorators: [{
            type: Component,
            args: [{ selector: `github-picker`, changeDetection: ChangeDetectionStrategy.OnPush, imports: [
                        ColorPresetsComponent
                    ], template: "<ng-content select=\"[before]\"></ng-content>\n\n<color-presets-component \n    direction=\"down\"\n    [columns]=\"columnsCount\"\n    [(color)]=\"control().value\" \n    [colorPresets]=\"control().presets\" />\n\n<ng-content></ng-content>", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", "@charset \"UTF-8\";:host{display:block;background:var(--ngx-color-picker-surface);border:1px solid var(--ngx-color-picker-border, rgba(0, 0, 0, .2));box-shadow:#00000026 0 3px 12px;border-radius:var(--ngx-color-picker-border-radius);padding:5px}:host ::ng-deep color-preset,:host ::ng-deep color-preset-sublist{width:25px;height:25px}:host ::ng-deep color-preset:hover:after,:host ::ng-deep color-preset.selected:after{display:block;content:\"\\a0\";position:absolute;inset:-1px;z-index:10;border:2px solid #fff;box-shadow:#0003 0 0 5px 2px}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }], propDecorators: { color: [{ type: i0.Input, args: [{ isSignal: true, alias: "color", required: false }] }, { type: i0.Output, args: ["colorChange"] }], control: [{ type: i0.Input, args: [{ isSignal: true, alias: "control", required: false }] }], columns: [{ type: i0.Input, args: [{ isSignal: true, alias: "columns", required: false }] }], width: [{
                type: HostBinding,
                args: ['style.width']
            }] } });

class SwatchesPickerComponent {
    constructor(cdr) {
        this.cdr = cdr;
        this.defaultColor = '#E6315B';
        this.color = model(this.defaultColor, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "color" }] : /* istanbul ignore next */ []));
        this.control = new ColorPickerControl();
        this.childControl = new ColorPickerControl();
        this.subscriptions = [];
        this.mapColors = {
            '#E6315B': [
                '#fc8da7', '#fa7d9a', '#f56484', '#f04a71', '#e82c58', '#e31746', '#de0235',
                '#d60234', '#d10232', '#c70230', '#b8022c', '#ab0229', '#9c0225', '#8f0122',
                '#8c0122', '#82011f', '#78011b', '#690117', '#5c0012', '#4f0010', '#42000c'
            ],
            '#793183': [
                '#ef8dfc', '#eb7dfa', '#e664f5', '#dc4af0', '#d22ce8', '#cb17e3', '#c402de',
                '#c002d9', '#bb02d4', '#b002c7', '#a202b8', '#9702ab', '#8a029c', '#7e018f',
                '#7a018a', '#730182', '#6c0178', '#5e0169', '#54015c', '#49014f', '#3d0142'
            ],
            '#009DE7': [
                '#8dd9fc', '#7dd2fa', '#64c7f5', '#4abbf0', '#2cade8', '#17a2e3', '#0298de',
                '#0295d9', '#0291d4', '#0289c7', '#027eb8', '#0275ab', '#026b9c', '#01628f',
                '#015f8a', '#015982', '#015278', '#014869', '#013f5c', '#01364f', '#012e42'
            ],
            '#00B59C': [
                '#8dfeea', '#7dfbe4', '#63f4db', '#4befd2', '#2de7c6', '#16e2be', '#03deb7',
                '#01ddb6', '#01d4ae', '#01c7a4', '#01b897', '#01aa8b', '#019b80', '#019076',
                '#018c73', '#01836c', '#017763', '#016857', '#005c4e', '#005044', '#004239'
            ],
            '#FFCE00': [
                '#fce68d', '#fae17d', '#f5da64', '#f0cf4a', '#e8c22c', '#e5bc17', '#deb202',
                '#deb100', '#d4aa02', '#c7a002', '#b89302', '#ab8902', '#9c7d02', '#8f7301',
                '#8c7001', '#826801', '#786201', '#695601', '#5c4b00', '#4f4100', '#423700'
            ],
            '#FF4A21': [
                '#fca28d', '#fa947d', '#f57f64', '#f0694a', '#e84f2c', '#e33c17', '#de2a02',
                '#d92a02', '#d42902', '#c72602', '#b82302', '#ab2102', '#9c1e02', '#8f1b01',
                '#8a1a01', '#821901', '#781701', '#691300', '#5c1100', '#4f0e00', '#420c00'
            ],
            '#D6D5D6': [
                '#fff', '#f2f2f2', '#e5e5e5', '#d9d9d9', '#cccccc', '#bfbfbf', '#b3b3b3',
                '#a6a6a6', '#999999', '#8c8c8c', '#808080', '#737373', '#666666', '#595959',
                '#4d4d4d', '#424242', '#363636', '#262626', '#1a1a1a', '#0f0f0f', '#000'
            ]
        };
    }
    ngOnInit() {
        if (this.color()) {
            this.childControl.setValueFrom(this.color());
        }
        else {
            this.control.setValueFrom(this.defaultColor);
        }
        /**
         * set color presets
         * defined by swatches color picker component
         */
        this.control.setColorPresets([
            '#e6315b', '#793183', '#009de7', '#00b59c', '#ffce00', '#ff4a21', '#d6d5d6'
        ]);
        /**
         * initially open first group
         */
        this.childControl.setColorPresets(this.mapColors[this.defaultColor]);
        this.subscriptions.push(this.childControl.valueChanges.subscribe((value) => {
            this.color.set(getValueByType(value, this.childControl.initType));
        }));
        this.subscriptions.push(this.control.valueChanges.subscribe((value) => {
            const presets = this.mapColors[value.toHexString()];
            if (presets) {
                this.childControl.setColorPresets(presets);
            }
            this.color.set(getValueByType(this.childControl.value, this.childControl.initType));
            this.cdr.detectChanges();
        }));
    }
    ngOnChanges(changes) {
        /**
         * trigger only if color binding is changed
         */
        const color = this.color();
        const control = this.control;
        if (color && control && control.initType && !isColorEqual(getValueByType(control.value, control.initType), color)) {
            this.childControl.setValueFrom(color);
        }
    }
    ngOnDestroy() {
        this.cdr.detach();
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: SwatchesPickerComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.0", type: SwatchesPickerComponent, isStandalone: true, selector: "swatches-picker", inputs: { color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { color: "colorChange" }, usesOnChanges: true, ngImport: i0, template: "<ng-content select=\"[before]\"></ng-content>\n\n<color-presets-component \n    [columns]=\"7\"\n    direction=\"down\"\n    [(color)]=\"control.value\" \n    [colorPresets]=\"control.presets\" />\n\n@if(childControl.presets.length) {\n    <color-presets-component\n        class=\"child-list\"\n        [columns]=\"7\"\n        direction=\"down\"\n        [(color)]=\"childControl.value\" \n        [colorPresets]=\"childControl.presets\" />\n}\n\n<ng-content></ng-content>", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", "@charset \"UTF-8\";:host{display:block;background:var(--ngx-color-picker-surface);--ngx-color-picker-width: 224px;width:var(--ngx-color-picker-width);border:1px solid var(--ngx-color-picker-border, rgba(0, 0, 0, .2));box-shadow:#0000004d 0 0 2px;border-radius:var(--ngx-color-picker-border-radius);padding:6px}:host ::ng-deep color-preset,:host ::ng-deep color-preset-sublist{width:30px;height:30px}:host ::ng-deep color-preset:hover:after,:host ::ng-deep color-preset.selected:after{display:block;content:\"\\a0\";position:absolute;inset:3px;z-index:10;border:3px solid #fff;box-shadow:#0003 0 0 5px 2px}:host ::ng-deep .presets-row:first-child color-preset:first-child,:host ::ng-deep .presets-row:first-child color-preset-sublist:first-child{border-radius:4px 0 0 4px}:host ::ng-deep .presets-row.last color-preset.last,:host ::ng-deep .presets-row.last color-preset-sublist.last{border-radius:0 4px 4px 0}:host ::ng-deep .child-list{margin-top:6px;border-top:1px solid #e5e5e5;padding:6px 0 0}:host ::ng-deep .child-list .presets-row.first color-preset.first,:host ::ng-deep .child-list .presets-row.first color-preset-sublist.first{border-radius:4px 0 0}:host ::ng-deep .child-list .presets-row.first color-preset.last,:host ::ng-deep .child-list .presets-row.first color-preset-sublist.last{border-radius:0 4px 0 0}:host ::ng-deep .child-list .presets-row.last color-preset.first,:host ::ng-deep .child-list .presets-row.last color-preset-sublist.first{border-radius:0 0 0 4px}:host ::ng-deep .child-list .presets-row.last color-preset.last,:host ::ng-deep .child-list .presets-row.last color-preset-sublist.last{border-radius:0 0 4px}:host ::ng-deep .child-list color-preset:hover:after,:host ::ng-deep .child-list color-preset.selected:after{content:\"\\2714\";font-size:18px;color:#fff;border:0;inset:0;line-height:30px;box-shadow:none;text-align:center}\n"], dependencies: [{ kind: "component", type: ColorPresetsComponent, selector: "color-presets-component", inputs: ["columns", "colorPresets", "color", "direction"], outputs: ["colorChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: SwatchesPickerComponent, decorators: [{
            type: Component,
            args: [{ selector: `swatches-picker`, changeDetection: ChangeDetectionStrategy.OnPush, imports: [
                        ColorPresetsComponent
                    ], template: "<ng-content select=\"[before]\"></ng-content>\n\n<color-presets-component \n    [columns]=\"7\"\n    direction=\"down\"\n    [(color)]=\"control.value\" \n    [colorPresets]=\"control.presets\" />\n\n@if(childControl.presets.length) {\n    <color-presets-component\n        class=\"child-list\"\n        [columns]=\"7\"\n        direction=\"down\"\n        [(color)]=\"childControl.value\" \n        [colorPresets]=\"childControl.presets\" />\n}\n\n<ng-content></ng-content>", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", "@charset \"UTF-8\";:host{display:block;background:var(--ngx-color-picker-surface);--ngx-color-picker-width: 224px;width:var(--ngx-color-picker-width);border:1px solid var(--ngx-color-picker-border, rgba(0, 0, 0, .2));box-shadow:#0000004d 0 0 2px;border-radius:var(--ngx-color-picker-border-radius);padding:6px}:host ::ng-deep color-preset,:host ::ng-deep color-preset-sublist{width:30px;height:30px}:host ::ng-deep color-preset:hover:after,:host ::ng-deep color-preset.selected:after{display:block;content:\"\\a0\";position:absolute;inset:3px;z-index:10;border:3px solid #fff;box-shadow:#0003 0 0 5px 2px}:host ::ng-deep .presets-row:first-child color-preset:first-child,:host ::ng-deep .presets-row:first-child color-preset-sublist:first-child{border-radius:4px 0 0 4px}:host ::ng-deep .presets-row.last color-preset.last,:host ::ng-deep .presets-row.last color-preset-sublist.last{border-radius:0 4px 4px 0}:host ::ng-deep .child-list{margin-top:6px;border-top:1px solid #e5e5e5;padding:6px 0 0}:host ::ng-deep .child-list .presets-row.first color-preset.first,:host ::ng-deep .child-list .presets-row.first color-preset-sublist.first{border-radius:4px 0 0}:host ::ng-deep .child-list .presets-row.first color-preset.last,:host ::ng-deep .child-list .presets-row.first color-preset-sublist.last{border-radius:0 4px 0 0}:host ::ng-deep .child-list .presets-row.last color-preset.first,:host ::ng-deep .child-list .presets-row.last color-preset-sublist.first{border-radius:0 0 0 4px}:host ::ng-deep .child-list .presets-row.last color-preset.last,:host ::ng-deep .child-list .presets-row.last color-preset-sublist.last{border-radius:0 0 4px}:host ::ng-deep .child-list color-preset:hover:after,:host ::ng-deep .child-list color-preset.selected:after{content:\"\\2714\";font-size:18px;color:#fff;border:0;inset:0;line-height:30px;box-shadow:none;text-align:center}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }], propDecorators: { color: [{ type: i0.Input, args: [{ isSignal: true, alias: "color", required: false }] }, { type: i0.Output, args: ["colorChange"] }] } });

class IpPickerComponent {
    constructor(cdr) {
        this.cdr = cdr;
        this.color = model(/* @ts-ignore */
        ...(ngDevMode ? [undefined, { debugName: "color" }] : /* istanbul ignore next */ []));
        this.control = input(new ColorPickerControl(), /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "control" }] : /* istanbul ignore next */ []));
        this.subscriptions = [];
    }
    ngOnInit() {
        /**
         * set color presets
         * defined by this chrome color picker component
         */
        if (!this.control().hasPresets()) {
            this.control()
                .setColorPresets([
                ['#f44336', '#ffebee', '#ffcdd2', '#EF9A9A', '#E57373', '#EF5350', '#F44336', '#E53935', '#D32F2F', '#C62828', '#B71C1C'],
                ['#E91E63', '#fce4ec', '#f8bbd0', '#f48fb1', '#f06292', '#ec407a', '#e91e63', '#d81b60', '#c2185b', '#ad1457', '#880e4f'],
                ['#9C27B0', '#F3e5f5', '#e1bee7', '#ce93d8', '#ba68c8', '#ab47bc', '#9c27b0', '#8e24aa', '#7b1fa2', '#6a1b9a', '#4a148c'],
                ['#673AB7', '#ede7f6', '#d1c4e9', '#b39ddb', '#9575cd', '#7e57c2', '#673ab7', '#5e35b1', '#512da8', '#4527a0', '#311b92'],
                ['#3F51B5', '#e8eaf6', '#c5cae9', '#9fa8da', '#7986cb', '#5c6bc0', '#3f51b5', '#3949ab', '#303f9f', '#283593', '#1a237e'],
                ['#2196F3', '#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0D47a1'],
                ['#03A9F4', '#e1f5fe', '#b3e5fc', '#81d4fa', '#4fc3f7', '#29b6f6', '#03a9f4', '#039be5', '#0288d1', '#0277bd', '#01579b'],
                ['#00BCD4', '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064'],
                ['#009688', '#E0F2f1', '#b2dfdb', '#80cbc4', '#4db6ac', '#26a69a', '#009688', '#00897b', '#00796b', '#00695c', '#004d40'],
                ['#4CAF50', '#e8f5e9', '#c8e6c9', '#a5d6a7', '#81c784', '#66bb6a', '#4caf50', '#43a047', '#388e3c', '#2e7d32', '#1b5e20'],
                ['#8BC34A', '#f1f8e9', '#dcedc8', '#c5e1a5', '#aed581', '#9ccc65', '#8bc34a', '#7cb342', '#689f38', '#558b2f', '#33691e'],
                ['#cddc39', '#f9fbe7', '#f0f4c3', '#e6ee9c', '#dce775', '#d4e157', '#c0dc39', '#c0ca33', '#afb42b', '#9e9d24', '#827717'],
                ['#ffeb3b', '#fffde7', '#fff9c4', '#fff59d', '#fff176', '#ffee58', '#ffeb3b', '#fdd835', '#fbc02d', '#f9a825', '#f57f17'],
                ['#ffc107', '#fff8e1', '#ffecb3', '#ffe082', '#ffd54f', '#ffca28', '#ffc107', '#ffb300', '#ffa000', '#ff8f00', '#ff6f00'],
                ['#ff9800', '#fff3e0', '#ffe0b2', '#ffcc80', '#ffb74d', '#ffa726', '#ff9800', '#fb8c00', '#f57c00', '#ef6c00', '#e65100'],
                ['#ff5722', '#fbe9e7', '#ffccbc', '#ffab91', '#ff8a65', '#ff7043', '#ff5722', '#f4511e', '#e64a19', '#d84315', '#bf360c'],
                ['#795548', '#efebe9', '#d7ccc8', '#bcaaa4', '#a1887f', '#8d6e63', '#795548', '#6d4c41', '#5d4037', '#4e342e', '#3e2723'],
                ['#9e9e9e', '#fafafa', '#f5f5f5', '#eee', '#e0e0e0', '#bdbdbd', '#9e9e9e', '#757575', '#616161', '#424242', '#212121'],
                ['#607d8b', '#eceff1', '#cfd8dc', '#b0bec5', '#90a4ae', '#78909c', '#60708b', '#546e7a', '#455a64', '#37474f', '#263238']
            ]);
        }
        this.subscriptions.push(this.control().valueChanges.subscribe((value) => {
            this.color.set(getValueByType(value, this.control().initType));
            this.cdr.detectChanges();
        }));
    }
    ngOnChanges(changes) {
        /**
         * trigger only if color binding is changed
         */
        const color = this.color();
        const control = this.control();
        if (color && control && !isColorEqual(getValueByType(control.value, control.initType), color)) {
            control.setValueFrom(color);
        }
    }
    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: IpPickerComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.0", type: IpPickerComponent, isStandalone: true, selector: "ip-picker", inputs: { color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: false, transformFunction: null }, control: { classPropertyName: "control", publicName: "control", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { color: "colorChange" }, usesOnChanges: true, ngImport: i0, template: "<div class=\"controls\">\n    <div class=\"controls-row presentation\">\n        <indicator-component colorType=\"hex\" [color]=\"control().value\" />\n        <hex-input-component [(color)]=\"control().value\" />\n    </div>\n\n    <div class=\"controls-row saturation-hue-alpha\">\n        <div class=\"column\">\n            <saturation-component [(color)]=\"control().value\" />\n            <alpha-component [(color)]=\"control().value\" />\n        </div>\n        <div class=\"column hue-column\">\n            <hue-component vertical [(color)]=\"control().value\" />\n        </div>\n    </div>\n</div>\n\n@if (control().presetsVisibilityChanges | async) {\n    <color-presets-component \n        [columns]=\"8\" \n        [(color)]=\"control().value\" \n        [colorPresets]=\"control().presets\" />\n}\n", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", "@charset \"UTF-8\";:host{display:block;--ngx-color-picker-width: 240px;width:var(--ngx-color-picker-width);border-radius:var(--ngx-color-picker-border-radius);background:var(--ngx-color-picker-surface);border:1px solid var(--ngx-color-picker-border);box-shadow:var(--ngx-color-picker-shadow)}.controls{padding:6px}.controls-row{display:table;width:100%}.column{display:table-cell;vertical-align:middle}.controls-row.saturation-hue-alpha .column:first-child{width:178px}saturation-component{height:178px;box-shadow:inset #0009 0 0 2px;margin-bottom:16px}.controls-row.presentation{border:1px solid var(--ngx-color-picker-control-border);border-radius:3px;padding:6px 6px 6px 36px;position:relative;margin:0 0 6px}.controls-row.saturation-hue-alpha{padding:0 0 6px}indicator-component{height:22px;width:22px;box-shadow:inset #0009 0 0 2px;position:absolute;left:4px;top:50%;border-radius:50%;margin-top:-11px}:host indicator-component ::ng-deep svg{vertical-align:15%}hex-input-component ::ng-deep input{border:0;color:var(--ngx-color-picker-input-secondary-color);margin:0;text-align:left;height:18px}.hue-column{vertical-align:top;padding:0 10px 0 16px}:host hue-component{width:100%;height:178px;box-shadow:inset #0009 0 0 2px}:host hue-component[vertical] ::ng-deep .pointer{width:auto;height:0;left:0;right:0;margin:0;background:transparent}:host alpha-component ::ng-deep .pointer{width:0;height:auto;top:0;bottom:0;margin:0;background:transparent}:host hue-component[vertical] ::ng-deep .pointer:after,:host hue-component[vertical] ::ng-deep .pointer:before{top:-5.5px;display:block;content:\"\\a0\";position:absolute;height:0;width:0;border-top:5px solid transparent;border-bottom:5px solid transparent}:host hue-component[vertical] ::ng-deep .pointer:after{border-left:8px solid #666;left:-8px}:host hue-component[vertical] ::ng-deep .pointer:before{border-right:8px solid #666;right:-8px}:host alpha-component{height:24px}:host alpha-component ::ng-deep .pointer:after,:host alpha-component ::ng-deep .pointer:before{left:-5.5px;display:block;content:\"\\a0\";position:absolute;height:0;width:0;border-left:5px solid transparent;border-right:5px solid transparent}:host alpha-component ::ng-deep .pointer:after{border-top:8px solid #666;top:-8px}:host alpha-component ::ng-deep .pointer:before{border-bottom:8px solid #666;bottom:-8px}\n"], dependencies: [{ kind: "component", type: SaturationComponent, selector: "saturation-component", inputs: ["color"], outputs: ["colorChange"] }, { kind: "component", type: IndicatorComponent, selector: "indicator-component", inputs: ["color", "colorType"] }, { kind: "component", type: HueComponent, selector: "hue-component", inputs: ["color", "vertical"], outputs: ["colorChange"] }, { kind: "component", type: AlphaComponent, selector: "alpha-component", inputs: ["color", "vertical"], outputs: ["colorChange"] }, { kind: "component", type: ColorPresetsComponent, selector: "color-presets-component", inputs: ["columns", "colorPresets", "color", "direction"], outputs: ["colorChange"] }, { kind: "component", type: HexComponent, selector: "hex-input-component", inputs: ["color", "label", "prefix"], outputs: ["colorChange"] }, { kind: "pipe", type: AsyncPipe, name: "async" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: IpPickerComponent, decorators: [{
            type: Component,
            args: [{ selector: `ip-picker`, changeDetection: ChangeDetectionStrategy.OnPush, imports: [
                        SaturationComponent,
                        IndicatorComponent,
                        HueComponent,
                        AlphaComponent,
                        ColorPresetsComponent,
                        HexComponent,
                        AsyncPipe
                    ], template: "<div class=\"controls\">\n    <div class=\"controls-row presentation\">\n        <indicator-component colorType=\"hex\" [color]=\"control().value\" />\n        <hex-input-component [(color)]=\"control().value\" />\n    </div>\n\n    <div class=\"controls-row saturation-hue-alpha\">\n        <div class=\"column\">\n            <saturation-component [(color)]=\"control().value\" />\n            <alpha-component [(color)]=\"control().value\" />\n        </div>\n        <div class=\"column hue-column\">\n            <hue-component vertical [(color)]=\"control().value\" />\n        </div>\n    </div>\n</div>\n\n@if (control().presetsVisibilityChanges | async) {\n    <color-presets-component \n        [columns]=\"8\" \n        [(color)]=\"control().value\" \n        [colorPresets]=\"control().presets\" />\n}\n", styles: [":host{--ngx-color-picker-width: 230px;--ngx-color-picker-surface: #fff;--ngx-color-picker-border: transparent;--ngx-color-picker-border-radius: 2px;--ngx-color-picker-shadow: rgba(0, 0, 0, .3) 0 1px 4px;--ngx-color-picker-divider: #d0d0d0;--ngx-color-picker-control-border: #e4e4e6;--ngx-color-picker-input-label-color: #b4b4b4;--ngx-color-picker-input-color: #272727;--ngx-color-picker-input-secondary-color: #817e81;--ngx-color-picker-input-border-color: rgb(218, 218, 218);--ngx-color-picker-pencil-color: #000;--ngx-color-picker-pointer-shadow: rgba(0, 0, 0, .3) 0 1px 4px}:host,:host ::ng-deep *{padding:0;margin:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}\n", "@charset \"UTF-8\";:host{display:block;--ngx-color-picker-width: 240px;width:var(--ngx-color-picker-width);border-radius:var(--ngx-color-picker-border-radius);background:var(--ngx-color-picker-surface);border:1px solid var(--ngx-color-picker-border);box-shadow:var(--ngx-color-picker-shadow)}.controls{padding:6px}.controls-row{display:table;width:100%}.column{display:table-cell;vertical-align:middle}.controls-row.saturation-hue-alpha .column:first-child{width:178px}saturation-component{height:178px;box-shadow:inset #0009 0 0 2px;margin-bottom:16px}.controls-row.presentation{border:1px solid var(--ngx-color-picker-control-border);border-radius:3px;padding:6px 6px 6px 36px;position:relative;margin:0 0 6px}.controls-row.saturation-hue-alpha{padding:0 0 6px}indicator-component{height:22px;width:22px;box-shadow:inset #0009 0 0 2px;position:absolute;left:4px;top:50%;border-radius:50%;margin-top:-11px}:host indicator-component ::ng-deep svg{vertical-align:15%}hex-input-component ::ng-deep input{border:0;color:var(--ngx-color-picker-input-secondary-color);margin:0;text-align:left;height:18px}.hue-column{vertical-align:top;padding:0 10px 0 16px}:host hue-component{width:100%;height:178px;box-shadow:inset #0009 0 0 2px}:host hue-component[vertical] ::ng-deep .pointer{width:auto;height:0;left:0;right:0;margin:0;background:transparent}:host alpha-component ::ng-deep .pointer{width:0;height:auto;top:0;bottom:0;margin:0;background:transparent}:host hue-component[vertical] ::ng-deep .pointer:after,:host hue-component[vertical] ::ng-deep .pointer:before{top:-5.5px;display:block;content:\"\\a0\";position:absolute;height:0;width:0;border-top:5px solid transparent;border-bottom:5px solid transparent}:host hue-component[vertical] ::ng-deep .pointer:after{border-left:8px solid #666;left:-8px}:host hue-component[vertical] ::ng-deep .pointer:before{border-right:8px solid #666;right:-8px}:host alpha-component{height:24px}:host alpha-component ::ng-deep .pointer:after,:host alpha-component ::ng-deep .pointer:before{left:-5.5px;display:block;content:\"\\a0\";position:absolute;height:0;width:0;border-left:5px solid transparent;border-right:5px solid transparent}:host alpha-component ::ng-deep .pointer:after{border-top:8px solid #666;top:-8px}:host alpha-component ::ng-deep .pointer:before{border-bottom:8px solid #666;bottom:-8px}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }], propDecorators: { color: [{ type: i0.Input, args: [{ isSignal: true, alias: "color", required: false }] }, { type: i0.Output, args: ["colorChange"] }], control: [{ type: i0.Input, args: [{ isSignal: true, alias: "control", required: false }] }] } });

/*
 * ngx-color-picker
 *
 * By Ivan Pintar, http://www.pintar-ivan.com
 * Licensed under the MIT License
 * See https://github.com/pIvan/ngx-color-picker/blob/master/README.md
 */
class ColorPickerModule {
    static forRoot(configuration) {
        return {
            ngModule: ColorPickerModule,
            providers: [
                { provide: COLOR_PICKER_CONFIG, useValue: configuration || new ColorPickerConfig() }
            ]
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: ColorPickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "22.0.0", ngImport: i0, type: ColorPickerModule, imports: [CommonModule,
            SaturationComponent,
            IndicatorComponent,
            HueComponent,
            AlphaComponent,
            RgbaComponent,
            HslaComponent,
            HexComponent,
            ColorPresetsComponent,
            ColorPresetComponent,
            ColorPresetSublist,
            ColorPickerInputDirective,
            ChunksPipe,
            ReversePipe,
            /**
             * prepared components
             */
            ChromePickerComponent,
            SketchPickerComponent,
            SwatchesPickerComponent,
            GithubPickerComponent,
            CompactPickerComponent,
            IpPickerComponent], exports: [SaturationComponent,
            IndicatorComponent,
            HueComponent,
            AlphaComponent,
            RgbaComponent,
            HslaComponent,
            HexComponent,
            ColorPresetsComponent,
            ChromePickerComponent,
            SketchPickerComponent,
            SwatchesPickerComponent,
            GithubPickerComponent,
            CompactPickerComponent,
            IpPickerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: ColorPickerModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.0", ngImport: i0, type: ColorPickerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        SaturationComponent,
                        IndicatorComponent,
                        HueComponent,
                        AlphaComponent,
                        RgbaComponent,
                        HslaComponent,
                        HexComponent,
                        ColorPresetsComponent,
                        ColorPresetComponent,
                        ColorPresetSublist,
                        ColorPickerInputDirective,
                        ChunksPipe,
                        ReversePipe,
                        /**
                         * prepared components
                         */
                        ChromePickerComponent,
                        SketchPickerComponent,
                        SwatchesPickerComponent,
                        GithubPickerComponent,
                        CompactPickerComponent,
                        IpPickerComponent
                    ],
                    exports: [
                        SaturationComponent,
                        IndicatorComponent,
                        HueComponent,
                        AlphaComponent,
                        RgbaComponent,
                        HslaComponent,
                        HexComponent,
                        ColorPresetsComponent,
                        ChromePickerComponent,
                        SketchPickerComponent,
                        SwatchesPickerComponent,
                        GithubPickerComponent,
                        CompactPickerComponent,
                        IpPickerComponent
                    ]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { AlphaComponent, COLOR_PICKER_CONFIG, ChromePickerComponent, Color, ColorPickerConfig, ColorPickerControl, ColorPickerModule, ColorPresetComponent, ColorPresetSublist, ColorPresetsComponent, ColorType, ColorsTable, CompactPickerComponent, GithubPickerComponent, HexComponent, HslaComponent, HueComponent, IndicatorComponent, IpPickerComponent, RgbaComponent, SaturationComponent, SketchPickerComponent, SwatchesPickerComponent, getValueByType };
//# sourceMappingURL=iplab-ngx-color-picker.mjs.map
