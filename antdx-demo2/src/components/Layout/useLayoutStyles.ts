// src/components/Layout/useLayoutStyles.ts
import { createStyles } from 'antd-style';

const useLayoutStyles = createStyles(({ token, css }) => ({
  layout: css`
    width: 100%;
    min-width: 1000px;
    height: 722px;
    border-radius: ${token.borderRadius}px;
    display: flex;
    background: ${token.colorBgContainer};
    font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

    .ant-prompts {
      color: ${token.colorText};
    }
  `,
}));

export default useLayoutStyles;
