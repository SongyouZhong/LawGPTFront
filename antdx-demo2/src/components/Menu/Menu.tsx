// src/components/Menu/Menu.tsx
import React from 'react';
import { Conversations } from '@ant-design/x';
import {  Button} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useMenuStyles from './useMenuStyles';
import RenderTitle from '../common/RenderTitle';

interface MenuProps {
  conversationsItems: any[]; // 根据实际类型定义
  onAddConversation: () => void;
  activeKey: string;
  onConversationClick: (key: string) => void;
}

const Menu: React.FC<MenuProps> = ({
  conversationsItems,
  onAddConversation,
  activeKey,
  onConversationClick,
}) => {
  const { styles } = useMenuStyles();

  const logoNode = (
    <div className={styles.logo}>
      <img
        src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
        draggable={false}
        alt="logo"
      />
      <span>Ant Design X</span>
    </div>
  );

  return (
    <div className={styles.menu}>
      {/* 🌟 Logo */}
      {logoNode}
      {/* 🌟 添加会话 */}
      <Button
        onClick={onAddConversation}
        type="link"
        className={styles.addBtn}
        icon={<PlusOutlined />}
      >
        New Conversation
      </Button>
      {/* 🌟 会话管理 */}
      <Conversations
        items={conversationsItems}
        className={styles.conversations}
        activeKey={activeKey}
        onActiveChange={onConversationClick}
      />
    </div>
  );
};

export default Menu;
