import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { PlatformService } from '../../services/platform/platform.service';

@Directive({
  selector: '[gdbFitHeight],[gdbFitWidth]',
})
export class FitTextDirective implements AfterViewInit {
  @Input('gdbFitHeight') height: number;
  @Input('gdbFitWidth') width: number;

  private fontSize: number;
  private fontSizeUnits: string;
  private lineHeight: number;
  private lineHeightUnits: string;
  private computedStyles: CSSStyleDeclaration;

  constructor(private elemRef: ElementRef<HTMLElement>, private platformService: PlatformService) {}

  ngAfterViewInit(): void {
    if (!this.platformService.isBrowser) {
      return;
    }

    // if this fails for some reason, it's not worth bothering, let's just bail
    try {
      this.setupStartingValues();
    } catch (err) {
      console.error('Could not fit height', err);
    }

    this.adjustSizes();
    setTimeout(() => this.adjustSizes());
  }

  adjustSizes() {
    if (this.height) {
      this.adjustForHeight();
    }
    if (this.width) {
      this.adjustForWidth();
    }
  }

  adjustForHeight() {
    while (parseInt(this.computedStyles.height, 10) > this.height) {
      this.elemRef.nativeElement.style.fontSize = --this.fontSize + this.fontSizeUnits;
      this.elemRef.nativeElement.style.lineHeight = --this.lineHeight + this.lineHeightUnits;
    }
  }

  adjustForWidth() {
    while (this.checkHorizontalOverflow()) {
      this.elemRef.nativeElement.style.fontSize = --this.fontSize + this.fontSizeUnits;
      this.elemRef.nativeElement.style.lineHeight = --this.lineHeight + this.lineHeightUnits;
    }
  }

  // adapted from https://stackoverflow.com/a/143889
  checkHorizontalOverflow() {
    const elem = this.elemRef.nativeElement;
    const curOverflow = elem.style.overflow;

    if (!curOverflow || curOverflow === 'visible') {
      elem.style.overflow = 'hidden';
    }

    const isOverflowing = elem.clientWidth < elem.scrollWidth;

    elem.style.overflow = curOverflow;

    return isOverflowing;
  }

  setupStartingValues() {
    this.computedStyles = window.getComputedStyle(this.elemRef.nativeElement);
    const fontSizeMatches = this.computedStyles.fontSize.match(/^(\d+)(.*)$/);

    if (!fontSizeMatches) {
      return;
    }

    const [, fontSizeStr, fontSizeUnits] = fontSizeMatches;

    this.fontSize = +fontSizeStr;
    this.fontSizeUnits = fontSizeUnits;

    const lineHeightMatches = this.computedStyles.lineHeight.match(/^(\d+)(.*)$/);

    if (!lineHeightMatches) {
      return;
    }

    const [, lineHeightStr, lineHeightUnits] = lineHeightMatches;

    this.lineHeight = +lineHeightStr;
    this.lineHeightUnits = lineHeightUnits;
  }
}
