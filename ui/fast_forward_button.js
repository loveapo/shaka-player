/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */


goog.provide('shaka.ui.FastForwardButton');

goog.require('shaka.ui.Element');
goog.require('shaka.ui.Locales');
goog.require('shaka.ui.Localization');
goog.require('shaka.util.Dom');


/**
 * @extends {shaka.ui.Element}
 * @final
 * @export
 */
shaka.ui.FastForwardButton = class extends shaka.ui.Element {
  /**
   * @param {!HTMLElement} parent
   * @param {!shaka.ui.Controls} controls
   */
  constructor(parent, controls) {
    super(parent, controls);

    /** @private {!HTMLButtonElement} */
    this.button_ = shaka.util.Dom.createButton();
    this.button_.classList.add('material-icons-round');
    this.button_.classList.add('shaka-fast-forward-button');
    this.button_.textContent =
      shaka.ui.Enums.MaterialDesignIcons.FAST_FORWARD;
    this.parent.appendChild(this.button_);
    this.updateAriaLabel_();

    this.eventManager.listen(
        this.localization, shaka.ui.Localization.LOCALE_UPDATED, () => {
          this.updateAriaLabel_();
        });

    this.eventManager.listen(
        this.localization, shaka.ui.Localization.LOCALE_CHANGED, () => {
          this.updateAriaLabel_();
        });

    this.eventManager.listen(this.button_, 'click', () => {
      this.fastForward_();
    });
  }

  /**
   * @private
   */
  updateAriaLabel_() {
    this.button_.setAttribute(shaka.ui.Constants.ARIA_LABEL,
        this.localization.resolve(shaka.ui.Locales.Ids.FAST_FORWARD));
  }

  /**
   * Cycles trick play rate between 1, 2, 4, and 8.
   * @private
   */
  fastForward_() {
    if (!this.video.duration) {
      return;
    }

    const trickPlayRate = this.player.getPlaybackRate();
    // Every time the button is clicked, the rate is multiplied by 2,
    // unless the rate is at max (8), in which case it is dropped back to 1.
    const newRate = (trickPlayRate < 0 || trickPlayRate > 4) ?
        1 : trickPlayRate * 2;
    this.player.trickPlay(newRate);
  }
};


/**
 * @implements {shaka.extern.IUIElement.Factory}
 * @final
 */
shaka.ui.FastForwardButton.Factory = class {
  /** @override */
  create(rootElement, controls) {
    return new shaka.ui.FastForwardButton(rootElement, controls);
  }
};

shaka.ui.Controls.registerElement(
    'fast_forward', new shaka.ui.FastForwardButton.Factory());
