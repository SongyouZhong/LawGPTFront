
// src/components/Layout/Layout.tsx
import React from 'react';
import { Menu } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import MenuCustom from '../Menu/Menu';
import Chat from '../Chat/Chat';
import useLayoutStyles from './useLayoutStyles';


interface LayoutProps {
  // 传递必要的props
  conversationsItems: any[]; // 根据实际类型定义
  onAddConversation: () => void;
  activeKey: string;
  onConversationClick: (key: string) => void;
  messages: any[]; // 根据实际类型定义
  onRequest: (message: string) => void;
  content: string;
  setContent: (value: string) => void;
  attachedFiles: any[]; // 根据实际类型定义
  headerOpen: boolean;
  setHeaderOpen: (open: boolean) => void;
  handleFileChange: (info: any) => void; // 根据实际类型定义
  senderPromptsItems: any[]; // 根据实际类型定义
  onPromptsItemClick: (info: any) => void; // 根据实际类型定义
  placeholderNode: React.ReactNode;
  roles: any; // 根据实际类型定义
  loading: boolean;
  onContractReview: () => void;
}

const topMenuItems = [
  {
    key: 'mail',
    icon: <MailOutlined />,
    label: '首页',
  },
  {
    key: 'app',
    icon: <AppstoreOutlined />,
    label: '功能',
  },
  {
    key: 'submenu',
    icon: <SettingOutlined />,
    label: '更多',
    children: [
      { key: 'setting:1', label: '选项一' },
      { key: 'setting:2', label: '选项二' },
    ],
  },
];

const Layout: React.FC<LayoutProps> = (props) => {
  const {
    conversationsItems,
    onAddConversation,
    activeKey,
    onConversationClick,
    messages,
    onRequest,
    content,
    setContent,
    attachedFiles,
    headerOpen,
    setHeaderOpen,
    handleFileChange,
    senderPromptsItems,
    onPromptsItemClick,
    placeholderNode,
    roles,
    loading,
    onContractReview,
  } = props;
  
  const { styles } = useLayoutStyles();

  return (
    <div className={styles.layout}>
      {/* 顶部导航菜单 */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img
            src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
            draggable={false}
            alt="logo"
          />
        <span>Ant Design X</span>
      </div>
        <Menu mode="horizontal" items={topMenuItems} />
      </header>

      {/* 主体内容区域 */}
      <div className={styles.body}>
        <MenuCustom
          conversationsItems={conversationsItems}
          onAddConversation={onAddConversation}
          activeKey={activeKey}
          onConversationClick={onConversationClick}
          onContractReview={onContractReview}
        />
        <Chat
          messages={messages}
          onRequest={onRequest}
          content={content}
          setContent={setContent}
          attachedFiles={attachedFiles}
          headerOpen={headerOpen}
          setHeaderOpen={setHeaderOpen}
          handleFileChange={handleFileChange}
          senderPromptsItems={senderPromptsItems}
          onPromptsItemClick={onPromptsItemClick}
          placeholderNode={placeholderNode}
          roles={roles}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Layout;
