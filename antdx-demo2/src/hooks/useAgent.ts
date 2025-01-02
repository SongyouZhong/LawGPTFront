// src/hooks/useAgent.ts
import { useXAgent } from '@ant-design/x';

const useAgentHook = () => {
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess }) => {
      onSuccess(`Mock success return. You said: ${message}`);
    },
  });

  return agent;
};

export default useAgentHook;
