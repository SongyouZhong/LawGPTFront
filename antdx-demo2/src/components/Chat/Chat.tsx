import React from "react";
import { CloudUploadOutlined } from "@ant-design/icons";
import { Attachments, Prompts, Sender } from "@ant-design/x";
import { GetProp } from "antd";
import MessageList from "./MessageList";
import SenderSection from "./SenderSection";
import useChatStyles from "./useChatStyles";

interface ChatProps {
  messages: any[];
  onRequest: (message: string) => void;
  content: string;
  setContent: (value: string) => void;
  attachedFiles: GetProp<typeof Attachments, "items">;
  headerOpen: boolean;
  setHeaderOpen: (open: boolean) => void;
  handleFileChange: GetProp<typeof Attachments, "onChange">;
  onPromptsItemClick: GetProp<typeof Prompts, "onItemClick">;
  placeholderNode: React.ReactNode;
  roles: any;
  loading: boolean;
}

const Chat: React.FC<ChatProps> = ({
  messages,
  onRequest,
  content,
  setContent,
  attachedFiles,
  headerOpen,
  setHeaderOpen,
  handleFileChange,
  placeholderNode,
  roles,
  loading,
}) => {
  const { styles } = useChatStyles();

  const items = messages.map(({ id, message, status }) => ({
    key: id,
    loading: status === "loading",
    role: status === "local" ? "local" : "ai",
    content: message,
  }));

  const senderHeader = (
    <Sender.Header
      title="Attachments"
      open={headerOpen}
      onOpenChange={setHeaderOpen}
      styles={{
        content: {
          padding: 0,
        },
      }}
    >
      <Attachments
        beforeUpload={() => false}
        items={attachedFiles}
        onChange={handleFileChange}
        placeholder={(type) =>
          type === "drop"
            ? { title: "Drop file here" }
            : {
                icon: <CloudUploadOutlined />,
                title: "Upload files",
                description: "Click or drag files to this area to upload",
              }
        }
      />
    </Sender.Header>
  );

  return (
    <div className={styles.chat}>
      {/* 🌟 消息列表 */}
      <MessageList
        items={items}
        roles={roles}
        placeholderNode={placeholderNode}
      />
      {/* 🌟 提示词 */}
      {/* <PromptsSection items={senderPromptsItems} onItemClick={onPromptsItemClick} /> */}
      {/* 🌟 输入框 */}
      <SenderSection
        content={content}
        onSubmit={onRequest}
        setContent={setContent}
        attachedFiles={attachedFiles}
        headerOpen={headerOpen}
        setHeaderOpen={setHeaderOpen}
        handleFileChange={handleFileChange}
        senderHeader={senderHeader}
        loading={loading}
      />
    </div>
  );
};

export default Chat;
