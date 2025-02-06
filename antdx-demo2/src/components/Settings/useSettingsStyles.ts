// src/components/Settings/useSettingsStyles.ts
import { createStyles } from 'antd-style';

const useSettingsStyles = createStyles(({ token }) => ({
  settingsBtn: {
    marginBottom: token.marginSM,
    // 你可以在这里添加更多自定义样式
  },
}));

export default useSettingsStyles;
