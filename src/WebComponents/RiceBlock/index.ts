import type { DetailedHTMLProps, HTMLAttributes } from 'react';

const TAG_NAME = 'rice-block';

export type RiceBlockAttributes = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  size?: string;
  radius?: string;
  hoverable?: boolean;
};

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: inline-block;
      width: var(--rice-block-size, 168px);
      aspect-ratio: 1 / 1;

      font-family: "Avenir Next", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
      font-size: 12px;
      line-height: 1.4;
      color: rgba(108, 124, 142, 0.72);

      vertical-align: middle;
    }

    .panel {
      position: relative;

      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 20px;
      overflow: hidden;

      font: inherit;
      color: inherit;

      background:
        radial-gradient(circle at 50% 18%, rgba(255, 255, 255, 0.8), transparent 36%),
        linear-gradient(180deg, #dde5ef 0%, #d6dfeb 56%, #ced8e3 100%);
      border: 1px solid rgba(255, 255, 255, 0.58);
      border-radius: var(--rice-block-radius, 38px);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.74),
        inset 14px 14px 26px rgba(255, 255, 255, 0.18),
        inset -18px -20px 28px rgba(150, 164, 182, 0.12),
        0 22px 40px rgba(140, 154, 172, 0.24),
        0 8px 18px rgba(255, 255, 255, 0.18);

      transition:
        transform 220ms ease,
        box-shadow 220ms ease,
        filter 220ms ease;

      isolation: isolate;
      cursor: default;
      user-select: none;
    }

    .panel::before {
      position: absolute;
      inset: 9px;

      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0)),
        linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0));
      border-radius: calc(var(--rice-block-radius, 38px) - 9px);
      opacity: 0.92;

      transition: opacity 220ms ease;

      content: "";
      pointer-events: none;
    }

    .panel::after {
      position: absolute;
      inset: 0;

      background:
        radial-gradient(circle at 50% 14%, rgba(255, 255, 255, 0.32), transparent 34%),
        linear-gradient(180deg, rgba(255, 255, 255, 0) 52%, rgba(138, 153, 174, 0.09) 100%);
      border-radius: inherit;
      opacity: 1;

      transition: opacity 220ms ease;

      content: "";
      pointer-events: none;
    }

    .content {
      position: relative;

      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;

      font: inherit;
      color: inherit;
      letter-spacing: 0.1em;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
      text-transform: uppercase;

      z-index: 1;
    }

    .content::slotted(*) {
      margin: 0;
    }

    :host([hoverable]) .panel:hover {
      transform: translateY(-3px);

      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.8),
        inset 14px 14px 26px rgba(255, 255, 255, 0.2),
        inset -18px -20px 28px rgba(150, 164, 182, 0.14),
        0 28px 50px rgba(140, 154, 172, 0.28),
        0 10px 20px rgba(255, 255, 255, 0.2);
      filter: brightness(1.015);
    }

    :host([hoverable]) .panel:hover::before {
      opacity: 1;
    }

    :host([hoverable]) .panel:hover::after {
      opacity: 0.58;
    }
  </style>
  <div class="panel" part="panel">
    <div class="content" part="content">
      <slot></slot>
    </div>
  </div>
`;

const formatLength = (value: string | null, fallback: string) => {
  if (!value) {
    return fallback;
  }

  return /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
};

export class RiceBlockElement extends HTMLElement {
  static get observedAttributes() {
    return ['size', 'radius'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.syncHostStyle();
  }

  attributeChangedCallback() {
    this.syncHostStyle();
  }

  private render() {
    if (!this.shadowRoot || this.shadowRoot.childNodes.length > 0) {
      return;
    }

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  private syncHostStyle() {
    this.style.setProperty(
      '--rice-block-size',
      formatLength(this.getAttribute('size'), '168px'),
    );
    this.style.setProperty(
      '--rice-block-radius',
      formatLength(this.getAttribute('radius'), '38px'),
    );
  }
}

export const defineRiceBlock = (tagName = TAG_NAME) => {
  if (
    typeof window !== 'undefined' &&
    typeof window.customElements !== 'undefined' &&
    !window.customElements.get(tagName)
  ) {
    window.customElements.define(tagName, RiceBlockElement);
  }

  return tagName;
};

defineRiceBlock();

export default defineRiceBlock;
