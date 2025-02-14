// src/components/Chat/useChatStyles.ts
import { createStyles } from 'antd-style';

const useChatStyles = createStyles(({ token, css }) => ({
  chat: css`
    height: 100%;
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: ${token.paddingLG}px;
    justify-content: space-around;
  `,
  messages: css`
    flex: 1;
  `,
  placeholder: css`
    padding-top: 32px;
  `,
  sender: css`
    box-shadow: ${token.boxShadow};
  `,
}));

export default useChatStyles;
