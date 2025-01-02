// src/hooks/useChat.ts
import { useXChat } from '@ant-design/x';
import useAgentHook from './useAgent';

const useChatHook = () => {
  const agent = useAgentHook();
  const { onRequest, messages, setMessages } = useXChat({
    agent,
  });

  return { onRequest, messages, setMessages };
};

export default useChatHook;
