// src/hooks/useChat.ts
import { useXChat } from '@ant-design/x';
import useAgentHook from './useAgent';

const useChatHook = (activeKey : string) => {
  const agent = useAgentHook(activeKey);
  const { onRequest, messages, setMessages } = useXChat({
    agent,
  });

  return { onRequest, messages, setMessages };
};

export default useChatHook;
