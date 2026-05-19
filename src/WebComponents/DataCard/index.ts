import type { DetailedHTMLProps, HTMLAttributes } from 'react';

const TAG_NAME = 'data-card';

export type DataCardData = {
  title?: string;
  meta?: string;
  amountLabel?: string;
  amount?: string;
  count?: string | number;
};

export type DataCardAttributes = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  title?: string;
  meta?: string;
  count?: string | number;
  data?: DataCardData;
  'amount-label'?: string;
  amount?: string;
};

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: block;
      width: var(--data-card-width, 100%);
      min-width: 280px;
      box-sizing: border-box;

      font-family: "Avenir Next", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
      color: #253043;

      vertical-align: middle;
    }

    article {
      position: relative;

      box-sizing: border-box;
      display: grid;
      grid-template-rows: auto auto 1fr auto;
      gap: 18px;
      width: 100%;
      min-height: 184px;
      padding: 28px 30px;

      background: linear-gradient(180deg, #f8fafc 0%, #f3f6fa 100%);
      border: 1px solid rgba(255, 255, 255, 0.78);
      border-radius: 24px;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.96),
        0 18px 36px rgba(167, 179, 196, 0.18);

      isolation: isolate;
    }

    article::before {
      position: absolute;
      inset: 0;

      border-radius: inherit;
      background:
        radial-gradient(circle at 14% 10%, rgba(255, 255, 255, 0.66), transparent 24%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0));

      content: "";
      pointer-events: none;
    }

    .header {
      position: relative;

      box-sizing: border-box;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;

      z-index: 1;
    }

    .title {
      margin: 0;

      font-size: 22px;
      line-height: 1.24;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #1d2737;
    }

    .countWrap {
      position: relative;

      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .countIcon {
      position: relative;

      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;

      background: linear-gradient(180deg, #ffdf82 0%, #e0ad32 100%);
      border-radius: 999px;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.54),
        0 8px 14px rgba(214, 166, 43, 0.26);
    }

    .countIcon::before {
      position: relative;

      font-size: 15px;
      line-height: 1;
      font-weight: 700;
      color: #7a5310;

      content: "Y";
    }

    .countValue {
      font-size: 24px;
      line-height: 1;
      font-weight: 700;
      color: #1f2b3d;
    }

    .meta {
      position: relative;

      margin: 0;

      font-size: 18px;
      line-height: 1.5;
      font-weight: 500;
      letter-spacing: 0.02em;
      color: #9ba6b6;

      z-index: 1;
    }

    .footer {
      position: relative;

      box-sizing: border-box;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 20px;

      z-index: 1;
    }

    .amount {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      min-height: 50px;
      padding: 0 18px;

      font-size: 22px;
      line-height: 1;
      font-weight: 600;
      color: #536073;

      background: #e9edf2;
      border-radius: 14px;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.7),
        0 8px 18px rgba(176, 187, 201, 0.2);
    }

    .amountLabel {
      color: #536073;
    }

    .amountValue {
      color: #536073;
    }

    .actions {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: 12px;
    }

    .action {
      position: relative;

      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      padding: 0;

      background: #eef2f7;
      border: 0;
      border-radius: 999px;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
      cursor: pointer;

      transition:
        transform 180ms ease,
        background-color 180ms ease,
        box-shadow 180ms ease;
    }

    .action:hover {
      transform: translateY(-2px);
    }

    .action:focus-visible {
      outline: 2px solid rgba(70, 110, 255, 0.32);
      outline-offset: 2px;
    }

    .action svg {
      width: 22px;
      height: 22px;
    }

    .actionEdit {
      background: #e7eef9;
    }

    .actionEdit svg {
      fill: #3d74e7;
    }

    .actionDelete {
      background: #f8ecec;
    }

    .actionDelete svg {
      fill: #f05c4d;
    }
  </style>
  <article part="card">
    <header class="header">
      <h3 class="title" part="title"></h3>
      <span class="countWrap" part="count">
        <span class="countIcon" aria-hidden="true"></span>
        <span class="countValue"></span>
      </span>
    </header>
    <p class="meta" part="meta"></p>
    <span aria-hidden="true"></span>
    <footer class="footer">
      <span class="amount" part="amount">
        <span class="amountLabel"></span>
        <span class="amountValue"></span>
      </span>
      <span class="actions" part="actions">
        <button class="action actionEdit" type="button" data-action="edit" aria-label="编辑">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16.86 3.49a2.12 2.12 0 0 1 3 3l-1.15 1.16-3-3 1.15-1.16ZM14.3 6.11l3 3-7.78 7.78-3.78.78.78-3.78L14.3 6.1ZM5 19h14v2H5z"></path>
          </svg>
        </button>
        <button class="action actionDelete" type="button" data-action="remove" aria-label="删除">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m13.41 12 4.3-4.29-1.42-1.42-4.29 4.3-4.29-4.3-1.42 1.42L10.59 12l-4.3 4.29 1.42 1.42 4.29-4.3 4.29 4.3 1.42-1.42z"></path>
          </svg>
        </button>
      </span>
    </footer>
  </article>
`;

const pick = (
  value?: string | number | null,
  fallback?: string | number | null,
) => {
  const target =
    value === undefined || value === null || value === '' ? fallback : value;

  return target === undefined || target === null ? '' : String(target);
};

export class DataCardElement extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'meta', 'amount-label', 'amount', 'count'];
  }

  private cardData: DataCardData = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set data(value: DataCardData) {
    this.cardData = value || {};
    this.render();
    this.syncContent();
  }

  get data() {
    return this.cardData;
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
    this.syncContent();
  }

  attributeChangedCallback() {
    this.syncContent();
  }

  private render() {
    if (!this.shadowRoot || this.shadowRoot.childNodes.length > 0) {
      return;
    }

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  private bindEvents() {
    if (!this.shadowRoot) {
      return;
    }

    this.shadowRoot
      .querySelectorAll<HTMLButtonElement>('[data-action]')
      .forEach((button) => {
        if (button.dataset.bound === 'true') {
          return;
        }

        button.dataset.bound = 'true';
        button.addEventListener('click', () => {
          const action = button.dataset.action;

          this.dispatchEvent(
            new CustomEvent(action || 'action', {
              bubbles: true,
              composed: true,
              detail: this.getMergedData(),
            }),
          );
        });
      });
  }

  private getMergedData() {
    return {
      title: pick(this.cardData.title, this.getAttribute('title')),
      meta: pick(this.cardData.meta, this.getAttribute('meta')),
      amountLabel: pick(
        this.cardData.amountLabel,
        this.getAttribute('amount-label'),
      ),
      amount: pick(this.cardData.amount, this.getAttribute('amount')),
      count: pick(this.cardData.count, this.getAttribute('count')),
    };
  }

  private syncContent() {
    if (!this.shadowRoot) {
      return;
    }

    const data = this.getMergedData();
    const title = this.shadowRoot.querySelector<HTMLElement>('.title');
    const meta = this.shadowRoot.querySelector<HTMLElement>('.meta');
    const amountLabel =
      this.shadowRoot.querySelector<HTMLElement>('.amountLabel');
    const amountValue =
      this.shadowRoot.querySelector<HTMLElement>('.amountValue');
    const countValue =
      this.shadowRoot.querySelector<HTMLElement>('.countValue');

    if (!title || !meta || !amountLabel || !amountValue || !countValue) {
      return;
    }

    title.textContent = pick(data.title, '测试1');
    meta.textContent = pick(data.meta, '由 盛 支付');
    amountLabel.textContent = pick(data.amountLabel, '盛');
    amountValue.textContent = pick(data.amount, '2.00');
    countValue.textContent = pick(data.count, '2');
  }
}

export const defineDataCard = (tagName = TAG_NAME) => {
  if (
    typeof window !== 'undefined' &&
    typeof window.customElements !== 'undefined' &&
    !window.customElements.get(tagName)
  ) {
    window.customElements.define(tagName, DataCardElement);
  }

  return tagName;
};

defineDataCard();

export default defineDataCard;
