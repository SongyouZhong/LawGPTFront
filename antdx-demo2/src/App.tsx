// src/Independent.tsx
import React, { useEffect } from 'react';
import {
  Attachments,
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Welcome,
} from '@ant-design/x';
import { createStyles } from 'antd-style';
import {
  FireOutlined,
  ReadOutlined,
  HeartOutlined,
  SmileOutlined,
  CommentOutlined,
  PaperClipOutlined,
  PlusOutlined,
  ShareAltOutlined,
  EllipsisOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import { Badge, Button, Space } from 'antd';
import RenderTitle from './components/common/RenderTitle';
import Layout from './components/Layout/Layout';
import useChatHook from './hooks/useChat';

const defaultConversationsItems = [
  {
    key: '0',
    label: 'What is Ant Design X?',
  },
];

const placeholderPromptsItems = [
  {
    key: '1',
    label: <RenderTitle icon={<FireOutlined style={{ color: '#FF4D4F' }} />} title="Hot Topics" />,
    description: 'What are you interested in?',
    children: [
      {
        key: '1-1',
        description: `What's new in X?`,
      },
      {
        key: '1-2',
        description: `What's AGI?`,
      },
      {
        key: '1-3',
        description: `Where is the doc?`,
      },
    ],
  },
  {
    key: '2',
    label: <RenderTitle icon={<ReadOutlined style={{ color: '#1890FF' }} />} title="Design Guide" />,
    description: 'How to design a good product?',
    children: [
      {
        key: '2-1',
        icon: <HeartOutlined />,
        description: `Know the well`,
      },
      {
        key: '2-2',
        icon: <SmileOutlined />,
        description: `Set the AI role`,
      },
      {
        key: '2-3',
        icon: <CommentOutlined />,
        description: `Express the feeling`,
      },
    ],
  },
];

const senderPromptsItems = [
  {
    key: '1',
    description: 'Hot Topics',
    icon: <FireOutlined style={{ color: '#FF4D4F' }} />,
  },
  {
    key: '2',
    description: 'Design Guide',
    icon: <ReadOutlined style={{ color: '#1890FF' }} />,
  },
];

const roles = {
  ai: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
    styles: {
      content: {
        borderRadius: 16,
      },
    },
  },
  local: {
    placement: 'end',
    variant: 'shadow',
  },
};

const Independent: React.FC = () => {
  // ==================== State ====================
  const [conversationsItems, setConversationsItems] = React.useState(defaultConversationsItems);
  const [activeKey, setActiveKey] = React.useState(defaultConversationsItems[0].key);
  const [content, setContent] = React.useState('');
  const [attachedFiles, setAttachedFiles] = React.useState([]);

  const [headerOpen, setHeaderOpen] = React.useState(false);

  // ==================== Hooks ====================
  const { onRequest, messages, setMessages } = useChatHook();

  // ==================== Effects ====================
  useEffect(() => {
    if (activeKey !== undefined) {
      setMessages([]);
    }
  }, [activeKey, setMessages]);

  // ==================== Handlers ====================
  const onSubmit = (nextContent: string) => {
    if (!nextContent) return;
    onRequest(nextContent);
    setContent('');
  };

  const onPromptsItemClick = (info: any) => { // 根据实际类型定义
    onRequest(info.data.description as string);
  };

  const onAddConversation = () => {
    setConversationsItems([
      ...conversationsItems,
      {
        key: `${conversationsItems.length}`,
        label: `New Conversation ${conversationsItems.length}`,
      },
    ]);
    setActiveKey(`${conversationsItems.length}`);
  };

  const onConversationClick = (key: string) => {
    setActiveKey(key);
  };

  const handleFileChange = (info: any) => { // 根据实际类型定义
    setAttachedFiles(info.fileList);
  };

  // ==================== Placeholder Node ====================
  const placeholderNode = (
    <Space direction="vertical" size={16}>
      <Welcome
        variant="borderless"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="Hello, I'm Ant Design X"
        description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
        extra={
          <Space>
            <Button icon={<ShareAltOutlined />} />
            <Button icon={<EllipsisOutlined />} />
          </Space>
        }
      />
      <Prompts
        title="Do you want?"
        items={placeholderPromptsItems}
        styles={{
          list: {
            width: '100%',
          },
          item: {
            flex: 1,
          },
        }}
        onItemClick={onPromptsItemClick}
      />
    </Space>
  );

  return (
    <Layout
      conversationsItems={conversationsItems}
      onAddConversation={onAddConversation}
      activeKey={activeKey}
      onConversationClick={onConversationClick}
      messages={messages}
      onRequest={onSubmit}
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
      loading={false} // 根据实际情况传递
    />
  );
};

export default Independent;
