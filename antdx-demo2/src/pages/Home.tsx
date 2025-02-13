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
    description: '你可能感兴趣?',
    children: [
      { key: '1-1', description: `如何注册商标并确保我的商标权益得到全面的法律保护？` },
      { key: '1-2', description: `如何判断一份合同是否有效？在合同履行过程中，如果双方发生纠纷，应如何处理？` },
      { key: '1-3', description: `如果他人的民事权益受到侵害，但行为人认为自己没有过失，那么责任归属应如何确定？` },
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
  // const [conversationId, setConversationId] = useState<string | null>(null);

  // ==================== Hooks ====================
  // 自定义聊天 hook
  const { onRequest, messages, setMessages } = useChatHook(activeKey);

  // ==================== 获取会话列表 ====================
  useEffect(() => {
    async function fetchConversations() {
      const apiKey = 'app-SQpOipvZ9uVJSLAf0h76HhQ0'; // 请替换为实际的 API-Key
      const userId = 'USER_ID_456';      // 请替换为实际的用户标识
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
          console.log("获取到会话列表")
          console.log(result.data)
          // 将返回的会话列表转换为 Conversations 组件所需格式（至少 key 和 label 字段）
          const items = result.data.map((conv: any) => ({
            key: conv.id,
            label: conv.name, // 这里默认使用后端返回的 name 作为会话名称
            conversation_id: conv.id, // 直接使用 conv.id 作为 conversation_id
          }));
          setConversationsItems(items);
          
        
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

  const onConversationClick = async (key: string) => {
    console.log("会话列表发生点击")
    console.log(key)
    setActiveKey(key);
    
    // 获取当前会话的历史消息
    const apiKey = 'app-SQpOipvZ9uVJSLAf0h76HhQ0';  // 请替换为实际的 API-Key
    const userId = 'USER_ID_456';                  // 请替换为实际的用户标识
  
    const conversationId = key; // 会话的 ID
  
    try {
      const response = await fetch(`http://localhost/v1/messages?conversation_id=${conversationId}&user=${userId}&limit=20`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      
      if (result.data) {
        console.log("返回的历史消息")
        console.log(result.data)
        // 将返回的历史消息列表更新到 state
        const newMessages = result.data.map((msg: any) => {
          return [
            {
              id: msg.id,
              message: msg.query, // 用户提问
              status: 'local', // 用户消息
            },
            {
              id: msg.id,
              message: msg.answer, // AI 回答
              status: 'ai', // AI 消息
            },
          ];
        }).flat(); // 将二维数组展平为一维数组
  
        setMessages(newMessages);
      }
  
      // 检查是否还有更多消息
      if (result.has_more) {
        // 如果有更多消息，可以设置 `first_id` 并通过滚动加载来获取更多
        const firstMessageId = result.data[result.data.length - 1].id;
        // 你可以用 `firstMessageId` 来加载下一页
      }
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
    }
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
        title="你好，我是法务小助手"
        description="基于最新的阿里通义千问大模型"
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
