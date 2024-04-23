/// <reference types="react" />

declare const NAME_SPACE: string;
declare const API_VERSION: string;
declare const PROJECTION: string;
declare const NODE_ENV: string;
declare module JSX {
  interface IntrinsicElements {
    div: any;
    span: any;
    a: any;
    svg: any;
    g: any;
    main: any;
    path: any;
  }
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

declare module '*.jpeg' {
  const content: any;
  export default content;
}

declare module '*.gif' {
  const content: any;
  export default content;
}

declare module '*.sass' {
  const content: any;
  export default content;
}

declare module '*.scss' {
  const content: any;
  export default content;
}

declare module '*.less' {
  const content: any;
  export default content;
}

declare module '*.module.less' {
  const content: any;
  export default content;
}

declare module '*.css' {
  const content: any;
  export default content;
}

declare module 'slash2' {
  const content: any;
  export default content;
}

declare module '*.bmp' {
  const content: any;
  export default content;
}
declare module '*.tiff' {
  const content: any;
  export default content;
}
