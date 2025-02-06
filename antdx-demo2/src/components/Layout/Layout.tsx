// src/components/Layout/Layout.tsx
import React from 'react';
import { Space, Button } from 'antd';
import Menu from '../Menu/Menu';
import Chat from '../Chat/Chat';
import Welcome from '@ant-design/x/lib/Welcome';
import { FireOutlined, ReadOutlined, HeartOutlined, SmileOutlined, CommentOutlined } from '@ant-design/icons';
import RenderTitle from '../common/RenderTitle';
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

const Layout: React.FC<LayoutProps> = ({
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
}) => {
  const { styles } = useLayoutStyles();

  return (
    <div className={styles.layout}>
      <Menu
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
  );
};

export default Layout;
