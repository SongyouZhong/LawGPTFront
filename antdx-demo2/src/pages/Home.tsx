import React, { useState, useEffect } from 'react';
import MenuCustom from '../components/Menu/Menu'; // 侧边对话列表组件
import Chat from '../components/Chat/Chat';       // 聊天组件
import { Space, Button } from 'antd';
import {
  FireOutlined,
  ReadOutlined,
  HeartOutlined,
  SmileOutlined,
  CommentOutlined,
  ShareAltOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import { Welcome, Prompts } from '@ant-design/x';
import RenderTitle from '../components/common/RenderTitle';
import PdfReview from '../components/ContractReview/PdfReview';
import useChatHook from '../hooks/useChat';

// 默认值可暂时保留，接口加载后会覆盖
const defaultConversationsItems = [
  { key: '0', label: 'What is Ant Design X?' },
];

const placeholderPromptsItems = [
  {
    key: '1',
    label: (
      <RenderTitle
        icon={<FireOutlined style={{ color: '#FF4D4F' }} />}
        title="Hot Topics"
      />
    ),
    description: 'What are you interested in?',
    children: [
      { key: '1-1', description: `What's new in X?` },
      { key: '1-2', description: `What's AGI?` },
      { key: '1-3', description: `Where is the doc?` },
    ],
  },
  {
    key: '2',
    label: (
      <RenderTitle
        icon={<ReadOutlined style={{ color: '#1890FF' }} />}
        title="Design Guide"
      />
    ),
    description: 'How to design a good product?',
    children: [
      { key: '2-1', icon: <HeartOutlined />, description: `Know the well` },
      { key: '2-2', icon: <SmileOutlined />, description: `Set the AI role` },
      { key: '2-3', icon: <CommentOutlined />, description: `Express the feeling` },
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

const Home: React.FC = () => {
  // ==================== State ====================
  // 对话列表数据
  const [conversationsItems, setConversationsItems] = useState(defaultConversationsItems);
  const [activeKey, setActiveKey] = useState('0'); 
  const [content, setContent] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [headerOpen, setHeaderOpen] = useState(false);
  // 是否切换到合同审核模式（如果你还有这个需求）
  const [contractReviewMode, setContractReviewMode] = useState(false);

  // ==================== Hooks ====================
  // 自定义聊天 hook
  const { onRequest, messages, setMessages } = useChatHook();

  // ==================== 获取会话列表 ====================
  useEffect(() => {
    async function fetchConversations() {
      const apiKey = 'app-SQpOipvZ9uVJSLAf0h76HhQ0'; // 请替换为实际的 API-Key
      const userId = 'USER_ID_123';      // 请替换为实际的用户标识
      try {
        const response = await fetch(`http://localhost/v1/conversations?user=${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        if (result.data) {
          // 将返回的会话列表转换为 Conversations 组件所需格式（至少 key 和 label 字段）
          const items = result.data.map((conv: any) => ({
            key: conv.id,
            label: conv.name, // 这里默认使用后端返回的 name 作为会话名称
          }));
          setConversationsItems(items);
          // 可选：将第一个会话设为 activeKey
          if (items.length > 0) {
            setActiveKey(items[0].key);
          }
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    }
    fetchConversations();
  }, []); // 组件挂载时调用一次

  // ==================== Effects ====================
  // 切换对话后，清空消息并回到聊天模式
  useEffect(() => {
    setMessages([]);
    setContractReviewMode(false);
  }, [activeKey, setMessages]);

  // ==================== Handlers ====================
  const onSubmit = (nextContent: string) => {
    if (!nextContent) return;
    onRequest(nextContent);
    setContent('');
  };

  const onPromptsItemClick = (info: any) => {
    onRequest(info.data.description as string);
  };

  const onAddConversation = () => {
    // 如果需要新增会话后，还需要调用后端接口创建会话，这里仅作为前端演示
    setConversationsItems((prev) => [
      ...prev,
      {
        key: String(prev.length),
        label: `New Conversation ${prev.length}`,
      },
    ]);
    setActiveKey(String(conversationsItems.length));
  };

  const onConversationClick = (key: string) => {
    setActiveKey(key);
  };

  const handleFileChange = (info: any) => {
    setAttachedFiles(info.fileList);
  };

  // 切换到合同审核模式
  const handleContractReview = () => {
    setContractReviewMode(true);
  };

  // ==================== Placeholder Node ====================
  const placeholderNode = contractReviewMode ? (
    <PdfReview />
  ) : (
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
        styles={{ list: { width: '100%' }, item: { flex: 1 } }}
        onItemClick={onPromptsItemClick}
      />
    </Space>
  );

  // ==================== Render ====================
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* 左侧：对话列表 + 新对话按钮 */}
      <MenuCustom
        conversationsItems={conversationsItems}
        onAddConversation={onAddConversation}
        activeKey={activeKey}
        onConversationClick={onConversationClick}
      />

      {/* 右侧：聊天面板 */}
      <Chat
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
        loading={false}
      />
    </div>
  );
};

export default Home;
