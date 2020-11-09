declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '@antv/data-set';

declare module 'react-fittext';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}
