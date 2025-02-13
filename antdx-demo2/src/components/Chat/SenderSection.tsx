// src/components/Chat/SenderSection.tsx
import React from 'react';
import { Sender, Attachments } from '@ant-design/x';
import { Button, Badge } from 'antd';
import {
  PaperClipOutlined,
  CloudUploadOutlined,
  ShareAltOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import { GetProp } from 'antd';
import useChatStyles from './useChatStyles';

interface SenderSectionProps {
  content: string;
  onSubmit: (value: string) => void;
  setContent: (value: string) => void;
  attachedFiles: GetProp<typeof Attachments, 'items'>;
  headerOpen: boolean;
  setHeaderOpen: (open: boolean) => void;
  handleFileChange: GetProp<typeof Attachments, 'onChange'>;
  // attachmentsNode: React.ReactNode;
  senderHeader: React.ReactNode;
  loading: boolean;
}

const SenderSection: React.FC<SenderSectionProps> = ({
  content,
  onSubmit,
  setContent,
  attachedFiles,
  headerOpen,
  setHeaderOpen,
  handleFileChange,
  // attachmentsNode,
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
      // prefix={attachmentsNode}
      loading={loading}
      className={styles.sender}
    />
  );
};

export default SenderSection;
