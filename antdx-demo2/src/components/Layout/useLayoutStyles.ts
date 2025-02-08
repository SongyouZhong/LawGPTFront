// src/components/Layout/useLayoutStyles.ts
import { createStyles } from 'antd-style';

const useLayoutStyles = createStyles(({ token, css }) => ({
  layout: css`
    width: 100%;
    min-width: 1000px;
    height: 722px;
    border-radius: ${token.borderRadius}px;
    display: flex;
    flex-direction: column; /* 改为 column 布局以支持顶部菜单栏 */
    background: ${token.colorBgContainer};
    font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

    .ant-prompts {
      color: ${token.colorText};
    }
  `,
  logo: css`
  display: flex;
  height: 72px;
  align-items: center;
  justify-content: start;
  padding: 0 24px;
  box-sizing: border-box;

  img {
    width: 24px;
    height: 24px;
    display: inline-block;
  }

  span {
    display: inline-block;
    margin: 0 8px;
    font-weight: bold;
    color: ${token.colorText};
    font-size: 16px;
  }
`,
  header: css`
    background: ${token.colorBgContainer};
    border-bottom: 1px solid ${token.colorBorderSecondary || '#f0f0f0'};
    padding: 0 16px;
    display: flex;
    align-items: center;
    height: 60px;
  `,
  body: css`
    display: flex;
    flex: 1;
  `,
}));

export default useLayoutStyles;
