// src/components/Chat/SenderSection.tsx
import React from "react";
import { Sender, Attachments } from "@ant-design/x";
import { GetProp } from "antd";
import useChatStyles from "./useChatStyles";

interface SenderSectionProps {
  content: string;
  onSubmit: (value: string) => void;
  setContent: (value: string) => void;
  attachedFiles: GetProp<typeof Attachments, "items">;
  headerOpen: boolean;
  setHeaderOpen: (open: boolean) => void;
  handleFileChange: GetProp<typeof Attachments, "onChange">;
  senderHeader: React.ReactNode;
  loading: boolean;
}

const SenderSection: React.FC<SenderSectionProps> = ({
  content,
  onSubmit,
  setContent,
  senderHeader,
  loading,
}) => {
  const { styles } = useChatStyles();

  return (
    <Sender
      value={content}
      header={senderHeader}
      onSubmit={onSubmit}
      onChange={setContent}
      loading={loading}
      className={styles.sender}
    />
  );
};

export default SenderSection;
