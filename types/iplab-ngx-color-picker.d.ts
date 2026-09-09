import * as i0 from '@angular/core';
import { InjectionToken, OnDestroy, ElementRef, ModelSignal, Signal, Renderer2, OnInit, InputSignal, InputSignalWithTransform, OutputEmitterRef, WritableSignal, PipeTransform, OnChanges, ChangeDetectorRef, SimpleChanges, ModuleWithProviders } from '@angular/core';
import * as i1 from '@angular/common';
import * as rxjs from 'rxjs';
import { BehaviorSubject } from 'rxjs';

interface IColorPickerConfig {
    indicatorTitle: string;
    presetsTitle: string;
}
declare const COLOR_PICKER_CONFIG: InjectionToken<IColorPickerConfig>;
declare class ColorPickerConfig implements IColorPickerConfig {
    indicatorTitle: string;
    presetsTitle: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ColorPickerConfig, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ColorPickerConfig>;
}

declare abstract class BaseColor {
    abstract toString(showAlpha?: boolean): string;
    abstract equal(color: BaseColor): boolean;
    protected round(value: number, decimals?: number): number;
}

/**
 * CMYK color space
 *
 * Cyan = ranges from 0 to 100%
 * Magenta = ranges from 0 to 100%
 * Yellow = ranges from 0 to 100%
 * blacK = ranges from 0 to 100%
 */
declare class Cmyk extends BaseColor {
    cyan: number;
    magenta: number;
    yellow: number;
    black: number;
    constructor(cyan: number, magenta: number, yellow: number, black: number);
    toString(): string;
    getCyan(): number;
    getMagenta(): number;
    getYellow(): number;
    getBlack(): number;
    equal(color: Cmyk): boolean;
}

/**
 * HSL and HSI are the same
 *
 * Hue = ranges from 0 to 360°
 * Saturation = ranges from 0 to 100%
 * Lightness or Intensity = ranges from 0 to 100%
 * Alpha = range from 0-1
 */
declare class Hsla extends BaseColor {
    hue: number;
    saturation: number;
    lightness: number;
    alpha: number;
    constructor(hue: number, saturation: number, lightness: number, alpha: number);
    toString(showAlphaChannel?: boolean): string;
    getHue(): number;
    getSaturation(): number;
    getLightness(): number;
    getAlpha(round?: boolean): number;
    equal(color: Hsla): boolean;
}

/**
 * HSB and HSV are the same
 *
 * Hue = ranges from 0 to 360°
 * Saturation = ranges from 0 to 100%
 * Brightness or Value = ranges from 0 to 100%
 * Alpha = range from 0-1
 */
declare class Hsva extends BaseColor {
    hue: number;
    saturation: number;
    value: number;
    alpha: number;
    constructor(hue: number, saturation: number, value: number, alpha: number);
    toString(showAlphaChannel?: boolean): string;
    getHue(): number;
    getSaturation(): number;
    getValue(): number;
    getAlpha(round?: boolean): number;
    equal(color: Hsva): boolean;
}

/**
 * RGB (Red Green Blue)
 *
 * Red = ranges from 0-255
 * Green = ranges from 0-255
 * Blue = ranges from 0-255
 * Alpha = range from 0-1
 */
declare class Rgba extends BaseColor {
    red: number;
    green: number;
    blue: number;
    alpha: number;
    constructor(red: number, green: number, blue: number, alpha: number);
    toString(showAlphaChannel?: boolean): string;
    getRed(): number;
    getGreen(): number;
    getBlue(): number;
    getAlpha(round?: boolean): number;
    equal(color: Rgba): boolean;
}

type ColorString = string;
declare class Color {
    /**
     * base color used to calculate other
     * default color
     * rgb(255, 0, 0)
     * hsl(0, 100%, 50%)
     * #ff0000
     */
    private hsva;
    constructor(colorString?: ColorString);
    static from(color: ColorString | Color | Hsva | Rgba | Hsla): Color;
    /**
     * make from existing color new color object
     */
    clone(): Color;
    /**
     * define Color from hex, rgb, rgba, hsl, hsla or cmyk string
     */
    setFromString(color: ColorString): this;
    /**
     * define Color from HSV values
     */
    setHsva(hue: number, saturation?: number, brightness?: number, alpha?: number): this;
    /**
     * define Color from RGBa
     */
    setRgba(red: number, green: number, blue: number, alpha?: number): this;
    /**
     * define Color from HSLa
     */
    setHsla(hue: number, saturation: number, lightness: number, alpha?: number): this;
    /**
     * return hexadecimal value formatted as '#341d2a' or '#341d2aFF' if alhpa channel is enabled
     */
    toHexString(alpha?: boolean): ColorString;
    /**
     * return rgba string formatted as rgba(52, 29, 42, 1)
     */
    toRgbaString(): ColorString;
    /**
     * return rgb string formatted as rgb(52, 29, 42)
     */
    toRgbString(): ColorString;
    /**
     * return hsla string formatted as hsla(327, 29%, 16%, 1)
     */
    toHslaString(): ColorString;
    /**
     * return hsl string formatted as hsl(327, 29%, 16%)
     */
    toHslString(): ColorString;
    /**
     * return hsva string formatted as hsva(327, 29%, 16%, 100%)
     */
    toHsvaString(): ColorString;
    /**
     * return hsv string formatted as hsv(327, 29%, 16%)
     */
    toHsvString(): ColorString;
    /**
     * return Cmyk string formatted as cmyk(100%, 100%, 100%, 100%)
     */
    toCmykString(): ColorString;
    getHsva(): Hsva;
    getRgba(): Rgba;
    getHsla(): Hsla;
    getCmyk(): Cmyk;
    equal(color: Color): boolean;
    private hsvaToHsla;
    private hslaToHsva;
    private rgbaToHsva;
    private hsvaToRgba;
    private rgbaToHsla;
    /**
     * convert rgb color from HSLa
     *
     * hue = 0 => 360
     * saturation = 0 => 1
     * lightness = 0 => 1
     */
    private hslaToRgba;
    private hueToRgb;
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
    private cmykToRgba;
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
    private rgbaToCmyk;
    private roundNumber;
    private stringToColor;
}

declare abstract class BaseComponent implements OnDestroy {
    private readonly subscriptions;
    private window;
    private readonly requestAnimationFrame;
    private mouseup;
    private readonly document;
    protected readonly elementRef: ElementRef;
    constructor();
    protected abstract movePointer(coordinates: {
        x: number;
        y: number;
        height: number;
        width: number;
    }): void;
    private addEventListeners;
    private onEventChange;
    private calculateCoordinates;
    private calculate;
    private getRequestAnimationFrame;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseComponent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BaseComponent, never, never, {}, {}, never, never, true, never>;
}

declare class SaturationComponent extends BaseComponent {
    private readonly renderer;
    color: ModelSignal<Color>;
    readonly pointer: Signal<ElementRef>;
    constructor(renderer: Renderer2);
    protected movePointer({ x, y, height, width }: {
        x: number;
        y: number;
        height: number;
        width: number;
    }): void;
    private updateBackgroundColor;
    private changePointerPosition;
    static ɵfac: i0.ɵɵFactoryDeclaration<SaturationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SaturationComponent, "saturation-component", never, { "color": { "alias": "color"; "required": true; "isSignal": true; }; }, { "color": "colorChange"; }, never, never, true, never>;
}

declare class IndicatorComponent implements OnInit {
    private readonly pickerConfig;
    private readonly renderer;
    private readonly elementRef;
    private readonly document;
    color: InputSignal<Color>;
    colorType: InputSignal<'rgba' | 'hex' | 'hsla'>;
    readonly backgroundColorEl: Signal<ElementRef<HTMLDivElement>>;
    private subscriptions;
    constructor(pickerConfig: ColorPickerConfig, renderer: Renderer2, elementRef: ElementRef, document: HTMLDocument);
    ngOnInit(): void;
    private renderTitle;
    private renderBackgroundColor;
    private onClick;
    static ɵfac: i0.ɵɵFactoryDeclaration<IndicatorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IndicatorComponent, "indicator-component", never, { "color": { "alias": "color"; "required": true; "isSignal": true; }; "colorType": { "alias": "colorType"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

declare class HueComponent extends BaseComponent {
    private readonly renderer;
    color: ModelSignal<Color>;
    isVertical: InputSignalWithTransform<boolean, string | boolean>;
    readonly pointer: Signal<ElementRef>;
    constructor(renderer: Renderer2);
    protected movePointer({ x, y, height, width }: {
        x: number;
        y: number;
        height: number;
        width: number;
    }): void;
    /**
     * hue value is in range from 0 to 360°
     */
    private changePointerPosition;
    static ɵfac: i0.ɵɵFactoryDeclaration<HueComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<HueComponent, "hue-component", never, { "color": { "alias": "color"; "required": true; "isSignal": true; }; "isVertical": { "alias": "vertical"; "required": false; "isSignal": true; }; }, { "color": "colorChange"; }, never, never, true, never>;
}

declare class AlphaComponent extends BaseComponent {
    private readonly renderer;
    color: InputSignal<Color>;
    colorChange: OutputEmitterRef<Color>;
    isVertical: InputSignalWithTransform<boolean, string | boolean>;
    pointer: Signal<ElementRef<HTMLDivElement>>;
    constructor(renderer: Renderer2);
    protected movePointer({ x, y, height, width }: {
        x: number;
        y: number;
        height: number;
        width: number;
    }): void;
    /**
     * hue value is in range from 0 to 360°
     */
    private changePointerPosition;
    get gradient(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<AlphaComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AlphaComponent, "alpha-component", never, { "color": { "alias": "color"; "required": true; "isSignal": true; }; "isVertical": { "alias": "vertical"; "required": false; "isSignal": true; }; }, { "colorChange": "colorChange"; }, never, never, true, never>;
}

declare class RgbaComponent {
    color: ModelSignal<Color>;
    labelVisible: InputSignalWithTransform<boolean, string | boolean>;
    isAlphaVisible: InputSignalWithTransform<boolean, string | boolean>;
    get value(): Rgba;
    onInputChange(newValue: number, color: 'R' | 'G' | 'B' | 'A'): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RgbaComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RgbaComponent, "rgba-input-component", never, { "color": { "alias": "color"; "required": true; "isSignal": true; }; "labelVisible": { "alias": "label"; "required": false; "isSignal": true; }; "isAlphaVisible": { "alias": "alpha"; "required": false; "isSignal": true; }; }, { "color": "colorChange"; }, never, never, true, never>;
}

declare class HslaComponent {
    color: ModelSignal<Color>;
    labelVisible: InputSignalWithTransform<boolean, string | boolean>;
    isAlphaVisible: InputSignalWithTransform<boolean, string | boolean>;
    get value(): Hsla;
    onInputChange(newValue: number, color: 'H' | 'S' | 'L' | 'A'): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<HslaComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<HslaComponent, "hsla-input-component", never, { "color": { "alias": "color"; "required": true; "isSignal": true; }; "labelVisible": { "alias": "label"; "required": false; "isSignal": true; }; "isAlphaVisible": { "alias": "alpha"; "required": false; "isSignal": true; }; }, { "color": "colorChange"; }, never, never, true, never>;
}

declare class HexComponent {
    color: ModelSignal<Color>;
    labelVisible: InputSignalWithTransform<boolean, string | boolean>;
    prefixValue: InputSignal<string>;
    get value(): string;
    onInputChange(event: KeyboardEvent, inputValue: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<HexComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<HexComponent, "hex-input-component", never, { "color": { "alias": "color"; "required": true; "isSignal": true; }; "labelVisible": { "alias": "label"; "required": false; "isSignal": true; }; "prefixValue": { "alias": "prefix"; "required": false; "isSignal": true; }; }, { "color": "colorChange"; }, never, never, true, never>;
}

declare class ColorPresetsComponent {
    columns: InputSignalWithTransform<number, string | number>;
    colorPresets: InputSignal<Array<Array<Color> | Color>>;
    color: ModelSignal<Color>;
    direction: InputSignal<'down' | 'up' | 'left' | 'right'>;
    onSelectionChange(color: Color): void;
    isList(colorPreset: Array<Array<Color> | Color>): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ColorPresetsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ColorPresetsComponent, "color-presets-component", never, { "columns": { "alias": "columns"; "required": false; "isSignal": true; }; "colorPresets": { "alias": "colorPresets"; "required": true; "isSignal": true; }; "color": { "alias": "color"; "required": true; "isSignal": true; }; "direction": { "alias": "direction"; "required": false; "isSignal": true; }; }, { "color": "colorChange"; }, never, never, true, never>;
}

declare class ColorPresetComponent implements OnDestroy {
    private readonly pickerConfig;
    private readonly elementRef;
    private readonly renderer;
    activeColor: InputSignal<Color>;
    color: InputSignal<Color>;
    showDepthText: InputSignalWithTransform<boolean, string | boolean>;
    selectionChange: OutputEmitterRef<Color>;
    longPress: OutputEmitterRef<boolean>;
    private mouseup;
    private subscriptions;
    protected className: Signal<boolean>;
    constructor(pickerConfig: ColorPickerConfig, elementRef: ElementRef, renderer: Renderer2);
    ngOnDestroy(): void;
    private updateBackground;
    private updateTitleAttr;
    private getTitle;
    private addEventListeners;
    private removeEventListeners;
    private onTouch;
    private onTouchEnd;
    static ɵfac: i0.ɵɵFactoryDeclaration<ColorPresetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ColorPresetComponent, "color-preset", never, { "activeColor": { "alias": "activeColor"; "required": true; "isSignal": true; }; "color": { "alias": "color"; "required": true; "isSignal": true; }; "showDepthText": { "alias": "show-depth-title"; "required": false; "isSignal": true; }; }, { "selectionChange": "selectionChange"; "longPress": "longPress"; }, never, never, true, never>;
}

declare class ColorPresetSublist implements OnDestroy {
    private readonly document;
    list: InputSignal<Array<Color>>;
    activeColor: InputSignal<Color>;
    direction: InputSignal<'down' | 'up' | 'left' | 'right'>;
    selectionChange: OutputEmitterRef<Color>;
    showChildren: WritableSignal<boolean>;
    private subscriptions;
    constructor(document: Document);
    ngOnDestroy(): void;
    get className(): string;
    /**
     * emit color change
     */
    onSelectionChange(color: Color): void;
    onLongPress(): void;
    private removeListeners;
    private listenDocumentEvents;
    private closeList;
    static ɵfac: i0.ɵɵFactoryDeclaration<ColorPresetSublist, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ColorPresetSublist, "color-preset-sublist", never, { "list": { "alias": "list"; "required": true; "isSignal": true; }; "activeColor": { "alias": "activeColor"; "required": true; "isSignal": true; }; "direction": { "alias": "direction"; "required": false; "isSignal": true; }; }, { "selectionChange": "selectionChange"; }, never, never, true, never>;
}

declare class ColorPickerInputDirective {
    min: InputSignalWithTransform<number, string | number>;
    max: InputSignalWithTransform<number, string | number>;
    inputChange: OutputEmitterRef<number>;
    inputChanges(event: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ColorPickerInputDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ColorPickerInputDirective, "[inputChange]", never, { "min": { "alias": "min"; "required": false; "isSignal": true; }; "max": { "alias": "max"; "required": false; "isSignal": true; }; }, { "inputChange": "inputChange"; }, never, never, true, never>;
}

declare class ChunksPipe implements PipeTransform {
    transform(arr: any[], chunkSize: number): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChunksPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<ChunksPipe, "chunks", true>;
}

declare class ReversePipe implements PipeTransform {
    transform(arr: Array<any>, isReversed?: boolean): any[];
    static ɵfac: i0.ɵɵFactoryDeclaration<ReversePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<ReversePipe, "reverse", true>;
}

declare enum ColorType {
    hex = "hex",
    hexa = "hexa",
    rgba = "rgba",
    rgb = "rgb",
    hsla = "hsla",
    hsl = "hsl",
    cmyk = "cmyk"
}
declare class ColorPickerControl {
    private modelValue;
    private initValue;
    private readonly valueChanged;
    readonly presetsVisibilityChanges: BehaviorSubject<boolean>;
    initType: ColorType | null;
    readonly alphaChannelVisibilityChanges: BehaviorSubject<boolean>;
    readonly valueChanges: rxjs.Observable<Color>;
    private colorPresets;
    constructor();
    setValueFrom(color: ColorString | Color | Rgba | Hsla | Hsva): this;
    get value(): Color;
    /**
     * @internal
     * used for two-way data binding
     */
    set value(value: Color);
    /**
     * reset color to initial
     */
    reset(): this;
    isAlphaChannelEnabled(): boolean;
    showAlphaChannel(): this;
    hideAlphaChannel(): this;
    getColorType(colorString: ColorString): ColorType | null;
    setColorPresets(colorPresets: Array<Array<ColorString> | ColorString>): this;
    get presets(): (Color | Color[])[];
    hasPresets(): boolean;
    isPresetVisible(): boolean;
    showPresets(): this;
    hidePresets(): this;
    private setValue;
    private finOutInputType;
    private setPresets;
}

declare class ChromePickerComponent implements OnInit, OnChanges, OnDestroy {
    private readonly cdr;
    selectedPresentation: number;
    presentations: ['rgba', 'hsla', 'hex'];
    color: ModelSignal<string | undefined>;
    control: InputSignal<ColorPickerControl>;
    private subscriptions;
    constructor(cdr: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    changePresentation(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChromePickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ChromePickerComponent, "chrome-picker", never, { "color": { "alias": "color"; "required": false; "isSignal": true; }; "control": { "alias": "control"; "required": false; "isSignal": true; }; }, { "color": "colorChange"; }, never, ["[before]", "*"], true, never>;
}

declare class SketchPickerComponent implements OnInit, OnChanges, OnDestroy {
    private readonly cdr;
    color: ModelSignal<ColorString | undefined>;
    control: InputSignal<ColorPickerControl>;
    private subscriptions;
    constructor(cdr: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SketchPickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SketchPickerComponent, "sketch-picker", never, { "color": { "alias": "color"; "required": false; "isSignal": true; }; "control": { "alias": "control"; "required": false; "isSignal": true; }; }, { "color": "colorChange"; }, never, ["[before]", "*"], true, never>;
}

declare class SwatchesPickerComponent implements OnInit, OnChanges, OnDestroy {
    private readonly cdr;
    private readonly defaultColor;
    color: ModelSignal<ColorString>;
    control: ColorPickerControl;
    childControl: ColorPickerControl;
    private subscriptions;
    private mapColors;
    constructor(cdr: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SwatchesPickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SwatchesPickerComponent, "swatches-picker", never, { "color": { "alias": "color"; "required": false; "isSignal": true; }; }, { "color": "colorChange"; }, never, ["[before]", "*"], true, never>;
}

declare class GithubPickerComponent implements OnInit, OnChanges, OnDestroy {
    private readonly cdr;
    color: ModelSignal<ColorString | undefined>;
    control: InputSignal<ColorPickerControl>;
    columns: InputSignalWithTransform<'auto' | number, 'auto' | number | string>;
    get width(): string;
    get columnsCount(): number | "auto";
    private subscriptions;
    constructor(cdr: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GithubPickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GithubPickerComponent, "github-picker", never, { "color": { "alias": "color"; "required": false; "isSignal": true; }; "control": { "alias": "control"; "required": false; "isSignal": true; }; "columns": { "alias": "columns"; "required": false; "isSignal": true; }; }, { "color": "colorChange"; }, never, ["[before]", "*"], true, never>;
}

declare class CompactPickerComponent implements OnInit, OnChanges, OnDestroy {
    private readonly cdr;
    color: ModelSignal<ColorString | undefined>;
    control: InputSignal<ColorPickerControl>;
    private subscriptions;
    constructor(cdr: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CompactPickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CompactPickerComponent, "compact-picker", never, { "color": { "alias": "color"; "required": false; "isSignal": true; }; "control": { "alias": "control"; "required": false; "isSignal": true; }; }, { "color": "colorChange"; }, never, ["[before]", "*"], true, never>;
}

declare class IpPickerComponent implements OnInit, OnChanges, OnDestroy {
    private readonly cdr;
    color: ModelSignal<ColorString | undefined>;
    control: InputSignal<ColorPickerControl>;
    private subscriptions;
    constructor(cdr: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IpPickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IpPickerComponent, "ip-picker", never, { "color": { "alias": "color"; "required": false; "isSignal": true; }; "control": { "alias": "control"; "required": false; "isSignal": true; }; }, { "color": "colorChange"; }, never, never, true, never>;
}

/**
 * http://www.w3.org/TR/css3-color/
 */
declare class ColorsTable {
    static transparent: Rgba;
    static aliceblue: Rgba;
    static antiquewhite: Rgba;
    static aqua: Rgba;
    static aquamarine: Rgba;
    static azure: Rgba;
    static beige: Rgba;
    static bisque: Rgba;
    static black: Rgba;
    static blanchedalmond: Rgba;
    static blue: Rgba;
    static blueviolet: Rgba;
    static brown: Rgba;
    static burlywood: Rgba;
    static cadetblue: Rgba;
    static chartreuse: Rgba;
    static chocolate: Rgba;
    static coral: Rgba;
    static cornflowerblue: Rgba;
    static cornsilk: Rgba;
    static crimson: Rgba;
    static cyan: Rgba;
    static darkblue: Rgba;
    static darkcyan: Rgba;
    static darkgoldenrod: Rgba;
    static darkgray: Rgba;
    static darkgreen: Rgba;
    static darkgrey: Rgba;
    static darkkhaki: Rgba;
    static darkmagenta: Rgba;
    static darkolivegreen: Rgba;
    static darkorange: Rgba;
    static darkorchid: Rgba;
    static darkred: Rgba;
    static darksalmon: Rgba;
    static darkseagreen: Rgba;
    static darkslateblue: Rgba;
    static darkslategray: Rgba;
    static darkslategrey: Rgba;
    static darkturquoise: Rgba;
    static darkviolet: Rgba;
    static deeppink: Rgba;
    static deepskyblue: Rgba;
    static dimgray: Rgba;
    static dimgrey: Rgba;
    static dodgerblue: Rgba;
    static firebrick: Rgba;
    static floralwhite: Rgba;
    static forestgreen: Rgba;
    static fuchsia: Rgba;
    static gainsboro: Rgba;
    static ghostwhite: Rgba;
    static gold: Rgba;
    static goldenrod: Rgba;
    static gray: Rgba;
    static grey: Rgba;
    static green: Rgba;
    static greenyellow: Rgba;
    static honeydew: Rgba;
    static hotpink: Rgba;
    static indianred: Rgba;
    static indigo: Rgba;
    static ivory: Rgba;
    static khaki: Rgba;
    static lavender: Rgba;
    static lavenderblush: Rgba;
    static lawngreen: Rgba;
    static lemonchiffon: Rgba;
    static lightblue: Rgba;
    static lightcoral: Rgba;
    static lightcyan: Rgba;
    static lightgoldenrodyellow: Rgba;
    static lightgray: Rgba;
    static lightgreen: Rgba;
    static lightgrey: Rgba;
    static lightpink: Rgba;
    static lightsalmon: Rgba;
    static lightseagreen: Rgba;
    static lightskyblue: Rgba;
    static lightslategray: Rgba;
    static lightslategrey: Rgba;
    static lightsteelblue: Rgba;
    static lightyellow: Rgba;
    static lime: Rgba;
    static limegreen: Rgba;
    static linen: Rgba;
    static magenta: Rgba;
    static maroon: Rgba;
    static mediumaquamarine: Rgba;
    static mediumblue: Rgba;
    static mediumorchid: Rgba;
    static mediumpurple: Rgba;
    static mediumseagreen: Rgba;
    static mediumslateblue: Rgba;
    static mediumspringgreen: Rgba;
    static mediumturquoise: Rgba;
    static mediumvioletred: Rgba;
    static midnightblue: Rgba;
    static mintcream: Rgba;
    static mistyrose: Rgba;
    static moccasin: Rgba;
    static navajowhite: Rgba;
    static navy: Rgba;
    static oldlace: Rgba;
    static olive: Rgba;
    static olivedrab: Rgba;
    static orange: Rgba;
    static orangered: Rgba;
    static orchid: Rgba;
    static palegoldenrod: Rgba;
    static palegreen: Rgba;
    static paleturquoise: Rgba;
    static palevioletred: Rgba;
    static papayawhip: Rgba;
    static peachpuff: Rgba;
    static peru: Rgba;
    static pink: Rgba;
    static plum: Rgba;
    static powderblue: Rgba;
    static purple: Rgba;
    static red: Rgba;
    static rosybrown: Rgba;
    static royalblue: Rgba;
    static saddlebrown: Rgba;
    static salmon: Rgba;
    static sandybrown: Rgba;
    static seagreen: Rgba;
    static seashell: Rgba;
    static sienna: Rgba;
    static silver: Rgba;
    static skyblue: Rgba;
    static slateblue: Rgba;
    static slategray: Rgba;
    static slategrey: Rgba;
    static snow: Rgba;
    static springgreen: Rgba;
    static steelblue: Rgba;
    static tan: Rgba;
    static teal: Rgba;
    static thistle: Rgba;
    static tomato: Rgba;
    static turquoise: Rgba;
    static violet: Rgba;
    static wheat: Rgba;
    static white: Rgba;
    static whitesmoke: Rgba;
    static yellow: Rgba;
    static yellowgreen: Rgba;
}

declare function getValueByType(color: Color, type: ColorType | null): string;

declare class ColorPickerModule {
    static forRoot<T extends IColorPickerConfig>(configuration?: T): ModuleWithProviders<ColorPickerModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ColorPickerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ColorPickerModule, never, [typeof i1.CommonModule, typeof SaturationComponent, typeof IndicatorComponent, typeof HueComponent, typeof AlphaComponent, typeof RgbaComponent, typeof HslaComponent, typeof HexComponent, typeof ColorPresetsComponent, typeof ColorPresetComponent, typeof ColorPresetSublist, typeof ColorPickerInputDirective, typeof ChunksPipe, typeof ReversePipe, typeof ChromePickerComponent, typeof SketchPickerComponent, typeof SwatchesPickerComponent, typeof GithubPickerComponent, typeof CompactPickerComponent, typeof IpPickerComponent], [typeof SaturationComponent, typeof IndicatorComponent, typeof HueComponent, typeof AlphaComponent, typeof RgbaComponent, typeof HslaComponent, typeof HexComponent, typeof ColorPresetsComponent, typeof ChromePickerComponent, typeof SketchPickerComponent, typeof SwatchesPickerComponent, typeof GithubPickerComponent, typeof CompactPickerComponent, typeof IpPickerComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ColorPickerModule>;
}

export { AlphaComponent, COLOR_PICKER_CONFIG, ChromePickerComponent, Color, ColorPickerConfig, ColorPickerControl, ColorPickerModule, ColorPresetComponent, ColorPresetSublist, ColorPresetsComponent, ColorType, ColorsTable, CompactPickerComponent, GithubPickerComponent, HexComponent, HslaComponent, HueComponent, IndicatorComponent, IpPickerComponent, RgbaComponent, SaturationComponent, SketchPickerComponent, SwatchesPickerComponent, getValueByType };
export type { IColorPickerConfig };
