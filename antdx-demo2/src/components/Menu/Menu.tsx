// src/components/Menu/Menu.tsx
import React from 'react';
import { Conversations } from '@ant-design/x';
import {  Button} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useMenuStyles from './useMenuStyles';
import RenderTitle from '../common/RenderTitle';
import Settings from '../Settings/Settings';
import ContractReview from '../ContractReview/ContractReview';
interface MenuProps {
  conversationsItems: any[]; // 根据实际类型定义
  onAddConversation: () => void;
  activeKey: string;
  onConversationClick: (key: string) => void;
  onContractReview: () => void; // 新增：合同审核回调
}

const Menu: React.FC<MenuProps> = ({
  conversationsItems,
  onAddConversation,
  activeKey,
  onConversationClick,
  onContractReview,
}) => {
  const { styles } = useMenuStyles();

  // const logoNode = (
  //   <div className={styles.logo}>
  //     <img
  //       src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
  //       draggable={false}
  //       alt="logo"
  //     />
  //     <span>Ant Design X</span>
  //   </div>
  // );

  return (
    <div className={styles.menu}>
      {/* 🌟 Logo */}
      {/* {logoNode} */}
      {/* 使用独立的 Settings 组件 */}
      {/* <Settings /> */}
       {/* 新增：合同审核按钮 */}
       <ContractReview onActivate={onContractReview} />
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
