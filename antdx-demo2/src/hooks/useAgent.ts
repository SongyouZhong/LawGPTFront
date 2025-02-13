import { useXAgent } from '@ant-design/x';
const API_KEY = 'app-SQpOipvZ9uVJSLAf0h76HhQ0';
const BASE_URL = '${process.env.REACT_APP_API_URL}/v1';

const useAgentHook = (activeKey: string) => {
  const [agent] = useXAgent({
    request: async ({ message }, { onUpdate, onSuccess, onError }) => {
      try {
        console.log("当前对话的activeKey")
        console.log(activeKey)
        const payload = {
          query: message,             // 用户输入的消息
          inputs: {},                 // 其它可选参数
          response_mode: 'streaming',  // 流式返回
          user: 'USER_ID_456',        // 用户标识，请替换为实际用户ID
          conversation_id:  Number(activeKey) !== 0 ? activeKey : null, // 传递 conversation_id
        };

        const response = await fetch(`${BASE_URL}/chat-messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No readable stream in response');
        }

        const decoder = new TextDecoder('utf-8');
        let partialData = '';
        let isDone = false;
        let buffer = ''; // 用于保存不完整的行数据

        while (!isDone) {
          const { value, done } = await reader.read();
          if (done) {
            // 最后一次调用 decode，flush 剩余内容
            buffer += decoder.decode(value ?? new Uint8Array(), { stream: false });
            break;
          }

          // 将当前 chunk 解码后追加到 buffer
          buffer += decoder.decode(value, { stream: true });
          // 按换行符拆分出完整的行，最后一行可能是不完整的
          const lines = buffer.split('\n');
          // 将最后一行留到下次处理（如果它是不完整的）
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;
            if (line.startsWith('data:')) {
              const jsonString = line.replace(/^data:\s*/, '');
              if (jsonString === '[DONE]') {
                isDone = true;
                break;
              }
              try {
                const parsed = JSON.parse(jsonString);
                const { event } = parsed;
                if (event === 'error') {
                  throw new Error(parsed?.message ?? 'unknown error');
                }
                if (event === 'agent_message') {
                  const answerPart = parsed.answer ?? '';
                  // console.log('Received answer part:', answerPart);
                  partialData += answerPart;
                  onUpdate(partialData);
                }
                if (event === 'message_end') {
                  onSuccess(partialData);
                  isDone = true;
                  break;
                }
                // 可根据需要处理其它事件，如 agent_thought 等
              } catch (err) {
                console.error('SSE parse error:', err);
              }
            }
          }
        }

        // 如果 buffer 中还有剩余的数据，也尝试处理（或直接调用 onSuccess）
        if (buffer) {
          try {
            // 假设剩余 buffer 中包含完整的一行
            const parsed = JSON.parse(buffer.replace(/^data:\s*/, ''));
            if (parsed.event === 'agent_message') {
              partialData += parsed.answer ?? '';
            }
          } catch (e) {
            // 解析失败可以忽略或者记录日志
          }
          onSuccess(partialData);
        }
      } catch (error) {
        if (error instanceof Error) {
          onError?.(error);
        } else {
          onError?.(new Error(String(error)));
        }
      }
    },
  });

  return agent;
};

export default useAgentHook;
