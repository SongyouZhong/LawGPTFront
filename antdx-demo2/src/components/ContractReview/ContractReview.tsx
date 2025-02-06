// src/components/ContractReview/ContractReview.tsx
import React from 'react';
import { Button, message } from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';
import useContractReviewStyles from './useContractReviewStyles';

interface ContractReviewProps {
  // 点击后通知上层切换模式
  onActivate: () => void;
}

const ContractReview: React.FC<ContractReviewProps> = ({ onActivate }) => {
  const { styles } = useContractReviewStyles();

  const handleClick = () => {
    // 这里可以添加其他逻辑，例如校验权限等
    message.info('切换到合同审核模式');
    onActivate();
  };

  return (
    <Button
      onClick={handleClick}
      type="link"
      className={styles.button}
      icon={<FileSearchOutlined />}
    >
      合同审核
    </Button>
  );
};

export default ContractReview;
